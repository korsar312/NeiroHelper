import { Readable } from "node:stream";

export namespace TelegramInterface {
	export interface IAdapter {
		sendMessage(text: string, chat_id: number, options?: IMessageOptions): Promise<ISend>;

		sendManyMessage(text: string, chat_id: number, options?: IMessageOptions): Promise<void>;

		editMessage(text: string, chat_id: number, message_id: number, options?: IMessageOptions): Promise<ISend>;

		getMessage(lastId?: number): Promise<TelegramInterface.IUpdate[]>;

		getFile(file_id: string): Promise<Readable>;

		setCommand(commands: TelegramInterface.ICommand[], forUser?: number): Promise<unknown>;
	}

	export interface IUpdate {
		update_id: number;
		message?: ISend;
		callback_query?: IRetry;
	}

	type TFrom = {
		id: number;
		is_bot: boolean;
		first_name: string;
		last_name: string;
		username: string;
		language_code: string;
		is_premium: boolean;
	};

	export interface IFileInfo {
		file_id: string;
		file_unique_id: string;
		file_size: number;
		file_path: string;
	}

	export interface ICommand {
		command: string;
		description?: string;
	}

	export type TChat = {
		id: number;
		first_name: string;
		last_name: string;
		username: string;
		type: "private" | "group" | "supergroup" | "channel";
	};

	export type TDocument = {
		file_name: string;
		mime_type: string;
		file_id: string;
		file_unique_id: string;
		file_size: number;
	};

	export interface ISend {
		message_id: number;
		from: TFrom;
		chat: TChat;
		date: number;
		text?: string;
		document?: TDocument;
		caption?: string;
	}

	export interface IRetry {
		id: string;
		from: TFrom;
		message: ISend;
		chat_instance: string;
		data: string;
	}

	export interface IMessageOptions {
		buttons?: TButton;
		parseMode?: "HTML" | "MarkdownV2";
	}

	export type TButtonEl = {
		text: string;
		click?: string;
		url?: string;
	};

	export type TButton = Array<TButtonEl[]>;
}
