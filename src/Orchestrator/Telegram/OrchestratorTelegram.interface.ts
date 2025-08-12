import { ProjectInterface } from "../../DI/Project.interface";

export namespace OrchestratorTelegramInterface {
	export type TDirective = {} & ProjectInterface.TDIModules;

	export enum EDirective {
		PAY = "/pay",
		SAY = "/say",
		START = "/start",
		LEARN = "/learn",
		CLEAR = "/clear",
		NO_AUTH = "/no_auth",
		CASH_OUT = "/cash_out",
		SEND_ALL = "/call_goi",
		ADD_AUTH = "/add_user",
		DEL_AUTH = "/del_user",
		TRANSFER = "/transfer",
		GET_BALANCE = "/get_usdt",
		GET_ALL_USER = "/get_users",
		SEND_MASSAGE = "/send_message",
		GET_MY_BALANCE = "/get_my_balance",
	}

	export type TDirectiveParse = {
		command: string;
		text: string;
	};
}
