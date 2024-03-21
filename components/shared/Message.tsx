import { MessageProps } from "@/app/page";
import { ChevronDown } from "lucide-react";

interface Messages {
  messages: MessageProps[];
}

const Message = ({ messages }: Messages) => {
  return (
    <div className="flex flex-col w-full justify-center items-center pb-32">
      {messages.length > 0 ? (
        <div className="flex flex-col gap-5">
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                className={`flex flex-col gap-5 xl:min-w-[1000px] w-full`}
              >
                <p className="text-white self-end max-w-[400px] bg-purple-500 p-5 rounded">
                  {message.sender}
                </p>
                <p className="text-white bg-gray-800 p-5 max-w-[400px] rounded">
                  {message.response}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-white gap-4">
          <ChevronDown className="text-white size-12 animate-bounce border rounded-full p-2" />
          <p>Start Conversation</p>
        </div>
      )}
    </div>
  );
};

export default Message;
