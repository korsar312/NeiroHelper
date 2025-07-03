import { RegisterDirective } from "../Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { AuthInterface } from "../../../Services/ServiceAuth/Auth.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { parseCommand } from "../Utils/ScriptParse";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { throwFn } from "../../../Utils";

@RegisterDirective(OrchestratorTelegramInterface.EDirective.ADD_AUTH)
class AddAuth implements OrchestratorTelegramInterface.IClass {
	public async invoke(modules: ProjectInterface.TDIService, data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = modules("Message").invoke.getWord(MessageInterface.EWord.USER_ADDED, MessageInterface.ELang.RU);

		const text = parseCommand(data.message?.text || "").text;
		const [addedId, hours] = text.split(" ");

		const addUserValid = Number(addedId);
		const hoursAdd = Number(hours);

		if (isNaN(addUserValid)) throwFn({ reasonUser: `Ошибка парсинга id` });
		if (isNaN(hoursAdd)) throwFn({ reasonUser: `Ошибка парсинга даты` });

		modules("Auth").invoke.addUserTime(addUserValid, +hours);

		await modules("Telegram").invoke.sendMessage(wordFinish, userId);
	}
}
