import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dailyServiceRepository } from "@/lib/repositories/dailyServiceRepository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const reportDate = searchParams.get("report_date");
    const storeId = searchParams.get("store_id");

    // 日付・店舗指定なら1件取得
    if (reportDate && storeId) {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("daily_service")
        .select("*")
        .eq("report_date", reportDate)
        .eq("store_id", storeId)
        .maybeSingle();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // 指定なしなら一覧取得
    const data = await dailyServiceRepository.getAll();

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error(error);

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
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json();

    const data = await dailyServiceRepository.save(body);

    return NextResponse.json({
      success: true,
      user,
      data,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    await dailyServiceRepository.delete(body.id);

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}