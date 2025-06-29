import dotenv from "dotenv";

dotenv.config();
export const Secret = {
	tokenTg: process.env.TOKEN_TG || "",
	openAiToken: process.env.OPENAI_TOKEN || "",
	addressWalletPidor: process.env.ADDRESS_WALLET_PIDOR || "",
	addressWalletSuper: process.env.ADDRESS_WALLET_SUPER || "",
	addressWalletWork: process.env.ADDRESS_WALLET_WORK || "",
	tokenWalletWork: process.env.TOKEN_WALLET_WORK || "",
	linkTg: "https://api.telegram.org",
	fullHost: "https://api.trongrid.io",
	usdtContract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
	payToDay: process.env.PAY_TO_DAY || 100,
	historyQty: 20,
};
