import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react'

interface TeamMember{
  id: string;
  name: string;
  user_email: string;
  image?: string;
  role?: string;
  status: string;
}

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  useEffect(()=>{
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team/fetch");
      if(res.ok){
        const data = await res.json();
        setTeam(data.team);
      }
    } catch (error) {
      console.error(error, "Team member fetching error");
    }finally{
      setIsLoading(false);
    }
  }

  const handleAddMember = async ()=> {
    if(!newMemberEmail) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/team/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: newMemberEmail, name: newMemberName})
      });
      if(res.ok){
        setNewMemberEmail("");
        setNewMemberName("");
        setOpenDialog(false);
        await fetchTeam();
      }
    } catch (error) {
      console.error("Failed to add member: ", error);
    }finally{
      setIsAdding(false);
    }
  }

  return (
    <Card className='border-white/5 bg-[#0a0a0e]'>
      <CardHeader className='flex flex-row items-center justify-between pb-4'>
        <div>
          <CardTitle className='text-base font-medium text-white'>  
            Team Members
          </CardTitle>
          <CardDescription>
            Manage your team and their access.
          </CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size='sm'
              className='bg-white text-black hover:bg-zinc-700'
            >
              <Plus className='w-4 h-4 mr-2'/>
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className='bg-[#0E0E12] border-white/10 text-white sm:max-w-106.25'>
            <DialogHeader>
              <DialogTitle>
                Add Team Member
              </DialogTitle>
              <DialogDescription className='text-zinc-400'>
                Add a new member to your organization. They will be added immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor='name' className='text-zinc-300'>Name</Label>
                <Input
                  id='name'
                  placeholder='John Doe'
                  className='bg-white/5 border-white/10 text-white'
                  value={newMemberName}
                  onChange={(e)=>{
                    setNewMemberName(e.target.value)
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor='email' className='text-zinc-300'>Email</Label>
                <Input
                  id='email'
                  placeholder='john@example.com'
                  className='bg-white/5 border-white/10 text-white'
                  value={newMemberEmail}
                  onChange={(e)=>{
                    setNewMemberEmail(e.target.value)
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={()=>setOpenDialog(false)}
                  className='border-white/10 text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white'
                >
                  Cancel
                </Button>
                <Button
                  disabled={isAdding}
                  onClick={handleAddMember}
                  className='bg-white text-black hover:bg-zinc-200'
                >
                  {isAdding ? "Adding...": "Add Member"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-zinc-500 text-sm">Loading team...</div>
          ): team.length === 0 ? (
            <div className="text-center py-4 text-zinc-500 text-sm">No team members found.</div>
          ): (
            <div className="flex flex-col gap-4">
              {team.map((member)=> (
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/1 hover:bg-white/2 transition-colors" key={member.id}>
                  <div className="flex items-center gap-3">
                    <Avatar className='h-9 w-9 border border-white/10'>
                      <AvatarFallback className='bg-zinc-800 text-zinc-400'>
                        {member.name?.slice(0,2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                    <div className="flex items-center gap-2">
                      <p className='text-sm font-medium text-white'>{member.name || "Unknown"}</p>
                      <Badge
                      variant='secondary'
                      className={cn("capitalize border mx-1 mb-1", 
                        member.status === "active" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                      )}
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className='text-xs text-zinc-500'>{member.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className='bg-white/5 capitalize text-zinc-400 hover:bg-white/10 border-white/5 mx-1'
                    variant={"secondary"}
                    >
                      {member.role || "Member"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamSection