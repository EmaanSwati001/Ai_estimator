const API_BASE_URL = "http://localhost:8000";

// Submit questionnaire and get full proposal
export async function createEstimate(formData) {
  const response = await fetch(`${API_BASE_URL}/api/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create project estimate.");
  }
  return response.json();
}

// Fetch a single estimate by ID
export async function getEstimate(projectId) {
  const response = await fetch(`${API_BASE_URL}/api/estimate/${projectId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to retrieve estimate data.");
  }
  return response.json();
}

// Fetch ALL estimates (admin)
export async function getAllEstimates() {
  const response = await fetch(`${API_BASE_URL}/api/estimates`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to retrieve all estimates.");
  }
  return response.json();
}

// Delete an estimate by ID (admin)
export async function deleteEstimate(projectId) {
  const response = await fetch(`${API_BASE_URL}/api/estimate/${projectId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete estimate.");
  }
  return response.json();
}

// Get AI feature recommendations for a given industry + features
export async function getRecommendations(industry, features) {
  const response = await fetch(`${API_BASE_URL}/api/recommend-features`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ industry, features }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to get recommendations.");
  }
  return response.json();
}

// Build the PDF download URL for a project
export function getPdfUrl(projectId) {
  return `${API_BASE_URL}/api/estimate/${projectId}/pdf`;
}
