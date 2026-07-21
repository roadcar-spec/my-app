import { NextRequest, NextResponse } from "next/server";
import { dailyService } from "@/lib/services/dailyService";

export async function GET() {
  try {
    const data = await dailyService.getDailySales();

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );

  }
}

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const data = await dailyService.saveDailySales(body);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );

  }
}