import axios from 'axios';

/* ========================================
   API URL
======================================== */

const BACKEND_URL =
  (
    import.meta.env.VITE_API_URL ||
    'https://perfume-stock-management-system-ewa.vercel.app'
  ).replace(/\/$/, '');

const API_BASE_URL =
  `${BACKEND_URL}/api`;

if (
  import.meta.env.MODE ===
  'development'
) {
  console.log(
    '🔧 API Base URL:',
    API_BASE_URL
  );
}

/* ========================================
   AXIOS INSTANCE
======================================== */

const API =
  axios.create({
    baseURL:
      API_BASE_URL,

    timeout:
      30000,
  });

/* ========================================
   REQUEST INTERCEPTOR
======================================== */

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'token'
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(
      error
    )
);

/* ========================================
   RESPONSE INTERCEPTOR
======================================== */

API.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    const token =
      localStorage.getItem(
        'token'
      );

    /*
      Only redirect if an authenticated
      session existed.

      Public storefront requests should
      not redirect customers to /login.
    */

    if (
      error.response
        ?.status ===
        401 &&
      token
    ) {
      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'user'
      );

      window.location.href =
        '/login';
    }

    return Promise.reject(
      error
    );
  }
);

export {
  BACKEND_URL,
  API_BASE_URL,
};

export default API;