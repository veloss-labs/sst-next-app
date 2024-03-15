'use client';
import React, { useTransition, useCallback } from 'react';
import Link from 'next/link';
import {
  usePathname,
  useSelectedLayoutSegment,
  useRouter,
} from 'next/navigation';
import { cn } from '~/utils/utils';
import { NAV_CONFIG, NavItem } from '~/constants/nav';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import SkipRenderOnClient from '../shared/skip-render-on-client';
import { useMediaQuery } from '~/libs/hooks/useMediaQuery';
import { api } from '~/services/trpc/react';
import { useLayoutStore } from '~/services/store/useLayoutStore';
import { Icons } from '~/components/icons';

export default function MobileFooterNav() {
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  return (
    <SkipRenderOnClient shouldRenderOnClient={() => isMobile}>
      <nav className="fixed bottom-0 z-40 flex w-full items-center justify-around border-t bg-white py-2 dark:border-slate-800 dark:bg-background dark:text-slate-300 md:hidden">
        {NAV_CONFIG.mainNav.map((item, index) => (
          <div key={index} className="relative w-max">
            <MobileFooterNav.Item item={item} />
          </div>
        ))}
      </nav>
    </SkipRenderOnClient>
  );
}

interface ItemProps {
  item: NavItem;
}

MobileFooterNav.Item = function Item({ item }: ItemProps) {
  switch (item.type) {
    case 'home': {
      return <MobileFooterNav.Home item={item} />;
    }
    case 'thread': {
      return <MobileFooterNav.Thread item={item} />;
    }
    case 'link': {
      return <MobileFooterNav.Link item={item} />;
    }
    case 'myPage': {
      return <MobileFooterNav.MyPage item={item} />;
    }
    default: {
      return null;
    }
  }
};

interface ItemProps {
  item: NavItem;
}

MobileFooterNav.Home = function Item({ item }: ItemProps) {
  const pathname = usePathname();

  const relationHrefs = item.relationHrefs ?? [];
  const relationIcons = item.relationIcons ?? [];

  const href =
    relationHrefs.find((href) => href === pathname) ?? PAGE_ENDPOINTS.ROOT;
  const Icon =
    href === PAGE_ENDPOINTS.FOLLOWING ? relationIcons.at(1) : item.icon;
  const isActive = relationHrefs.includes(pathname);

  return (
    <Link
      href={item.disabled ? '#' : href}
      className={cn(
        'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      {Icon ? <Icon /> : <item.icon />}
    </Link>
  );
};

MobileFooterNav.Thread = function Item({ item }: ItemProps) {
  const pathname = usePathname();
  const href = item.href as string;
  const isActive = pathname === href ? true : false;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { popupOpen } = useLayoutStore();

  const onClick = useCallback(() => {
    popupOpen('THREAD');

    let type: string | undefined = undefined;
    switch (pathname) {
      case PAGE_ENDPOINTS.ROOT: {
        type = 'recommendation';
        break;
      }
      case PAGE_ENDPOINTS.FOLLOWING: {
        type = 'following';
        break;
      }
      default: {
        type = undefined;
        break;
      }
    }

    const nextPath = type ? `${href}?type=${type}` : href;

    startTransition(() => {
      router.push(nextPath);
    });
  }, [router, popupOpen, href, pathname]);

  return (
    <button
      type="button"
      role="link"
      data-href={item.disabled ? '#' : href}
      className={cn(
        'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
      onClick={onClick}
    >
      {isPending ? (
        <Icons.rotateCcw className="mr-2 size-4 animate-spin" />
      ) : (
        <item.icon />
      )}
    </button>
  );
};

MobileFooterNav.Link = function Item({ item }: ItemProps) {
  const pathname = usePathname();
  const href = item.href as string;
  const isActive = pathname === href ? true : false;

  return (
    <Link
      href={item.disabled ? '#' : href}
      className={cn(
        'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
};

MobileFooterNav.MyPage = function Item({ item }: ItemProps) {
  const segment = useSelectedLayoutSegment();
  const { data } = api.auth.getSession.useQuery();

  const href = data ? PAGE_ENDPOINTS.MY_PAGE.ID(data.user.id) : '#';

  const isActive = segment && href.startsWith(`/${segment}`) ? true : false;

  return (
    <Link
      href={item.disabled ? '#' : href}
      className={cn(
        'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
};
