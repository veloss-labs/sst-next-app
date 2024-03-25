import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import { api } from '~/services/trpc/server';

interface Props {
  params: {
    userId: string;
  };
}

export default async function Pages({ params }: Props) {
  const initialData = await api.threads.getItems({
    userId: params.userId,
    type: 'repost',
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadList
        userId={params.userId}
        initialData={initialData}
        type="repost"
      />
    </React.Suspense>
  );
}
