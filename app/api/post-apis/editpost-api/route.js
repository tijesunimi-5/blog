import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function POST(req) {
  try {
    // Parse the request body
    const { editedPost, postId } = await req.json();

    // Validate inputs
    if (!editedPost || !postId) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // Replace with your database name
    const postsCollection = db.collection("posts"); // Replace with your collection name

    if (!ObjectId.isValid(postId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid post ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the post in the database
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { post: editedPost, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not updated" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Respond with success
    return new Response(
      JSON.stringify({ success: true, message: "Post updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating post:", error);

    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
