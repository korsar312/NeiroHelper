import { DirectiveBase } from "../DirectiveBase";
import { MessageInterface } from "../../../Services/ServiceMessage/Message.interface";
import { scriptGetChatId } from "../Utils/ScriptGetChatId";
import { parseCommand } from "../Utils/ScriptParse";
import { throwFn } from "../../../Utils";
import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { TelegramInterface } from "../../../Services/ServiceTelegram/Telegram.interface";
import { Secret } from "../../../Config/Secret";
import CheckPay from "../../Script/CheckPay";
import { Directive } from "../../../index";
import { FilesInterface } from "../../../Infrastructure/InfrastructureFiles/Files.interface";
import { Const } from "../../../Config/Const";
import { discount } from "../../../Config/Discount";

const userPayList: Map<number, string> = new Map();
const abortFn = new Map<number, AbortController>();

const forever = "Пожизненно";
const cancel = "cancel";

let isFakeWallet = false;

@Directive.register(OrchestratorTelegramInterface.EDirective.PAY)
export class Pay extends DirectiveBase {
	public async invoke(data: TelegramInterface.IUpdate) {
		try {
			const userId = scriptGetChatId(data);

			const text = parseCommand(data.message?.text || data.callback_query?.data).text;
			const messageId = data.callback_query?.message.message_id;

			if (text === cancel) return await this.cancelPay(userId, messageId);

			if (userPayList.has(userId)) return;

			if (text) return await this.offer(text, userId, messageId);
			if (!text) return await this.payChoice(userId);
		} catch (e: any) {
			throwFn(`Ошибка оплаты`, e);
		}
	}

	async getUniqSum(dollarQty: number): Promise<string> {
		try {
			while (true) {
				const uniq = String(Math.floor(Math.random() * 99 + 1)).padStart(2, "0");
				const cent = uniq.padEnd(6, "0");
				const fullPrice = dollarQty + cent;
				const formatFullPrice = formatMicroUsdt(fullPrice);

				const isTaken = Array.from(userPayList.values()).some((el) => el === formatFullPrice);
				if (!isTaken) return formatFullPrice;

				await delay(200);
			}
		} catch (e) {
			throwFn(`Ошибка уникального номера оплаты`, e);
		}
	}

