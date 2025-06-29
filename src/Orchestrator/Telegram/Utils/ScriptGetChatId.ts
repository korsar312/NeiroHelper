import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";

export function scriptGetChatId(update: TelegramInterface.IUpdate): number {
	const id = update.message?.chat.id || update.callback_query?.from.id;
	if (!id) throw new Error(`Ошибка определения ID чата`);

	return id;
}
