import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import { AuthProvider } from './auth/AuthContext';
import { trackPageView } from './api/client';

const router = createBrowserRouter(routes);

// Count page views for the admin Analytics page (paths only, no personal data).
let lastPath = window.location.pathname;
trackPageView(lastPath);
router.subscribe(({ location }) => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    trackPageView(lastPath);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
