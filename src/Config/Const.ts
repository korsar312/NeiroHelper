import dotenv from "dotenv";

dotenv.config();
export const Const = {
	payToDay: process.env.IS_DEV ? 3 : 100,
	historyQty: 20,
	awaitPay: 500,
	superPartPercent: 25,
};
