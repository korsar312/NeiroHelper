import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.ADD_AUTH)
export class AddAuth extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.USER_ADDED, MessageInterface.ELang.RU);

		const text = parseCommand(data.message?.text || "").text;
		const [addedId, hours] = text.split(" ");

		const addUserValid = Number(addedId);
		const hoursAdd = Number(hours);

		if (isNaN(addUserValid)) throwFn({ reasonUser: `Ошибка парсинга id` });
		if (isNaN(hoursAdd)) throwFn({ reasonUser: `Ошибка парсинга даты` });

		this.modules.services("Auth").invoke.addUserTime(addUserValid, +hours);

		await this.modules.services("Telegram").invoke.sendMessage(wordFinish, userId);
	}
}
