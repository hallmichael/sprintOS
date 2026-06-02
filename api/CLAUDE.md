# api/ — Laravel backend rules

- PHP 8.3, Laravel 11. Modules live in `app/Modules/<Module>` and all share the same anatomy:
  `Http/{Controllers,Requests,Resources}`, `Domain/{Models,Services,Actions,Data}`, `Jobs/`, `Tests/`,
  a `<Module>ServiceProvider.php` and a `routes.php`.
- Controllers are thin: validate (FormRequest) → call one Action/Service → return a Resource.
- A module's public API is its `Services/` interfaces, bound in its service provider.
- Inputs/outputs of services are typed DTOs (spatie/laravel-data), not arrays.
- Queue heavy work (orchestration runs, ingestion). Never run an LLM loop in a web request.
- Tests: Pest. Tenant isolation + boundary rules are checked in `tests/Architecture`.
