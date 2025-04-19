
import { sqliteTable, text, integer, } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	address: text('address').notNull(),
	age: integer('age').notNull(),
	dateofbirth: text('dateofbirth').notNull(),
	citizenship: text('citizenship').notNull()

});
