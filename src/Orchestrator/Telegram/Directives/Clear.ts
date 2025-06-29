import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.CLEAR)
class Clear implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const word = modules("Message").invoke.getWord(MessageInterface.EWord.HISTORY_CLEAN, MessageInterface.ELang.RU);

		await modules("History").invoke.clearHistory(data.message.chat.id);
		await modules("Telegram").invoke.sendMessage(word, data.message.chat.id);
	}
}
