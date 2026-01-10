import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { setup_key } = await req.json()
    
    // Simple protection - only allow setup with correct key
    if (setup_key !== 'AHSAS_ADMIN_SETUP_2026') {
      return new Response(JSON.stringify({ error: 'Invalid setup key' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const adminEmail = 'admin@ahsas.org'
    const adminPassword = 'Admin@123'
    const adminMemberId = '540'

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail)

    if (existingAdmin) {
      // Update password for existing admin
      await supabaseAdmin.auth.admin.updateUserById(existingAdmin.id, {
        password: adminPassword
      })
      
      // Update profile
      await supabaseAdmin
        .from('profiles')
        .update({ 
          member_id: adminMemberId,
          password_plaintext: adminPassword
        })
        .eq('user_id', existingAdmin.id)

      console.log('Admin password updated successfully')
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Admin password updated',
        credentials: {
          admission_number: adminMemberId,
          password: adminPassword
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create new admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: 'System Administrator' }
    })

    if (createError) {
      console.error('Error creating admin:', createError)
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (newUser.user) {
      // Update profile with member_id and password
      await supabaseAdmin
        .from('profiles')
        .update({ 
          member_id: adminMemberId,
          full_name: 'System Administrator',
          password_plaintext: adminPassword
        })
        .eq('user_id', newUser.user.id)

      // Ensure admin role exists
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', newUser.user.id)
        .single()

      if (!existingRole) {
        await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: newUser.user.id, role: 'admin' })
      } else {
        await supabaseAdmin
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', newUser.user.id)
      }
    }

    console.log('Admin created successfully')
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Admin created successfully',
      credentials: {
        admission_number: adminMemberId,
        password: adminPassword
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: unknown) {
    console.error('Setup error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})