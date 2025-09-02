import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ConfirmEmail() {
  const [status, setStatus] = useState('Confirming your email...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    async function handleConfirmation() {
      if (accessToken && refreshToken && type) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          setStatus(`Error confirming email: ${error.message}`);
        } else {
          setStatus('Email confirmed!');
        }
      } else {
        setStatus('Invalid confirmation link.');
      }
    }

    handleConfirmation();
  }, []);

  return <div>{status}</div>;
}

