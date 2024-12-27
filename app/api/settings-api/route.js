import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email, newName, newBio, newPassword } = await req.json();

    const client = await clientPromise;
    const db = client.db("blogger_data");
    const collection = db.collection("bloggers");

    const user = await collection.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const updateFields = {};
    if (newName) updateFields.username = newName;
    if (newBio) updateFields.bio = newBio;
    if (newPassword) updateFields.password = newPassword;

    const result = await collection.updateOne(
      { email },
      { $set: updateFields }
    );

    return new Response(
      JSON.stringify(
        { success: true, message: "User updated successfully", result },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
