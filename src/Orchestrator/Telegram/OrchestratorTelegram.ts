import { parseCommand } from "./Utils/ScriptParse";
import OrchestratorBase from "../OrchestratorBase";
import { OrchestratorTelegramInterface } from "./OrchestratorTelegram.interface";
import { TelegramInterface } from "../../Services/ServiceTelegram/Telegram.interface";
import { MessageInterface } from "../../Services/ServiceMessage/Message.interface";
import { AuthInterface } from "../../Services/ServiceAuth/Auth.interface";
import { scriptGetChatId } from "./Utils/ScriptGetChatId";
import { IThrow, throwFn } from "../../Utils";
import { ProjectInterface } from "../../DI/Project.interface";
import { RegisterDirective } from "./Utils/ScriptRegistry";

class OrchestratorTelegram extends OrchestratorBase {
	private diDirective: RegisterDirective;
	private isPolling = true;
	private offset = 0;

	constructor(params: ProjectInterface.TDIModules, diDirective: RegisterDirective) {
		import("./OrchestratorTelegram.init");
		super(params);
		this.diDirective = diDirective;
	}

	async invoke() {
		await this.init();
		this.polling().catch((e) => console.log(`OrchestratorTelegram ${e}`));
	}

	public async init() {
		try {
			const { START, CLEAR, PAY } = OrchestratorTelegramInterface.EDirective;

			this.modules.services("Auth").invoke.setUserGrade(410821090, AuthInterface.EGrade.SUPER);
			this.modules.services("Auth").invoke.setUserGrade(995717149, AuthInterface.EGrade.ADMIN, "2751189346824");

			const payDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.PAY_DISC, MessageInterface.ELang.RU);
			const startDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.START_DISC, MessageInterface.ELang.RU);
			const clearDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CLEAR_DISC, MessageInterface.ELang.RU);

			await this.modules.services("Telegram").invoke.setCommand([
				{ command: PAY, description: payDisc },
				{ command: START, description: startDisc },
				{ command: CLEAR, description: clearDisc },
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
			const updates = await this.modules.services("Telegram").invoke.getMessage(this.offset);

			if (updates.length !== 0) {
				this.offset = updates[updates.length - 1].update_id + 1;

				for (const update of updates) this.scriptDefinition(update).catch((e) => console.log(`updateHandler ${e}`));
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

			console.log("<>");
			console.log(text);
			console.log(id);
			console.log("</>");

			const isAuth = this.modules.services("Auth").invoke.isAuthUser(id, command);
			if (!isAuth) command = OrchestratorTelegramInterface.EDirective.NO_AUTH;

			const directive = this.diDirective.getDirective(command);
			if (directive === null) throwFn(`Невалидная команда ${command}`);

			await directive.invoke(update);
		} catch (e) {
			const err = e as IThrow;
			console.log(`Ошибка \n== ${err.error}`);

			this.modules
				.services("Telegram")
				.invoke.sendMessage(err.reasonUser || `Ошибка`, id)
				.catch((e: any) => console.log(`scriptDefinition ${e}`));
		}
	}
}

export default OrchestratorTelegram;
