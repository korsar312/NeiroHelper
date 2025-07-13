import { DbInterface } from "../Db.interface";
import Database from "better-sqlite3";

class DbImp implements DbInterface.IAdapter {
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
			return row ? { role: row.role, id, expiresAt: row.expiresAt ?? undefined } : undefined;
		},

		allUsers: (): DbInterface.TUser[] => {
			const rows = this.db.prepare(`SELECT id, role, expiresAt FROM grade;`).all() as DbInterface.TUser[];

			return rows.map(({ id, role, expiresAt }) => ({ id: id, role: role, expiresAt: expiresAt ?? undefined }));
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
}

export default DbImp;
