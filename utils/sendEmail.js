const nodemailer = require('nodemailer');

const sendEmail = async (opt) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const send = await transporter.sendMail({
		from: `${process.env.FROM_NAME} <${process.env.FROM_NAME}>`,
		to: opt.email,
		subject: opt.subject,
		text: opt.message,
	});

	console.log(`Message send: ${send.messageId}`);
	return send;
};

module.exports = sendEmail;
