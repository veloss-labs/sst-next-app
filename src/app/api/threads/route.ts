import { NextResponse } from 'next/server';
import { getSession } from '~/server/auth';
import { threadService } from '~/services/threads/threads';
import * as z from 'zod';

const searchParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(['page', 'cursor']).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const query = searchParamsSchema.parse({
      cursor: searchParams.get('cursor') ?? undefined,
      pageNo: searchParams.get('pageNo') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      type: searchParams.get('type') ?? undefined,
    });

    const data = await threadService.getItems(query);
    return NextResponse.json(data);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}