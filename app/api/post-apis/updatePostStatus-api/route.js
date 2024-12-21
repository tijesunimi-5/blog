import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { postId, isPinned, isLiked } = await req.json();

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
      const result = await collection.updateOne(query, { $set: updateFields });
      return new Response(
        JSON.stringify({ success: true, message: "Updated", result }),
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
