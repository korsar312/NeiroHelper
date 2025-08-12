import dotenv from "dotenv";

dotenv.config();
export const Links = {
	linkTg: "https://api.telegram.org",
	fullHost: "https://api.trongrid.io",
	chanelTg: (process.env.ADDRESS_CHANNAL || "").trim(),
};
