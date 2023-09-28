import { NextFunction, Request, Response } from "express";
import { AuthToken, Login } from "./auth.model";
import User, { UserAttributes } from "../users/users.model";
import { createUser, findUserByEmail } from "../users/users.service";
import bcrypt from "bcrypt";
import { HTTPStatusCode } from "../../common/HTTPStatusCode";
import jwt from "jsonwebtoken";
import { JwtSignToken } from "../../common/appUtil";
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

		const sign: JwtToken = {
			userId: user.id!,
			name: user.name!,
		};

		const auth: AuthToken = {
			userId: user.id!,
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
				token: createToken(sign),
			};
			res.json(auth);
		} else {
			res.status(HTTPStatusCode.AUTHORIZATION_ERROR);
			throw new Error("Invalid credentials");
		}
	} catch (error) {
		res.status(HTTPStatusCode.AUTHORIZATION_ERROR);
		if(error instanceof Error){
			error.message = "Invalid credentials";
		}
		next(error);
	}
};

export const resetPassword = async (
	req: Request<{}, AuthToken, Login>,
	res: Response<AuthToken>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email);

		// validate password then

		// res.json(auth);
	} catch (error) {
		next(error);
	}
};

export const requestResetPassword = async (
	req: Request<{}, AuthToken, Login>,
	res: Response<AuthToken>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email);

		// validate password then

		const auth: AuthToken = {
			userId: user.id!,
			token: "",
		};

		res.json(auth);
	} catch (error) {
		next(error);
	}
};

export const verifyEmail = async (
	req: Request<{}, AuthToken, Login>,
	res: Response<AuthToken>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email);

		// validate password then

		const auth: AuthToken = {
			userId: user.id!,
			token: "",
		};

		res.json(auth);
	} catch (error) {
		next(error);
	}
};

export const requestEmailVerification = async (
	req: Request<{}, AuthToken, Login>,
	res: Response<AuthToken>,
	next: NextFunction
) => {
	try {
		const user = await findUserByEmail(req.body.email);

		// validate password then

		const auth: AuthToken = {
			userId: user.id!,
			token: "",
		};

		res.json(auth);
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
