import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Filter, Globe, Search, Upload } from 'lucide-react';
import React from 'react'

interface KnowledgeTableProps{
  sources: KnowledgeSource[];
  onSourceClick: (source: KnowledgeSource)=> void;
  isLoading: boolean;
}

export const getTypeIcon = (type: SourceType) => {
  switch(type){
    case "website":
      return <Globe className='w-4 h-4 text-blue-400'/>
    case "upload":
      return <Upload className='w-4 h-4 text-emerald-400'/>
    case "text":
      return <File className='w-4 h-4 text-zinc-400'/>
  }
}
export const getStatusBadge = (status: SourceStatus) => {
  switch(status){
    case "active":
      return <Badge variant="default" className='bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none'>Active</Badge>
    case "training":
      return <Badge variant="secondary" className='bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 shadow-none'>Training</Badge>
    case "error":
      return <Badge variant="destructive" className='bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 shadow-none'>Error</Badge>
    case "excluded":
      return <Badge variant="secondary" className='bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20 border-zinc-500/20 shadow-none'>Excluded</Badge>
    default: 
      return <Badge variant="outline">Unknown</Badge>
  }
}


const KnowledgeTable = ({sources, onSourceClick, isLoading}: KnowledgeTableProps) => {
  return (
    <Card className='border-white/5 bg-[#0a0a0e]'> 
    <CardHeader className='pb-4'>
      <div className="flex items-center justify-between">
        <CardTitle className='text-base font-medium text-white'>
          Sources
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500"/>
            <Input className='pl-9 h-9 w-50 md:w-75 bg-white/2 border-white/10 text-sm'
            placeholder='Search sources...'
            />
          </div>
          <Button
          variant='ghost'
          size='icon'
          className='text-zinc-400 hover:text-white hover:bg-white/5'
          >
            <Filter className='w-4 h-4'/>
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className='p-0'>
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-xs uppercase font-medium text-zinc-500">
              Name
            </TableHead>
            <TableHead className="text-xs uppercase font-medium text-zinc-500">
              Type
            </TableHead>
            <TableHead className="text-xs uppercase font-medium text-zinc-500">
              Status
            </TableHead>
            <TableHead className="text-xs uppercase font-medium text-zinc-500">
              Last Updated
            </TableHead>
            <TableHead className="text-xs uppercase font-medium text-zinc-500 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow className="border-white/5" key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : sources.length > 0 ? (
            sources.map((source) => (
              <TableRow
                key={source.id}
                className="border-white/5 cursor-pointer group transition-colors hover:bg-white/2"
                onClick={() => onSourceClick(source)}
              >
                <TableCell className="font-medium text-zinc-200 group-hover:text-white">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(source.type as SourceType)}
                    <div className="flex flex-col">
                      <span>{source.name}</span>
                      {source.source_url && (
                        <span className='text-xs text-zinc-500 font-normal'>{source.source_url}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize text-zinc-400">
                  {source.type}
                </TableCell>
                <TableCell className="capitalize text-zinc-400">
                  {getStatusBadge(source.status as SourceStatus)}
                </TableCell>
                <TableCell className="capitalize text-zinc-400">
                  {source.last_updated && (
                    new Date(source.last_updated).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell className="text-right">
                    <Button className='h-8 text-zinc-400 hover:text-white hover:bg-white/2'
                      variant='ghost'
                      size='sm'
                    >
                      View
                    </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="h-32 text-center text-zinc-500"
                colSpan={5}
              >
                No knowledge sources added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
    </Card>
  )
}

export default KnowledgeTable