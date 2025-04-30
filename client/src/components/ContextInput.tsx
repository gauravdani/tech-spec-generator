import React, { useState, useRef, useEffect } from 'react';

interface ContextInputProps {
  onSend: (context: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export const ContextInput: React.FC<ContextInputProps> = ({
  onSend,
  placeholder = "Add additional context or requirements...",
  isLoading = false,
  className = "",
}) => {
  const [context, setContext] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [context]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (context.trim() && !isLoading) {
      onSend(context.trim());
      setContext("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-lg shadow-sm">
        <textarea
          ref={textareaRef}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="context-input min-h-[44px] max-h-[200px] pr-[100px] resize-none
            w-full p-3 rounded-lg border border-gray-300
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            dark:bg-gray-800 dark:border-gray-700 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            transition-all duration-200 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!context.trim() || isLoading}
          className="send-button absolute right-2 bottom-2
            px-4 py-1.5 bg-blue-500 text-white rounded-lg
            hover:bg-blue-600 active:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 ease-in-out
            flex items-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Send</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </>
          )}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press Shift + Enter for new line, Enter to send
      </div>
    </div>
  );
};

export default ContextInput; 