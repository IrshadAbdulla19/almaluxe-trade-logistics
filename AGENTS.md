<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep business contacts in `src/lib/site.ts` and public moving pages in the existing TanStack route tree so shared branding stays consistent.
- Moving quotation fields use the shared Zod schema and additive columns on the existing leads table; retain historical records and role-protected lead management.
- Retired catalogue URLs redirect to moving services; the existing services table remains editable through the secured admin catalogue URL.
