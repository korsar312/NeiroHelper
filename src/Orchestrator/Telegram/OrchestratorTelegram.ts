import "./OrchestratorTelegram.init";
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
		this.polling().catch((e) => {
			console.log(`OrchestratorTelegram ${e}`);
		});
	}

	public async init() {
		try {
			const { CLEAR, PAY, GET_BALANCE } = OrchestratorTelegramInterface.EDirective;

			//this.module("Auth").invoke.setUserGrade(410821090, AuthInterface.EGrade.SUPER);
			this.module("Auth").invoke.setUserGrade(995717149, AuthInterface.EGrade.ADMIN, "2751189346824");

			const payDisc = this.module("Message").invoke.getWord(MessageInterface.EWord.PAY_DISC, MessageInterface.ELang.RU);
			const clearDisc = this.module("Message").invoke.getWord(MessageInterface.EWord.CLEAR_DISC, MessageInterface.ELang.RU);
			const balanceDisc = this.module("Message").invoke.getWord(MessageInterface.EWord.BALANCE_DISC, MessageInterface.ELang.RU);

			await this.module("Telegram").invoke.setCommand([
				{ command: PAY, description: payDisc },
				{ command: CLEAR, description: clearDisc },
				{ command: GET_BALANCE, description: balanceDisc },
			]);
		} catch (e) {
			console.log(`Ошибка инициализации \n== ${e}`);
		}
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
		try {
			const updates = await this.module("Telegram").invoke.getMessage(this.offset);

			if (updates.length !== 0) {
				this.offset = updates[updates.length - 1].update_id + 1;

				for (const update of updates)
					this.scriptDefinition(update).catch((e) => {
						console.log(`updateHandler ${e}`);
					});
			}
		} catch (e) {
			console.error(`Ошибка в обновления сообщений ТГ: \n== ${e}`);
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
			console.log(`Ошибка \n== ${e}`);
			this.module("Telegram")
				.invoke.sendMessage(`Ошибка \n== ${e}`, id)
				.catch((e) => {
					console.log(`scriptDefinition ${e}`);
				});
		}
	}
}

export default OrchestratorTelegram;
