// src/routes/api/users/+server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


//crud
export const GET: RequestHandler = async () => {
	const data = await db.select().from(user);
	return json({ data });
};

export const POST: RequestHandler = async ({ request }) => {
	const { name, address, age, dateofbirth, citizenship } = await request.json();
	await db.insert(user).values({ name, address, age, dateofbirth, citizenship });
	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request }) => {
	const { id, name, address, age, dateofbirth, citizenship } = await request.json();
	if (!id) return json({ success: false, message: 'ID is required' }, { status: 400 });

	await db
		.update(user)
		.set({ name, address, age, dateofbirth, citizenship })
		.where(eq(user.id, id));

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	if (!id) return json({ success: false, message: 'ID is required' }, { status: 400 });

	await db.delete(user).where(eq(user.id, id));

	return json({ success: true });
};
