import Prompt from "@models/prompt";
import { connectDB } from "@utils/database";

export const POST = async (request) => {
    const { userId, prompt, tag } = await request.json();

    try {
        console.log("processing......")
        await connectDB();
        console.log("connected")
        const newPrompt = new Prompt({ creator: userId, prompt, tag });

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}