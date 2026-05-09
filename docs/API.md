# TextForge AI — API Reference

Base URL: `http://localhost:5000` (or your Railway URL when deployed)

All endpoints return JSON unless they explicitly stream SSE.
All `/api/*` endpoints honour an optional `x-user-id` header — when set, queries are scoped to that user.
The `/v1/*` endpoint is authenticated via `Authorization: Bearer tf_live_xxx`.

---

## Internal API

### POST `/api/generate`
Generates text using Gemini and streams the response via Server-Sent Events.

**Request Body**
```json
{
  "topic": "The impact of artificial intelligence on healthcare",
  "tone": "formal",
  "length": "medium",
  "language": "en",
  "keywords": ["diagnostics", "patient outcomes"],
  "templateId": "essay"
}
```

| Field      | Type     | Required | Values                                   |
|------------|----------|----------|------------------------------------------|
| topic      | string   | ✅       | 3–500 characters                         |
| tone       | string   |          | `formal` `casual` `creative` `academic`  |
| length     | string   |          | `short` `medium` `long`                  |
| language   | string   |          | `en` `hi` `es` `fr` `de` `ja` `ar` `zh`  |
| keywords   | string[] |          | Up to 10 SEO keywords (≤ 40 chars each)  |
| templateId | string   |          | Optional template tag for analytics      |

**SSE Response Stream**
```
data: {"text": "Artificial ", "done": false}
data: {"text": "intelligence ", "done": false}
...
data: {"id": "667abc...", "done": true}
```

The final event includes the saved generation `id` so clients can favourite or share it immediately.

---

### POST `/api/generate/refine`
Regenerates an existing piece of text following a refinement instruction.

**Request Body**
```json
{
  "originalText": "<the previous output>",
  "instruction": "Make this text noticeably shorter while keeping the key ideas.",
  "topic": "<the original topic>",
  "tone": "formal",
  "length": "short",
  "language": "en",
  "refinementOf": "<previous generation _id, optional>"
}
```

Streams the refined text using the same SSE format as `/api/generate`.

---

### GET `/api/generate/preview`
Returns the engineered prompt without calling Gemini — useful for debugging.

**Query Params:** `topic`, `tone`, `length`, `language`, `keywords` (comma-separated)

---

### GET `/api/history`
Paginated, filterable list of past generations.

**Query Params**
| Param          | Default | Description                              |
|----------------|---------|------------------------------------------|
| page           | 1       |                                          |
| limit          | 10      | max 50                                   |
| tone           |         | filter by tone                           |
| language       |         | filter by language                       |
| search         |         | case-insensitive match on topic + output |
| favouritesOnly | false   | only starred generations                 |

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "667abc...",
      "topic": "Quantum computing",
      "tone": "academic",
      "length": "long",
      "language": "en",
      "keywords": [],
      "output": "Quantum computing represents...",
      "wordCount": 342,
      "isFavourite": true,
      "isShared": true,
      "createdAt": "2025-06-10T12:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 42, "pages": 5 }
}
```

---

### GET `/api/history/:id` · DELETE `/api/history/:id` · DELETE `/api/history`
Get one, delete one, clear all (per-user when `x-user-id` is sent).

---

### PATCH `/api/history/:id/favourite`
Toggles the `isFavourite` flag. Returns the updated generation.

---

### PATCH `/api/history/:id/share`
Body: `{ "isShared": false }` — disables the public share link for that generation.

---

### GET `/api/share/:id`
**Public, unauthenticated.** Returns a generation by id ONLY if `isShared: true`. Powers the `/s/:id` share page in the frontend.

---

### GET `/api/stats`
Aggregations for the Stats Dashboard. Per-user when `x-user-id` is sent.

**Response**
```json
{
  "success": true,
  "data": {
    "totalGenerations": 142,
    "totalWords": 38420,
    "favouritesCount": 12,
    "byTone":     [{ "_id": "formal",   "count": 70 }, ...],
    "byLanguage": [{ "_id": "en",       "count": 110 }, ...],
    "last30Days": [{ "_id": "2026-04-15", "count": 4, "words": 1200 }, ...]
  }
}
```

---

### `/api/keys` (authenticated user)
| Method | Endpoint           | Description                                  |
|--------|--------------------|----------------------------------------------|
| GET    | `/api/keys`        | List user's keys (key bodies are masked)     |
| POST   | `/api/keys`        | Body `{ "name": "..." }` → returns full key  |
| DELETE | `/api/keys/:id`    | Revoke a key (sets `isRevoked: true`)        |

POST returns the full key value **once** — store it immediately.

---

## Public API

### POST `/v1/generate`
Synchronous (non-streaming) generation for third-party API consumers.

```bash
curl -X POST http://localhost:5000/v1/generate \
  -H "Authorization: Bearer tf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "The future of renewable energy",
    "tone": "academic",
    "length": "medium",
    "language": "en",
    "keywords": ["solar", "wind", "grid"]
  }'
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "667abc...",
    "output": "Renewable energy is poised to...",
    "wordCount": 348,
    "model": "gemini-2.5-flash",
    "createdAt": "2026-04-15T10:32:11.000Z"
  }
}
```

**Rate limit:** 10 requests per minute per API key. Exceeding returns `429`.

---

## GET `/health`
Health check.

**Response:** `{ "status": "ok", "service": "TextForge AI Backend", "version": "1.1.0", "timestamp": "..." }`
