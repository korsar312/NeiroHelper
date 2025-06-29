import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.NO_AUTH)
class NoAuth implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const word = modules("Message").invoke.getWord(MessageInterface.EWord.NO_AUTH, MessageInterface.ELang.RU);

		await modules("Telegram").invoke.sendMessage(
			word + ": " + data.message.chat.id + " " + OrchestratorTelegramInterface.EDirective.PAY,
			data.message.chat.id,
		);
	}
}
