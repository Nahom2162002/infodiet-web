import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'No account found with that email' }, { status: 400, headers: corsHeaders });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000);
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `InfoDiet <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: 'InfoDiet Password Reset',
            html: `
                <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0a0f0d; color: white; border-radius: 16px;">
                    <h1 style="color: #00c896; font-size: 24px; margin: 0 0 8px;">🥗 InfoDiet</h1>
                    <h2 style="color: white; font-size: 20px; margin: 0 0 16px;">Password Reset Request</h2>
                    <p style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                        We received a request to reset your InfoDiet password. 
                        Click the button below to reset it. This link expires in 1 hour.
                    </p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #00c896, #00a57a); color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px;">
                        Reset Password
                    </a>
                    <p style="color: rgba(255,255,255,0.3); font-size: 13px; margin: 24px 0 0; line-height: 1.6;">
                        If you did not request this, please ignore this email. 
                        Your password will not change.
                    </p>
                </div>
            `
        });

        return NextResponse.json({ message: 'Password reset email sent!' }, { headers: corsHeaders });
    } catch (err: any) {
        console.log('Forgot password error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}