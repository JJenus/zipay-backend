import { UserUpdateAttributes } from "../api/users/users.model";
import nodeMailer from "nodemailer";
import { welcomeEmail } from "./welcomeEmail";

export const AppName = "Elisa Finance";
const noReply = "no-reply@elisafinance.com";
const smtpHost = "smtppro.zoho.com";
const smtpPort = 465; // Use the appropriate port for your SMTP server
// Sender's email credentials
const senderPassword = "Adrian1@jet";

const sendEmail = async (
	to: string,
	message: string | null,
	subject: string
) => {
	const transporter = nodeMailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: true,
		auth: {
			// TODO: replace `user` and `pass` values from <https://forwardemail.net>
			user: noReply,
			pass: senderPassword,
		},
	});

	try {
		console.log("Sending mail");
		const info = await transporter.sendMail({
			from: `${AppName} <${noReply}>`, // sender address
			to: to!, // list of receivers
			subject: subject, // Subject line
			text: AppName, // plain text body
			html: message || AppName, // html body
		});

		console.log("Message sent: %s", info.messageId);
	} catch (error) {
		console.log(error);
	}
};

export const sendWelcomeEmail = async (user: UserUpdateAttributes) => {
	const message = welcomeEmail
		.replace("{{name}}", user.name!)
		.replace("{{token}}", user.id!);

	await sendEmail(user.email!, message, "Welcome to " + AppName);
};

export const isEmail = (val: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(val);
};

export const JwtSignToken = "xipayUan5640$sdr";
