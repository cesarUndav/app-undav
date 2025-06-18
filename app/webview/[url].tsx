import React from 'react';
import AutoLoginWebView from '@/components/WebViewAutoLogin';
import { useLocalSearchParams } from 'expo-router';

export default function WebViewScreen() {
  const { url, tryLogin } = useLocalSearchParams();

  return (
    <AutoLoginWebView
      url={decodeURIComponent(url as string)}
      tryLogin={tryLogin === 'true'}
    />
  );
}
