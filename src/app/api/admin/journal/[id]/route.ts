import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { readJSON, writeJSON } from '@/lib/dataStore';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const posts = readJSON<any[]>('journal.json');
    
    // Find post index (handling string IDs or coercion safely)
    const index = posts.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update fields
    const updatedPost = {
      ...posts[index],
      ...body
    };

    posts[index] = updatedPost;
    writeJSON('journal.json', posts);

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = readJSON<any[]>('journal.json');
    const filtered = posts.filter((p) => String(p.id) !== String(id));
    
    if (posts.length === filtered.length) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    writeJSON('journal.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 400 });
  }
}
