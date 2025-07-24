export namespace PaymentInterface {
	export interface IAdapter {
		createPayAddress(): Promise<IWallet>;

		isExistTransaction(address: string, min_timestamp: string, sum: string): Promise<boolean>;

		checkBalanceUsdt(address: string): Promise<number>;

		checkBalanceTrx(address: string): Promise<number>;

		fundingAddress(address: string, amount: number): Promise<string>;

		sendUsdtWallet(privateKey: string, toAddress: string, amount: number): Promise<void>;
	}

	export interface IParams {
		tokenWalletCollector: string;
		USDT_CONTRACT: string;
	}

	export interface IWallet {
		privateKey: string;
		publicKey: string;
		address: string;
	}
}
