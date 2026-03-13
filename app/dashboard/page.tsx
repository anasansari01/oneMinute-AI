'use client'
import DashboardOverView from '@/components/dashboard/dashboardOverView';
import InitialForm from '@/components/dashboard/initialform'
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react'

const page = () => {
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    const fetchMetadata = async () =>{
      const response = await fetch("/api/metadata/fetch");
      const data = await response.json();
      setIsMetaDataAvailable(data.exists);
      setIsLoading(false);
    }
    fetchMetadata();
  }, []);

  if(isLoading) { 
    return (
      <div className="flex-1 flex w-full items-center justify-center p-4">
        <Loader2 className='w-8 h-8 animate-spin'/>
      </div>
    );
  }

  return (
    <div className='flex-1 w-full'>
      {!isMetaDataAvailable ? (
        <div className="w-full flex items-center justify-center p-4 min-h-100">
          <InitialForm/>
        </div>
      ): (
        <DashboardOverView/>
      )}
    </div>
  )
}

export default page