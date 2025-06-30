import { MessageInterface } from "../Message.interface";

const Dictionary: MessageInterface.TDictionary = {
	USDT: {
		RU: "USDT:",
	},
	SUBSCRIBE_PERIOD: {
		RU: "Дней подписки:",
	},
	CHOICE_PAY_DAY: {
		RU: "На сколько дней вы хотите оформить подписку?",
	},
	USER_ADDED: {
		RU: "Пользователь добавлен",
	},
	USER_DELETED: {
		RU: "Пользователь удален",
	},
	USER_NOT_FOUND: {
		RU: "пользователь не найден",
	},
	BALANCE_DISC: {
		RU: "Узнать балланс USDT. Через пробел адрес кошелька",
	},
	PAY_DISC: {
		RU: "Оплата подписки. Через пробел число дней",
	},
	TIME_LEFT: {
		RU: "Времени осталось:",
	},
	SUBSCRIBE_COMPLETE: {
		RU: "Подписка оформлена",
	},
	PAY_ADDRESS: {
		RU: "Адрес: ",
	},
	PAY_SUM: {
		RU: "Сумма: ",
	},
	PAY_INSTRUCTION: {
		RU: "Переведите по TRC20 ТОЧНОЕ количество USDT",
	},
	CLEAR_DISC: {
		RU: "Очистка истории",
	},
	LANG_DISC: {
		RU: "Текст для обучения после пробела",
	},
	HISTORY_CLEAN: {
		RU: "История очищена",
	},
	NO_AUTH: {
		RU: "У вас нет доступа",
	},
	GET_FILE_INFO: {
		RU: "Получаю информацию о файле",
	},
	DOWNLOADING_FILE: {
		RU: "Скачиваю файл",
	},
	TEXT_WILL_BE_SAVE: {
		RU: "Текст сохраняется для обучения",
	},
	SAVE_FILE: {
		RU: "Файл сохранен",
	},
	SAVE_TEXT: {
		RU: "Текст сохранен",
	},
	GET_TO_LLM: {
		RU: "Запрос отправлен в нейросеть",
	},
};

export default Dictionary;
