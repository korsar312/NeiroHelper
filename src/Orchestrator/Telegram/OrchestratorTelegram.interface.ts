import { TelegramInterface } from "../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../DI/Project.interface";

export namespace OrchestratorTelegramInterface {
	export interface IClass {
		invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate): Promise<void>;
	}

	export enum EDirective {
		SAY = "/say",
		LEARN = "/learn",
		NO_AUTH = "/noAuth",
		CLEAR = "/clear",
		PAY = "/pay",
		START = "/start",
		ADD_AUTH = "/addUser",
		CASH_OUT = "/cashOut",
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
