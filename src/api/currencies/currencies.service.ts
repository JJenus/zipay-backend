import Currency, { CurrencyAttr } from "./currencies.model";

export const findAll = async (): Promise<Currency[]> => {
	try {
		let result = await Currency.findAll();
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to get settings");
	}
};

export const findCurrencyById = async (id: string): Promise<Currency> => {
	try {
		let result = await Currency.findByPk(id);
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to get settings");
	}
};

export const createCurrency = async (
	setting: CurrencyAttr
): Promise<Currency> => {
	try {
		const result = await Currency.create(setting);

		return result;
	} catch (error) {
		throw new Error("Unable to create currency");
	}
};

export const updateCurrency = async (
	id: string,
	currencyUpdate: CurrencyAttr
): Promise<Currency> => {
	let currency;
	try {
		currency = await Currency.findByPk(id);

		if (!currency) {
			throw new Error();
		}
	} catch (error) {
		throw new Error("Unauthorized currency update");
	}

	try {
		currency.setAttributes(currencyUpdate);
		await currency.save();

		return currency;
	} catch (error) {
		throw new Error("Unable to update currency");
	}
};
