const API_BASE_URL = "http://localhost:8000";

export async function createEstimate(formData) {
  const response = await fetch(`${API_BASE_URL}/api/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create project estimate.");
  }

  return response.json();
}

export async function getEstimate(projectId) {
  const response = await fetch(`${API_BASE_URL}/api/estimate/${projectId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to retrieve estimate data.");
  }

  return response.json();
}

export function getPdfUrl(projectId) {
  return `${API_BASE_URL}/api/estimate/${projectId}/pdf`;
}
