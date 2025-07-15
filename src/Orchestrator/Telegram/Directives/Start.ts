import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { Links } from "../../../Config/Links";

@Directive.register(OrchestratorTelegramInterface.EDirective.START)
export class Start extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);

		const wordInstruction = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.MAJOR_INSTRUCTION, MessageInterface.ELang.RU);
		const wordForWork = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.FOR_CAN_WORK, MessageInterface.ELang.RU);
		const wordYourId = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.YOUR_ID, MessageInterface.ELang.RU);
		const wordChanel = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.JOIN_CHANEL, MessageInterface.ELang.RU);
		const wordHello = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.MAJOR_HELLO, MessageInterface.ELang.RU);

		const wordSubscribe = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CHANNEL_LINK, MessageInterface.ELang.RU);
		const wordPay = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.BUY_BOT_SUBSCRIBE, MessageInterface.ELang.RU);

		const wordConcat = `${wordHello}\n\n<a href="${Links.chanelTg}">${wordChanel}</a>\n\n${wordInstruction}\n\n${wordYourId} <b>${userId}</b> \n\n${wordForWork} ${OrchestratorTelegramInterface.EDirective.PAY}`;

		await this.modules.services("Telegram").invoke.sendMessage(wordConcat, userId, {
			parseMode: "HTML",
			buttons: [[{ text: wordSubscribe, url: Links.chanelTg }], [{ text: wordPay, click: OrchestratorTelegramInterface.EDirective.PAY }]],
		});
	}
}
