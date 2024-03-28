import sendEmail from "./sendEmail";

interface SendVerificationEmail {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}

export const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}: SendVerificationEmail) => {
  const verifyEmail = `${origin}/api/v1/auth/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link <a href='${verifyEmail}'>Verify Email</a></p>`;
  return sendEmail({
    to: email,
    subject: "Email confirmation",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};
