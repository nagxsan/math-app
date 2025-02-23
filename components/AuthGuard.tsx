"use client"

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const token = localStorage.getItem('mathtor-token');
    
    if (!token && pathname !== '/sign-in' && pathname !== '/sign-up') {
      router.push('/sign-in');
    }
  }, [pathname, router]);
  
  return <>{children}</>;
}
