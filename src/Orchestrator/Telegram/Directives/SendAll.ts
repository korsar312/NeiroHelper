import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { Directive } from "../../../index";

@Directive.register(OrchestratorTelegramInterface.EDirective.SEND_ALL)
export class SendAll extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const text = parseCommand(data.message?.text || "").text;
		const id = scriptGetChatId(data);

		const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.MAILING_COMPLETE, MessageInterface.ELang.RU);
		const users = this.modules.services("Auth").invoke.getAllUser();

		for (const user of users) {
			try {
				await this.modules.services("Telegram").invoke.sendMessage(text, user.userId);
			} catch (e) {}

			await new Promise((res) => setTimeout(res, 800));
		}

		await this.modules.services("Telegram").invoke.sendMessage(`${wordFinish}: ${users.length}`, id);
	}
}
