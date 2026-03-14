'use client'
import TeamSection from '@/components/dashboard/settings/teamSection';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface OrganizationData {
  id: string;
  business_name: string;
  website_url: string;
  created_at: string;
}

const SettingPage = () => {
  const router = useRouter();
  const [organizationData, setOrganizationData] = useState<OrganizationData>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const res = await fetch("/api/organization/fetch");
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setOrganizationData(data.organization);
      } catch (error) {
        toast.error("Failed to fetch organization data");
      }
    };
    fetchOrganizationData();

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const gmtOffset = new Date().getTimezoneOffset();
    const offsetHours = -gmtOffset / 60;
    const gmtString = `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
    setTimezone(`${userTimezone} (${gmtString})`);
  }, []);

  const handleDeleteWorkspace = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch("/api/organization/delete", {
        method: "DELETE",
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to delete workspace");
      }

      toast.success("Workspace deleted successfully");
      
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      localStorage.clear();
      sessionStorage.clear();

      router.push("/");
      router.refresh();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete workspace");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500'>
      <div>
        <h1 className='text-2xl font-semibold text-white tracking-tight'>
          Settings
        </h1>
        <p className='text-sm text-zinc-400 mt-1'>
          Manage workspace preferences, security, and billing.
        </p>
      </div>

      <Card className='border-white/5 bg-[#0A0A0E]'>
        <CardHeader>
          <CardTitle className='text-base font-medium text-white'>  
            Workspace Settings
          </CardTitle>
          <CardDescription>
            General settings for your organization. (Read Only)
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className='text-zinc-500'>
                Workspace Name
              </Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                {organizationData?.business_name || "Loading..."}
              </div>
            </div>
            <div className="space-y-2">
              <Label className='text-zinc-500'>Primary Website</Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                {organizationData?.website_url || "Loading..."}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-white">
              <Label className='text-zinc-500'>
                Default Language
              </Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                English
              </div>
            </div>
            <div className="space-y-2 text-white">
              <Label className='text-zinc-500'>
                Timezone
              </Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
                {timezone || "Loading..."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TeamSection />

      <Card className='border-red-500/10 bg-red-500/2'>
        <CardHeader>
          <CardTitle className='text-base font-medium text-red-500'>
            Danger Zone
          </CardTitle>
          <CardDescription className='text-red-500/60'>
            Irreversible actions for this workspace.
          </CardDescription>
        </CardHeader>
        <div className="px-6">
          <div className="h-px bg-red-500/10" />
        </div>
        <CardContent className='pt-6'>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className='text-sm font-medium text-zinc-300'>Delete Workspace</p>
              <p className='text-xs text-zinc-500'>
                Permanently delete all knowledge, conversations, and settings.
              </p>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className='bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-none'
                >
                  <Trash2 className='w-4 h-4 mr-2'/>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='bg-[#0E0E12] border-white/10'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-white'>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-zinc-400'>
                    This action cannot be undone. This will permanently delete your workspace 
                    and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    className='bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white'
                    disabled={isDeleting}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    className='bg-red-500 text-white hover:bg-red-600 border-none disabled:opacity-50'
                    onClick={handleDeleteWorkspace}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Workspace"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingPage;