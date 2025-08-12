import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";

@Directive.register(OrchestratorTelegramInterface.EDirective.NO_AUTH)
export class NoAuth extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const word = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.NO_AUTH, MessageInterface.ELang.RU);
		const chatId = scriptGetChatId(data);

		await this.modules.services("Telegram").invoke.sendMessage(word + ": " + chatId + " " + OrchestratorTelegramInterface.EDirective.PAY, chatId);
	}
}
