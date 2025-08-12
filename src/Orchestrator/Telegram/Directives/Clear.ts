import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.CLEAR)
export class Clear extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const word = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.HISTORY_CLEAN, MessageInterface.ELang.RU);
		const chatId = scriptGetChatId(data);

		await this.modules.services("History").invoke.clearHistory(chatId);
		await this.modules.services("Telegram").invoke.sendMessage(word, chatId);
	}
}
