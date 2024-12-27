import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Parse the incoming request body
    const { postId, isPinned, isLiked } = await req.json();

    // Validate ObjectId
    if (!ObjectId.isValid(postId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid postId format" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("blogger_data");
    const collection = db.collection("posts");

    // Ensure postId is a valid ObjectId
    const query = { _id: new ObjectId(postId) };
    const post = await collection.findOne(query);

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    const updateFields = {};
    if (isPinned !== undefined) updateFields.isPinned = isPinned;
    if (isLiked !== undefined) updateFields.isLiked = isLiked;

    if (Object.keys(updateFields).length > 0) {
      // Perform the update
      const result = await collection.updateOne(query, { $set: updateFields });

      // Fetch the updated post to return the latest data
      const updatedPost = await collection.findOne(query);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Post updated successfully",
          post: updatedPost,
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "No updates provided" }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
