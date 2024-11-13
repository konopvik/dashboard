// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    // Replace with actual authentication check (e.g., check a database)
    if (email === 'test@example.com' && password === 'password') {
        const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return NextResponse.json({ token });
    } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
}
