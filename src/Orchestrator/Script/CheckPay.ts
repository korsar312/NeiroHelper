import { ProjectInterface } from "../../DI/Project.interface";
import { clearInterval } from "node:timers";
import { throwFn } from "../../Utils";
import { Secret } from "../../Config/Secret";

async function CheckPay(modules: ProjectInterface.TDIService, address: string, sum: string, callback?: (timer: number) => void) {
	let count = 0;
	let isCircle = true;
	const maxCount = Secret.awaitPay;

	try {
		const timestamp = String(new Date().getTime());

		return new Promise(async (resolve, reject) => {
			callback?.(maxCount);

			const tick = setInterval(() => {
				++count;

				if (count > maxCount) {
					clearInterval(tick);
					isCircle = false;
					reject("ВНИМАНИЕ!\n\nОплата не была произведена в установленный срок");
				}

				count % 10 === 0 && callback?.(maxCount - count);
			}, 1000);

			while (isCircle) {
				const isExist = await modules("Payment")
					.invoke.isExistTransaction(address, timestamp, sum)
					.catch((e) => console.log(`isExist ${e}`));

				if (isExist) {
					clearInterval(tick);
					resolve(true);

					break;
				}

				await new Promise((res) => setTimeout(res, 10000));
			}
		});
	} catch (e) {
		throwFn(`Ошибка оплаты`, e);
	}
}

export default CheckPay;
