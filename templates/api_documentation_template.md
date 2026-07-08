# API Route Structure Compliance Template
**Module ID**: TMPL-API-DOC  
**Version**: 1.0.0  
**Focus**: Structural and security verification rules for newly created API endpoints.

---

## 1. Compliance Checklist for API Endpoints

### A. Endpoint Naming & Verb Selection
- Use lower-case, plural nouns for collection paths (e.g., `/api/v1/concepts`, NOT `/api/v1/getConcept`).
- Ensure HTTP verbs align with actions:
  - `GET`: Retrieve data without side effects.
  - `POST`: Create a new resource or execute a complex operation.
  - `PUT`: Update a resource entirely.
  - `DELETE`: Remove a resource.

### B. Parameter Validation
- **Path parameters**: Validate format (e.g., UUID format or regex constraints).
- **Body payloads**: Ensure strict JSON validation schemas are applied (e.g., Joi, Zod, or JSONSchema). Reject payload if unexpected fields are present.

### C. Security Headers & Controls
- Apply Rate Limiting headers (`X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`).
- Require Authorization Bearer Token for protected endpoints.
- Return standardized status codes:
  - `200 OK` / `201 Created` on successes.
  - `400 Bad Request` on payload validation fails.
  - `401 Unauthorized` / `403 Forbidden` on security validation failures.
  - `429 Too Many Requests` on rate breaches.
