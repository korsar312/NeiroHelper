import { ProjectInterface } from "../../DI/Project.interface";
import { clearInterval } from "node:timers";

async function CheckPay(modules: ProjectInterface.TDIService, address: string, sum: string, callback?: (timer: number) => void) {
	let count = 0;
	const maxCount = 500;

	const timestamp = String(new Date().getTime());

	return new Promise(async (resolve, reject) => {
		callback?.(maxCount);

		const tick = setInterval(() => {
			++count;

			if (count > maxCount) {
				clearInterval(tick);
				reject("Время оплаты истекло");
			}

			count % 5 === 0 && callback?.(maxCount - count);
		}, 1000);

		while (true) {
			const isExist = await modules("Payment").invoke.isExistTransaction(address, timestamp, sum);
			if (isExist) {
				clearInterval(tick);
				resolve(true);
			}

			await new Promise((res) => setTimeout(res, 10000));
		}
	});
}

export default CheckPay;
