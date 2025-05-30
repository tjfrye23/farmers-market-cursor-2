import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, url: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Farmers Market <onboarding@resend.dev>', // Use your verified domain in production
      to,
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to Farmers Market!</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${url}">${url}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
