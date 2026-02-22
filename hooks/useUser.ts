'use client'

import {isAuthorized} from '@/lib/isAuthorized'
import { useEffect, useState } from 'react';

export const useUser = () => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const fetchUser= async ()=> {
      const user=await isAuthorized();
      setEmail(user.email);
      setLoading(false);
    }
    fetchUser();
  },[]); 
  
  return {email, loading};
}