import zod from "zod";

export const ParamsWithId = zod.object({
	id: zod.string().uuid(),
});

export type ParamsWithId = zod.infer<typeof ParamsWithId>;
