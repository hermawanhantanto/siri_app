"use client";
import transcript from "@/actions/ai-generate";
import Message from "@/components/shared/Message";
import Recorder from "@/components/shared/Recorder";
import { Bolt, Speech } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export interface MessageProps {
  sender: string;
  response: string;
  id: string;
}

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useFormState(transcript, initialState);
  const [message, setMessage] = useState<MessageProps[]>([]);

  useEffect(() => {
    if (state !== initialState) {
      setMessage(
        //@ts-ignore
        (messages) => [
          ...messages,
          { sender: state.sender, response: state.response, id: state.id },
        ]
      );
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: blob.type });

    const dataTransfer = new DataTransfer();

    if (fileRef.current) {
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      if (submitRef.current) {
        submitRef.current.click();
      }
    }
  };

  return (
    <section className="w-full max-h-screen overflow-y-scroll h-screen flex flex-col bg-purple-600 ">
      <header className="fixed top-0 flex items-center justify-between p-10 w-full">
        <div className="rounded-full p-2 bg-purple-700 shadow cursor-pointer">
          <Speech className="w-6 h-6 text-white" />
        </div>

        <div className="rounded-full p-2 bg-purple-700 shadow cursor-pointer hover:bg-purple-700/50">
          <Bolt className="w-6 h-6 text-white" />
        </div>
      </header>

      <form
        action={formAction}
        className="p-5 pt-20 flex flex-col justify-center items-center flex-1 bg-gradient-to-b from-purple-600 to-black"
      >
        <Message messages={message} />
        <input type="file" hidden ref={fileRef} name="audio" />
        <button type="submit" hidden ref={submitRef}></button>
        <div className="flex items-center justify-center fixed bottom-0 w-full sm:rounded-t-[8rem] rounded-t-3xl h-32 bg-black">
          <Recorder uploadAudio={uploadAudio} />
        </div>
      </form>
    </section>
  );
}
