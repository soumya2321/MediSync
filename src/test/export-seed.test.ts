import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildSeededEngine } from '@/services/mock/seed';

function escapeSql(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

describe('export seed sql', () => {
  it('generates supabase/seed.sql with updated demo users and cases', () => {
    // Fixed timestamp matching original seed anchor so dates are stable
    const FIXED_NOW = 1790487939414;
    const eng = buildSeededEngine(FIXED_NOW);
    const db = eng.db;

    const lines: string[] = [
      '-- MediSync Seed / Dummy Data',
      '-- Automatically generated from actual system fixtures and replay engine',
      'BEGIN;',
      '',
      '-- Organizations',
    ];

    for (const org of db.orgs) {
      lines.push(
        `INSERT INTO organizations (id, name, type, timezone, phone, city) VALUES (${escapeSql(org.id)}, ${escapeSql(org.name)}, ${escapeSql(org.type)}, ${escapeSql(org.timezone)}, ${escapeSql(org.phone)}, ${escapeSql(org.city)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push('\n-- Users');
    for (const u of db.users) {
      lines.push(
        `INSERT INTO users (id, org_id, key, name, email, role, title, mfa_enrolled, status) VALUES (${escapeSql(u.id)}, ${escapeSql(u.orgId)}, ${escapeSql(u.key)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${escapeSql(u.title)}, ${escapeSql(u.mfaEnrolled)}, 'active') ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push('\n-- Practice Policies');
    for (const [orgId, pol] of Object.entries(db.policies)) {
      lines.push(
        `INSERT INTO practice_policies (practice_org_id, max_bridge_days, rx_validity_months, too_early_threshold, visit_rules, sla) VALUES (${escapeSql(orgId)}, ${escapeSql(pol.maxBridgeDays)}, ${escapeSql(pol.rxValidityMonths)}, ${escapeSql(pol.tooEarlyThreshold)}, ${escapeSql(pol.visitRules)}, ${escapeSql(pol.sla)}) ON CONFLICT (practice_org_id) DO NOTHING;`,
      );
    }

    lines.push('\n-- Pharmacy Links');
    for (const lnk of db.links) {
      lines.push(
        `INSERT INTO practice_pharmacy_links (id, practice_org_id, pharmacy_org_id, status, cases_last_30d) VALUES (${escapeSql(lnk.id)}, ${escapeSql(lnk.practiceOrgId)}, ${escapeSql(lnk.pharmacyOrgId)}, ${escapeSql(lnk.status)}, ${escapeSql(lnk.casesLast30d)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Patients (${db.patients.length} records)`);
    for (const p of db.patients) {
      lines.push(
        `INSERT INTO patients (id, practice_org_id, first_name, last_name, dob, phone, email, chart_number, sms_opt_out, preferred_channel) VALUES (${escapeSql(p.id)}, ${escapeSql(p.practiceOrgId)}, ${escapeSql(p.firstName)}, ${escapeSql(p.lastName)}, ${escapeSql(p.dob)}, ${escapeSql(p.phone)}, ${escapeSql(p.email)}, ${escapeSql(p.chartNumber)}, ${escapeSql(p.smsOptOut)}, ${escapeSql(p.preferredChannel)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Prescriptions (${db.prescriptions.length} records)`);
    for (const rx of db.prescriptions) {
      lines.push(
        `INSERT INTO prescriptions (id, practice_org_id, patient_id, prescriber_id, medication_name, strength, form, sig, quantity, days_supply, refills_authorized, refills_remaining, written_at, last_fill_at, drug_class, controlled_schedule, status, status_changed_at, check_in_before_next_refill) VALUES (${escapeSql(rx.id)}, ${escapeSql(rx.practiceOrgId)}, ${escapeSql(rx.patientId)}, ${escapeSql(rx.prescriberId)}, ${escapeSql(rx.medicationName)}, ${escapeSql(rx.strength)}, ${escapeSql(rx.form)}, ${escapeSql(rx.sig)}, ${escapeSql(rx.quantity)}, ${escapeSql(rx.daysSupply)}, ${escapeSql(rx.refillsAuthorized)}, ${escapeSql(rx.refillsRemaining)}, ${escapeSql(rx.writtenAt)}, ${escapeSql(rx.lastFillAt)}, ${escapeSql(rx.drugClass)}, ${escapeSql(rx.controlledSchedule)}, ${escapeSql(rx.status)}, ${escapeSql(rx.statusChangedAt)}, ${escapeSql(rx.checkInBeforeNextRefill)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Encounters (${db.encounters.length} records)`);
    for (const enc of db.encounters) {
      lines.push(
        `INSERT INTO encounters (id, patient_id, provider_id, occurred_at, type) VALUES (${escapeSql(enc.id)}, ${escapeSql(enc.patientId)}, ${escapeSql(enc.providerId)}, ${escapeSql(enc.occurredAt)}, ${escapeSql(enc.type)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Observations (${db.observations.length} records)`);
    for (const obs of db.observations) {
      lines.push(
        `INSERT INTO observations (id, patient_id, code, observed_at, value) VALUES (${escapeSql(obs.id)}, ${escapeSql(obs.patientId)}, ${escapeSql(obs.code)}, ${escapeSql(obs.observedAt)}, ${escapeSql(obs.value)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Refill Cases (${db.cases.length} records)`);
    for (const c of db.cases) {
      lines.push(
        `INSERT INTO refill_cases (id, case_number, practice_org_id, pharmacy_org_id, patient_id, prescription_id, source, status, resolution, blockers, priority, owner_user_id, owner_role, next_action, due_at, status_since, escalation_level, requested_payload, injection_suspected, linked_case_id, version, created_by, created_at, updated_at, cancel_reason, conflicts, match_candidate_ids, suggested_action) VALUES (${escapeSql(c.id)}, ${escapeSql(c.caseNumber)}, ${escapeSql(c.practiceOrgId)}, ${escapeSql(c.pharmacyOrgId)}, ${escapeSql(c.patientId)}, ${escapeSql(c.prescriptionId)}, ${escapeSql(c.source)}, ${escapeSql(c.status)}, ${escapeSql(c.resolution)}, ${escapeSql(c.blockers)}, ${escapeSql(c.priority)}, ${escapeSql(c.ownerUserId)}, ${escapeSql(c.ownerRole)}, ${escapeSql(c.nextAction)}, ${escapeSql(c.dueAt)}, ${escapeSql(c.statusSince)}, ${escapeSql(c.escalationLevel)}, ${escapeSql(c.requestedPayload)}, ${escapeSql(c.injectionSuspected)}, ${escapeSql(c.linkedCaseId)}, ${escapeSql(c.version)}, ${escapeSql(c.createdBy)}, ${escapeSql(c.createdAt)}, ${escapeSql(c.updatedAt)}, ${escapeSql(c.cancelReason)}, ${escapeSql(c.conflicts)}, ${escapeSql(c.matchCandidateIds)}, ${escapeSql(c.suggestedAction)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Case Notes (${db.notes.length} records)`);
    for (const n of db.notes) {
      lines.push(
        `INSERT INTO case_notes (id, case_id, author_name, body, created_at) VALUES (${escapeSql(n.id)}, ${escapeSql(n.caseId)}, ${escapeSql(n.authorName)}, ${escapeSql(n.body)}, ${escapeSql(n.createdAt)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Case Tasks (${db.tasks.length} records)`);
    for (const t of db.tasks) {
      lines.push(
        `INSERT INTO case_tasks (id, case_id, org_id, title, done, done_at, done_by) VALUES (${escapeSql(t.id)}, ${escapeSql(t.caseId)}, ${escapeSql(t.orgId)}, ${escapeSql(t.title)}, ${t.status === 'done' ? 'TRUE' : 'FALSE'}, NULL, NULL) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Info Requests (${db.infoRequests.length} records)`);
    for (const ir of db.infoRequests) {
      lines.push(
        `INSERT INTO info_requests (id, case_id, requested_from, questions, response, status, created_at, responded_at) VALUES (${escapeSql(ir.id)}, ${escapeSql(ir.caseId)}, ${escapeSql(ir.requestedFrom)}, ${escapeSql(ir.questions)}, NULL, ${escapeSql(ir.status)}, ${escapeSql(ir.createdAt)}, NULL) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Case Events (${db.events.length} records)`);
    for (const ev of db.events) {
      const actor = { type: ev.actorType, name: ev.actorName };
      lines.push(
        `INSERT INTO case_events (id, case_id, action, from_status, to_status, actor, reason, timestamp, metadata) VALUES (${escapeSql(ev.id)}, ${escapeSql(ev.caseId)}, ${escapeSql(ev.eventType)}, ${escapeSql(ev.fromStatus)}, ${escapeSql(ev.toStatus)}, ${escapeSql(actor)}, ${escapeSql(ev.reason)}, ${escapeSql(ev.createdAt)}, ${escapeSql({ ruleIds: ev.ruleIds })}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Provider Decisions (${db.decisions.length} records)`);
    for (const d of db.decisions) {
      lines.push(
        `INSERT INTO provider_decisions (id, case_id, provider_id, provider_name, decision, bridge_days, reason_code, patient_next_step, note, order_confirmation_hash, aal, decided_at) VALUES (${escapeSql(d.id)}, ${escapeSql(d.caseId)}, NULL, ${escapeSql(d.providerName)}, ${escapeSql(d.decision)}, ${escapeSql(d.bridgeDays)}, ${escapeSql(d.reasonCode)}, ${escapeSql(d.patientNextStep)}, ${escapeSql(d.note)}, ${escapeSql(d.confirmationHash)}, ${escapeSql(d.aal)}, ${escapeSql(d.createdAt)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Outbox Messages (${db.outbox.length} records)`);
    for (const o of db.outbox) {
      lines.push(
        `INSERT INTO outbox_messages (id, case_id, destination, channel, payload, status, attempts, next_attempt_at, dead_lettered_at, created_at) VALUES (${escapeSql(o.id)}, ${escapeSql(o.caseId)}, ${escapeSql(o.template)}, ${escapeSql(o.channel)}, '{}'::jsonb, ${escapeSql(o.status)}, ${escapeSql(o.attempts)}, ${escapeSql(o.nextAttemptAt)}, NULL, ${escapeSql(o.createdAt)}) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    lines.push(`\n-- Patient Status Tokens (${db.statusTokens.length} records)`);
    for (const tok of db.statusTokens) {
      lines.push(
        `INSERT INTO patient_status_tokens (case_id, token, expires_at, failed_attempts, locked_at) VALUES (${escapeSql(tok.caseId)}, ${escapeSql(tok.token)}, ${escapeSql(tok.expiresAt)}, ${escapeSql(tok.failedAttempts)}, ${escapeSql(tok.lockedAt)}) ON CONFLICT (case_id) DO NOTHING;`,
      );
    }

    lines.push('\n-- Grant permissions to Supabase roles');
    lines.push('GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;');
    lines.push('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;');
    lines.push('GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;');
    lines.push('\nCOMMIT;\n');

    const seedPath = path.resolve('supabase/seed.sql');
    fs.writeFileSync(seedPath, lines.join('\n'), 'utf-8');
    expect(fs.existsSync(seedPath)).toBe(true);
    expect(fs.readFileSync(seedPath, 'utf-8')).toContain('Riya Kapoor');
    expect(fs.readFileSync(seedPath, 'utf-8')).toContain('Dr. Arjun Verma');
  });
});
