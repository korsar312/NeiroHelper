import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";
import { Secret } from "../../../Config/Secret";
import CheckPay from "../../Script/CheckPay";
import { parseCommand } from "../Utils/ScriptParse";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";

const userPayList: Map<number, string> = new Map();

@RegisterDirective(OrchestratorTelegramInterface.EDirective.PAY)
class Pay implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		try {
			const userId = scriptGetChatId(data);

			if (userPayList.has(userId)) return;

			const text = parseCommand(data.message?.text || data.callback_query?.data).text;
			const day = isNaN(+text) ? 10 : +text;

			if (text) return await this.offer(modules, day, userId);
			if (!text) return await this.payChoice(modules, userId);
		} catch (e) {
			throw new Error(`Ошибка оплаты \n== ${e}`);
		}
	}

	async getUniqSum(dollarQty: number): Promise<string> {
		try {
			while (true) {
				const uniq = String(Math.floor(Math.random() * 99 + 1)).padStart(2, "0");
				const cent = uniq.padEnd(6, "0");
				const fullPrice = dollarQty + cent;
				const formatFullPrice = formatMicroUsdt(fullPrice);

				const isTaken = Array.from(userPayList.values()).some((el) => el === formatFullPrice);

				if (!isTaken) {
					return formatFullPrice;
				}

				await delay(100);
			}
		} catch (e) {
			throw new Error(`Ошибка уникального номера оплаты \n== ${e}`);
		}
	}

	async payChoice(modules: ProjectInterface.TDIService, chatId: number) {
		try {
			const wordInstruction = modules("Message").invoke.getWord(MessageInterface.EWord.CHOICE_PAY_DAY, MessageInterface.ELang.RU);
			const command = OrchestratorTelegramInterface.EDirective.PAY;

			const variableSub = [1, 10, 30];

			const buttons: TelegramInterface.TButton[] = variableSub.map((el) => {
				return { text: String(el), click: `${command} ${el}` };
			});

			await modules("Telegram").invoke.sendMessage(wordInstruction, chatId, { buttons });
		} catch (e) {
			throw new Error(`Ошибка выбора оплаты \n== ${e}`);
		}
	}

	async offer(modules: ProjectInterface.TDIService, numberDay: number, chatId: number) {
		try {
			const wordInstruction = modules("Message").invoke.getWord(MessageInterface.EWord.PAY_INSTRUCTION, MessageInterface.ELang.RU);
			const wordAddress = modules("Message").invoke.getWord(MessageInterface.EWord.PAY_ADDRESS, MessageInterface.ELang.RU);
			const wordSum = modules("Message").invoke.getWord(MessageInterface.EWord.PAY_SUM, MessageInterface.ELang.RU);
			const wordMinute = modules("Message").invoke.getWord(MessageInterface.EWord.TIME_LEFT, MessageInterface.ELang.RU);
			const SubPeriod = modules("Message").invoke.getWord(MessageInterface.EWord.SUBSCRIBE_PERIOD, MessageInterface.ELang.RU);
			const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.SUBSCRIBE_COMPLETE, MessageInterface.ELang.RU);

			const address = Secret.addressWalletWork;
			const payAmount = +Secret.payToDay * numberDay;

			const formatFullPrise = await this.getUniqSum(payAmount);
			userPayList.set(chatId, formatFullPrise);

			const wordContract = `${wordInstruction}\n\n${wordAddress}\n${address}\n\n${wordSum}\n${formatFullPrise}\n\n${SubPeriod}\n${numberDay}\n\n${wordMinute}`;
			const messageTimeLeft = await modules("Telegram").invoke.sendMessage(wordContract, chatId);

			await CheckPay(modules, address, formatFullPrise, lastMinute);

			const oneDayMs = 24 * 60 * 60 * 1000 * numberDay;
			const nowDate = new Date().getTime();
			const subscribeDate = String(nowDate + oneDayMs);

			modules("Auth").invoke.setUserGrade(chatId, AuthInterface.EGrade.GOY, subscribeDate);

			await modules("Telegram").invoke.sendMessage(wordFinish, chatId);
			userPayList.delete(chatId);

			function lastMinute(num: number) {
				try {
					modules("Telegram")
						.invoke.editMessage(`${wordContract} ${num}`, chatId, messageTimeLeft.message_id)
						.catch(() => {});
				} catch (e) {}
			}
		} catch (e) {
			userPayList.delete(chatId);
			throw new Error(`Ошибка процесса оплаты \n== ${e}`);
		}
	}
}

function formatMicroUsdt(v: string) {
	return (parseInt(v) / 1000000).toFixed(2);
}

function delay(ms: number): Promise<void> {
	return new Promise((res) => setTimeout(res, ms));
}
