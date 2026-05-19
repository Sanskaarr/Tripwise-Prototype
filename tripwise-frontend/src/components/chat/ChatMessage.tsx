import React from 'react';
import { motion } from 'framer-motion';
import { User, AlertCircle, RefreshCw } from 'lucide-react';
import HotelCard from './HotelCard';
import TransportCard from './TransportCard';
import MasterPlanCard from './MasterPlanCard';
import tripwiseLogo from '@/assets/tripwise-logo.png';
import ReactMarkdown from 'react-markdown';

// ─── Message Type System ───────────────────────────────────────

export interface ChatMessageData {
    id: string;
    sender: 'bot' | 'user' | 'system';
    type:
    | 'text'
    | 'overview'
    | 'hotel-options'
    | 'transport-options'
    | 'master-plan'
    | 'selection'
    | 'loading'
    | 'error'
    | 'action-buttons';
    content: any;
    timestamp: number;
}

export interface OverviewContent {
    destination: string;
    overview: string;
    weatherForecast: string;
    estimatedCost: string;
    bestTimeToVisit?: string;
    highlights?: string[];
}

export interface ActionButton {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

// ─── Props ─────────────────────────────────────────────────────

interface ChatMessageProps {
    message: ChatMessageData;
    onHotelSelect?: (hotel: any) => void;
    onTransportSelect?: (transport: any) => void;
    onRetry?: () => void;
    onAction?: (action: string) => void;
    selectedHotelName?: string | null;
    selectedTransportMode?: string | null;
    hotelSelectionLocked?: boolean;
    transportSelectionLocked?: boolean;
}

// ─── Bot Avatar ────────────────────────────────────────────────

const BotAvatar = () => (
    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 overflow-hidden">
        <img src={tripwiseLogo} alt="TripWise AI" className="w-6 h-6 object-contain" />
    </div>
);

// ─── Loading Dots ──────────────────────────────────────────────

const TypingDots = () => (
    <div className="flex items-center gap-1.5 py-1">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/60"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
        ))}
    </div>
);

// ─── Main Component ────────────────────────────────────────────

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    onHotelSelect,
    onTransportSelect,
    onRetry,
    onAction,
    selectedHotelName,
    selectedTransportMode,
    hotelSelectionLocked,
    transportSelectionLocked,
}) => {
    const isBot = message.sender === 'bot';
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';

    // Wrapper for bot messages (avatar + bubble)
    const BotBubble = ({ children, noPadding }: { children: React.ReactNode; noPadding?: boolean }) => (
        <div className="flex items-start gap-3 max-w-[90%]">
            <BotAvatar />
            <div className={`flex flex-col gap-1 min-w-0 flex-1 ${noPadding ? '' : ''}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 ml-1">TripWise AI</span>
                <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.03] backdrop-blur-md px-5 py-4 shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );

    // Wrapper for user messages
    const UserBubble = ({ children }: { children: React.ReactNode }) => (
        <div className="flex items-start gap-3 justify-end max-w-[80%] ml-auto">
            <div className="rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/10 backdrop-blur-md px-5 py-3 shadow-lg">
                {children}
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-foreground/60" />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
        >
            {/* ── Text Message ── */}
            {message.type === 'text' && isBot && (
                <BotBubble>
                    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line prose prose-invert max-w-none prose-p:my-0 prose-headings:my-2">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                </BotBubble>
            )}

            {message.type === 'text' && isUser && (
                <UserBubble>
                    <div className="text-sm text-foreground/90 leading-relaxed prose prose-invert max-w-none prose-p:my-0">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                </UserBubble>
            )}

            {/* ── Overview Card ── */}
            {message.type === 'overview' && (
                <BotBubble>
                    <div className="space-y-4">
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                            {(message.content as OverviewContent).overview}
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Weather</p>
                                <p className="text-sm font-medium mt-0.5">{(message.content as OverviewContent).weatherForecast}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Est. Cost</p>
                                <p className="text-sm font-medium mt-0.5">{(message.content as OverviewContent).estimatedCost}</p>
                            </div>
                            {(message.content as OverviewContent).bestTimeToVisit && (
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Best Time</p>
                                    <p className="text-sm font-medium mt-0.5">{(message.content as OverviewContent).bestTimeToVisit}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </BotBubble>
            )}

            {/* ── Hotel Options ── */}
            {message.type === 'hotel-options' && (
                <div className="flex items-start gap-3 max-w-full">
                    <BotAvatar />
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 ml-1">TripWise AI</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(message.content as any[]).map((hotel, i) => (
                                <HotelCard
                                    key={i}
                                    hotel={hotel}
                                    isSelected={selectedHotelName === hotel.name}
                                    onSelect={() => !hotelSelectionLocked && onHotelSelect?.(hotel)}
                                    index={i}
                                    disabled={!!hotelSelectionLocked}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Transport Options ── */}
            {message.type === 'transport-options' && (
                <div className="flex items-start gap-3 max-w-full">
                    <BotAvatar />
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 ml-1">TripWise AI</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(message.content as any[]).map((transport, i) => (
                                <TransportCard
                                    key={i}
                                    transport={transport}
                                    isSelected={selectedTransportMode === transport.mode}
                                    onSelect={() => !transportSelectionLocked && onTransportSelect?.(transport)}
                                    index={i}
                                    disabled={!!transportSelectionLocked}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Master Plan ── */}
            {message.type === 'master-plan' && (
                <div className="flex items-start gap-3 max-w-full">
                    <BotAvatar />
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 ml-1">TripWise AI</span>
                        <MasterPlanCard plan={message.content as string} />
                    </div>
                </div>
            )}

            {/* ── User Selection ── */}
            {message.type === 'selection' && (
                <UserBubble>
                    <p className="text-sm font-medium text-foreground/90">{message.content}</p>
                </UserBubble>
            )}

            {/* ── Loading ── */}
            {message.type === 'loading' && (
                <BotBubble>
                    <div className="flex items-center gap-3">
                        <TypingDots />
                        <span className="text-xs text-muted-foreground">{message.content || 'Thinking...'}</span>
                    </div>
                </BotBubble>
            )}

            {/* ── Error ── */}
            {message.type === 'error' && (
                <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-red-500/20 bg-red-500/5 backdrop-blur-md px-5 py-4 shadow-lg">
                        <p className="text-sm text-red-300 mb-3">{message.content}</p>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Action Buttons ── */}
            {message.type === 'action-buttons' && (
                <div className="flex items-start gap-3 max-w-[90%]">
                    <div className="w-9 h-9 shrink-0" /> {/* Spacer for alignment */}
                    <div className="flex flex-wrap gap-3">
                        {(message.content as ActionButton[]).map((action, i) => (
                            <button
                                key={i}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 ${action.variant === 'primary'
                                    ? 'bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 hover:scale-105 shadow-lg shadow-primary/10'
                                    : 'border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                    } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ChatMessage;
