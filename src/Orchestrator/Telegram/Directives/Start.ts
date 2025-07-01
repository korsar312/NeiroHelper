import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.START)
class Start implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);

		const wordHello = modules("Message").invoke.getWord(MessageInterface.EWord.MAJOR_HELLO, MessageInterface.ELang.RU);
		const wordYourId = modules("Message").invoke.getWord(MessageInterface.EWord.YOUR_ID, MessageInterface.ELang.RU);
		const wordForWork = modules("Message").invoke.getWord(MessageInterface.EWord.FOR_CAN_WORK, MessageInterface.ELang.RU);

		const wordConcat = `${wordHello}\n${wordYourId} ${userId}\n${wordForWork} ${OrchestratorTelegramInterface.EDirective.PAY}`;

		await modules("Telegram").invoke.sendMessage(wordConcat, userId);
	}
}
