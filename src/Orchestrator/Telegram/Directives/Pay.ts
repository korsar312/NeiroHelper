import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { Secret } from "../../../Config/Secret";
import CheckPay from "../../Script/CheckPay";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";

const userPayList: Map<number, string> = new Map();

@RegisterDirective(OrchestratorTelegramInterface.EDirective.PAY)
class Pay implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = data.message.chat.id;

		try {
			if (userPayList.has(userId)) return;

			const wordInstruction = modules("Message").invoke.getWord(MessageInterface.EWord.PAY_INSTRUCTION, MessageInterface.ELang.RU);
			const wordAddress = modules("Message").invoke.getWord(MessageInterface.EWord.PAY_ADDRESS, MessageInterface.ELang.RU);
			const wordSum = modules("Message").invoke.getWord(MessageInterface.EWord.PAY_SUM, MessageInterface.ELang.RU);
			const wordMinute = modules("Message").invoke.getWord(MessageInterface.EWord.TIME_LEFT, MessageInterface.ELang.RU);
			const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.SUBSCRIBE_COMPLETE, MessageInterface.ELang.RU);

			const address = Secret.addressWalletWork;

			const formatFullPrise = await this.getUniqSum();
			userPayList.set(userId, formatFullPrise);

			const wordContract = `${wordInstruction}\n\n${wordAddress}\n${address}\n\n${wordSum}\n${formatFullPrise}\n\n${wordMinute}`;
			const messageTimeLeft = await modules("Telegram").invoke.sendMessage(wordContract, userId);

			await CheckPay(modules, address, formatFullPrise, lastMinute);

			const oneDayMs = 24 * 60 * 60 * 1000;
			const nowDate = new Date().getTime();
			const subscribeDate = String(nowDate + oneDayMs);

			modules("Auth").invoke.setUserGrade(userId, AuthInterface.EGrade.GOY, subscribeDate);

			await modules("Telegram").invoke.sendMessage(wordFinish, userId);
			userPayList.delete(userId);

			function lastMinute(num: number) {
				modules("Telegram").invoke.editMessage(`${wordContract} ${num}`, userId, messageTimeLeft.message_id);
			}
		} catch (e) {
			userPayList.delete(userId);
			throw new Error(`Ошибка процесса оплаты \n== ${e}`);
		}
	}

	getUniqSum(): Promise<string> {
		return new Promise(async (resolve) => {
			const dollar = Secret.payToDay;

			while (true) {
				const uniq = String(Math.floor(Math.random() * 99 + 1)).padStart(2, "0");
				const cent = uniq.padEnd(6, "0");

				const fullPrise = dollar + cent;
				const formatFullPrise = formatMicroUsdt(fullPrise);

				const hasValue = Array.from(userPayList.values()).some((el) => el === formatFullPrise);

				if (!hasValue) resolve(formatFullPrise);

				await new Promise((res) => setTimeout(res, 100));
			}
		});
	}
}

function formatMicroUsdt(v: string) {
	return (parseInt(v) / 1000000).toFixed(2);
}
