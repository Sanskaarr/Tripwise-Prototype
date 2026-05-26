import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useProfileStore } from '@/store/profileStore';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi } from '@/lib/api/interactiveApi';
import { useShallow } from 'zustand/react/shallow';
import { ArrowUp, Sparkles, Map, IndianRupee } from 'lucide-react';
import ChatMessage, { ChatMessageData } from '@/components/chat/ChatMessage';
import tripwiseLogo from '@/assets/tripwise-logo.png';
import { config } from '@/config/env';
import { sessionCheckState } from '@/lib/sessionCheckState';
import { BudgetSummary } from '@/components/chat/BudgetSummary';

// ─── Unique ID Generator ───────────────────────────────────────
const uid = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ─── Component ─────────────────────────────────────────────────
const ConversationalWizard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bottomRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    const [inputText, setInputText] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [showBudget, setShowBudget] = useState(false);

    // Profile store
    const { basicInfo } = useProfileStore(useShallow(state => ({ basicInfo: state.basicInfo })));

    // Wizard store
    const {
        _hasHydrated, sessionId, messages, isLoading,
        addMessage, removeLastMessage, updateLastMessage,
        setMasterPlan, setStep, setLoading, setOverviewData, setSessionId, resetWizard,
    } = useWizardStore();

    const userName = basicInfo.fullName?.split(' ')[0] || 'Traveler';

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    // ─── Initialize Conversation ───────────────────────────────
    useEffect(() => {
        if (!_hasHydrated) return;
        if (hasInitialized.current) return;

        const state = useWizardStore.getState();
        const profileState = useProfileStore.getState();

        // 1. If resuming a finalized plan, display it
        if (state.currentStep === 'PLAN' && state.masterPlan) {
            hasInitialized.current = true;
            if (messages.length === 0) {
                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'text',
                    content: `Welcome back, ${userName}! Here is your finalized master plan:`,
                    timestamp: Date.now(),
                });
                setTimeout(() => {
                    addMessage({
                        id: uid(),
                        sender: 'bot',
                        type: 'master-plan',
                        content: state.masterPlan!,
                        timestamp: Date.now(),
                    });
                }, 400);
            }
            return;
        }

        // 2. If messages already exist, resume without re-initializing
        if (messages.length > 0) {
            hasInitialized.current = true;
            return;
        }

        // 3. Start a fresh interactive planning session
        hasInitialized.current = true;

        if (profileState.profileId) {
            setLoading(true);
            InteractiveApi.initSession(profileState.profileId).then((res) => {
                setLoading(false);
                if (res.success && res.data) {
                    setSessionId(res.data.id);
                    setOverviewData(res.data.destinationOverview ?? '');
                    setStep('OVERVIEW');

                    const dest = profileState.destination?.destination || 'my destination';
                    const initPrompt = `Introduce yourself as my travel guide. I am planning a trip to ${dest}. Welcome me by name, ${userName}, and ask me if we should look at travel options (flights/trains) or hotels first.`;

                    const initMsg: ChatMessageData = {
                        id: uid(),
                        sender: 'user',
                        type: 'text',
                        content: initPrompt,
                        timestamp: Date.now(),
                        isHidden: true,
                    } as any;

                    addMessage(initMsg);

                    setLoading(true);
                    processAIResponse([initMsg]).finally(() => {
                        setLoading(false);
                    });
                } else {
                    addMessage({
                        id: uid(),
                        sender: 'system',
                        type: 'error',
                        content: res.error || 'Failed to load your trip plan. Please try again.',
                        timestamp: Date.now(),
                    });
                }
            });
            return;
        }

        // No profileId — redirect to onboarding
        if (profileState.destination?.destination && profileState.dates?.startDate) {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `I see you have a draft trip to **${profileState.destination.destination}**. Let me finalize the details to start...`,
                timestamp: Date.now(),
            });
            setTimeout(() => navigate('/plan/confirmation'), 2500);
        } else {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `It looks like you don't have an active trip plan right now. Let's start a new one...`,
                timestamp: Date.now(),
            });
            setTimeout(() => navigate('/plan'), 2500);
        }
    }, [messages.length, userName, addMessage, location, _hasHydrated, navigate, setOverviewData, setSessionId, setStep, setLoading]);

    // ─── Core Streaming Logic ─────────────────────────────────
    const processAIResponse = async (allMessages: ChatMessageData[]) => {
        let assistantContent = "";
        const CHAT_URL = `${config.apiBaseUrl}/api/chat/stream`;

        try {
            const token = sessionCheckState.token;
            const profileState = useProfileStore.getState();
            const profileContext = {
                fullName: profileState.basicInfo?.fullName,
                cityOfDeparture: profileState.basicInfo?.cityOfDeparture,
                adults: profileState.basicInfo?.adults,
                children: profileState.basicInfo?.children,
                infants: profileState.basicInfo?.infants,
                budgetLevel: profileState.budget?.level,
                startDate: profileState.dates?.startDate,
                returnDate: profileState.dates?.returnDate,
                durationDays: profileState.dates?.duration,
                travelStyle: profileState.destination?.travelStyle,
                interests: Object.entries(profileState.interests || {})
                    .filter(([_, v]) => v)
                    .map(([k]) => k),
                accommodationPreference: profileState.accommodation?.category,
                transportPreference: profileState.transport?.mode,
            };

            const response = await fetch(CHAT_URL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    messages: allMessages
                        .filter((m) => m.sender !== 'system')
                        .map((m) => ({
                            role: m.sender === 'bot' ? 'assistant' : 'user',
                            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
                        })),
                    destination: profileState.destination?.destination,
                    profileContext,
                }),
            });

            if (!response.ok) throw new Error("Failed to get travel advice");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Add empty bot message that will be filled by streaming
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: "",
                timestamp: Date.now(),
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                for (const line of chunk.split('\n')) {
                    if (line.startsWith('data:')) {
                        const data = line.replace('data:', '').trim();
                        if (data) {
                            assistantContent += data;
                            updateLastMessage(assistantContent);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Chat error:", error);
            addMessage({
                id: uid(),
                sender: 'system',
                type: 'error',
                content: error instanceof Error ? error.message : "Something went wrong",
                timestamp: Date.now(),
            });
        }
    };

    // ─── Generate Master Plan from Full Conversation ───────────
    const handleGenerateMasterPlanFromChat = useCallback(async () => {
        if (!sessionId || isLoading) return;
        setLoading(true);

        addMessage({
            id: uid(),
            sender: 'system',
            type: 'loading',
            content: 'Compiling your conversation into a Master Plan...',
            timestamp: Date.now(),
        });

        try {
            const chatMessages = messages
                .filter((m) => m.sender !== 'system')
                .map((m) => ({
                    role: m.sender === 'bot' ? 'assistant' : 'user',
                    content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
                }));

            const response = await InteractiveApi.finalizeTrip(sessionId, chatMessages);
            removeLastMessage();

            if (response.success && response.data) {
                const plan = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
                setMasterPlan(plan);
                setStep('PLAN');

                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'text',
                    content: `Here is your finalized master plan compiled from our conversation!`,
                    timestamp: Date.now(),
                });

                setTimeout(() => {
                    addMessage({
                        id: uid(),
                        sender: 'bot',
                        type: 'master-plan',
                        content: plan,
                        timestamp: Date.now(),
                    });
                }, 400);
            } else {
                addMessage({
                    id: uid(),
                    sender: 'system',
                    type: 'error',
                    content: response.error || 'Failed to generate the master plan. Please try again.',
                    timestamp: Date.now(),
                });
            }
        } catch {
            removeLastMessage();
            addMessage({
                id: uid(),
                sender: 'system',
                type: 'error',
                content: 'Something went wrong while compiling your plan. Please try again.',
                timestamp: Date.now(),
            });
        } finally {
            setLoading(false);
        }
    }, [sessionId, messages, isLoading, setLoading, addMessage, removeLastMessage, setMasterPlan, setStep]);

    const handlePlanAnother = useCallback(() => {
        resetWizard();
        navigate('/dashboard');
    }, [resetWizard, navigate]);

    // ─── Handle user text input ────────────────────────────────
    const handleSendMessage = useCallback(async () => {
        const text = inputText.trim();
        if (!text || isLoading) return;

        const userMsg: ChatMessageData = {
            id: uid(),
            sender: 'user',
            type: 'text',
            content: text,
            timestamp: Date.now(),
        };

        addMessage(userMsg);
        setInputText('');
        setLoading(true);

        try {
            await processAIResponse([...messages, userMsg]);
        } finally {
            setLoading(false);
        }
    }, [inputText, isLoading, messages, addMessage, setLoading]);

    const getInputPlaceholder = () => {
        if (isLoading) return 'TripWise AI is working...';
        if (useWizardStore.getState().currentStep === 'PLAN') return 'Your trip plan is ready!';
        return 'Type a message to TripWise AI...';
    };

    return (
        <>
            <SiteHeader />
            <main className="relative z-10 container mx-auto px-4 pt-24 pb-32 max-w-4xl min-h-screen flex flex-col">

                {/* Controls Overlay */}
                <div className="flex justify-between items-center gap-2 mb-4 sticky top-24 z-40">
                    <div className="flex items-center gap-2">
                        {sessionId && messages.filter(m => !(m as any).isHidden).length > 0 && useWizardStore.getState().currentStep !== 'PLAN' && (
                            <button
                                onClick={handleGenerateMasterPlanFromChat}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300
                                bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in slide-in-from-left duration-300"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Generate Master Plan
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowBudget(!showBudget)}
                            className={`p-2.5 rounded-xl border border-white/10 backdrop-blur-md transition-all ${showBudget ? 'bg-primary/20 text-primary border-primary/30' : 'bg-black/20 text-muted-foreground'}`}
                        >
                            <IndianRupee className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`p-2.5 rounded-xl border border-white/10 backdrop-blur-md transition-all ${showMap ? 'bg-primary/20 text-primary border-primary/30' : 'bg-black/20 text-muted-foreground'}`}
                        >
                            <Map className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Budget Summary Section */}
                {showBudget && (
                    <div className="mb-6 animate-in slide-in-from-top duration-300">
                        <BudgetSummary messages={messages.filter(m => !(m as any).isHidden).map(m => ({
                            role: m.sender === 'bot' ? 'assistant' : 'user',
                            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
                        }))} />
                    </div>
                )}

                {/* Message List */}
                <div className="flex-1 flex flex-col gap-5 pb-4">
                    {messages.filter(msg => !(msg as any).isHidden).map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            onPlanAnother={handlePlanAnother}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Fixed Input Bar */}
                <div className="fixed bottom-4 md:bottom-6 left-0 right-0 px-4 z-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-2.5 flex items-center gap-3 shadow-2xl shadow-black/30">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                <img src={tripwiseLogo} alt="" className="w-5 h-5 object-contain" />
                            </div>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder={getInputPlaceholder()}
                                disabled={isLoading}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50"
                            />
                            {isLoading ? (
                                <div className="flex items-center gap-1 pr-1">
                                    {[0, 1, 2].map(i => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim()}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${inputText.trim()
                                        ? 'bg-primary text-white hover:scale-105 shadow-lg shadow-primary/30'
                                        : 'bg-white/10 text-muted-foreground/40 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default ConversationalWizard;
