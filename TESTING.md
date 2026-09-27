# MediSync — What's built & how to test it

## Run it
```
npm install        # first time only
npm run dev        # open http://localhost:5174 (or 5173)
npm test           # automated tests (181 passed across 15 test suites)
```
- **Live Supabase DB + In-Memory Simulation:** The database schema (`schema.sql`) and seed data (`seed.sql`) are applied in Supabase. Refreshing resets the deterministic simulation clock.
- **Password for every account:** `MediSync!2026`
- **MFA code:** `111111`
- **Switching roles:** once signed in, a **"Demo: …" pill** sits at the bottom left. Use it to switch roles instantly without signing out.

## The problem we solve (one line)
When a refill needs a provider, it bounces between pharmacy, practice staff, provider and patient with **no owner and no shared status**. MediSync turns it into **one shared case with one owner, one next step and a due time**. The case only closes when the pharmacy confirms, and the patient is kept informed at every step.

## Demo accounts
| Who | Email | Role | Lands on |
|---|---|---|---|
| Riya Kapoor | admin@lakeside.example.com | Practice admin (MFA) | Queue + Failure simulator |
| Dr. Arjun Verma | dr.verma@lakeside.example.com | Provider (MFA) | Provider inbox |
| Dr. Sneha Nair | dr.nair@lakeside.example.com | Provider (covering) | Provider inbox |
| Aarav Patel | staff@lakeside.example.com | Practice staff | Queue |
| Meera Kulkarni | ma@lakeside.example.com | Practice staff | Queue |
| Rahul Patel | admin@citycare.example.com | Pharmacy admin (MFA) | Pharmacy requests |
| Ishaan Khanna | tech@citycare.example.com | Pharmacy staff (CityCare) | Pharmacy requests |
| Dr. Divya Prasad, PharmD | rph@greenleaf.example.com | Pharmacy staff (GreenLeaf) | Pharmacy requests |

---

## Pages: what each one solves and how to test it

### 1. Sign in / MFA — `/sign-in`, `/mfa`
**Solves:** protecting health data. Providers and admins must use MFA, and clinical decisions require it.
**Test:**
1. Enter a wrong password. You should see "Invalid email or password." with no hint about which part was wrong.
2. Sign in as `staff@…`. You go straight to the Queue with no MFA.
3. Sign in as `dr.verma@…`. You're asked for MFA; enter `111111` and you land on the Provider inbox.
4. Enter a wrong MFA code. You should see "That code didn't work…".
5. Click a "Demo accounts" row. It fills in the login for you.
6. Other screens to try: `/sign-up`, `/forgot-password`, invite accept (Settings → Team → Invite gives a link) and `/reset-password`. Each one shows a demo link where a real email would be sent.

### 2. Refill Queue — `/queue` (practice staff and admin)
**Solves:** "I can't see where a stuck refill is, what's blocking it or who acts next."
**Test:**
1. The KPI tiles (Open / Urgent / SLA breached / Unassigned) filter the list when clicked.
2. The status tabs, blocker, priority, owner and SLA filters and the search box all change the URL. Copy the URL into a new tab and the same view opens.
3. Click **Claim** on an unassigned case. The owner updates instantly.
4. Search for `zzz`. You should see the "No cases match" message and a Clear button.
5. Open `/queue?mockEmpty=listCases` to see the empty state, and `/queue?mockError=listCases` to see the error state with a Retry button.

### 3. Case Detail — `/cases/:id` ⭐ the North Star page
**Solves:** "Why is this stuck, and what happens next?" It also records who did what and why.
Open any case from the Queue:
- **"Why is this stuck?" panel:** current state, time in that state, owner, what it's waiting for, blockers with the rule ID that raised each one (R1–R10), the last delivery attempt, and the next automatic escalation.
- **Next step card:** only the actions allowed for your role in this state appear. The rules' suggestion is highlighted, and **Suggest** asks the mock AI.
- **Timeline:** every event has a **Why?** link showing the actor, rule IDs, reason and request ID.
- **Tabs:** Notes (practice-only), Tasks, Patient messages (templates or AI draft, which must be reviewed before sending), Original request, Deliveries (retries).

