import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function findUserByEmail(
  supabaseAdmin: any,
  email: string,
) {
  const perPage = 200
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) return match

    if (!data?.users?.length || data.users.length < perPage) break
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { setup_key } = await req.json()

    // Simple protection - only allow setup with correct key
    if (setup_key !== 'AHSAS_ADMIN_SETUP_2026') {
      return new Response(JSON.stringify({ error: 'Invalid setup key' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminMemberId = '540'
    const adminPassword = 'Admin@123'

    // Login uses profiles.member_id -> profiles.email mapping.
    // Ensure there is an auth user for the SAME email stored on that profile.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, user_id, email, full_name')
      .eq('member_id', adminMemberId)
      .maybeSingle()

    if (profileError) {
      console.error('setup-admin: profile lookup error', profileError)
      return new Response(JSON.stringify({ error: 'Failed to lookup admin profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: 'Admin profile not found for member_id 540' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminEmail = profile.email
    const adminName = profile.full_name || 'System Administrator'

    const existing = await findUserByEmail(supabaseAdmin, adminEmail)

    let authUserId: string

    if (existing) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: adminPassword,
      })
      if (updateError) {
        console.error('setup-admin: password update error', updateError)
        return new Response(JSON.stringify({ error: 'Failed to update admin password' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      authUserId = existing.id
      console.log('setup-admin: existing auth user found; password updated')
    } else {
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: adminName },
      })

      if (createError || !created.user) {
        console.error('setup-admin: create error', createError)
        return new Response(JSON.stringify({ error: createError?.message || 'Failed to create admin user' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      authUserId = created.user.id
      console.log('setup-admin: auth user created')
    }

    // Link profile + role to auth user id (fixes invalid password caused by orphaned profile.user_id)
    if (profile.user_id !== authUserId) {
      const oldUserId = profile.user_id

      const { error: linkProfileError } = await supabaseAdmin
        .from('profiles')
        .update({
          user_id: authUserId,
          password_plaintext: adminPassword,
        })
        .eq('id', profile.id)

      if (linkProfileError) {
        console.error('setup-admin: link profile error', linkProfileError)
        return new Response(JSON.stringify({ error: 'Failed to link admin profile' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (oldUserId) {
        const { error: moveRoleError } = await supabaseAdmin
          .from('user_roles')
          .update({ user_id: authUserId })
          .eq('user_id', oldUserId)

        if (moveRoleError) {
          console.warn('setup-admin: role move warning', moveRoleError)
        }
      }
    }

    // Ensure admin role exists for authUserId
    const { data: roleRow } = await supabaseAdmin
      .from('user_roles')
      .select('id, role')
      .eq('user_id', authUserId)
      .maybeSingle()

    if (!roleRow) {
      await supabaseAdmin.from('user_roles').insert({ user_id: authUserId, role: 'admin' })
    } else if (roleRow.role !== 'admin') {
      await supabaseAdmin.from('user_roles').update({ role: 'admin' }).eq('user_id', authUserId)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin login fixed',
        credentials: {
          admission_number: adminMemberId,
          password: adminPassword,
          email: adminEmail,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: unknown) {
    console.error('setup-admin: unexpected error', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
