const API_URL = 'http://localhost:5000/api';

const api = {
    getHeaders: () => {
        const token = sessionStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: api.getHeaders()
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    },

    post: async (endpoint, body) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: api.getHeaders(),
                body: JSON.stringify(body)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    },

    put: async (endpoint, body) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: api.getHeaders(),
                body: JSON.stringify(body)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error putting to ${endpoint}:`, error);
            throw error;
        }
    }
};

// Expose globally
window.api = api;
