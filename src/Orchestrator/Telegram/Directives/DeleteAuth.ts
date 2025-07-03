import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { throwFn } from "../../../Utils";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.DEL_AUTH)
class DeleteAuth implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		try {
			const userId = scriptGetChatId(data);
			const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.USER_DELETED, MessageInterface.ELang.RU);
			const wordUserNotFound = modules("Message").invoke.getWord(MessageInterface.EWord.USER_NOT_FOUND, MessageInterface.ELang.RU);

			const text = parseCommand(data.message?.text || "").text;
			const deleteId = Number(text);

			if (isNaN(deleteId)) throwFn({ reasonUser: `Ошибка парсинга id` });

			const isUserExist = modules("Auth").invoke.isAuthUser(deleteId, OrchestratorTelegramInterface.EDirective.SAY);
			if (!isUserExist) throwFn({ reasonUser: wordUserNotFound });

			modules("Auth").invoke.removeUser(deleteId);
			modules("Telegram")
				.invoke.sendMessage(wordFinish, userId)
				.catch((e) => {
					console.log(`DeleteAuth ${e}`);
				});
		} catch (e) {
			throwFn(`Ошибка удаления пользователя`, e);
		}
	}
}
