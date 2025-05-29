import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Optional, for storing tokens securely

export default function App() {
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      const { queryParams } = Linking.parse(url);

      if (queryParams?.token) {
        console.log('Email verification token:', queryParams.token);

        // Example: Send token to your backend to verify
        const response = await fetch('https://localhost:3000/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: queryParams.token }),
        });

        const result = await response.json();
        console.log('Verification result:', result);
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => Linking.removeEventListener('url', handleDeepLink);
  }, []);

  return null;
}