Cases worth opening as **Jordan (staff)** (use the Queue tabs to find them):
| Find it under | What to check |
|---|---|
| Needs match: **Rohan Joshi** | No phone was sent, so it's flagged "Please confirm the patient". Pick the candidate and triage runs. |
| Needs match: **Kavita Menon** | Unknown patient. Close it with "Not our patient". |
| Triage: **Manoj Deshmukh** | No blockers (R10). "Return to pharmacy" closes it. |
| Triage: **Lalit Mohan** | Conflicting info: pharmacy says 2 refills, chart says 0, shown side by side. Request info or send to the provider. |
| Triage: **Sanjay Bhatnagar** | Prior-auth needed. "Work insurance issue" moves it to the insurance queue. |
| Waiting on info: **Neha Saxena** | Questions are waiting on GreenLeaf (answer them as Grace, see page 6). |
| With provider: **Zoya Farooqui** | Red banner: the fax contained "IGNORE PREVIOUS INSTRUCTIONS…", which was ignored and flagged. |
| With provider: **Pooja Iyer** | Schedule II controlled substance. A new Rx is required and the AI refuses to suggest anything. |
| Awaiting pharmacy: **Ananya Patel** | Sent but not yet confirmed. The case can't close until the pharmacy confirms. |
| Search **Harish Chandra** | Pharmacy was unreachable: 5 failed attempts, dead letter, a "Call the pharmacy" task and a **Retry now** button in Deliveries. |
| Search **Vijay Singhania / Lakshmi Sundaram** | SLA breached, escalated to the covering provider. |
| Search **Vikram Malhotra** (closed tab "All incl. closed") | A duplicate request was linked to the original case. |

On any case with a patient, **"Open patient status page (demo)"** opens what the patient sees (see page 7).

### 4. Provider Inbox — `/provider/inbox` (Dr. Rao)
**Solves:** the provider decision, the step where refills stall. It is fast, safe and never automatic.
**Test:**
1. The inbox is sorted with urgent cases first. Selecting a case shows its blockers, a 3-bullet AI summary with source links, and the decision panel.
2. Choose **Approve** → **Review order**. The confirmation dialog repeats the patient, DOB, chart number, drug, quantity, refills and pharmacy. Click **Confirm & sign**.
3. After a few seconds the case moves from Approved to **Sent to pharmacy** (the delivery worker ran).
4. **Deny** without a reason is blocked: you must give a reason *and* a next step for the patient.
5. **Bridge + visit** approves a 30-day supply (the practice maximum; 31 is rejected) and creates a visit task.
6. **Step-up MFA:** use the Demo pill → tick "Switch without MFA (aal1)" → switch to Dr. Rao → approve. The MFA modal appears before the approval is saved.
7. As Jordan (staff), open a "With provider" case. You see "Only providers can make clinical decisions." and no decision button.

### 5. Pharmacy intake — `/pharmacy/requests/new` (Omar) ⭐ the 60-second demo
**Solves:** messy faxes. Missing information is found on arrival instead of days later.
**Test (the magic moment):**
1. As **Omar**, click **Use sample fax** → **Read fax with AI**.
2. The fields fill in, with the original fax shown alongside. Green means confident; amber (the Sig line) must be confirmed with its checkbox before Send is enabled.
3. Choose Lakeside → **Send request**. The result is "Waiting on provider".
4. Switch to **Dr. Rao**. **Sunita Sharma** is at the top, marked **Urgent**, with "No refills remaining · R6" and "A1c overdue · R7". Approve her.
5. Switch back to **Omar** → Requests → "Needs your action". Open Maria's request and click Confirm receipt → Start filling → Mark ready → Mark dispensed. The case closes as completed.

Also try:
- **Suspicious sample** → a warning banner appears.
- Open `/pharmacy/requests/new?mockError=extractIntake` → "Auto-fill unavailable", with manual entry as the fallback.
- Upload a `.svg` file, or a file renamed to `.pdf`, → it is rejected.
- Leave the "Type the details" form half-filled and navigate away → you're asked "Discard this request?".

