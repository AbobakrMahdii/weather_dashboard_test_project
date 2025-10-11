import { NextRequest, NextResponse } from "next/server";

// Mock user data for demonstration
// In a real app, this would come from your database
// We'll use a simple approach since the tokens are generated randomly by faker
const mockUser = {
  id: "fb8f4317-c104-4f73-b69b-87c4cc6d0e80",
  name: "Lucia Gerlach",
  email: "m.alhilalee@gmail.com",
  role: "user",
  created_at: "2024-10-29T11:11:31.354Z",
  updated_at: "2025-09-29T02:46:21.062Z",
};

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token provided" },
        { status: 401 }
      );
    }

    // In a real app, you would validate the token against your database/JWT
    // For this demo, we'll just check if a token exists (any non-empty token is valid)
    if (token.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Return the mock user data for any valid token
    return NextResponse.json({
      success: true,
      response: mockUser, // Changed from 'data' to 'response' to match ResponseHandler expectation
    });
  } catch (error) {
    console.error("❌ Profile API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
