import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.GET_ALL_USER)
class GetUserList implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = data.message.chat.id;
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.USER_ADDED, MessageInterface.ELang.RU);

		const userList = modules("Auth").invoke.getAllUser();

		userList.reduce((prev, cur) => {
			prev += cur.id;
			return prev;
		}, "");

		//modules("Telegram").invoke.sendMessage(wordFinish, userId);
	}
}
