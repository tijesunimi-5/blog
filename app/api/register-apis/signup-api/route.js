import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const {
      username,
      email,
      password,
      bio,
      post,
      isFollowing,
      followers,
      following,
    } = await req.json();

    const client = await clientPromise;
    const db = client.db("blogger_data");
    const existingUser = await db.collection("bloggers").findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User already exists" }),
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("bloggers").insertOne({
      username,
      email,
      password: hashedPassword,
      bio,
      post,
      followers,
      following,
      isFollowing,
    });
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
