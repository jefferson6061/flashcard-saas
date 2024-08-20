import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    
    Here's the text from the image:

    You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

    1. Create clear and concise questions for the front of the flashcard.
    2. Provide accurate and informative answers for the back of the flashcard.
    3. Ensure that each flashcard focuses on a single concept or piece of information.
    3. Use simple language to make the flashcards accessible to a wide range of learners.
    4. Include a variety of question types, such as definitions, examples, comparisons, and applications.
    5. Avoid overly complex or ambiguous phrasing in both questions and answers.
    6. When appropriate, use mnemonics or memory aids to help reinforce the information.
    7. Tailor the difficulty level of the flashcards to the user's specified preferences.
    8. If given a body of text, extract the most important and relevant information for the flashcards.
    9. Aim to create a balanced set of flashcards that covers the topic comprehensively.
    10. Only generate 10 flashcards.

    Remember to follow the best practices for flashcard creation and ensure that the content 
    is accurate and well-structured.

    Return om the following JSON format
    {
        flashcards: [{front : str, back : str}]
    }
    `;


    export async function POST(req) {
        const openai = new OpenAI();
        const data = await req.text();
    
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            model: 'gpt-4-turbo', // Updated model name
            response_format: { type: 'json_object' },
        });
    
        console.log(completion.choices[0].message.content);
        const flashcards = JSON.parse(completion.choices[0].message.content);
    
        return NextResponse.json(flashcards.flashcards);
    }
    
    