export type TDiscount = {
	text: string;
	value: number;
	price: number;
};

export const discount: TDiscount[] = [
	{
		text: "При оформлении подписки на 7 дней — стоимость составит 500 USDT",
		value: 7,
		price: 500,
	},
	{
		text: "При оформлении подписки на 30 дней — стоимость составит 1000 USDT",
		value: 30,
		price: 1000,
	},
];
