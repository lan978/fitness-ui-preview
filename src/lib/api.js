export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function readResponsePayload(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { msg: text };
  }
}

async function requestJson(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: isFormData
      ? { ...(options.headers || {}) }
      : {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
  });

  const data = await readResponsePayload(response);
  if (!response.ok) {
    throw new ApiError(data?.msg || `Request failed: ${response.status}`, response.status, data);
  }

  return data;
}

export function registerStaffUser(payload) {
  return requestJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginStaffUser(payload) {
  return requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCurrentStaffUser() {
  return requestJson("/api/auth/me");
}

export function logoutStaffUser() {
  return requestJson("/api/auth/logout", {
    method: "POST"
  });
}

export function getWorkspaceState() {
  return requestJson("/api/workspace/state");
}

export function claimWorkspaceConversation(conversationId) {
  return requestJson(`/api/workspace/conversations/${conversationId}/claim`, {
    method: "POST"
  });
}

export function transferWorkspaceConversation(conversationId) {
  return requestJson(`/api/workspace/conversations/${conversationId}/transfer`, {
    method: "POST"
  });
}

export function polishWorkspaceReply(text) {
  return requestJson("/api/workspace/polish", {
    method: "POST",
    body: JSON.stringify({ text })
  });
}

export function getKnowledgeState() {
  return requestJson("/api/knowledge/state");
}

export async function uploadKnowledgeDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  return requestJson("/api/knowledge/upload", {
    method: "POST",
    body: formData
  });
}

export function deleteKnowledgeChunks(chunkIds) {
  return requestJson("/api/knowledge/chunks/delete", {
    method: "POST",
    body: JSON.stringify({ chunk_ids: chunkIds })
  });
}

export function deleteKnowledgeDocument(docId) {
  return requestJson("/api/knowledge/docs/delete", {
    method: "POST",
    body: JSON.stringify({ doc_id: docId })
  });
}

export function getAnalyticsState() {
  return requestJson("/api/analytics/state");
}

export function sendDemoMessage(sessionId, message) {
  return requestJson("/api/demo/message", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, message })
  });
}
