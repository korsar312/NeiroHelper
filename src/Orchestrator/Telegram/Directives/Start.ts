import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { Secret } from "../../../Config/Secret";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.START)
class Start implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);

		const wordInstruction = modules("Message").invoke.getWord(MessageInterface.EWord.MAJOR_INSTRUCTION, MessageInterface.ELang.RU);
		const wordForWork = modules("Message").invoke.getWord(MessageInterface.EWord.FOR_CAN_WORK, MessageInterface.ELang.RU);
		const wordYourId = modules("Message").invoke.getWord(MessageInterface.EWord.YOUR_ID, MessageInterface.ELang.RU);
		const wordChanel = modules("Message").invoke.getWord(MessageInterface.EWord.JOIN_CHANEL, MessageInterface.ELang.RU);
		const wordHello = modules("Message").invoke.getWord(MessageInterface.EWord.MAJOR_HELLO, MessageInterface.ELang.RU);

		const wordSubscribe = modules("Message").invoke.getWord(MessageInterface.EWord.CHANNEL_LINK, MessageInterface.ELang.RU);
		const wordPay = modules("Message").invoke.getWord(MessageInterface.EWord.BUY_BOT_SUBSCRIBE, MessageInterface.ELang.RU);

		const wordConcat = `${wordHello}\n\n<a href="${Secret.chanelTg}">${wordChanel}</a>\n\n${wordInstruction}\n\n${wordYourId} <b>${userId}</b> \n\n${wordForWork} ${OrchestratorTelegramInterface.EDirective.PAY}`;

		await modules("Telegram").invoke.sendMessage(wordConcat, userId, {
			parseMode: "HTML",
			buttons: [[{ text: wordSubscribe, url: Secret.chanelTg }], [{ text: wordPay, click: OrchestratorTelegramInterface.EDirective.PAY }]],
		});
	}
}
