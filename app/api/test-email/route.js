import { Resend } from "resend";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>",
      to: "shahidnadafco@gmail.com", // Replace with your email
      subject: "Testing Resend default domain",
      text: "If you see this, Resend works!",
    });
    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error });
  }
}
