import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.CLEAR)
class Clear implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const word = modules("Message").invoke.getWord(MessageInterface.EWord.HISTORY_CLEAN, MessageInterface.ELang.RU);
		const chatId = scriptGetChatId(data);

		await modules("History").invoke.clearHistory(chatId);
		await modules("Telegram").invoke.sendMessage(word, chatId);
	}
}
