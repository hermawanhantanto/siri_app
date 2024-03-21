"use server";

import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcript(prevsState: any, formData: FormData) {
  try {
    if (process.env.OPENAI_API_KEY === undefined)
      return {
        sender: "AI",
        response: "API key not found",
        id: "",
      };

    const file = formData.get("audio") as File;

    console.log(file);

    const id = Math.random().toString(36).substring(7);

    if (file.size === 0)
      return {
        sender: "AI",
        response: "Audio file not found",
        id: "",
      };

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: transcription.text },
      ],
      model: "gpt-3.5-turbo",
    });

    console.log(transcription.text);

    return {
      sender: transcription.text,
      response: completion.choices[0].message.content,
      id,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default transcript;
