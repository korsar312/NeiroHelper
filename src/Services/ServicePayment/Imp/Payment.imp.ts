import { PaymentInterface } from "../Payment.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { TronWeb } from "tronweb";
import { throwFn } from "../../../Utils";

class PaymentImp implements PaymentInterface.IAdapter {
	protected Infrastructure: ProjectInterface.TInfrastructure;
	protected params: PaymentInterface.IParams;

	constructor(Infrastructure: ProjectInterface.TInfrastructure, params: PaymentInterface.IParams) {
		this.Infrastructure = Infrastructure;
		this.params = params;
	}

	async createPayAddress() {
		try {
			const tronWeb = this.createTron();
			const account = await tronWeb.createAccount();

			return {
				address: account.address.base58,
				privateKey: account.privateKey,
				publicKey: account.publicKey,
			};
		} catch (e) {
			throwFn(`Ошибка создания кошелька`, e);
		}
	}

	async checkBalanceUsdt(address: string) {
		try {
			const tronWeb = this.createTron();
			tronWeb.setAddress(this.params.USDT_CONTRACT);

			const contract = await tronWeb.contract().at(this.params.USDT_CONTRACT);
			const result = await contract.balanceOf(address).call();

			return Number(result.toString());
		} catch (e: any) {
			throwFn(e.code === "INVALID_ARGUMENT" ? { reasonUser: "Ошибка в адресе кошелька" } : `Ошибка при получении USDT-баланса`, e);
		}
	}

	async isExistTransaction(address: string, min_timestamp: string, sum: string) {
		try {
			const url = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?min_timestamp=${min_timestamp}&contract_address=${this.params.USDT_CONTRACT}`;

			const response = await fetch(url);
			const result = await response.json();

			const minTime = Number(min_timestamp);

			const match = result.data.find((tx: any) => {
				const sumTrans = (parseInt(tx.value) / 1000000).toFixed(2);
				const isToAddress = tx.to === address;
				const isUsdt = tx.token_info?.address === this.params.USDT_CONTRACT;
				const isAfterTime = tx.block_timestamp >= minTime;
				const isCorrectSum = sum === sumTrans;

				return isToAddress && isUsdt && isAfterTime && isCorrectSum;
			});

			return Boolean(match);
		} catch (e) {
			throwFn(`Ошибка при получении списка транзакций`, e);
		}
	}

	async checkBalanceTrx(address: string) {
		try {
			const tronWeb = this.createTron();
			tronWeb.setAddress(this.params.USDT_CONTRACT);

			const balance = await tronWeb.trx.getBalance(address); // возвращает баланс в SUN (1 TRX = 1_000_000 SUN)

			return balance / 1_000_000; // преобразуем из SUN в TRX
		} catch (e) {
			throwFn(`Ошибка при получении TRX-баланса`, e);
		}
	}

	async fundingAddress(address: string, amount: number) {
		try {
			if (amount <= 0) throwFn({ reasonUser: `amount = 0` });

			const tronWeb = this.createTron(this.params.tokenWalletCollector);

			const amountInSun = tronWeb.toBigNumber(amount).multipliedBy(tronWeb.toBigNumber(10).pow(6)).toNumber();
			const broadcast = await tronWeb.trx.sendTransaction(address, amountInSun);

			return broadcast.transaction.txID;
		} catch (e) {
			throwFn(`Ошибка при отправке TRX:\n${e}`);
		}
	}

	async sendUsdtWallet(privateKey: string, toAddress: string, amount: number) {
		try {
			if (amount <= 0) throwFn({ reasonUser: `amount = 0` });

			const tronWeb = this.createTron(privateKey);
			const contract = await tronWeb.contract().at(this.params.USDT_CONTRACT);
			const amountInSun = tronWeb.BigNumber(amount).multipliedBy(tronWeb.toBigNumber(10).pow(6)).toFixed(0);

			return await contract.transfer(toAddress, amountInSun).send({ shouldPollResponse: true });
		} catch (e) {
			throwFn(`Ошибка при отправке USDT`, e);
		}
	}

	private createTron(privateKey?: string) {
		return new TronWeb({
			fullNode: "https://api.trongrid.io",
			solidityNode: "https://api.trongrid.io",
			privateKey,
		});
	}
}

export default PaymentImp;
