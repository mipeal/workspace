// /src/components/page/challenge-detail-view.tsx
'use client';

import { useChallengeById } from '@/hooks/api/useChallengeById';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Trophy } from 'lucide-react';

export function ChallengeDetailView({ challengeId }: { challengeId: number }) {
  const { data: challenge, isLoading, isError } = useChallengeById(challengeId);

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (isError ||!challenge) return <p className="text-red-500">Could not load challenge details.</p>;

  return (
    <div className="space-y-4">
      {/* Challenge Statistics */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">
            {challenge.value} points
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-sm">{challenge.solves || 0} users solved</span>
        </div>
        {challenge.solved_by_me && (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Solved
          </Badge>
        )}
        <Badge variant="outline">{challenge.category}</Badge>
      </div>
      
      {/* Challenge Description */}
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: challenge.description }}
      />
      {/* Additional details like files, hints, etc. can be rendered here */}
    </div>
  );
}