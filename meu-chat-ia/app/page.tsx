'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';

export default function Chat() {
  const { messages = [], sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat', 
    }),
  });

  const [texto, setTexto] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;

    sendMessage({ text: texto });
    setTexto('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
      
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh] border border-gray-100">
        
        <div className="bg-blue-600 text-white p-4 text-center font-semibold text-lg shadow-sm z-10">
          Assistente Local (Ollama)
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10 text-sm">
              Envie uma mensagem para iniciar o chat  
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                }`}
              >
                {m.parts?.map((part, index) => (
                  part.type === 'text' ? <span key={index}>{part.text}</span> : null
                ))}
              </div>
              
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              value={texto} 
              onChange={(e) => setTexto(e.target.value)} 
              disabled={status !== 'ready'}
              placeholder={status === 'ready' ? "Digite sua mensagem aqui..." : "Aguardando resposta..."}
              className="w-full pl-4 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all shadow-inner disabled:bg-gray-200"
            />
            <button 
              type="submit" 
              disabled={!texto.trim() || status !== 'ready'} 
              className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 text-white px-5 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium text-sm"
            >
              Enviar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}