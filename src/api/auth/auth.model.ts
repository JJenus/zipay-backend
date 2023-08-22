import zod from "zod";

export const Login = zod.object({
	email: zod.string().email(),
	password: zod.string().refine((value: string) => value.length > 4, {
		message: "password too short",
	}),
});

export type Login = zod.infer<typeof Login>;

export type AuthToken = {
    userId: string,
    token: string
}
