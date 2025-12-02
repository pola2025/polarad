import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

// 조회수 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return NextResponse.json({ views: 0 });
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula={slug}='${slug}'`,
      {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
        next: { revalidate: 60 }
      }
    );

    const result = await res.json();
    const record = result.records?.[0];
    const views = record?.fields?.views || 0;

    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

// 조회수 증가
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return NextResponse.json({ views: 0 });
  }

  try {
    // 기존 레코드 찾기
    const findRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula={slug}='${slug}'`,
      { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } }
    );

    const findResult = await findRes.json();
    const record = findResult.records?.[0];

    if (record) {
      const currentViews = record.fields.views || 0;
      const newViews = currentViews + 1;

      // 조회수 업데이트
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${record.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: { views: newViews }
          })
        }
      );

      return NextResponse.json({ views: newViews });
    }

    return NextResponse.json({ views: 0 });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
