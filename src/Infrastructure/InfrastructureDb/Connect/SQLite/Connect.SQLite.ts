import Database from "better-sqlite3";
import { DbInterface } from "../../Db.interface";

export class ConnectSQLite implements DbInterface.IAdapter {
	private db: Database.Database;

	constructor(dbPath = "app.db") {
		this.db = new Database(dbPath);
		this.init();
	}

	private init() {
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS grade (
				id INTEGER PRIMARY KEY,
				role TEXT NOT NULL,
				expiresAt TEXT
			);
			CREATE TABLE IF NOT EXISTS tokens (
				id INTEGER PRIMARY KEY,
				amount INTEGER NOT NULL
			);
			CREATE TABLE IF NOT EXISTS history (
				id INTEGER NOT NULL,
				idMessage INTEGER PRIMARY KEY,
				question TEXT NOT NULL,
				answer TEXT NOT NULL
			);
		`);
	}

	create = {
		grade: (id: number, role: string, expiresAt?: string) => {
			this.db.prepare(`INSERT OR REPLACE INTO grade (id, role, expiresAt) VALUES (?, ?, ?);`).run(id, role, expiresAt ?? null);
		},

		tokens: (id: number, amount: number) => {
			this.db.prepare(`INSERT OR REPLACE INTO tokens (id, amount) VALUES (?, ?);`).run(id, amount);
		},

		history: (id: number, idMessage: number, question: string, answer: string) => {
			this.db
				.prepare(`INSERT OR REPLACE INTO history (id, idMessage, question, answer) VALUES (?, ?, ?, ?);`)
				.run(id, idMessage, question, answer);
		},
	};

	read = {
		grade: (id: number): DbInterface.TUser | undefined => {
			const row = this.db.prepare(`SELECT role, expiresAt FROM grade WHERE id = ?;`).get(id) as DbInterface.TUser | undefined;
			return row ? { role: row.role, expiresAt: row.expiresAt ?? undefined } : undefined;
		},

		tokens: (id: number): number | undefined => {
			const row = this.db.prepare(`SELECT amount FROM tokens WHERE id = ?;`).get(id) as
				| {
						amount: number;
				  }
				| undefined;
			return row?.amount;
		},

		history: (id: number, last: number): DbInterface.THistoryItem[] => {
			const rows = this.db
				.prepare(`SELECT question, answer, idMessage AS id FROM history WHERE id = ? ORDER BY idMessage DESC LIMIT ?;`)
				.all(id, last) as DbInterface.THistoryItem[];
			return rows;
		},
	};

	update = {
		grade: (id: number, update: Partial<DbInterface.TUser>) => {
			const current = this.read.grade(id);
			if (!current) return;

			const role = update.role ?? current.role;
			const expiresAt = update.expiresAt ?? current.expiresAt ?? null;

			this.db.prepare(`UPDATE grade SET role = ?, expiresAt = ? WHERE id = ?;`).run(role, expiresAt, id);
		},

		tokens: (id: number, amount: number) => {
			const current = this.read.tokens(id) ?? 0;
			this.db.prepare(`INSERT OR REPLACE INTO tokens (id, amount) VALUES (?, ?);`).run(id, current + amount);
		},

		history: (id: number, idMessage: number, update: Partial<Omit<DbInterface.THistoryItem, "id">>) => {
			const setClauses = [];
			const values = [];

			if (update.question !== undefined) {
				setClauses.push("question = ?");
				values.push(update.question);
			}
			if (update.answer !== undefined) {
				setClauses.push("answer = ?");
				values.push(update.answer);
			}

			if (setClauses.length === 0) return;

			values.push(id, idMessage);
			this.db.prepare(`UPDATE history SET ${setClauses.join(", ")} WHERE id = ? AND idMessage = ?;`).run(...values);
		},
	};

	delete = {
		grade: (id: number) => {
			this.db.prepare(`DELETE FROM grade WHERE id = ?;`).run(id);
		},

		tokens: (id: number) => {
			this.db.prepare(`DELETE FROM tokens WHERE id = ?;`).run(id);
		},

		history: (id: number) => {
			this.db.prepare(`DELETE FROM history WHERE id = ?;`).run(id);
		},
	};

	readAll = {
		grade: (): Array<{ id: DbInterface.TUser[] }> => {
			const rows = this.db.prepare(`SELECT id, role, expiresAt FROM grade;`).all() as Array<{
				id: number;
				role: string;
				expiresAt: string | null;
			}>;

			const map = new Map<number, DbInterface.TUser[]>();

			for (const { id, role, expiresAt } of rows) {
				if (!map.has(id)) map.set(id, []);
				map.get(id)!.push({ role, expiresAt: expiresAt ?? undefined });
			}

			return Array.from(map.values()).map((arr) => ({ id: arr }));
		},

		tokens: (): Array<{ id: number; amount: number }> => {
			return this.db.prepare(`SELECT id, amount FROM tokens;`).all() as Array<{ id: number; amount: number }>;
		},

		history: (): Array<{ id: DbInterface.THistoryItem[] }> => {
			const rows = this.db.prepare(`SELECT id, idMessage, question, answer FROM history;`).all() as Array<{
				id: number;
				idMessage: number;
				question: string;
				answer: string;
			}>;

			const map = new Map<number, DbInterface.THistoryItem[]>();

			for (const { id, idMessage, question, answer } of rows) {
				if (!map.has(id)) map.set(id, []);
				map.get(id)!.push({ id: idMessage, question, answer });
			}

			return Array.from(map.values()).map((arr) => ({ id: arr }));
		},
	};
}
