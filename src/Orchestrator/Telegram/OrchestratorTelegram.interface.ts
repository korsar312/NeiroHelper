import { ProjectInterface } from "../../DI/Project.interface";

export namespace OrchestratorTelegramInterface {
	export type TDirective = {} & ProjectInterface.TDIModules;

	export enum EDirective {
		PAY = "/pay",
		SAY = "/say",
		START = "/start",
		LEARN = "/learn",
		CLEAR = "/clear",
		NO_AUTH = "/noauth",
		CASH_OUT = "/cashout",
		SEND_ALL = "/sendall",
		ADD_AUTH = "/adduser",
		DEL_AUTH = "/deluser",
		TRANSFER = "/transfer",
		GET_BALANCE = "/getusdt",
		GET_ALL_USER = "/getusers",
		SEND_MASSAGE = "/sendmessage",
	}

	export type TDirectiveParse = {
		command: string;
		text: string;
	};
}
