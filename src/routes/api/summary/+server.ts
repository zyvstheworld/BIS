import {db} from '$lib/server/db';
import {user} from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai'

import type { RequestHandler } from './$types';


//api key
const apiKey = import.meta.env.VITE_OPEN_API_KEY;
    if (!apiKey) {
        throw new Error ("Envrioment variables is not set.")
    }

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_API_KEY,
})
    


export const GET: RequestHandler = async () => {
    const data = await db.select().from(user);
    
    // Calculate statistics
    const totalResidents = data.length;
    const averageAge = Math.round(data.reduce((sum, r) => sum + r.age, 0) / totalResidents);
    const ageGroups = {
        youth: data.filter(r => r.age < 20).length,
        adult: data.filter(r => r.age >= 20 && r.age < 60).length,
        senior: data.filter(r => r.age >= 60).length
    };


    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", //gpt-4o-mini lang, wag na gagamit ng iba mahal eh -aron
            messages: [{
                role: "system",
                content: "You are a helpful assistant that summarizes barangay resident data."
            }, {
                role: "user",
                content: `Please provide a concise summary of the following barangay data:
                Total Residents: ${totalResidents}
                Average Age: ${averageAge}
                Age Groups: Youth (0-19): ${ageGroups.youth}, Adults (20-59): ${ageGroups.adult}, Seniors (60+): ${ageGroups.senior}
                Please format it as a natural paragraph.`
            }]
        });

        return json({
            data,
            stats: {
                totalResidents,
                averageAge,
                ageGroups
            },
            summary: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return json({
            data,
            stats: {
                totalResidents,
                averageAge,
                ageGroups
            },
            summary: "Unable to generate AI summary at this time."
        });
    }
};
