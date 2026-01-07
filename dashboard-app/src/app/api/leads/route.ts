// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

/* =========================
   GET LEADS (SAFE + PAGED)
========================= */
export async function GET(request: NextRequest) {
  console.log("GET /api/leads called");
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log("Search params:", Object.fromEntries(searchParams.entries()));

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const companyId = Number(searchParams.get("companyId")) || 1;
    const offset = (page - 1) * limit;

    console.log(`Query: page=${page}, limit=${limit}, companyId=${companyId}`);

    // Total count
    const countResult = await db`
      SELECT COUNT(*) FROM leads
      WHERE company_id = ${companyId}
    `;
    console.log("Count result:", countResult);

    const total = Number(countResult[0]?.count || 0);
    console.log("Total leads:", total);

    // Data
    const leads = await db`
      SELECT *
      FROM leads
      WHERE company_id = ${companyId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    console.log("Fetched leads count:", leads?.length);

    return NextResponse.json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("GET /api/leads ERROR DETAILS:", error);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "Failed to fetch leads",
        details: error?.message,
        code: error?.code 
      },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE LEAD
========================= */
export async function POST(request: NextRequest) {
  console.log("POST /api/leads called");
  try {
    const body = await request.json();
    console.log("Request body:", body);

    if (!body.sale_name?.trim()) {
      console.log("Validation failed: Sale name required");
      return NextResponse.json(
        { error: "Sale name required" },
        { status: 400 }
      );
    }

    if (!body.amount || body.amount <= 0) {
      console.log("Validation failed: Invalid amount", body.amount);
      return NextResponse.json(
        { error: "Valid amount required" },
        { status: 400 }
      );
    }

    const companyId = body.company_id || 1;
    const now = new Date();
    const saleDate = now.toISOString().split("T")[0];

    console.log("Preparing insert with:", {
      sale_name: body.sale_name,
      amount: body.amount,
      status: body.status || "Open",
      stage: body.stage || "Proposal",
      stage_percentage: body.stage_percentage || 0,
      sale_date: saleDate,
      next_activity_date: body.next_activity_date || null,
      company_id: companyId,
      company_name: body.company_name || 'SuperCompany Ltd ASA',
      owner: body.owner || 'John Doe',
      currency: body.currency || 'EUR',
      created_at: now.toISOString()
    });

    // IMPORTANT: Handle null for next_activity_date
    const nextActivityDate = body.next_activity_date || null;

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
    ${nextActivityDate},
    ${companyId},
    ${body.company_name || 'SuperCompany Ltd ASA'},
    ${body.owner || 'John Doe'},
    ${body.currency || 'EUR'},
    ${now.toISOString()}
  )
  RETURNING *
`;

    console.log("Insert successful, result:", result);
    console.log("Created lead ID:", result[0]?.id);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("POST /api/leads ERROR DETAILS:", error);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    console.error("Error severity:", error?.severity);
    console.error("Error position:", error?.position);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        error: "Failed to create lead",
        details: error?.message,
        code: error?.code,
        hint: "Check if all required columns exist in database"
      },
      { status: 500 }
    );
  }
}