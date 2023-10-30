import { Card } from '~/components/ui/card';
import Avatars from './avatars';
import { TipTapEditor } from '../editor/tiptap-editor';
import { cn, getDateFormatted } from '~/utils/utils';

import type { ThreadItemSchema } from '~/services/threads/threads.model';

interface ThreadItemProps {
  item: ThreadItemSchema;
}

export default function ThreadItem({ item }: ThreadItemProps) {
  const date = getDateFormatted(item.createdAt);
  return (
    <Card className="m-3 mx-auto overflow-hidden rounded-xl border-none shadow-none">
      <div className="md:flex">
        <div className="md:shrink-0">
          <span className="h-[192px] w-[192px] rounded-md bg-muted object-cover md:w-48" />
        </div>
        <div className="w-full py-4 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center">
              <Avatars
                src={item.user?.image ?? undefined}
                alt={`${item.user?.username} profile picture`}
                fallback="T"
              />
              <div className="ml-4 flex w-full flex-row">
                <div>
                  <div className="text-base font-semibold tracking-wide text-black dark:text-white">
                    {item.user?.username}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-300">
                    @{item.user?.name}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-end">
                  <div
                    className="text-sm text-gray-400 dark:text-gray-300"
                    suppressHydrationWarning
                  >
                    {date}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TipTapEditor
            editable={false}
            debouncedUpdatesEnabled={false}
            name={`thraed-text-${item.id}`}
            value={item.text}
            noBorder
            className={cn(
              'prose prose-brand prose-headings:font-display font-default focus:outline-none',
            )}
            customClassName="p-0 mt-4"
          />
        </div>
      </div>
    </Card>
  );
}