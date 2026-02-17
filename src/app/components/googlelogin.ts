'use client';

import { getAccessTokenFromCode, socialLogin } from '@/services/auth/social';
// import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react';

export default function GoogleLogin() {
  // const router = useRouter();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCode(params.get('code'));
    }
  }, []);

  useEffect(() => {
    if (code) {
      const fetchData = async () => {
        try {
          const accessToken = await getAccessTokenFromCode({
            authorizationCode: code,
          });
          if (accessToken?.success) {
            await socialLogin({
              accessToken: accessToken?.data ?? '',
              provider: 'google',
            });
          }
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      };
      fetchData();
    }
  }, [code]);

  return null;
}
