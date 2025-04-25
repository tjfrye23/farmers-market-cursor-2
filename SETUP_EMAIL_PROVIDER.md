# Email Provider Setup for Farmers Market Authentication

## Current Configuration

- Supabase Project URL: https://wnnfjfrcawlhekduqvzf.supabase.co
- Environment variables are properly set in `.env.local`

## Steps to Configure Email Provider

1. **Access Supabase Dashboard**

   - Go to https://app.supabase.com
   - Select your project "Farmers Market"

2. **Navigate to Email Settings**

   - Click on "Authentication" in the left sidebar
   - Select "Providers" tab
   - Scroll to "Email" section

3. **Choose an Email Provider**
   Options available:

   - **SendGrid** (Recommended for production)
     - Create account at https://sendgrid.com
     - Generate API key
     - Set up domain verification
   - **SMTP** (Alternative option)
     - Can use services like Gmail, Amazon SES, etc.
     - Will need SMTP credentials

4. **Configure Selected Provider**
   For SendGrid:

   - Add SendGrid API key
   - Configure sender name and email
   - Set up domain verification
   - Test email delivery

5. **Customize Email Templates**

   - Configure email templates for:
     - Confirmation emails
     - Magic link emails
     - Reset password emails
     - Change email address notifications
   - Add your brand colors and logo
   - Test all email templates

6. **Additional Settings**
   - Set confirmation URL: `https://[your-domain]/auth/callback`
   - Configure password reset URL
   - Set up rate limiting if needed
   - Enable/disable specific auth methods

## Testing

1. Create a test account
2. Verify email confirmation works
3. Test password reset flow
4. Check email template rendering

## Production Checklist

- [ ] Domain verified with email provider
- [ ] All email templates customized
- [ ] Test emails sent successfully
- [ ] Spam folder checks completed
- [ ] Rate limits configured
- [ ] Error monitoring set up

## Notes

- Keep API keys and credentials secure
- Monitor email delivery rates
- Set up email authentication (SPF, DKIM, DMARC)
- Consider implementing email logging for debugging

For detailed instructions, visit: https://supabase.com/docs/guides/auth/auth-email
