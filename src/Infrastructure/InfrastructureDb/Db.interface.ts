export namespace DbInterface {
	export interface IAdapter {
		create: {
			/** создаёт или заменяет запись с role и необязательным expiresAt. */
			grade(id: number, role: string, expiresAt?: string | undefined): void;

			/** устанавливает токены точно в значение amount. */
			tokens(id: number, amount: number): void;

			/** добавляет новую пару {question, answer} пользователю. */
			history(id: number, idMessage: number, question: string, answer: string): void;
		};
		read: {
			/** возвращает { role, expiresAt } | undefined. */
			grade(id: number): TUser | undefined;

			/** возвращает Array<{ role, expiresAt }> | undefined  */
			allUsers(): TUser[] | undefined;

			/** возвращает последние qty пар. */
			tokens(id: number): number | undefined;

			/** создаёт или заменяет запись с role и необязательным expiresAt. */
			history(id: number, last: number): THistoryItem[];
		};
		update: {
			/** обновляет role и/или expiresAt. */
			grade(id: number, update: Partial<TUser>): void;

			/** прибавляет amount к текущему значению. */
			tokens(id: number, amount: number): void;

			/** находит существующую пару и обновляет её. */
			history(id: number, idMessage: number, update: Partial<Omit<THistoryItem, "id">>): void;
		};
		delete: {
			/** удаляют все связанные записи по id. */
			grade(id: number): void;

			/** удаляют все связанные записи по id. */
			tokens(id: number): void;

			/** удаляют все связанные записи по id. */
			history(id: number): void;
		};
	}

	export type THistoryItem = { question: string; answer: string; id: number };
	export type TUser = { role: string; expiresAt?: string; id: number };
}
