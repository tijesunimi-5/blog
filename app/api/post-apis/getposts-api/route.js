import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("blogger_data");

    // Fetch posts from the database
    const posts = await db
      .collection("posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    if (posts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No posts available" }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ success: true, posts }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
