import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, new_password, user_id } = await req.json();

    if (!new_password) {
      return new Response(
        JSON.stringify({ error: "new_password is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email && !user_id) {
      return new Response(
        JSON.stringify({ error: "email or user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let targetUserId = user_id;

    // If user_id not provided, find by email by paginating through users
    if (!targetUserId && email) {
      let page = 1;
      const perPage = 1000;
      let found = false;
      
      while (!found) {
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage,
        });

        if (listError) {
          console.error("Error listing users:", listError);
          return new Response(
            JSON.stringify({ error: "Failed to find user" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const user = usersData.users.find(u => u.email === email);
        if (user) {
          targetUserId = user.id;
          found = true;
        } else if (usersData.users.length < perPage) {
          break;
        } else {
          page++;
        }
      }
    }

    if (!targetUserId) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { password: new_password }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update password: " + updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Password reset successfully for ${email || targetUserId}`);
    
    return new Response(
      JSON.stringify({ success: true, message: "Password updated successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