### 6. Pharmacy requests + pharmacy case view — `/pharmacy/requests`
**Solves:** pharmacies can see status without phoning the practice, and they only see what they need.
**Test:**
1. As **Omar**, open a request. You see **initials and birth year only**: no notes, no chart data, no AI output.
2. As **Grace (GreenLeaf)**, open Olivia's request ("With the practice" tab). Answer the questions and the case goes back to the practice's triage.
3. As **Grace**, paste the URL of one of Omar's CityCare cases. You get **Case not found**, because each pharmacy's data is isolated.

### 7. Patient status page — `/status/:token` (no login)
**Solves:** the patient sits in silence with no idea where the refill is ("I still don't have my medication").
**Test:**
1. From a practice case, click "Open patient status page (demo)". The DOB is shown on the case (for example Aisha Patel: 02/20/1990).
2. Enter a wrong DOB. You see how many attempts are left; after 5 wrong tries the link is **locked**.
3. With the right DOB you see a 5-step tracker, what happens next and the clinic's phone number. **No drug names** appear anywhere.

### 8. Failure simulator (Riya, sidebar → "Failure simulator")
**Solves:** "What happens when a dependency fails?" The judges will look for this.
**Test:**
1. Click **Take pharmacy down** → as Dr. Verma, approve any case → back as Riya, click **+4 h**.
2. Open that case. You should see 5 failed attempts, a dead letter, the "Pharmacy unreachable" blocker and a call task. The "Why is this stuck?" panel explains all of it.
3. Click **Bring back online** → Deliveries → **Retry now** → the case moves to Sent to pharmacy.
4. Toggle **SMS down** → patient messages fall back to email.
5. Click **+1 day** → overdue cases escalate (Level 1 goes to the covering provider, Level 2 to the admin).
6. **Quiet hours** are on by default (9 PM–8 AM Chicago time). If patient messages show "Held — quiet hours", switch this off.

### 9. Session safety (Demo pill buttons)
- **Idle warning:** shows "Stay signed in?" with a 60-second countdown.
- **Expire session:** a re-login modal opens *over* the current page, so any half-filled form isn't lost.

### 10. Analytics — `/analytics` (Riya / Dr. Verma / Rahul)
**Solves:** measurable value. North Star metric: % of refills pharmacy-confirmed within 48 business hours. The page also shows median hours, touches per refill, SLA breaches, AI acceptance and top blockers. `?mockEmpty=getAnalyticsSummary` shows the empty state.

### 11. Settings — `/settings/...` (Riya)
- **Team:** invite (gives a demo link), change role, remove. You can't demote the last admin.
- **Pharmacies:** link or unlink pharmacies.
- **Policies:** SLA and visit rules.
- **Audit log:** every view of a case is recorded.

All of these need MFA; switching as aal1 triggers the MFA modal.

---

## Error / empty states on any page
Add `?mockError=<function>` or `?mockEmpty=<function>` to the URL, for example `?mockError=getCase` or `?mockEmpty=listCases`.

## Status
- ✅ All pages are built, including the Cadabra / Apple-Linear Hackathon showcase landing page at `/`.
- ✅ Automated checks: `npm test` → **181 tests passing** (15 test suites) · `npm run lint` clean · `npm run typecheck` clean · `npm run build` OK.
- ✅ Supabase database: `schema.sql` and `seed.sql` executed in Supabase SQL Editor; `.env` configured with project credentials.
- ℹ️ Refreshing the browser resets all demo data. This is by design: no patient data is kept in browser storage.

## Where the code lives (for UI work)
- **Colors, fonts, animations:** `src/index.css` (Cadabra medical glassmorphism tokens & utilities)
- **Reusable components:** `src/components/ui/`
- **Pages:** `src/features/<page>/`
- **Landing Page & Hackathon Sections:** `src/features/landing/LandingPage.tsx`
- **Business rules (don't change for UI work):** `supabase/functions/_shared/` and `src/services/`
