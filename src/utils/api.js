export const BASE_URL = import.meta.env.VITE_API_URL || 'https://e3-e4-backend.ethree.in';

export const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure the URL is absolute if it's a relative path starting with /api
    const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;

    let res = await fetch(fullUrl, { ...options, headers });

    // If unauthorized, attempt to refresh the token using the HTTP-only cookie
    if (res.status === 401) {
        try {
            const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
                method: 'POST',
                // Important to ensure the browser sends the domain cookies
                credentials: 'include'
            });

            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                if (refreshData.token) {
                    token = refreshData.token;
                    localStorage.setItem('token', token);

                    // Update headers and retry the original request
                    headers['Authorization'] = `Bearer ${token}`;
                    res = await fetch(fullUrl, { ...options, headers });
                }
            } else {
                // If refresh token is expired or unauthorized, clear local session
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth_expired'));
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth_expired'));
        }
    }

    return res;
};

export const sendOtp = async (mobile, additionalData = {}) => {
    return fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, location: 'E4', ...additionalData })
    });
};

export const verifyOtp = async (mobile, otp, additionalData = {}) => {
    return fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, location: 'E4', ...additionalData })
    });
};

export const logout = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return res;
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
