import dotenv from "dotenv";

dotenv.config();
export const Secret = {
	tokenTg: (process.env.IS_DEV ? process.env.TOKEN_TG_TEST : process.env.TOKEN_TG) || "",
	openAiToken: process.env.OPENAI_TOKEN || "",
	addressWalletPidor: process.env.ADDRESS_WALLET_PIDOR || "",
	addressWalletSuper: process.env.ADDRESS_WALLET_SUPER || "",
	addressWalletWork: process.env.ADDRESS_WALLET_WORK || "",
	tokenWalletWork: process.env.TOKEN_WALLET_WORK || "",
	usdtContract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
};
