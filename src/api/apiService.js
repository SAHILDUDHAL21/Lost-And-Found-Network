//const API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'https://lostandfoundbackend-q8yc.onrender.com/api';


// Helper to get stored auth headers with JWT token
function getAuthHeaders() {
  const token = localStorage.getItem('jwt-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Authentication API with JWT
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem('jwt-token', data.token);
    }
    return data;
  } catch (error) {
    console.error('Registration API Error:', error);
    return { success: false, message: 'Server offline or network error' };
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem('jwt-token', data.token);
    }
    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    return { success: false, message: 'Server offline or network error' };
  }
}

export async function verifyToken(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Verify Token API Error:', error);
    return { success: false };
  }
}

// User Profile API
export async function fetchUserProfile(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Fetch User Profile API Error:', error);
    return null;
  }
}

export async function updateUserProfile(idOrEmail, userData) {
  try {
    const endpoint = (typeof idOrEmail === 'number' || (!isNaN(idOrEmail) && Number(idOrEmail) > 0))
      ? `${API_BASE_URL}/users/${idOrEmail}`
      : `${API_BASE_URL}/users/email/${encodeURIComponent(idOrEmail)}`;

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Update User Profile API Error:', error);
    return null;
  }
}

// Found Items API (CREATE, READ, UPDATE, DELETE)
export async function fetchItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Fetch Items API Error:', error);
    return null;
  }
}

export async function createItem(itemData) {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Create Item API Error:', error);
    return null;
  }
}

export async function updateItem(id, itemData) {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Update Item API Error:', error);
    return null;
  }
}

export async function deleteItem(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('Delete Item API Error:', error);
    return false;
  }
}

// Ownership Claims API (CREATE, READ, UPDATE STATUS, DELETE)
export async function fetchClaimsByItem(itemId) {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/item/${itemId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Fetch Claims API Error:', error);
    return [];
  }
}

export async function submitClaim(claimData) {
  try {
    const response = await fetch(`${API_BASE_URL}/claims`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(claimData),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Submit Claim API Error:', error);
    return null;
  }
}

export async function updateClaimStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Update Claim Status API Error:', error);
    return null;
  }
}

export async function deleteClaim(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('Delete Claim API Error:', error);
    return false;
  }
}

// Comments API (CREATE, READ, DELETE)
export async function fetchCommentsByItem(itemId) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/item/${itemId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Fetch Comments API Error:', error);
    return [];
  }
}

export async function postComment(commentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(commentData),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Post Comment API Error:', error);
    return null;
  }
}

export async function deleteComment(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('Delete Comment API Error:', error);
    return false;
  }
}

// Scammer Leaderboard API (CREATE, READ)
export async function fetchScammers() {
  try {
    const response = await fetch(`${API_BASE_URL}/scammers`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Fetch Scammers API Error:', error);
    return null;
  }
}

export async function createScammer(scammerData) {
  try {
    const response = await fetch(`${API_BASE_URL}/scammers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(scammerData),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Create Scammer API Error:', error);
    return null;
  }
}
