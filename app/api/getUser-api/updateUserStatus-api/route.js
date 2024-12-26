import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { postUser, isFollowing } = await req.json();

    const client = clientPromise;
    const db = client.db("blogger_data");
    const collection = db.collection("bloggers");

    const user = await collection.findOne(postUser);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const updateFields = {};
    if (isFollowing !== undefined) updateFields.isFollowing = isFollowing;

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
      JSON.stringify({ success: false, message: "Sever error" }),
      { status: 500 }
    );
  }
}
