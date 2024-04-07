import sendEmail from "./sendEmail";

interface SendVerificationEmail {
  name: string;
  email: string;
  token: string;
  origin: string;
}

export const sendResendPasswordEmail = async ({
  name,
  email,
  token,
  origin,
}: SendVerificationEmail) => {
  const resetUrl = `${origin}/api/v1/auth/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset your password by clicking on the following link <a href='${resetUrl}'>Reset Password</a></p>`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};
