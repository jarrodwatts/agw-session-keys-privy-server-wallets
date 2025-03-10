import { NextResponse } from "next/server";

// This API route stores the session information for the server wallet
export async function POST(request: Request) {
  try {
    const { sessionId, expiresAt } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Store the session ID in a database associated with the user
    // 2. Use this session ID when executing transactions on behalf of the user

    console.log("Received session ID:", sessionId);
    console.log(
      "Session expires at:",
      new Date(expiresAt * 1000).toISOString()
    );

    return NextResponse.json({
      success: true,
      message: "Session created successfully",
    });
  } catch (error) {
    console.error("Error processing session:", error);
    return NextResponse.json(
      { error: "Failed to process session" },
      { status: 500 }
    );
  }
}
