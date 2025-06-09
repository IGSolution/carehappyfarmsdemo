import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
const handler = async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { email } = await req.json();
    console.log('Sending invitation to:', email);
    // Generate a unique token
    const token = crypto.randomUUID();
    console.log(token, 'token');
    // Get the origin from request headers or use a fallback
    const baseUrl = "http://localhost:3000"
    const inviteUrl = `${baseUrl}/admin-signup?invite=${token}`;
    console.log('Generated invite URL:', inviteUrl);
    // Check if invitation already exists for this email
    const { data: existingInvitation } = await supabase.from('admin_invitations').select('*').eq('email', email).eq('used', false).gt('expires_at', new Date().toISOString()).single();
    if (existingInvitation) {
      return new Response(JSON.stringify({
        error: 'An active invitation already exists for this email'
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // Store the invitation in the database
    const { error: dbError } = await supabase.from('admin_invitations').insert({
      email,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
    console.log('Invitation stored in database successfully');
    // Send the invitation email
    const emailResponse = await resend.emails.send({
      from: "KRP Farm <technology@primeorbs.com>",
      to: [
        email
      ],
      subject: "Admin Invitation - KRP Farm",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #16a34a; text-align: center;">You're Invited to Join KRP Farm as an Admin</h1>
          <p>You have been invited to join KRP Farm as an administrator.</p>
          <p>Click the button below to accept your invitation and create your admin account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Accept Admin Invitation
            </a>
          </div>
          <p><strong>This invitation will expire in 7 days.</strong></p>
          <p>After creating your account, you can sign in at the admin portal.</p>
          <hr style="margin: 30px 0; border: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="word-break: break-all; color: #16a34a; font-size: 14px;">
            ${inviteUrl}
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `
    });
    console.log('Email sent successfully:', emailResponse);
    return new Response(JSON.stringify({
      success: true,
      message: 'Admin invitation sent successfully',
      inviteUrl: inviteUrl
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error sending admin invitation:", error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
serve(handler);
