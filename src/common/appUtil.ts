export const isEmail = (val: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(val);
};

export const JwtSignToken = "xipayUan5640$sdr";
