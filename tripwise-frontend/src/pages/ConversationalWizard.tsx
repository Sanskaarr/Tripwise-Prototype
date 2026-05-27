import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useProfileStore } from '@/store/profileStore';
import { useWizardStore, MapLocation } from '@/store/wizardStore';
import { InteractiveApi } from '@/lib/api/interactiveApi';
import { useShallow } from 'zustand/react/shallow';
import { ArrowUp, Sparkles, MessageSquare, LayoutList } from 'lucide-react';
import ChatMessage, { ChatMessageData } from '@/components/chat/ChatMessage';
import TripMap from '@/components/map/TripMap';
import MasterPlanCard from '@/components/chat/MasterPlanCard';
import { parseMasterPlan } from '@/types/masterPlan';
import tripwiseLogo from '@/assets/tripwise-logo.png';
import { config } from '@/config/env';
import { sessionCheckState } from '@/lib/sessionCheckState';

function extractLocationTokens(raw: string): { places: MapLocation[]; clean: string } {
    const places: MapLocation[] = [];
    let clean = raw;
    const TOKEN = '[LOCATIONS:';
    let idx = 0;

    while ((idx = clean.indexOf(TOKEN, idx)) !== -1) {
        const jsonStart = idx + TOKEN.length;
        let depth = 0;
        let jsonEnd = -1;

        for (let i = jsonStart; i < clean.length; i++) {
            const ch = clean.charAt(i);
            if (ch === '{') depth++;
            else if (ch === '}') {
                depth--;
                if (depth === 0) { jsonEnd = i; break; }
            }
        }

        if (jsonEnd === -1 || clean.charAt(jsonEnd + 1) !== ']') { idx++; continue; }

        try {
            const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
            if (Array.isArray(parsed?.places)) places.push(...parsed.places);
        } catch {}

        clean = clean.slice(0, idx) + clean.slice(jsonEnd + 2);
    }

    return { places, clean };
}

