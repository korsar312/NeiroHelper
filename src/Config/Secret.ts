import dotenv from "dotenv";

dotenv.config();
export const Secret = {
	tokenTg: ((process.env.IS_DEV ? process.env.TOKEN_TG_TEST : process.env.TOKEN_TG) || "").trim(),
	openAiToken: (process.env.OPENAI_TOKEN || "").trim(),
	addressWalletPidor: (process.env.ADDRESS_WALLET_PIDOR || "").trim(),
	addressWalletSuper: (process.env.ADDRESS_WALLET_SUPER || "").trim(),
	addressWalletWork: (process.env.ADDRESS_WALLET_WORK || "").trim(),
	tokenWalletWork: (process.env.TOKEN_WALLET_WORK || "").trim(),
	usdtContract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t".trim(),
};
