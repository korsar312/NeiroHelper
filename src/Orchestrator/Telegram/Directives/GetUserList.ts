import { DirectiveBase } from "../DirectiveBase";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Directive } from "../../../index";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";

@Directive.register(OrchestratorTelegramInterface.EDirective.GET_ALL_USER)
export class GetUserList extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		const id = scriptGetChatId(data);

		const users = this.modules.services("Auth").invoke.getAllUser();

		const wordId = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.ID, MessageInterface.ELang.RU);
		const wordNo = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.NO, MessageInterface.ELang.RU);
		const wordYes = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.YES, MessageInterface.ELang.RU);
		const wordSubUntil = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SUB_UNTIL, MessageInterface.ELang.RU);
		const wordSubIsActive = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SUB_ACTIVE, MessageInterface.ELang.RU);

		const forHuman = users.reduce((prev, cur) => {
			const id = `${wordId} - ${cur.userId}\n`;
			const subUntil = cur.timeOver ? `${wordSubUntil} - ${new Date(+cur.timeOver).toLocaleString("ru-RU")}\n` : "";
			const subIsActive = `${wordSubIsActive} - ${cur.isOverSub ? wordNo : wordYes}\n`;

			return prev + (id + subUntil + subIsActive + `\n`);
		}, "");

		await this.modules.services("Telegram").invoke.sendManyMessage(forHuman, id);
	}
}
