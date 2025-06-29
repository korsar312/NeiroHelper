import "./Directives/Learn";
import "./Directives/Say";
import "./Directives/NoAuth";
import "./Directives/Clear";
import "./Directives/Pay";
import "./Directives/DeleteAuth";
import "./Directives/AddAuth";
import "./Directives/GetUserList";
import { parseCommand } from "./Utils/ScriptParse";
import { getDirective } from "./Utils/ScriptRegistry";
import OrchestratorBase from "../OrchestratorBase";
import { OrchestratorTelegramInterface } from "./OrchestratorTelegram.interface";
import { TelegramInterface } from "../../Services/ServiceTelegram/Telegram.interface";
import { MessageInterface } from "../../Services/ServiceMessage/Message.interface";
import { AuthInterface } from "../../Services/ServiceAuth/Auth.interface";
import { scriptGetChatId } from "./Utils/ScriptGetChatId";

class OrchestratorTelegram extends OrchestratorBase {
	private offset = 0;
	private isPolling = true;

	async invoke() {
		await this.init();
		this.polling();
	}

	public init() {
		const { CLEAR, PAY } = OrchestratorTelegramInterface.EDirective;

		this.module("Auth").invoke.setUserGrade(410821090, AuthInterface.EGrade.SUPER);
		this.module("Auth").invoke.setUserGrade(995717149, AuthInterface.EGrade.ADMIN);

		const payDisc = this.module("Message").invoke.getWord(MessageInterface.EWord.PAY_DISC, MessageInterface.ELang.RU);
		const clearDisc = this.module("Message").invoke.getWord(MessageInterface.EWord.CLEAR_DISC, MessageInterface.ELang.RU);

		return this.module("Telegram").invoke.setCommand([
			{ command: PAY, description: payDisc },
			{ command: CLEAR, description: clearDisc },
		]);
	}

	public async polling() {
		console.log("Опрос тг запущен");

		while (this.isPolling) {
			try {
				await this.updateHandler();
			} catch (e) {
				console.error(`Ошибка в пуллинге: \n== ${e}`);
			}
		}
	}

	public async updateHandler() {
		const updates = await this.module("Telegram").invoke.getMessage(this.offset);

		if (updates.length !== 0) {
			this.offset = updates[updates.length - 1].update_id + 1;
			for (const update of updates) {
				this.scriptDefinition(update);
			}
		}
	}

	public async scriptDefinition(update: TelegramInterface.IUpdate) {
		const id = scriptGetChatId(update);

		try {
			const text = update.message?.text || update.message?.caption || update.callback_query?.data || "";
			let { command } = parseCommand(text);

			const isAuth = this.module("Auth").invoke.isAuthUser(id, command);
			if (!isAuth) command = OrchestratorTelegramInterface.EDirective.NO_AUTH;

			const directive = getDirective(command);
			if (directive === null) throw new Error(`Невалидная команда ${command}`);

			await directive.invoke(this.module, update);
		} catch (e) {
			this.module("Telegram").invoke.sendMessage(`Ошибка \n== ${e}`, id);
		}
	}
}

export default OrchestratorTelegram;
