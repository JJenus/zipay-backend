import zod from "zod";

export const Login = zod.object({
	email: zod.string().email(),
	password: zod.string(),
});

export type Login = zod.infer<typeof Login>;

export type AuthToken = {
	userId: string;
	token: string;
};
