import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";

@Directive.register(OrchestratorTelegramInterface.EDirective.DEL_AUTH)
export class DeleteAuth extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		try {
			const userId = scriptGetChatId(data);
			const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.USER_DELETED, MessageInterface.ELang.RU);
			const wordUserNotFound = this.modules
				.services("Message")
				.invoke.getWord(MessageInterface.EWord.USER_NOT_FOUND, MessageInterface.ELang.RU);

			const text = parseCommand(data.message?.text || "").text;
			const deleteId = Number(text);

			if (isNaN(deleteId)) throwFn({ reasonUser: `Ошибка парсинга id` });

			const isUserExist = this.modules.services("Auth").invoke.isAuthUser(deleteId, OrchestratorTelegramInterface.EDirective.SAY);
			if (!isUserExist) throwFn({ reasonUser: wordUserNotFound });

			this.modules.services("Auth").invoke.removeUser(deleteId);
			this.modules
				.services("Telegram")
				.invoke.sendMessage(wordFinish, userId)
				.catch((e) => {
					console.log(`DeleteAuth ${e}`);
				});
		} catch (e) {
			throwFn(`Ошибка удаления пользователя`, e);
		}
	}
}