// ─── Unique ID Generator ───────────────────────────────────────
const uid = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ─── Component ─────────────────────────────────────────────────
const ConversationalWizard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bottomRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    const autoGeneratePlanRef = useRef(false);
    const [inputText, setInputText] = useState('');
    const [viewMode, setViewMode] = useState<'chat' | 'dashboard'>('chat');
    const prevStepRef = useRef('');

    // Profile store
    const { basicInfo } = useProfileStore(useShallow(state => ({ basicInfo: state.basicInfo })));

    // Wizard store
    const {
        _hasHydrated, sessionId, messages, isLoading, currentStep, mapLocations, masterPlan,
        addMessage, removeLastMessage, updateLastMessage,
        setMasterPlan, setStep, setLoading, setOverviewData, setSessionId, resetWizard,
        addLocations, revisePlan,
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
            setViewMode('dashboard');
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
            let buffer = '';

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

                if (done) {
                    // Flush any remaining buffered line
                    if (buffer.startsWith('data:')) {
                        const data = buffer.slice(5).trim();
                        if (data && data !== '[DONE]') {
                            assistantContent += data;
                            const { places, clean } = extractLocationTokens(assistantContent);
                            if (places.length > 0) addLocations(places);
                            updateLastMessage(clean);
                        }
                    }
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                // Keep the last (possibly incomplete) line in the buffer
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5).trim();
                        if (data && data !== '[DONE]') {
                            assistantContent += data;
                            const { places, clean } = extractLocationTokens(assistantContent);
                            if (places.length > 0) addLocations(places);
                            updateLastMessage(clean);
                        }
                    }
                }
            }

            // Final cleanup of any tokens that survived the stream
            const { places: finalPlaces, clean: finalClean } = extractLocationTokens(assistantContent);
            if (finalPlaces.length > 0) addLocations(finalPlaces);
            assistantContent = finalClean;

            if (assistantContent.includes('[PLAN_READY]')) {
                const cleaned = assistantContent.replace('[PLAN_READY]', '').trim();
                updateLastMessage(cleaned);
                autoGeneratePlanRef.current = true;
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
                setViewMode('dashboard');

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
        revisePlan();
    }, [revisePlan]);

    // Track transitions into PLAN step to switch to dashboard
    useEffect(() => {
        if (currentStep === 'PLAN' && prevStepRef.current !== 'PLAN') {
            setViewMode('dashboard');
        }
        prevStepRef.current = currentStep;
    }, [currentStep]);

    const handleBook = useCallback(() => {
        if (!masterPlan) return;
        try {
            const parsed = typeof masterPlan === 'string' ? parseMasterPlan(masterPlan) : masterPlan;
            navigate('/booking/summary', { state: { plan: parsed } });
        } catch (e) {
            console.error("Error parsing plan for booking:", e);
        }
    }, [masterPlan, navigate]);

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
            if (autoGeneratePlanRef.current) {
                autoGeneratePlanRef.current = false;
                setTimeout(() => handleGenerateMasterPlanFromChat(), 1200);
            }
        } finally {
            setLoading(false);
        }
    }, [inputText, isLoading, messages, addMessage, setLoading, handleGenerateMasterPlanFromChat]);

    const getInputPlaceholder = () => {
        if (isLoading) return 'TripWise AI is working...';
        if (currentStep === 'PLAN') {
            if (viewMode === 'dashboard') return 'Plan is ready!';
            return 'Suggest refinements (e.g., "Add more beaches" or "Change Day 2 stay")...';
        }
        return 'Type a message to TripWise AI...';
    };

    const showMap = currentStep === 'PLAN' && viewMode === 'dashboard' && mapLocations.length > 0;

    if (currentStep === 'PLAN' && viewMode === 'dashboard') {
        const parsedPlan = typeof masterPlan === 'string' ? parseMasterPlan(masterPlan) : masterPlan;

        return (
            <>
                <SiteHeader />
                <div className="min-h-screen bg-slate-50/50 pt-20 flex flex-col animate-in fade-in duration-300">
                    {/* Action Bar Header */}
                    <div className="bg-transparent sticky top-16 z-30 px-6 py-4">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Left: Trip summary */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                                        <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                                        Finalized Plan
                                    </span>
                                </div>
                                <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-tight">
                                    {parsedPlan?.tripOverview?.title || 'Your Trip Plan'}
                                </h1>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={() => setViewMode('chat')}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all flex items-center gap-2 hover:border-slate-300 active:scale-[0.98]"
                                >
                                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                    Refine Plan
                                </button>
                                <button
                                    onClick={handleBook}
                                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md active:scale-[0.98] hover:opacity-95"
                                    style={{ background: 'linear-gradient(135deg, hsl(222,47%,11%) 0%, hsl(225,50%,18%) 50%, hsl(222,47%,11%) 100%)' }}
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    Book This Trip
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Split Body */}
                    <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 md:h-[calc(100vh-11rem)]">
                        {/* Left: Master Itinerary / Budget Card */}
                        <div className="w-full md:w-1/2 h-full flex flex-col min-h-[500px] md:min-h-0">
                            <MasterPlanCard plan={masterPlan!} onPlanAnother={handlePlanAnother} isSplitView={true} />
                        </div>

                        {/* Right: Interactive Map */}
                        <div className="w-full md:w-1/2 h-[450px] md:h-full flex flex-col">
                            <TripMap places={mapLocations} />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SiteHeader />
            <main className={`relative z-10 container mx-auto px-4 pt-24 pb-32 min-h-screen flex ${showMap ? 'max-w-7xl gap-6 items-start' : 'max-w-4xl flex-col'}`}>

                {/* Chat column */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Controls Overlay */}
                    <div className="flex items-center gap-2 mb-4 sticky top-24 z-40">
                        {sessionId && messages.filter(m => !(m as any).isHidden).length > 0 && currentStep !== 'PLAN' && (
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
                        {currentStep === 'PLAN' && viewMode === 'chat' && (
                            <button
                                onClick={() => setViewMode('dashboard')}
                                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300
                                bg-slate-900 text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20 border border-slate-800 disabled:opacity-50 animate-in fade-in slide-in-from-left duration-300"
                            >
                                <LayoutList className="w-3.5 h-3.5 text-indigo-400" />
                                View Interactive Dashboard
                            </button>
                        )}
                    </div>

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
                </div>

                {/* Map side panel — only in PLAN step */}
                <AnimatePresence>
                    {showMap && (
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="hidden md:block shrink-0 sticky top-24 self-start"
                            style={{ width: 380, height: 'calc(100vh - 7rem)' }}
                        >
                            <TripMap places={mapLocations} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fixed Input Bar */}
                <div className="fixed bottom-4 md:bottom-6 left-0 right-0 px-4 z-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-2.5 flex items-center gap-3 shadow-2xl shadow-black/30 animate-in slide-in-from-bottom duration-300">
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
