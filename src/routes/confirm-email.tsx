import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
      return;
    }

    const verify = async () => {
      const { error } = await supabase.auth.verifyOtp({ type: 'email', token });
      if (error) {
        setStatus('error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } else {
        setStatus('success');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    };

    verify();
  }, [location.search, navigate]);

  if (status === 'verifying') {
    return <p>Confirming your email...</p>;
  }

  if (status === 'error') {
    return <p>Confirmation failed. Redirecting...</p>;
  }

  return <p>Email confirmed! Redirecting...</p>;
}
