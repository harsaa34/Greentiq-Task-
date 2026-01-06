// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

/* =========================
   GET LEADS (SAFE + PAGED)
========================= */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // ✅ IMPORTANT: default companyId (prevents 400)
    const companyId = Number(searchParams.get("companyId")) || 1;

    const offset = (page - 1) * limit;

    // Total count
    const countResult = await db`
      SELECT COUNT(*) FROM leads
      WHERE company_id = ${companyId}
    `;

    const total = Number(countResult[0].count);

    // Data
    const leads = await db`
      SELECT *
      FROM leads
      WHERE company_id = ${companyId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE LEAD
========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.sale_name?.trim()) {
      return NextResponse.json(
        { error: "Sale name required" },
        { status: 400 }
      );
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // ✅ default company fallback
    const companyId = body.company_id || 1;

    const now = new Date();
    const saleDate = now.toISOString().split("T")[0];

    const result = await db`
  INSERT INTO leads (
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
  ) VALUES (
    ${body.sale_name},
    ${body.status || "Open"},
    ${body.amount},
    ${body.stage || "Proposal"},
    ${body.stage_percentage || 0},
    ${saleDate},
    ${body.next_activity_date},
    ${companyId},
    ${body.company_name || 'SuperCompany Ltd ASA'},
    ${body.owner || 'John Doe'},
    ${body.currency || 'EUR'},
    ${now.toISOString()}
  )
  RETURNING *
`;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