	async payChoice(chatId: number) {
		try {
			const wordInstruction = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.CHOICE_PAY_DAY, MessageInterface.ELang.RU);
			const wordDiscount = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.STOCK, MessageInterface.ELang.RU);
			const wordUsdt = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.USDT, MessageInterface.ELang.RU);
			const wordStock = discount.reduce((prev, cur) => prev + `• ${cur.text}\n`, "");
			const wordStockAll = wordStock.length ? `\n\n${wordDiscount}:\n<blockquote>${wordStock}</blockquote>` : ``;
			const wordChoice = `${wordInstruction}${wordStockAll}`;

			const command = OrchestratorTelegramInterface.EDirective.PAY;
			const constVar = [1, 10, 30, forever].filter((el) => !discount.find((dis) => dis.value === el));

			const wordDayUs = (day: number, price: number) => {
				return this.modules
					.services("Message")
					.invoke.getWord(MessageInterface.EWord.DAY_US_USDT, MessageInterface.ELang.RU, [day, price, wordUsdt]);
			};

			const buttons: TelegramInterface.TButton = [
				constVar.map((el) => ({ text: String(el), click: `${command} ${el}` })),
				...discount.map((el) => [{ text: wordDayUs(el.value, el.price || 9999), click: `${command} ${el.value}` }]),
			];

			await this.modules.services("Telegram").invoke.sendMessage(wordChoice, chatId, { buttons, parseMode: "HTML" });
		} catch (e) {
			throwFn(`Ошибка выбора оплаты`, e);
		}
	}

	async offer(numberDay: number | string, chatId: number, messageId?: number) {
		try {
			userPayList.set(chatId, "");

			const isInfinity = numberDay === forever;

			const day = isInfinity ? 9999 : Math.round(Number(numberDay));

			if (!isInfinity) {
				if (isNaN(day)) throwFn({ reasonUser: `Неверно указано количество дней` });
				if (day < 1) throwFn({ reasonUser: `Количество дней не может быть меньше 1` });
				if (day > 1000) throwFn({ reasonUser: `Количество дней превышает возможное` });
			}

			let address: string;

			if (isFakeWallet) address = Secret.addressWalletWork[0];
			else address = Secret.addressWalletWork[1];

			isFakeWallet = !isFakeWallet;

			const payAmount = isInfinity ? 9999 : getPrice(day);

			const formatFullPrise = await this.getUniqSum(payAmount);
			userPayList.set(chatId, formatFullPrise);

			const wordTRC20 = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.TRC20, MessageInterface.ELang.RU);
			const wordThrottle = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.PAY_THROTTLE, MessageInterface.ELang.RU);
			const wordAddress = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.PAY_ADDRESS, MessageInterface.ELang.RU);
			const wordSum = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.PAY_SUM, MessageInterface.ELang.RU);
			const wordMinute = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.TIME_LEFT, MessageInterface.ELang.RU);
			const SubPeriod = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SUBSCRIBE_PERIOD, MessageInterface.ELang.RU);
			const wordFinish = this.modules.services("Message").invoke.getWord(MessageInterface.EWord.SUBSCRIBE_COMPLETE, MessageInterface.ELang.RU);
			const wordInstruction = this.modules
				.services("Message")
				.invoke.getWord(MessageInterface.EWord.PAY_INSTRUCTION, MessageInterface.ELang.RU, [
					`<b>(${isInfinity ? forever : day})</b>`,
					`<b>${formatFullPrise}</b>`,
					`<b>${wordTRC20}</b>`,
				]);

			const wordContract = `
${wordInstruction}\n
${wordThrottle}\n
${wordAddress}
<code>${address}</code>\n
${wordSum}
<code>${formatFullPrise}</code>\n
${SubPeriod}
${isInfinity ? forever : day}\n
${wordMinute}
`;

			const command = OrchestratorTelegramInterface.EDirective.PAY;

			const options: TelegramInterface.IMessageOptions = {
				parseMode: "HTML",
				buttons: [[{ text: "Отменить оплату", click: `${command} ${cancel}` }]],
			};

			const messageTimeLeft = messageId
				? await this.modules.services("Telegram").invoke.editMessage(wordContract, chatId, messageId, options)
				: await this.modules.services("Telegram").invoke.sendMessage(wordContract, chatId, options);

			const controller = new AbortController();
			abortFn.set(chatId, controller);

			const services = this.modules.services;
			await CheckPay(this.modules, address, formatFullPrise, lastMinute, controller.signal);

			const subscribeAfter = this.modules.services("Auth").invoke.addUserTime(chatId, day * 24);
			const wordSubscribe = `${wordFinish} ${new Date(subscribeAfter).toLocaleDateString("ru-RU")}`;

			userPayList.delete(chatId);
			const log = { userId: chatId, date: new Date().toLocaleString("ru-RU"), price: formatFullPrise };

			await this.modules.services("Telegram").invoke.editMessage(wordSubscribe, chatId, messageTimeLeft.message_id);
			await this.modules.infrastructure("Files").invoke.addToFile(FilesInterface.FilePath.LOG_PAY(), JSON.stringify(log));

			function lastMinute(num: number) {
				try {
					services("Telegram")
						.invoke.editMessage(`${wordContract}${num}`, chatId, messageTimeLeft.message_id, options)
						.catch((e) => console.log(`lastMinute ${e}`));
				} catch (e) {
					console.log(`lastMinute2 ${e}`);
				}
			}
		} catch (e) {
			userPayList.delete(chatId);

			if (e !== 801) {
				throwFn(e === 802 ? { reasonUser: "ВНИМАНИЕ!\n\nОплата не была произведена в установленный срок" } : "Ошибка процесса оплаты", e);
			}
		}
	}

	async cancelPay(chatId: number, messageId?: number) {
		abortFn.get(chatId)?.abort();
		const wordCancel = "Оплата была отменена пользователем";

		messageId
			? await this.modules.services("Telegram").invoke.editMessage(wordCancel, chatId, messageId)
			: await this.modules.services("Telegram").invoke.sendMessage(wordCancel, chatId);
	}
}

function formatMicroUsdt(v: string) {
	return (parseInt(v) / 1000000).toFixed(2);
}

function delay(ms: number): Promise<void> {
	return new Promise((res) => setTimeout(res, ms));
}

function getPrice(day: number | string): number {
	const dis = discount.find((el) => el.value === day);

	return dis ? dis.price : +Const.payToDay * +day;
}
