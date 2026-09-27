# MediSync — Step-by-Step Flows (every login)

## Before you start
1. Open a terminal in the project folder and run: `npm run dev`
2. Open **http://localhost:5174** (or `5173`) in your browser.
3. **Database connection:** Configured with Supabase (`schema.sql` and `seed.sql` executed in SQL Editor; `.env` populated with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
4. **Password for every account:** `MediSync!2026`
5. **MFA code (when asked):** `111111`
6. **Switch login fast:** after you sign in, click the **"Demo: …" button at the bottom-left**. Pick any person and you are logged in as them right away.
7. **Start fresh:** refresh the browser page. All demo data replays deterministically.

---

## The big picture (one story)

```
Pharmacy sends request  →  System checks it (rules)  →  Staff fix problems (if any)
      →  Provider decides  →  Pharmacy gets approval  →  Pharmacy fills medicine
      →  Patient is told at every step  →  Case closes
```

**Who does what:**
| Person | Job in the app |
|---|---|
| **Pharmacy** (Ishaan, Dr. Divya, Rahul) | Sends refill requests. Fills the medicine. |
| **Practice staff** (Aarav, Meera) | Fixes problems: wrong patient, missing info, insurance. |
| **Provider / doctor** (Dr. Arjun Verma, Dr. Sneha Nair) | Approves or denies. Only they can decide (with MFA). |
| **Practice admin** (Riya) | Manages the team and settings. Can break things on purpose (simulator). |
| **Patient** (no login) | Opens a secure link and sees the plain-language status. |

---

## 0. Landing page & Hackathon Showcase (no login)
**Where:** http://localhost:5174/ (or http://localhost:5173/)
**UI Theme:** Cadabra.Studio / Apple + Linear Medical Glassmorphism (`#98FF98` Mint Green, `#93C572` Pistachio, `#F5F0E6` Soft Beige, `#8B6B4A` Mocha Brown, `#D8A7B1` Dusky Pink, 24px rounded corners).

1. **Hero Experience:**
   - Apple keynote zoom-out motion: loads scaled at 1.15 and smoothly settles to 1.0.
   - Animated top workflow line: `Patient → Pharmacy → Provider → Practice Staff → Insurance → Pharmacy → Patient`.
   - Clear value proposition: **"Closing the Prescription Refill Gap"** with **View Demo**, **Explore Workflow**, and **Patient Status Tracker**.
   - Interactive live tablet mock cycling through states with real-time SMS toast.
2. **Section 1 — The Problem (Why Refills Get Stuck):**
   - 6 Premium cards: No Refills Remaining, Provider Approval Required, Patient Visit Needed, Missing Information, Clinical Review Required, Insurance Blockers.
   - Bottom insight banner: *"No single participant has complete visibility. Patients only know one thing: they still don't have their medication."*
3. **Section 2 — What Problem Are We Solving? (Hackathon Question):**
   - Demonstrates that software exists, but cross-organizational ownership is missing.
   - Introduces the **Shared Refill Case**: one source of truth, one owner, one next action, one timeline, complete visibility → *No more refill ping-pong.*
4. **Section 3 — Who Is The Primary Customer? (Hackathon Question):**
   - 4 Animated role cards: Practice Admin, Provider, Pharmacy Admin, Pharmacy Staff.
   - Highlight: **Primary Customer = Physician Groups & Practice Teams**; **Secondary Customer = Pharmacies**.
5. **Section 4 — Where Does AI Add Value? (Hackathon Question):**
   - Split layout: **AI Handles** (fax extraction, missing info detection, summarization, suggestion) vs **Humans Handle** (clinical decisions, approvals, modifications, denials, reviews).
   - Banner: *Clinical prescribing decisions always remain with authorized healthcare professionals.*
6. **Section 5 — How The System Works (Hackathon Question):**
   - 7-step interactive scrolling timeline from Request Received to Case Closed.
7. **Section 6 — System Intelligence (Hackathon Question):**
   - Horizontal deterministic state machine (*What's happening now? → What's missing? → What's blocking progress? → Who can resolve it? → What should happen next? → Did it happen? → What's the new state?*).
8. **Section 7 — Why MediSync Is Different:**
   - Direct comparison table: Traditional workflow (faxes, phone tag, no ownership) vs MediSync (shared case, clear ownership, real-time status).
9. **Section 8 — Go To Market (Hackathon Question):**
   - 6-stage commercialization funnel: Awareness → Prospect → MOFU → BOFU → Close → Customer Success.
10. **Section 9 — Success Metrics:**
    - Animated KPI gauges: Target < 48h resolution, 30% reduction in refill delays, 50% fewer manual follow-ups, 100% case visibility.
11. **Preserved Core Modules:**
    - **Security & Trust:** 8 cards (MFA on decisions, row-level multi-tenancy, append-only audit log, AES-256 encryption, minimum necessary, safe SMS, transactional outbox, BAA-ready).
    - **Interactive ROI Calculator:** drag the sliders to test estimated practice savings.
    - **Transparent Pricing:** $149/provider/mo, Free for pharmacies, 30-day pilot.
    - **Request a Pilot Form:** fill and submit to test form validation and success message.

---

## 1. Sign in page (everyone)
**Where:** http://localhost:5173/sign-in
1. Type a wrong password. You see **"Invalid email or password."**
2. Below the form there is a **Demo accounts** list. Click a name and it fills in the login for you.
3. Click **Sign in**.
4. Doctors and admins get an **MFA screen**. Type `111111`.
5. You land on your home page (it's different for each role).

Other pages you can try:
- **Forgot password** → type an email → click the demo link → set a new password.
- **Sign up** → create a new practice → click the demo verify link → sign in. The new practice has **no data**, so you see the "empty" screens.

---

## 2. PHARMACY flow — Ishaan Khanna (CityCare Pharmacy)
**Login:** `tech@citycare.example.com`
**Home:** Requests page

### 2A. Send a new refill request (the main demo)
1. Click **New request** in the left menu.
2. Click **Use sample fax**. A messy fax appears in the box.
3. Click **Read fax with AI**.
4. The form fills in by itself, with the fax shown on the left.
   - **Green** field = the AI is sure.
   - **Amber** field = the AI is not sure. Tick **"Please confirm this field"** under it.
5. Choose **PeopleTree Family Medicine** as the practice.
6. Click **Send request**.
7. You see **"Request RB-10xx sent"** with the status **Waiting on provider**.
   → The system found the problems by itself: *no refills left* and *A1c blood test overdue*.

**Also try:**
- **Suspicious sample** → a red warning says the fax has strange instructions. They are ignored.
- The **Type the details** tab → click Send with empty fields → you see "Required" errors.
- Fill in half the form, then click another menu item → the app asks **"Discard this request?"**

### 2B. See your requests
1. Click **Requests**. There are 3 tabs:
   - **Needs your action** → approved requests waiting for you.
   - **With the practice** → the practice is still working on these.
   - **Closed** → finished.
2. Click any card to open it.
3. You only see **initials** (like "A.P.") and the birth year. No full name and no doctor notes. This is on purpose, for privacy.

### 2C. Fill an approved medicine
1. **Needs your action** → open a request (for example **A.P.**, Sertraline).
2. Click the buttons in order:
   **Confirm receipt → Start filling → Mark ready for pickup → Mark dispensed**
3. The progress bar moves at each step. After "dispensed" the case is **Closed**.
   → The patient gets a "ready for pickup" message automatically.

---

## 3. PHARMACY flow — Dr. Divya Prasad, PharmD (GreenLeaf Pharmacy)
**Login:** `rph@greenleaf.example.com`

### 3A. Answer the practice's questions
1. Open **With the practice** → open **O.M.** (Levothyroxine).
2. The practice asked 2 questions (strength and quantity).
3. Type the answers (for example `75 mcg` and `30`) and click **Send answers**.
4. The case goes back to the practice to continue.

### 3B. Privacy test
- Dr. Divya **cannot** see CityCare's requests. If you paste a CityCare case link, you see **"Case not found"**.

---

## 4. PRACTICE STAFF flow — Aarav Patel
**Login:** `staff@lakeside.example.com`
**Home:** Refill queue

### 4A. The queue
1. The top boxes show **Open, Urgent, SLA breached, Unassigned**. Click a box to filter.
2. The tabs show each status: Needs match, Triage, With provider, and so on.
3. Search by name, medicine or case number.
4. Click **Claim** on a case → it becomes yours.
5. Click any row to open the case.

### 4B. Inside a case (what you always see)
- **Why is this stuck?** (right side) → what the case is waiting for, who owns it, and when it escalates.
- **Next step** → only the buttons you are allowed to press.
- **Timeline** → everything that happened. Click **Why?** on any line to see the reason.
- **Tabs:** Notes, Tasks, Patient messages, Original request, Deliveries.

### 4C. Cases to try (find them in the queue)
| Open this case | What to do | What happens |
|---|---|---|
| **Rohan Joshi** (Needs match tab) | Click **This is the patient** → **Confirm match** | The system checks the rules and moves the case on. |
| **Kavita Menon** (Needs match) | Click **Not our patient** → type a reason | The case is closed and the pharmacy is told. |
| **Manoj Deshmukh** (Triage) | Click **Return to pharmacy** | No doctor is needed; the pharmacy can fill it. The case closes. |
| **Lalit Mohan** (Triage) | Look at the **Conflicting information** table | The pharmacy says 2 refills, the chart says 0. Click **Request information** to ask. |
| **Sanjay Bhatnagar** (Triage) | Click **Work insurance issue** | The case moves to Insurance. Then click **Insurance resolved**. |
| **Dinesh Aggarwal** (Visit needed tab) | Click **Visit completed** | The case goes back to the doctor. |
| **Zoya Farooqui** (With provider) | Just read it | Red banner: the fax tried to trick the system. It was ignored. |
| **Pooja Iyer** (With provider) | Just read it | Controlled medicine. The AI will not give any suggestion. |

### 4D. Other staff actions
- **Notes tab** → type a note → **Add note**. Only your practice sees it.
- **Patient messages tab** → pick a template → **Send to patient**.
  - Or click **Draft with AI** → edit the text → tick **"I reviewed this message"** → send.
- **Suggest** button (in Next step) → the AI suggests an action. You still decide.
- **Log phone request** (left menu) → type in a patient's phone request → **Create case**.
- Staff **cannot** approve medicine. On a "With provider" case you do not see any decide button.

---

## 5. PROVIDER / DOCTOR flow — Dr. Arjun Verma
**Login:** `dr.verma@lakeside.example.com` (MFA: `111111`)
**Home:** Provider inbox

### 5A. Approve a refill
1. The inbox list is on the left. **Urgent** cases are at the top.
2. Click a case (for example **Vikram Malhotra**).
3. You see:
   - the problems (blockers), with the rule number
   - an **AI summary** (3 short points with source links)
   - the **Your decision** box
4. Choose **Approve** and click **Review order**.
5. A confirmation box repeats **everything**: patient, date of birth, medicine, quantity, refills, pharmacy.
6. Click **Confirm & sign**.
7. Done → the next case opens. The approved case moves to **Sent to pharmacy** in a few seconds.

### 5B. The other decisions (try each one)
| Choice | What you must fill in | What happens |
|---|---|---|
| **Approve with changes** | Change strength, quantity or refills | Sent to the pharmacy with the changes. |
| **Bridge supply + visit** | Number of days (max 30) | A short supply now, and staff get a "book visit" task. Try 31 → error. |
| **Require a visit first** | An optional note | The patient is asked to book a visit. |
| **Do not approve** | A reason **and** a next step for the patient | Both are required. The pharmacy and patient are told. |

### 5C. The main demo continued
- If Ishaan sent the sample fax (step 2A), **Sunita Sharma** is at the top, marked **Urgent**, with "No refills remaining" and "A1c overdue". Approve her.

### 5D. MFA safety test
1. Click the **Demo** button → tick **"Switch without MFA (aal1)"** → pick Dr. Verma.
2. Approve any case → **Confirm & sign**.
3. The app asks **"Verify it's you"** → type `111111` → only then is it saved.

---

## 6. PRACTICE ADMIN flow — Riya Kapoor
**Login:** `admin@lakeside.example.com` (MFA: `111111`)
**Home:** Refill queue (same as staff), plus extra menus.

### 6A. Failure simulator (shows the system is strong)
1. In the left menu, click **Failure simulator**.
2. Click **Take pharmacy down (4 h)**.
3. Switch to **Dr. Verma** → approve any case.
4. Switch back to **Riya** → simulator → click **+4 h** (skips time).
5. Open that case:
   - **Why is this stuck?** says "Pharmacy message failed 5×".
   - Red chip: **Pharmacy unreachable**.
   - **Tasks tab:** "Call the pharmacy".
6. Simulator → **Bring back online** → in the case, open the **Deliveries** tab → **Retry now** → the status becomes **Sent to pharmacy**.

**More simulator buttons:**
- **SMS down** → patient messages go by email instead.
- **+1 day** → late cases **escalate** to the covering doctor, then to the admin.
- **Quiet hours** (on by default) → no texts at night. If messages show "Held — quiet hours", turn this off.
- **Acknowledge this case as the pharmacy** → use it while a case is open.
- **Reset all demo data**

### 6B. Analytics (left menu)
- The big number shows **% of refills solved within 48 hours**.
- Charts show weekly results, top blockers and each pharmacy.

### 6C. Settings (left menu)
- **Team** → **Invite member** → you get an invite link (copy it, open it in a private window, and join).
  - Change a person's role or remove them.
  - You cannot remove the last admin.
- **Pharmacies** → invite or unlink a pharmacy.
- **Policies** → change time limits and visit rules → save.
- **Audit log** → a list of who viewed or changed what.
- The app may ask for the MFA code `111111` for these pages.

---

## 7. PATIENT flow (no login)
The patient only gets a text or email with a link.
1. Log in as **Aarav** (staff) → open a case with a patient, for example **Aisha Patel**.
2. In the right-side box, click **Open patient status page (demo)**. It opens in a new tab.
3. Type the patient's date of birth (Aisha: **02/20/1990**). The DOB is shown on the case page.
4. You see:
   - **"Hi Aisha"**
   - a **5-step tracker**: Received → Being reviewed → Approved → At pharmacy → Ready
   - what happens next, and the clinic phone number
   - **no medicine names** (for privacy)
5. **Test:** type a wrong DOB → "X attempts left" → after 5 wrong tries the link is **locked**.

---

## 8. Safety tests (any login)
| Test | How | You should see |
|---|---|---|
| Idle timeout | Demo button → **Idle warning** | "Stay signed in?" with a 60-second countdown |
| Session expired | Start typing a form → Demo button → **Expire session** | A login box opens over the page and your form is not lost |
| Wrong role | As Ishaan, go to `/queue` | "You don't have access" |
| Page not found | Go to `/abc` | A friendly 404 page |
| Error screen | Add `?mockError=getCase` to a case URL | An error message and a **Try again** button |
| Empty screen | Go to `/queue?mockEmpty=listCases` | An empty state with a helpful button |

---

## 9. One full end-to-end test (about 5 minutes)
1. **Ishaan** → New request → Use sample fax → Read fax with AI → tick the amber field → choose Lakeside → **Send**.
2. **Dr. Verma** → Sunita Sharma (Urgent) → Approve → Review order → **Confirm & sign**.
3. Wait 5 seconds → **Ishaan** → Needs your action → Sunita's request (**S.S.**) → Confirm receipt → Start filling → Mark ready → Mark dispensed.
4. **Aarav** → queue tab **All incl. closed** → search "Sunita" → open the case → read the **Timeline** (every step, who did it, and why) and the **Patient messages** tab.
5. Click **Open patient status page (demo)** → DOB **04/12/1961** → the tracker shows **Ready**.

✅ If all 5 steps work, the main flow works from start to end.

---

**Found a problem?** Tell me the **login**, the **page** and the **step number**, and I will fix it.
