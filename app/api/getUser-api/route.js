import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("blogger_data");

    const users = await db.collection("bloggers").find().toArray();

    if (users.length === 0) {
      return new Response(
        JSON.stringify(
          { success: false, message: "No user Available", users },
          { status: 200 }
        )
      );
    }

    return new Response(JSON.stringify({ success: true, users }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
