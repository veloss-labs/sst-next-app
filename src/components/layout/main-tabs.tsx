'use client';
import React, { useCallback, useTransition } from 'react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '~/libs/hooks/useMediaQuery';
import { cn } from '~/utils/utils';

interface MainTabsProps {
  children: React.ReactNode;
}

const MEDIA_QUERY = '(max-width: 768px)';

export default function MainTabs({ children }: MainTabsProps) {
  const isMobile = useMediaQuery(MEDIA_QUERY, false);

  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onTabChange = useCallback(
    (value: string) => {
      startTransition(() => {
        router.push(value);
      });
    },
    [router, startTransition],
  );

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Tabs value={pathname} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value={PAGE_ENDPOINTS.ROOT}>
          회원님을 위한 추천
        </TabsTrigger>
        <TabsTrigger value={PAGE_ENDPOINTS.FOLLOWING}>팔로잉</TabsTrigger>
      </TabsList>
      <TabsContent
        value={PAGE_ENDPOINTS.ROOT}
        className={cn({
          'opacity-50': isPending && pathname === PAGE_ENDPOINTS.ROOT,
        })}
      >
        {children}
      </TabsContent>
      <TabsContent
        value={PAGE_ENDPOINTS.FOLLOWING}
        className={cn({
          'opacity-50': isPending && pathname === PAGE_ENDPOINTS.FOLLOWING,
        })}
      >
        {children}
      </TabsContent>
    </Tabs>
  );
}
