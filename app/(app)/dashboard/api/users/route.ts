import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

 

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Search query
    const search = searchParams.get("search")?.toLowerCase() || "";

    // Filters
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const company = searchParams.get("company");

    // Build dynamic where clause
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    if (country) {
      whereClause.country = { equals: country, mode: "insensitive" };
    }

    if (city) {
      whereClause.city = { equals: city, mode: "insensitive" };
    }

    if (company) {
      whereClause.company = { equals: company, mode: "insensitive" };
    }

    // Query DB
    const [user, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // optional: sort by recent
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        data: user,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

 