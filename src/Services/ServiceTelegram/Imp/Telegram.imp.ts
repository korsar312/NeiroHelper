import { TelegramInterface } from "../Telegram.interface";
import { ConnectInterface } from "../Connect/Connect.Interface";
import { Readable } from "node:stream";
import { ProjectInterface } from "../../../DI/Project.interface";

const { POST, GET } = ConnectInterface.EMethod;
const { EType, ELink } = ConnectInterface;

class TelegramImp implements TelegramInterface.IAdapter {
	private readonly connect: ConnectInterface.BaseClass;
	private readonly request: ConnectInterface.BaseClass["request"];
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Connection: ConnectInterface.BaseClass, Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.connect = Connection;
		this.request = this.connect.request.bind(this.connect);
		this.Infrastructure = Infrastructure;
	}

	public sendMessage(text: string, chat_id: number, options?: TelegramInterface.IMessageOptions) {
		const btn = options?.buttons.map((el) => ({ text: el.text, callback_data: el.click }));
		const data = { chat_id, text, reply_markup: options && { inline_keyboard: [btn] } };

		return this.request<TelegramInterface.ISend>({ method: POST, link: ELink.SEND_MESSAGE, data });
	}

	public editMessage(text: string, chat_id: number, message_id: number) {
		const data = { text, chat_id, message_id };

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

	public setCommand(commands: TelegramInterface.ICommand[]) {
		return this.request({ method: POST, link: ELink.SET_DIRECTIVES, data: { commands } });
	}
}

export default TelegramImp;
