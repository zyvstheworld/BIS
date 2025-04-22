import {db} from '$lib/server/db';
import {user} from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai'

import type { RequestHandler } from './$types';

const apiKey = import.meta.env.VITE_OPEN_API_KEY;
    if (!apiKey) {
        throw new Error ("Envrioment variables is not set.")
    }

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_API_KEY,
})
    


export const GET: RequestHandler = async () => {
    const data = await db.select().from(user);

    

    return json({ data: data});
};
