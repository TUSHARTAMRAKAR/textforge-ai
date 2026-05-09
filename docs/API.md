# TextForge AI — API Reference

Base URL: `http://localhost:5000`

---

## POST `/api/generate`

Generates text using Claude AI. Streams the response via Server-Sent Events (SSE).

**Request Body**
```json
{
  "topic": "The impact of artificial intelligence on healthcare",
  "tone": "formal",
  "length": "medium"
}
```

| Field  | Type   | Required | Values                                   |
|--------|--------|----------|------------------------------------------|
| topic  | string | ✅       | 3–500 characters                         |
| tone   | string | ✅       | `formal` `casual` `creative` `academic`  |
| length | string | ✅       | `short` `medium` `long`                  |

**SSE Response Stream**
```
data: {"text": "Artificial ", "done": false}
data: {"text": "intelligence ", "done": false}
...
data: {"text": "", "done": true}
```

**Error Response**
```json
{ "success": false, "message": "Topic must be at least 3 characters" }
```

---

## GET `/api/generate/preview`

Returns the prompt that would be sent to Claude — no API call made.

**Query Params:** `topic`, `tone`, `length`

**Response**
```json
{
  "success": true,
  "prompt": "You are TextForge AI..."
}
```

---

## GET `/api/history`

Returns paginated list of past generations.

**Query Params:** `page` (default: 1), `limit` (default: 10, max: 50)

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
      "output": "Quantum computing represents...",
      "wordCount": 342,
      "createdAt": "2025-06-10T12:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 42, "pages": 5 }
}
```

---

## GET `/api/history/:id`

Returns a single generation by ID.

---

## DELETE `/api/history/:id`

Deletes a single generation.

**Response:** `{ "success": true, "message": "Generation deleted" }`

---

## DELETE `/api/history`

Clears ALL history.

**Response:** `{ "success": true, "message": "Cleared 42 generation(s)" }`

---

## GET `/health`

Health check endpoint.

**Response:** `{ "status": "ok", "service": "TextForge AI Backend", "version": "1.0.0" }`
