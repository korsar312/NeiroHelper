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

type TRoleCommand = "admin" | "sup";
const { RU } = MessageInterface.ELang;

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
			this.modules.services("Auth").invoke.setUserGrade(410821090, AuthInterface.EGrade.SUPER);
			this.modules.services("Auth").invoke.setUserGrade(995717149, AuthInterface.EGrade.ADMIN, "2751189346824");

			const payDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.PAY_DISC, RU);
			const startDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.START_DISC, RU);
			const clearDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CLEAR_DISC, RU);
			const learnDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.LEARN_DISC, RU);
			const CashOutDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CASH_OUT_DISC, RU);
			const sendAllDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SEND_ALL_DISC, RU);
			const AddUserDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.ADD_AUTH_DISC, RU);
			const DelUserDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.DEL_AUTH_DISC, RU);
			const transferDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.TRANSFER_DISC, RU);
			const getBalDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.GET_BALANCE_DISC, RU);
			const sendMesDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SEND_MASSAGE_DISC, RU);
			const getMyBalDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.GET_MY_BALANCE_DISC, RU);
			const getAllUsDisc = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.GET_ALL_USER_DISC, RU);

			const allUser = this.modules.services("Auth").invoke.getAllUser();
			const userGrade = allUser.reduce(
				(prev: Record<TRoleCommand, number[]>, { userId, grade }) => {
					const id = +userId;

					if (grade === AuthInterface.EGrade.ADMIN) prev.admin.push(id);
					if (grade === AuthInterface.EGrade.SUPER) prev.sup.push(id);

					return prev;
				},
				{ admin: [], sup: [] },
			);

			const goiPull: TelegramInterface.ICommand[] = [
				{ command: OrchestratorTelegramInterface.EDirective.PAY, description: payDisc },
				{ command: OrchestratorTelegramInterface.EDirective.START, description: startDisc },
				{ command: OrchestratorTelegramInterface.EDirective.CLEAR, description: clearDisc },
			];

			const adminPull: TelegramInterface.ICommand[] = [
				...goiPull,
				{ command: OrchestratorTelegramInterface.EDirective.LEARN, description: learnDisc },
				{ command: OrchestratorTelegramInterface.EDirective.CASH_OUT, description: CashOutDisc },
				{ command: OrchestratorTelegramInterface.EDirective.SEND_ALL, description: sendAllDisc },
				{ command: OrchestratorTelegramInterface.EDirective.ADD_AUTH, description: AddUserDisc },
				{ command: OrchestratorTelegramInterface.EDirective.DEL_AUTH, description: DelUserDisc },
				{ command: OrchestratorTelegramInterface.EDirective.TRANSFER, description: transferDisc },
				{ command: OrchestratorTelegramInterface.EDirective.GET_BALANCE, description: getBalDisc },
				{ command: OrchestratorTelegramInterface.EDirective.GET_ALL_USER, description: getAllUsDisc },
				{ command: OrchestratorTelegramInterface.EDirective.SEND_MASSAGE, description: sendMesDisc },
				{ command: OrchestratorTelegramInterface.EDirective.GET_MY_BALANCE, description: getMyBalDisc },
			];

			for (const el of [...userGrade.admin, ...userGrade.sup]) await this.modules.services("Telegram").invoke.setCommand(adminPull, el);

			await this.modules.services("Telegram").invoke.setCommand(goiPull);
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
