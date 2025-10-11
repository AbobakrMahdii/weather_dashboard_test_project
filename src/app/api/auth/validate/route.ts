import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({
        success: true,
        data: { valid: false },
      });
    }

    // In a real app, you would validate the token against your database/JWT
    // For this demo, any non-empty token is considered valid
    const isValid = token.length > 0;

    return NextResponse.json({
      success: true,
      data: { valid: isValid },
    });
  } catch (error) {
    console.error("Token validation API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
