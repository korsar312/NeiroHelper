export namespace ConnectInterface {
	export interface BaseClass {
		request<T>(param: TRequest): Promise<T>;
	}

	export const ELink = {
		SEND_MESSAGE: "sendMessage",
		EDIT_MESSAGE: "editMessageText",
		UPDATE_MESSAGE: "getUpdates",
		GET_FILE_INFO: "getFile",
		SET_DIRECTIVES: "setMyCommands",
		GET_FILE: "",
	};

	export interface ILink {
		token: string;
		link: string;
	}

	export enum EMethod {
		GET = "GET",
		POST = "POST",
	}

	export enum EType {
		FILE = "/file",
		TEXT = "",
	}

	export type TRes<T> = {
		ok?: boolean;
		result: T;
	};

	export type TRequest = {
		method: EMethod;
		link: string;
		query?: Record<string, any>;
		data?: Record<string, any>;
		addLink?: string;
		type?: EType;
	};

	export type TLink = Pick<TRequest, "link" | "addLink" | "type" | "query">;
}
