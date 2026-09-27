-- MediSync Schema Migration
-- Designed for Supabase PostgreSQL with Row Level Security (RLS)
-- Safe to re-run: drops previous tables and types cleanly

DROP TABLE IF EXISTS patient_status_tokens CASCADE;
DROP TABLE IF EXISTS outbox_messages CASCADE;
DROP TABLE IF EXISTS provider_decisions CASCADE;
DROP TABLE IF EXISTS info_requests CASCADE;
DROP TABLE IF EXISTS case_tasks CASCADE;
DROP TABLE IF EXISTS case_notes CASCADE;
DROP TABLE IF EXISTS case_events CASCADE;
DROP TABLE IF EXISTS refill_cases CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS observations CASCADE;
DROP TABLE IF EXISTS encounters CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS practice_pharmacy_links CASCADE;
DROP TABLE IF EXISTS practice_policies CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

DROP TYPE IF EXISTS controlled_schedule CASCADE;
DROP TYPE IF EXISTS drug_class CASCADE;
DROP TYPE IF EXISTS resolution_type CASCADE;
DROP TYPE IF EXISTS case_source CASCADE;
DROP TYPE IF EXISTS case_priority CASCADE;
DROP TYPE IF EXISTS case_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS org_type CASCADE;

CREATE TYPE org_type AS ENUM ('practice', 'pharmacy');
CREATE TYPE user_role AS ENUM ('practice_admin', 'provider', 'practice_staff', 'pharmacy_admin', 'pharmacy_staff');
CREATE TYPE case_status AS ENUM (
  'RECEIVED', 'NEEDS_PATIENT_MATCH', 'TRIAGE', 'WAITING_ON_INFO',
  'WAITING_ON_PROVIDER', 'WAITING_ON_PATIENT_VISIT', 'WAITING_ON_INSURANCE',
  'APPROVED', 'DENIED', 'SENT_TO_PHARMACY', 'PHARMACY_CONFIRMED',
  'FILLING', 'READY_FOR_PICKUP', 'DISPENSED', 'CLOSED', 'CANCELLED'
);
CREATE TYPE case_priority AS ENUM ('URGENT', 'ROUTINE');
CREATE TYPE case_source AS ENUM ('portal', 'electronic', 'fax', 'phone');
CREATE TYPE resolution_type AS ENUM ('completed', 'denied', 'returned_to_pharmacy', 'duplicate', 'withdrawn');
CREATE TYPE drug_class AS ENUM ('blood_pressure', 'diabetes', 'antidepressant', 'adhd', 'controlled_other', 'other');
CREATE TYPE controlled_schedule AS ENUM ('II', 'III', 'IV', 'V');

CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type org_type NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Chicago',
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  title TEXT NOT NULL,
  mfa_enrolled BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE practice_policies (
  practice_org_id TEXT PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  max_bridge_days INT NOT NULL DEFAULT 30,
  rx_validity_months INT NOT NULL DEFAULT 12,
  too_early_threshold NUMERIC NOT NULL DEFAULT 0.8,
  visit_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  sla JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE practice_pharmacy_links (
  id TEXT PRIMARY KEY,
  practice_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pharmacy_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  cases_last_30d INT NOT NULL DEFAULT 0
);

CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  practice_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  phone TEXT,
  email TEXT,
  chart_number TEXT NOT NULL,
  sms_opt_out BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_channel TEXT NOT NULL DEFAULT 'sms',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE encounters (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL REFERENCES users(id),
  occurred_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL DEFAULT 'office'
);

CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  value TEXT
);

CREATE TABLE prescriptions (
  id TEXT PRIMARY KEY,
  practice_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  prescriber_id TEXT NOT NULL REFERENCES users(id),
  medication_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  form TEXT NOT NULL DEFAULT 'tablet',
  sig TEXT NOT NULL,
  quantity INT NOT NULL,
  days_supply INT NOT NULL DEFAULT 30,
  refills_authorized INT NOT NULL DEFAULT 5,
  refills_remaining INT NOT NULL DEFAULT 0,
  written_at TIMESTAMPTZ NOT NULL,
  last_fill_at TIMESTAMPTZ,
  drug_class drug_class NOT NULL,
  controlled_schedule controlled_schedule,
  status TEXT NOT NULL DEFAULT 'active',
  status_changed_at TIMESTAMPTZ,
  check_in_before_next_refill BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE refill_cases (
  id TEXT PRIMARY KEY,
  case_number TEXT NOT NULL UNIQUE,
  practice_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pharmacy_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id TEXT REFERENCES patients(id) ON DELETE SET NULL,
  prescription_id TEXT REFERENCES prescriptions(id) ON DELETE SET NULL,
  source case_source NOT NULL,
  status case_status NOT NULL,
  resolution resolution_type,
  blockers JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority case_priority NOT NULL,
  owner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  owner_role TEXT NOT NULL,
  next_action TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status_since TIMESTAMPTZ NOT NULL,
  escalation_level INT NOT NULL DEFAULT 0,
  requested_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  injection_suspected BOOLEAN NOT NULL DEFAULT FALSE,
  linked_case_id TEXT,
  version INT NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancel_reason TEXT,
  conflicts JSONB NOT NULL DEFAULT '[]'::jsonb,
  match_candidate_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggested_action TEXT
);

CREATE TABLE case_events (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES refill_cases(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  from_status case_status,
  to_status case_status,
  actor JSONB NOT NULL,
  reason TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE case_notes (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES refill_cases(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE case_tasks (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES refill_cases(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  done_at TIMESTAMPTZ,
  done_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE info_requests (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES refill_cases(id) ON DELETE CASCADE,
  requested_from TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  response JSONB,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

CREATE TABLE provider_decisions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES refill_cases(id) ON DELETE CASCADE,
  provider_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  provider_name TEXT NOT NULL,
  decision TEXT NOT NULL,
  bridge_days INT,
  reason_code TEXT,
  patient_next_step TEXT,
  note TEXT,
  order_confirmation_hash TEXT NOT NULL,
  aal TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE outbox_messages (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES refill_cases(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ,
  dead_lettered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE patient_status_tokens (
  case_id TEXT PRIMARY KEY REFERENCES refill_cases(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_at TIMESTAMPTZ
);

CREATE INDEX idx_refill_cases_practice ON refill_cases(practice_org_id, status);
CREATE INDEX idx_refill_cases_pharmacy ON refill_cases(pharmacy_org_id, status);
CREATE INDEX idx_refill_cases_patient ON refill_cases(patient_id);
CREATE INDEX idx_case_events_case ON case_events(case_id);
CREATE INDEX idx_case_notes_case ON case_notes(case_id);
CREATE INDEX idx_case_tasks_case ON case_tasks(case_id);
CREATE INDEX idx_info_requests_case ON info_requests(case_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
