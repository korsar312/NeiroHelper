import dotenv from "dotenv";

dotenv.config();

export const Secret = {
	tokenTg: ((process.env.IS_DEV ? process.env.TOKEN_TG_TEST : process.env.TOKEN_TG) || "").trim(),
	openAiToken: getArr("OPENAI_TOKEN"),
	addressWalletPidor: (process.env.ADDRESS_WALLET_PIDOR || "").trim(),
	addressWalletSuper: (process.env.ADDRESS_WALLET_SUPER || "").trim(),
	addressWalletWork: getArr("ADDRESS_WALLET_WORK"),
	tokenWalletWork: (process.env.TOKEN_WALLET_WORK || "").trim(),
	usdtContract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t".trim(),
};

function getArr(name: string): string[] {
	const result: string[] = [];
	let index = 1;

	while (true) {
		const value = process.env[`${name}_${index}`];
		if (!value) break;
		result.push((value || "").trim());
		index++;
	}

	return result;
}
