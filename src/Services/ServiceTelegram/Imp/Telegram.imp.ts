import { TelegramInterface } from "../Telegram.interface";
import { ConnectInterface } from "../Connect/Connect.Interface";
import { Readable } from "node:stream";
import { ProjectInterface } from "../../../DI/Project.interface";

const { POST, GET } = ConnectInterface.EMethod;
const { EType, ELink } = ConnectInterface;

class TelegramImp implements TelegramInterface.IAdapter {
	private readonly connect: ConnectInterface.BaseClass;
	private readonly request: ConnectInterface.BaseClass["request"];
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(Connection: ConnectInterface.BaseClass, Infrastructure: ProjectInterface.TInfrastructure) {
		this.connect = Connection;
		this.request = this.connect.request.bind(this.connect);
		this.Infrastructure = Infrastructure;
	}

	public sendMessage(_text: string, chat_id: number, options?: TelegramInterface.IMessageOptions) {
		const text = escapeTags(_text);

		const btn = options?.buttons?.map((row) => row.map((cell) => ({ text: cell.text, callback_data: cell.click, url: cell.url })));
		const data = { chat_id, text, parse_mode: options?.parseMode, reply_markup: { inline_keyboard: btn } };

		return this.request<TelegramInterface.ISend>({ method: POST, link: ELink.SEND_MESSAGE, data });
	}

	public async sendManyMessage(_text: string, chat_id: number, options?: TelegramInterface.IMessageOptions) {
		const text = escapeTags(_text);

		const chunks = text.match(/[\s\S]{1,4000}(?=\s|$)/g) || [];
		for (const chunk of chunks) await this.sendMessage(chunk, chat_id, options);
	}

	public editMessage(_text: string, chat_id: number, message_id: number, options?: TelegramInterface.IMessageOptions) {
		const text = escapeTags(_text);

		const btn = options?.buttons?.map((row) => row.map((cell) => ({ text: cell.text, callback_data: cell.click, url: cell.url })));
		const data = { chat_id, text, message_id, parse_mode: options?.parseMode, reply_markup: { inline_keyboard: btn } };

		return this.request<TelegramInterface.ISend>({ method: POST, link: ELink.EDIT_MESSAGE, data });
	}

	public getMessage(lastId?: number) {
		const offset = lastId ? { offset: lastId } : undefined;
		const query = { ...offset, timeout: 100 };

		return this.request<TelegramInterface.IUpdate[]>({ method: GET, link: ELink.UPDATE_MESSAGE, query });
	}

	public async getFile(file_id: string) {
		const file = await this.request<TelegramInterface.IFileInfo>({
			method: GET,
			link: ELink.GET_FILE_INFO,
			query: { file_id },
		});

		return this.request<Readable>({ method: GET, link: ELink.GET_FILE, addLink: file.file_path, type: EType.FILE });
	}

	public setCommand(commands: TelegramInterface.ICommand[], forUser?: number) {
		return this.request({ method: POST, link: ELink.SET_DIRECTIVES, data: { commands, scope: forUser && { type: "chat", chat_id: forUser } } });
	}
}

function escapeTags(input: string): string {
	const allowedTags = ["a", "b", "i", "u", "s", "code", "pre", "blockquote"];

	return input.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, tagName) => {
		const lowerTag = tagName.toLowerCase();
		if (allowedTags.includes(lowerTag)) return match;

		return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	});
}

export default TelegramImp;
