import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { masterStoreRepository } from "@/lib/repositories/masterStoreRepository";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("GET USER:", user);

    const data = await masterStoreRepository.getAll();

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

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("POST USER:", user);

    const body = await req.json();

    const data = await masterStoreRepository.create(
      body.code,
      body.name
    );

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