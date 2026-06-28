import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { journalService } from '@/services/journalService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await journalService.getAll(true); // Include drafts for admin
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to get journal entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, author, excerpt, content, category, status } = body;
    
    if (!title || !author || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await journalService.create({
      title,
      author,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      excerpt,
      content,
      category,
      status: status || 'Draft'
    });

    if (!newPost) {
      return NextResponse.json({ error: 'Failed to create article record' }, { status: 500 });
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create journal article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 400 });
  }
}
