import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { getSectionStatusBadge, getToneBadge } from './sectionBadges';
import { ShieldAlert } from 'lucide-react';

interface SectionsTableProps {
  sections: Section[];
  isLoading: boolean;
  onPreview: (section: Section) => void;
  onCreateSection: () => void;
}

const SectionsTable = ({
  sections,
  onPreview,
  isLoading,
  onCreateSection
}: SectionsTableProps) => {
  return (
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Name
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Sources
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Tone
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Scope
              </TableHead>
              <TableHead className="text-xs uppercase font-medium text-zinc-500">
                Status
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
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-32 bg-white/5 hover:bg-white/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sections.length > 0 ? (
              sections.map((section) => (
                <TableRow
                  key={section.id}
                  className="border-white/5 cursor-pointer group transition-colors hover:bg-white/2"
                  onClick={() => onPreview(section)}
                >
                  <TableCell className="font-medium text-zinc-200">
                    {section.name}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-400 group">
                    {section.sourceCount}{" "}
                    <span className='text-zinc-600'>sources</span>
                  </TableCell>

                  <TableCell>
                    {getToneBadge(section.tone)}
                  </TableCell>

                  <TableCell className="text-zinc-400 text-sm">
                    {section.scopeLabel || "General"}
                  </TableCell>

                  <TableCell>
                    {getSectionStatusBadge(section.status)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      className="h-8 text-zinc-400 hover:text-white hover:bg-white/5"
                      variant="ghost"
                      size="sm"
                      onClick={()=>onPreview(section)}
                    >
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-48 text-center"
                  colSpan={6}
                > 
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className='w-8 h-8 text-zinc-600'/>
                    <span className='text-zinc-400'>No sections defined yet.</span>
                    <Button
                    variant="link"
                    className='text-indigo-400'
                    onClick={onCreateSection}
                    >
                      Create your first section
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
  );
};

export default SectionsTable;