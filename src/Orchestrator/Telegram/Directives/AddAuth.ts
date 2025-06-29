import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { parseCommand } from "../Utils/ScriptParse";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.ADD_AUTH)
class AddAuth implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = data.message.chat.id;
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.USER_ADDED, MessageInterface.ELang.RU);

		const text = parseCommand(data.message.text || "").text;
		const [addedId, date] = text.split(" ");

		const addUserValid = Number(addedId);

		if (isNaN(addUserValid)) throw new Error(`Ошибка парсинга id`);
		if (isNaN(+(date || ""))) throw new Error(`Ошибка парсинга даты`);

		modules("Auth").invoke.setUserGrade(addUserValid, AuthInterface.EGrade.GOY, date);
		modules("Telegram").invoke.sendMessage(wordFinish, userId);
	}
}
