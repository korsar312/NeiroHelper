import { MessageInterface } from "../Message.interface";

const Dictionary: MessageInterface.TDictionary = {
	MAJOR_INSTRUCTION: {
		RU: "Чтобы вставить команду в поле ввода Telegram, нажмите и удерживайте её в меню команд.",
	},
	MAJOR_HELLO: {
		RU: "Добро пожаловать в бота!",
	},
	FOR_CAN_WORK: {
		RU: "Для получения доступа введите команду:",
	},
	YOUR_ID: {
		RU: "Ваш персональный айди:",
	},
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
		RU: "Для продления подписки на {{1}} дней выполните перевод РОВНО на сумму {{2}} USDT по сети TRC20",
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
