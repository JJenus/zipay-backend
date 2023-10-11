import { NextFunction, Request, Response } from "express";
import { AuthToken, Login } from "./auth.model";
import User, {
	UserAttributes,
	UserUpdateAttributes,
} from "../users/users.model";
import {
	createUser,
	findUserByEmail,
	findUserById,
} from "../users/users.service";
import bcrypt from "bcrypt";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";
import jwt from "jsonwebtoken";
import { JwtSignToken, sendWelcomeEmail } from "../../common/appUtil";
import { JwtToken } from "../../interfaces/JwtToken";
import { createAccount } from "../accounts/account.service";
import { getAppSettings } from "../appSettings/appSettings.service";

const createToken = (payload: JwtToken) => {
	return jwt.sign(payload, JwtSignToken, { expiresIn: "1h" });
};

export const registerUser = async (
	req: Request<{}, AuthToken, UserAttributes>,
	res: Response<AuthToken>,
	next: NextFunction
) => {
	try {
		const reqUser = req.body;

		const user = await createUser(reqUser);
		const settings = await getAppSettings();
		await createAccount(user.id!, settings.defaultBaseCurrency);

		await sendWelcomeEmail(user);

		const sign: JwtToken = {
			userId: user.id!,
			name: user.name!,
		};

		const auth: AuthToken = {
			userId: user.id!,
			user: user,
			token: createToken(sign),
		};

		res.json(auth);
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (
	req: Request<{}, AuthToken, Login>,
	res: Response<AuthToken>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email);

		// validate password then
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password!
		);

		if (validPassword) {
			const sign: JwtToken = {
				userId: user.id!,
				name: user.name!,
			};

			const auth: AuthToken = {
				userId: user.id!,
				user: user,
				token: createToken(sign),
			};
			res.json(auth);
		} else {
			res.status(HTTPStatusCode.AUTHORIZATION_ERROR);
			throw new Error("Invalid credentials");
		}
	} catch (error) {
		res.status(HTTPStatusCode.AUTHORIZATION_ERROR);
		if (error instanceof Error) {
			error.message = "Invalid credentials";
		}
		next(error);
	}
};


export const verifyEmail = async (
	req: Request<{}, Partial<User>, UserUpdateAttributes>,
	res: Response<Partial<User>>,
	next: NextFunction
) => {
	try {
		const user = await findUserById(req.body.id!);

		// validate password then

		user.setAttributes("emailVerified", true);
		await user.save();

		res.json(user);
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (
	req: Request<{}, void, UserUpdateAttributes>,
	res: Response<void>,
	next: NextFunction
) => {
	try {
		const user = await findUserById(req.body.id!);
		const passwordHash = await bcrypt.hash(req.body.password!, 10);
		user.setAttributes("password", passwordHash);

		user.save();

		// validate password then

		res.json();
	} catch (error) {
		next(error);
	}
};

export const requestResetPassword = async (
	req: Request<{}, void, UserUpdateAttributes>,
	res: Response<void>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email!);

		// request password change

		res.json();
	} catch (error) {
		next(error);
	}
};


export const requestEmailVerification = async (
	req: Request<{}, AuthToken, UserUpdateAttributes>,
	res: Response<void>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email!);

		// send email
		res.send();
	} catch (error) {
		next(error);
	}
};

// export const createBeneficiary = async (
// 	req: Request<{}, Beneficiary, BeneficiaryAttr>,
// 	res: Response<Beneficiary>,
// 	next: NextFunction
// ) => {
// 	try {
// 		const log = await Beneficiaries.createBeneficiary(req.body);
// 		res.json(log);
// 	} catch (error) {
// 		next(error);
// 	}
// };
