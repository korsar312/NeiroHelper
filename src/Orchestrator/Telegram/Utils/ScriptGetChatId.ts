import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { throwFn } from "../../../Utils";

export function scriptGetChatId(update: TelegramInterface.IUpdate): number {
	const id = update.message?.chat.id || update.callback_query?.from.id;
	if (!id) throwFn({ reasonUser: `Ошибка определения ID чата` });

	return id;
}
