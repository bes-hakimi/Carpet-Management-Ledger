import { Message } from '../../page';

interface Props {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}


export default function ChatMessages({ messages, messagesEndRef }: Props) {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex justify-start">
                        <div className="max-w-md px-4 py-3 rounded-2xl border border-gray-300">
                            <p>{msg.text}</p>
                            {msg.time && (
                                <p className="text-xs mt-2 ">
                                    {msg.time}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
