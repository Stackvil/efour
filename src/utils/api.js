export const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let res = await fetch(url, { ...options, headers });

    // If unauthorized, attempt to refresh the token using the HTTP-only cookie
    if (res.status === 401) {
        try {
            const refreshRes = await fetch('/api/auth/refresh-token', {
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
                    res = await fetch(url, { ...options, headers });
                }
            } else {
                // If refresh token is expired or unauthorized, clear local session
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Could emit an event here to notify the app to logout
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
