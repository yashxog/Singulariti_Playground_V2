import { ArrowUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
// import Focus from './messageInputActions/focus';
import { ScrollingButtonsComponent } from './scrollingButtons';

export const NewChatSearchBox = ({
    sendMessage,
    // focusMode,
    // setFocusMode
} : {
    sendMessage: (message: string) => void;
    // focusMode: string,
    // setFocusMode: (mode: string) => void;
}) => {
    const [message, setMessage] = useState('');

    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || activeElement?.hasAttribute('contenteditable');
        
        if (e.key === '/' && !isInputFocused) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    return (
      <div className="w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(message);
            setMessage('');
          }
        }}
        className="mx-auto bg-custom-bg-1 rounded-2xl shadow-lg border border-borderColour1"
      >
        <div className="relative w-full p-3">
          <div className="flex items-center gap-2">
            <TextareaAutosize
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={1}
              className="flex-1 bg-transparent text-white text-lg placeholder:text-white/50 resize-none focus:outline-none"
              placeholder="Ask anything"
            />
            <button
              disabled={message.trim().length === 0}
              className="bg-[linear-gradient(to_bottom,rgba(84,84,84,0.25)0%,rgba(186,186,186,0.25)100%)] text-white disabled:text-white hover:bg-white/20 transition duration-100 rounded-full p-2 self-end"
              type="submit"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </form>
      <div className="pt-5">
          <ScrollingButtonsComponent/>
      </div>
      </div>
    );
}