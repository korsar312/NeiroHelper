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
		ADD_AUTH = "/addUser",
		GET_BALANCE = "/getusdt",
		DEL_AUTH = "/delUser",
		GET_ALL_USER = "/getUsers",
	}

	export type TDirectiveParse = {
		command: string;
		text: string;
	};
}
