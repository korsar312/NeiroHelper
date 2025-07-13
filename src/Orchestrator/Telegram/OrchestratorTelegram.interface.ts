import { ProjectInterface } from "../../DI/Project.interface";

export namespace OrchestratorTelegramInterface {
	export type TDirective = {} & ProjectInterface.TDIModules;

	export enum EDirective {
		SAY = "/say",
		LEARN = "/learn",
		NO_AUTH = "/noAuth",
		CLEAR = "/clear",
		PAY = "/pay",
		START = "/start",
		ADD_AUTH = "/addUser",
		CASH_OUT = "/cashOut",
		TRANSFER = "/transfer",
		GET_BALANCE = "/getusdt",
		DEL_AUTH = "/delUser",
		GET_ALL_USER = "/getUsers",
		SEND_MASSAGE = "/sendMgs",
	}

	export type TDirectiveParse = {
		command: string;
		text: string;
	};
}
