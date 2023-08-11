import Beneficiary, { BeneficiaryAttr } from "./beneficiaries.model";

export const findUserBeneficiaries = async (
	id: string
): Promise<Beneficiary[]> => {
	try {
		let result = await Beneficiary.findAll({
			where: {
				userId: id,
			},
		});
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to fetch beneficiaries");
	}
};

export const findBeneficiaryById = async (id: string): Promise<Beneficiary> => {
	try {
		let result = await Beneficiary.findByPk(id);
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to fetch beneficiary");
	}
};

export const createBeneficiary = async (
	beneficiary: BeneficiaryAttr
): Promise<Beneficiary> => {
	try {
		const result = await Beneficiary.create(beneficiary);

		return result;
	} catch (error) {
		throw new Error("Unable to create beneficiary");
	}
};
