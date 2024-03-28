export default {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "hadaroadams1234@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
};
