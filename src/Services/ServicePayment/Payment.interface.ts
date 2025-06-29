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
		fullHost: string;
		USDT_CONTRACT: string;
		addressWalletMain: string;
		tokenWalletCollector: string;
		addressWalletSecond: string;
		addressWalletCollector: string;
	}

	export interface IWallet {
		privateKey: string;
		publicKey: string;
		address: string;
	}

	export interface ITransaction {
		transaction_id: string;
		token_info: TToken_info;
		block_timestamp: number;
		from: string;
		to: string;
		type: "Transfer";
		value: string;
	}

	type TToken_info = {
		symbol: "USDT";
		address: string;
		decimals: number;
		name: "Tether USD";
	};
}
