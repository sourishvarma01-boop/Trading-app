import { NextResponse } from 'next/server';
import { STARTING_CASH } from '@/lib/stocks';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username?.trim() || !password?.trim()) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        // Generate a fake email from username since we use username-based auth
        const fakeEmail = `${username.trim().toLowerCase()}@tradeapp.com`;

        const { data, error } = await supabase.auth.signUp({
            email: fakeEmail,
            password: password.trim(),
            options: {
                data: { username: username.trim() } // trigger reads this to create profile
            }
        });

        if (error || !data.user) {
            console.error('Supabase signUp error:', error);
            return NextResponse.json({ error: error?.message || 'Registration failed' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Account created! Please login.' });

    } catch (e) {
        console.error('Register error:', e);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
