'server-only';
import {
  Prisma,
  type ThreadLike,
  type Tag,
  type Thread,
  type ThreadBookmark,
} from '@prisma/client';
import {
  type UserSelectSchema,
  getUserSelector,
  getUserSimpleSelector,
} from '~/services/db/selectors/users';
import { getTagsSimpleSelector } from '~/services/db/selectors/tags';
import { type ThreadListQuerySchema } from '~/services/threads/threads.query';

export const getRecommendationsSelector = () =>
  Prisma.validator<Prisma.ThreadRecommendationSelect>()({
    id: true,
    similarity: true,
    thread: {
      select: getThreadsSelector(),
    },
    recommendedThread: {
      select: getThreadsSelector(),
    },
  });

export const getStatsSelector = () =>
  Prisma.validator<Prisma.ThreadStatsSelect>()({
    id: true,
    threadId: true,
    likes: true,
    score: true,
  });

export const getRecommendationsWithThreadSelector = (
  userId?: string,
  input?: ThreadListQuerySchema,
) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
    user: {
      select: getUserSelector(),
    },
    mentions: {
      select: getThreadsMentionsSelector(),
    },
    tags: {
      select: getThreadsTagsSelector(),
    },
    stats: {
      select: getStatsSelector(),
    },
    threadRecommendationThreads: {
      select: getRecommendationsSelector(),
    },
    likes: userId ? { where: { userId } } : false,
    bookmarks: userId ? { where: { userId } } : false,
    _count: {
      select: {
        likes: true,
      },
    },
  });

export const getThreadsMentionsSelector = () =>
  Prisma.validator<Prisma.ThreadMentionSelect>()({
    user: {
      select: getUserSimpleSelector(),
    },
  });

export const getThreadsTagsSelector = () =>
  Prisma.validator<Prisma.ThreadTagSelect>()({
    tag: {
      select: getTagsSimpleSelector(),
    },
  });

export const getThreadsSelector = (
  userId?: string,
  input?: ThreadListQuerySchema,
) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    jsonString: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
    user: {
      select: getUserSelector(),
    },
    mentions: {
      select: getThreadsMentionsSelector(),
    },
    tags: {
      select: getThreadsTagsSelector(),
    },
    likes: userId ? { where: { userId } } : false,
    bookmarks: userId ? { where: { userId } } : false,
    _count: {
      select: {
        likes: true,
      },
    },
  });

export type ThreadSelectSchema = Pick<
  Thread,
  | 'id'
  | 'text'
  | 'level'
  | 'createdAt'
  | 'deleted'
  | 'hiddenNumberOfLikesAndComments'
  | 'whoCanLeaveComments'
> & {
  user: UserSelectSchema;
  mentions: { user: Pick<UserSelectSchema, 'id' | 'username'> }[];
  tags: { tag: Pick<Tag, 'name' | 'id'> }[];
  _count: {
    likes: number;
  };
  likes: ThreadLike[];
  bookmarks: ThreadBookmark[];
};