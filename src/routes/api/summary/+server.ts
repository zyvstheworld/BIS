// src/routes/summary/+server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';

import type { RequestHandler } from './$types';

const apiKey = import.meta.env.VITE_OPEN_API_KEY;
if (!apiKey) {
	throw new Error("Environment variable VITE_OPEN_API_KEY is not set.");
}

const openai = new OpenAI({ apiKey });

export const GET: RequestHandler = async () => {
	try {
		const data = await db.select().from(user);

		if (data.length === 0) {
			return json({ summary: "No user data found." });
		}

		const plainText = data
			.map((u, i) => `${i + 1}. Name: ${u.name}, Age: ${u.age}, Address: ${u.address}, DOB: ${u.dateofbirth}, Citizenship: ${u.citizenship}`)
			.join('\n');

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You summarize user data from a barangay database.' },
				{ role: 'user', content: `Summarize the following records:\n${plainText}` }
			]
		});

		const summary = completion.choices[0].message.content;

		return json({ summary });
	} catch (err) {
		console.error('Error generating summary:', err);
		return json({ error: 'Failed to generate summary' }, { status: 500 });
	}
};
