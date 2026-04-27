import React, { useState } from 'react';

import { LoginScreen } from './app/screens/LoginScreen';
import { WelcomeScreen } from './app/screens/WelcomeScreen';

export default function App() {
  const [userEmail, setUserEmail] = useState<string>('');

  const isAuthenticated = userEmail.length > 0;

  const handleLoginSuccess = (email: string): void => {
    setUserEmail(email);
  };

  const handleLogout = (): void => {
    setUserEmail('');
  };

  if (isAuthenticated) {
    return <WelcomeScreen email={userEmail} onLogout={handleLogout} />;
  }

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}