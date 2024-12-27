import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function DELETE(req) {
  try {
    // Extract the postId from the request body
    const { postId } = await req.json();

    if (!postId) {
      return new Response("Post ID is required", { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("blogger_data");

    // Access the posts collection
    const collection = db.collection("posts");

    // Delete the post by ID
    const result = await collection.deleteOne({ _id: new ObjectId(postId) });

    if (result.deletedCount === 0) {
      return new Response("Post not found", { status: 404 });
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Post deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response("An error occurred while deleting the post.", {
      status: 500,
    });
  }
}
