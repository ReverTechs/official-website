# Contact Form Integration Guide

## Current Implementation

The contact form (`components/contact-form.tsx`) currently:
- Captures user input (name, email, subject, message)
- Shows loading and success states
- Logs the data to console
- Works for both logged-in and logged-out users

## Integration Options

### Option 1: SendGrid Integration (Recommended)

1. **Install SendGrid SDK:**
```bash
npm install @sendgrid/mail
```

2. **Create API Route** (`app/api/contact/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    const msg = {
      to: 'your-email@example.com', // Your email
      from: 'your-email@example.com', // Verified sender
      subject: `Contact Form: ${subject}`,
      text: `From: ${name} (${email})\n\n${message}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
```

3. **Update Contact Form:**
```typescript
// In components/contact-form.tsx
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

if (!response.ok) throw new Error('Failed to send');
```

4. **Add Environment Variable:**
```env
SENDGRID_API_KEY=your_api_key_here
```

### Option 2: Resend Integration

1. **Install Resend:**
```bash
npm install resend
```

2. **Create API Route:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'your-email@example.com',
    subject: `Contact: ${subject}`,
    html: `<p><strong>${name}</strong> (${email})</p><p>${message}</p>`,
  });

  return Response.json({ success: true });
}
```

### Option 3: EmailJS Integration (No Backend)

1. **Install EmailJS:**
```bash
npm install @emailjs/browser
```

2. **Update Contact Form:**
```typescript
import emailjs from '@emailjs/browser';

// Initialize
emailjs.init('YOUR_PUBLIC_KEY');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    }
  );
};
```

### Option 4: Supabase Database

1. **Create a Messages Table:**
```sql
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Update Contact Form:**
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
await supabase.from('messages').insert([formData]);
```

## Environment Variables

Add these to your `.env.local`:
```env
# SendGrid
SENDGRID_API_KEY=your_key

# Resend
RESEND_API_KEY=your_key

# EmailJS
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_id
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting to prevent spam
2. **Validation**: Add server-side validation
3. **Honeypot**: Add hidden fields to catch bots
4. **Recaptcha**: Integrate Google reCAPTCHA for additional security

## Example with Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Continue with email sending...
}
```

