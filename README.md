# Almaluxe Packers and Movers

The existing website is now exclusively for household and office relocation. Black, gold/yellow and white branding is retained. Existing lead records and optional integrations are preserved.

## Pages
- `/`: moving home page
- `/about`: company and head office
- `/packers-movers`: Moving Services (existing URL retained)
- `/service-areas`: Thrissur, Bangalore, Mangalore, Chennai and Hyderabad
- `/quote`: structured moving quotation
- `/contact`: clickable business contacts, map and quotation form
- `/privacy`: enquiry privacy policy; legal review recommended
- `/auth`: staff sign-in
- `/admin`: moving enquiries, search, statuses, pagination and CSV download
- `/admin/leads/$id`: moving details, source tracking, follow-up date and internal notes
- `/admin/catalog`: moving service editing (existing URL retained)

Retired catalogue URLs redirect permanently to Moving Services; historical records are not deleted.

## Architecture
The live app uses React, TypeScript, Vite, Tailwind v4 and TanStack Start, with Lovable Cloud database and authentication. It is not an Express/MongoDB runtime. Routes live in `src/routes`, shared public components in `src/components/site`, and lead validation/server submission in `src/lib/leads.schema.ts` and `src/lib/leads.functions.ts`. Server functions are typed same-origin calls rather than separate REST endpoints. The shared schema validates customer name, phone, optional email, pickup, destination, moving date, property type, required services and additional details on both client and server.

Existing `leads` stores enquiries and UTM attribution, statuses and follow-up dates. Additive nullable moving columns preserve compatibility with historical leads. `lead_notes` stores internal follow-up notes; `services` stores editable moving services. `user_roles` separately stores permissions. Database policies restrict enquiry reads/updates to administrators; anonymous submissions are saved server-side. Retired records remain stored but are not rendered publicly.

## Local development
```sh
bun install
bun run dev
bun run test
```
Use the generated public `VITE_SUPABASE_*` configuration for the browser. Server-side database configuration and optional integration credentials are managed by Lovable Cloud; never put private values in browser code or source control. Outside this hosted environment, provide server credentials securely and apply the existing schema before testing server functions.

## Common edits
- Business contacts: `src/lib/site.ts`
- Theme tokens: `src/styles.css`
- Header and footer: `src/components/site`
- Page copy and page metadata: the corresponding `src/routes` file
- Quote fields and validation: shared lead schema, form and additive database columns
- Public service descriptions: signed-in admin Services page

## Integrations and configuration
Google Sheets and WhatsApp notification helpers are retained in `src/lib/integrations.server.ts`; a failure never blocks saving the enquiry. Sheets requires the existing connector credentials, `LEADS_SPREADSHEET_ID` and a `Leads` worksheet. WhatsApp requires the existing connector credentials, `WHATSAPP_NOTIFY_TO` and an approved `WHATSAPP_LEAD_TEMPLATE`. The 12-column Sheets layout is preserved; moving services appear under interest, and a readable moving summary is included in the message. These helpers are not proof that a connector is configured or delivering. Facebook/Instagram webhook ingestion has not been implemented.

No owner email notification is configured. Enquiries are stored in Cloud → Database → leads and shown in the secured admin area. Owner emails require a paid plan and a verified owned domain; verification alone does not activate notification code.

There are currently no registered auth users, so admin end-to-end verification requires the owner account. The existing first-account signup behavior assigns the first registered account as administrator. Complete owner setup before publishing; later accounts are not administrators. Hosted signup/email settings must be checked before relying on account creation.

## Deployment and checks
Run the project tests and verify public pages, quotation storage and authorised admin changes. Publish using Lovable's publishing flow when ready; the app has not been published as part of this update. Connect a custom domain separately if desired. Review the privacy policy and confirm service availability before launch. Generated imagery is illustrative, not a photo of the company's own staff or vehicles.
