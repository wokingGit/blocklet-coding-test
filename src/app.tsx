import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import ProfileInfo from './pages/ProfileInfo';
import { NotificationProvider } from './notification-context';

function App() {
  return (
    <div className="app">
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile-info" element={<ProfileInfo />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </NotificationProvider>
    </div>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
