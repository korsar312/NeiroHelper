import { TelegramInterface } from "../Telegram.interface";
import { ConnectInterface } from "../Connect/Connect.Interface";
import { Readable } from "node:stream";
import { ProjectInterface } from "../../../DI/Project.interface";
import TelegramImp from "./Telegram.imp";

const { POST, GET } = ConnectInterface.EMethod;
const { EType, ELink } = ConnectInterface;

const testSend: TelegramInterface.ISend = {
	message_id: 123,
	from: {
		id: 123,
		is_bot: true,
		first_name: "string",
		last_name: "string",
		username: "string",
		language_code: "string",
		is_premium: true,
	},
	chat: {
		id: 123,
		first_name: "string",
		last_name: "string",
		username: "string",
		type: "channel",
	},
	date: 123,
	text: "string",
	document: {
		file_name: "string",
		mime_type: "string",
		file_id: "string",
		file_unique_id: "string",
		file_size: 123,
	},
	caption: "string",
};

class TelegramImpTest implements TelegramInterface.IAdapter {
	private readonly connect: ConnectInterface.BaseClass;
	private readonly request: ConnectInterface.BaseClass["request"];
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Connection: ConnectInterface.BaseClass, Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.connect = Connection;
		this.request = this.connect.request.bind(this.connect);
		this.Infrastructure = Infrastructure;
	}

	public sendMessage(text: string, chat_id: number, options?: TelegramInterface.IMessageOptions) {
		if (Math.round(Math.random())) throw "sendMessage";

		const btn = options?.buttons?.map((el) => ({ text: el.text, callback_data: el.click }));
		const data = { chat_id, text, parse_mode: options?.parseMode, reply_markup: { inline_keyboard: btn && [btn] } };

		return this.request<TelegramInterface.ISend>({ method: POST, link: ELink.SEND_MESSAGE, data });
	}

	public editMessage(text: string, chat_id: number, message_id: number) {
		if (Math.round(Math.random())) throw "editMessage";

		const data = { text, chat_id, message_id };

		return this.request<TelegramInterface.ISend>({ method: POST, link: ELink.EDIT_MESSAGE, data });
	}

	public getMessage(lastId?: number) {
		if (Math.round(Math.random())) throw "getMessage";

		const offset = lastId ? { offset: lastId } : undefined;
		const query = { ...offset, timeout: 100 };

		return this.request<TelegramInterface.IUpdate[]>({ method: GET, link: ELink.UPDATE_MESSAGE, query });
	}

	public async getFile(file_id: string) {
		if (Math.round(Math.random())) throw "getFile";

		const file = await this.request<TelegramInterface.IFileInfo>({
			method: GET,
			link: ELink.GET_FILE_INFO,
			query: { file_id },
		});

		return this.request<Readable>({ method: GET, link: ELink.GET_FILE, addLink: file.file_path, type: EType.FILE });
	}

	public setCommand(commands: TelegramInterface.ICommand[]) {
		if (Math.round(Math.random())) throw "setCommand";

		return this.request({ method: POST, link: ELink.SET_DIRECTIVES, data: { commands } });
	}
}

export default TelegramImpTest;
