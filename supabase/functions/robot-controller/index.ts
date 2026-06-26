import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CONTROLLER_PASSWORD = Deno.env.get('CONTROLLER_PASSWORD') ?? 'changeme'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, x-controller-password',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // GET — Display darf immer lesen, kein Passwort nötig
    if (req.method === 'GET') {
        const { data, error } = await supabase
        .from('robot_state')
        .select('face, voiceline, updated_at')
        .eq('id', 1)
        .single()

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    // POST — nur mit richtigem Passwort
    if (req.method === 'POST') {
        const password = req.headers.get('x-controller-password')

        if (password !== CONTROLLER_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const body = await req.json()
        const update: Record<string, string | null> = { updated_at: new Date().toISOString() }

        if (body.face) update.face = body.face
            if (body.voiceline !== undefined) update.voiceline = body.voiceline

                const { error } = await supabase
                .from('robot_state')
                .update(update)
                .eq('id', 1)

                if (error) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    })
                }

                return new Response(JSON.stringify({ ok: true }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
})
