
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

console.log(resend, '..........');


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactFormRequest = await req.json();

    console.log("Received contact form submission:", { name, email, subject });

    const fromAddress = "KRP Farm <technology@primeorbs.com>"
    // Send email to admin - using Resend's default verified domain
    const emailResponse = await resend.emails.send({
      from:fromAddress,
      to: ["chisomozowara0@gmail.com"],
      reply_to: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p><em>This message was sent via the KRP Farm contact form.</em></p>
        <p><em>Reply to this email to respond directly to ${name} at ${email}</em></p>
      `,
    });

    console.log("Email sent to admin:", emailResponse);

    // Only send confirmation email if the main email was successful
    if (emailResponse.data) {
      await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject: "Thank you for contacting KRP Farm",
        html: `
          <h2>Thank you for your message, ${name}!</h2>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <strong>Subject:</strong> ${subject}<br><br>
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Best regards,<br>The Farm Store Team</p>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
