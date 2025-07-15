import dotenv from "dotenv";

dotenv.config();
export const Const = {
	payToDay: process.env.IS_DEV ? 100 : 3,
	historyQty: 20,
	awaitPay: 500,
	superPartPercent: 25,
};
