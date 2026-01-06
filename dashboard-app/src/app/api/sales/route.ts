import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const companyId = Number(searchParams.get('companyId') || 1);
    const offset = (page - 1) * limit;

    // With postgres library, use tagged template literals
    const countResult = await sql`
      SELECT COUNT(*) FROM sales WHERE company_id = ${companyId}
    `;

    const total = Number(countResult[0].count);

    const result = await sql`
      SELECT * FROM sales
      WHERE company_id = ${companyId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json({
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Fetch sales error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.sale_name?.trim()) {
      return NextResponse.json({ error: 'Sale name required' }, { status: 400 });
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
    }

    const now = new Date();

    const result = await sql`
      INSERT INTO sales (
        sale_name,
        status,
        amount,
        stage,
        stage_percentage,
        sale_date,
        next_activity_date,
        company_id,
        company_name,
        owner,
        currency,
        created_at
      )
      VALUES (
        ${body.sale_name},
        ${body.status || 'Open'},
        ${Number(body.amount)},
        ${body.stage || 'Proposal'},
        ${body.stage_percentage || 0},
        ${body.sale_date || now.toISOString().split('T')[0]},
        ${body.next_activity_date},
        ${body.company_id || 1},
        ${body.company_name || 'Harvanya Pvt Ltd'},
        ${'John Doe'},
        ${'EUR'},
        ${now}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Create sale error:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
