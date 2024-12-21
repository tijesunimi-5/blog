import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("blogger_data");

    //check if user exist
    const blogger = await db.collection("bloggers").findOne({ email });

    if (!blogger) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    //to validate password
    const isValidPassword = await bcrypt.compare(password, blogger.password);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email or password",
        }),
        { status: 401 }
      );
    }

    //if credentials are correct......
    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        blogger: {
          username: blogger.username,
          email: blogger.email,
          bio: blogger.bio,
          post: blogger.post,
          followers: blogger.followers,
          following: blogger.following,
          isFollowing: blogger.isFollowing,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
