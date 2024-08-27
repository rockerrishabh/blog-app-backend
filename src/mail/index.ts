import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: Bun.env.SMTP_HOST,
  port: Number(Bun.env.SMTP_PORT),
  secure: false,
  auth: {
    user: Bun.env.SMTP_USER,
    pass: Bun.env.SMTP_PASSWORD,
  },
});

export async function mail(
  to: string,
  subject: string,
  html: string
): Promise<SMTPTransport.SentMessageInfo> {
  const mailResponse = await transporter.sendMail({
    from: `"Rishabh Kumar 👻" <${Bun.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  return mailResponse;
}
