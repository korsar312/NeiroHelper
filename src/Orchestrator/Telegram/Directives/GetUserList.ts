import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";

export class GetUserList extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const userId = scriptGetChatId(data);
		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.USER_ADDED, MessageInterface.ELang.RU);

		const userList = this.modules.services("Auth").invoke.getAllUser();

		userList.reduce((prev, cur) => {
			prev += cur.id;
			return prev;
		}, "");

		//modules("Telegram").invoke.sendMessage(wordFinish, userId);
	}
}
