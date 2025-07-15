import { ProjectInterface } from "../../DI/Project.interface";
import { clearInterval } from "node:timers";
import { throwFn } from "../../Utils";
import { Const } from "../../Config/Const";

async function CheckPay(
	modules: ProjectInterface.TDIModules,
	address: string,
	sum: string,
	callback?: (timer: number) => void,
	abortFn?: AbortSignal,
) {
	let count = 0;
	let isCircle = true;
	const maxCount = Const.awaitPay;

	try {
		const timestamp = String(new Date().getTime());

		return new Promise(async (resolve, reject) => {
			callback?.(maxCount);

			abortFn?.addEventListener("abort", () => {
				clearInterval(tick);
				isCircle = false;
				reject(801);
			});

			const tick = setInterval(() => {
				++count;

				if (count > maxCount) {
					clearInterval(tick);
					isCircle = false;
					reject(802);
				}

				count % 10 === 0 && callback?.(maxCount - count);
			}, 1000);

			while (isCircle) {
				const isExist = await modules
					.services("Payment")
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
