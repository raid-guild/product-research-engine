# MVP And Package Recommendation

## MVP Recommendation

Build MVP B: Ops Kit.

Do not build the full business-in-a-box, full QuickBooks replacement, or growth suite first. Start with a narrow job-to-payment-to-record workflow.

## First Product Scope

Core objects:

- Customer.
- Lead/inquiry.
- Job.
- Estimate.
- Invoice.
- Payment status.
- Receipt/expense attachment.
- Follow-up task.
- Monthly records packet.

Core workflows:

- Add inquiry from call/text/manual form.
- Convert inquiry to estimate.
- Schedule job.
- Attach notes/photos/receipts to job.
- Send invoice/payment link.
- Track unpaid invoice.
- Trigger review request after payment.
- Generate monthly accountant-ready export.

AI-assisted areas:

- Convert messy job notes into a clean estimate draft.
- Draft customer follow-up messages.
- Categorize receipts into user-approved buckets.
- Flag missing records.
- Summarize monthly activity for owner/accountant.
- Detect stale quotes, unpaid invoices, and jobs without next action.

## Explicit Non-Scope

- Tax filing.
- Legal entity recommendation.
- Payroll.
- Full double-entry accounting.
- Advanced dispatch.
- Inventory.
- Deep route optimization.
- Full website builder.
- Review gating or fake review generation.

## Packaging

### Package 1: Admin Recovery Setup

Price: $499 one-time.

Includes:

- 60-minute onboarding call.
- Import up to 100 customers or active jobs.
- Configure estimate/invoice templates.
- Connect payment provider or invoice workflow.
- Create review request template.
- Create receipt/document folders.
- First monthly records packet.

Purpose:

- Funds onboarding.
- Validates pain.
- Prevents support from being hidden inside a cheap monthly plan.

### Package 2: Solo Ops

Price: $149/month.

Includes:

- Up to 1 owner user.
- Customer/job database.
- Estimates/invoices/payment status.
- Automated reminders.
- Review request workflow.
- Records dashboard.
- Monthly accountant-ready export.
- AI message and summary assistance.

### Package 3: Small Crew Ops

Price: $249/month.

Includes:

- Up to 3 field users.
- Everything in Solo Ops.
- Shared job notes/photos.
- Basic task assignment.
- Crew reminders.
- Weekly owner digest.

### Temporary Validation Package: Concierge Ops

Price: $399/month, first 10 customers only.

Includes:

- Monthly cleanup call.
- Manual data cleanup capped at 2 hours/month.
- Priority feedback channel.

This should be a validation instrument, not the permanent business model.

## $10k MRR Scenarios

| Scenario | Customer Mix | MRR |
|---|---:|---:|
| Solo only | 67 customers at $149 | $9,983 |
| Small crew only | 40 customers at $249 | $9,960 |
| Blended | 35 Solo + 20 Small Crew | $10,195 |
| Concierge validation | 25 Solo + 10 Concierge | $7,725 plus $12,475 setup fees if all paid setup |

## No-Build Concierge Test

Before building the full app:

1. Recruit 10 handyman/home-repair operators.
2. Offer Admin Recovery Setup for $299-$499.
3. Use Airtable/Notion, Stripe/Square links, Google Drive, Gmail/SMS templates, and manual monthly exports.
4. Measure whether operators pay, use the workflow, and ask to continue.
5. Only build the parts repeatedly used across at least 7 of 10 customers.

## First 30-Day Build Plan

Week 1:

- Landing page and intake form.
- Customer/job schema.
- Manual admin dashboard.
- Interview and onboarding scripts.

Week 2:

- Estimate/invoice workflow.
- Payment status tracking.
- Reminder and follow-up templates.

Week 3:

- Receipt/photo/job note attachments.
- Monthly export prototype.
- Stale quote/unpaid invoice dashboard.

Week 4:

- AI-assisted message drafts and monthly summaries.
- Basic onboarding import.
- Pilot analytics: time-to-first-invoice, unpaid invoices, follow-up completion, export created.

## First-Week Success Outcome

The customer should see within seven days:

- All active jobs in one place.
- At least one invoice sent.
- At least one unpaid invoice reminder automated.
- At least one review request sent after payment.
- Receipts and job photos stored against jobs.
- A clean "what my accountant needs" packet outline.

