import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { post, email, name, bio, isLiked, isPinned, profile_picture } =
      await req.json();

    const client = await clientPromise;
    const db = client.db("blogger_data");

    //check for the user
    const existingUser = await db.collection("bloggers").findOne({ email });

    if (!existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User does not exist" }),
        { status: 409 }
      );
    }

    const result = await db
      .collection("posts")
      .insertOne({
        email,
        post,
        name,
        bio,
        createdAt: new Date(),
        isLiked,
        isPinned,
        profile_picture,
      });

    return new Response(
      JSON.stringify({
        success: true,
        result,
        post: {
          name: name,
          post: post,
          isLiked: isLiked,
          email: email,
          bio: bio,
          CreatedAt: new Date(),
          picture: profile_picture,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to post:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
