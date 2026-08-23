import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Bot,
  Send,
  Sparkles,
  Play,
  RotateCcw,
  Calendar,
  AlertCircle,
  HelpCircle,
  Loader2,
  Compass,
  Trash2,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const CoachView: React.FC = () => {
  const {
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChat,
    activeGoal,
    startFocusSession,
    openRememberWhy,
    openWhatShouldIDo,
    openEmergencyReset,
    setActiveTab,
  } = useNexus();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    sendChatMessage(input);
    setInput('');
  };

  const situationalChips = [
    { label: 'What should I do next?', action: () => openWhatShouldIDo() },
    { label: 'I wasted the morning', prompt: 'I wasted the whole morning and feel terrible. How do I recover without feeling guilty?' },
    { label: "I don't feel like studying", prompt: "I have zero motivation to study right now. What is the lowest friction next step?" },
    { label: 'I have only 45 minutes', prompt: 'I only have 45 minutes of free time today. What should I prioritize?' },
    { label: 'Panic / Fear of failure', prompt: "I am feeling overwhelmed and terrified that I won't reach my goal. Re-anchor me." },
  ];

  const handleActionClick = (action: any) => {
    if (!action) return;
    const type = action.actionType || action.type;
    if (type === 'WHAT_NEXT' || type === 'what_next') {
      openWhatShouldIDo();
    } else if (type === 'START_FOCUS' || type === 'start_focus') {
      startFocusSession({
        title: action.payload?.title || action.label || 'Focused Sprint',
        subject: action.payload?.subject || 'Core',
        durationMinutes: action.payload?.durationMinutes || 25,
      });
    } else if (type === 'REMEMBER_WHY' || type === 'remember_why') {
      openRememberWhy();
    } else if (type === 'EMERGENCY_RESET' || type === 'emergency_reset') {
      openEmergencyReset();
    } else if (type === 'VIEW_PLAN' || type === 'view_plan') {
      setActiveTab('plan');
    } else if (type === 'PROMPT' || type === 'prompt') {
      sendChatMessage(action.label || action.payload);
    } else if (action.label) {
      sendChatMessage(action.label);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto">
      {/* Coach Header */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between gap-3 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                NEXUS AI COACH
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Zero-shame, practical navigation toward <strong className="text-neutral-700 dark:text-neutral-300">{activeGoal.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openRememberWhy}
            title="Recalibrate your North Star compass"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>North Star</span>
          </button>
          <button
            onClick={clearChat}
            title="Reset conversation"
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4">
        {chatMessages.map((msg: any) => {
          const isAssistant = msg.role === 'assistant' || msg.sender === 'coach';
          const content = msg.content || msg.text || '';
          const actions = msg.suggestedActions || (msg.actionSuggestion ? [{
            label: msg.actionSuggestion.title,
            actionType: 'START_FOCUS',
            payload: msg.actionSuggestion,
          }] : []);

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-xl p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isAssistant
                    ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                    : 'bg-blue-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {content.split('\n\n').map((para: string, idx: number) => {
                    // Check for bullet lists
                    if (para.startsWith('- ') || para.startsWith('* ')) {
                      const items = para.split('\n');
                      return (
                        <ul key={idx} className="list-disc pl-4 space-y-1 my-1">
                          {items.map((it: string, iIdx: number) => (
                            <li key={iIdx}>{it.replace(/^[-*]\s+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx}>{para}</p>;
                  })}
                </div>

                {/* Suggested Action Buttons in Coach Reply */}
                {actions && actions.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                    {actions.map((act: any, aIdx: number) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border border-blue-500/20 transition-all active:scale-95 shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isChatLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span>NEXUS Coach is formulating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Situational Quick Chips */}
      <div className="py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
        {situationalChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (chip.action) {
                chip.action();
              } else if (chip.prompt) {
                sendChatMessage(chip.prompt);
              }
            }}
            className="text-xs whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors shadow-xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSubmit} className="pt-1 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach anything (e.g. 'I feel stuck on Chemistry', 'Help me prioritize')..."
            className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="absolute right-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
