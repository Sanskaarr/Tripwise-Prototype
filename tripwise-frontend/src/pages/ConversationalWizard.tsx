import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useProfileStore } from '@/store/profileStore';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi, HotelOption, TransportOption } from '@/lib/api/interactiveApi';
import { useShallow } from 'zustand/react/shallow';
import { Search, ArrowUp, Sparkles, Map, IndianRupee } from 'lucide-react';
import ChatMessage, { ChatMessageData } from '@/components/chat/ChatMessage';
import tripwiseLogo from '@/assets/tripwise-logo.png';
import { extractAndGeocodePlaces } from '@/utils/extractPlaces';
import { config } from '@/config/env';
import { BudgetSummary } from '@/components/chat/BudgetSummary';

// ─── Unique ID Generator ───────────────────────────────────────
const uid = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ─── Component ─────────────────────────────────────────────────
const ConversationalWizard: React.FC = () => {
    const navigate = useNavigate();
    const bottomRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    const [inputText, setInputText] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [showBudget, setShowBudget] = useState(false);

    // Profile store
    const { basicInfo } = useProfileStore(useShallow(state => ({ basicInfo: state.basicInfo })));

    // Wizard store
    const {
        _hasHydrated, sessionId, overviewData, messages, isLoading,
        selectedHotel, selectedTransport,
        addMessage, removeLastMessage, updateLastMessage, clearMessages,
        setHotelOptions, selectHotel: storeSelectHotel,
        setTransportOptions, selectTransport: storeSelectTransport,
        setMasterPlan, setStep, setLoading, resetWizard,
    } = useWizardStore();

    const userName = basicInfo.fullName?.split(' ')[0] || 'Traveler';

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    // ─── Initialize Conversation ───────────────────────────────
    useEffect(() => {
        if (!_hasHydrated) return; // Wait for Zustand to load from localforage
        if (hasInitialized.current) return;

        // Handle empty state (e.g. user navigated here directly without a plan or local state was cleared)
        if (!overviewData && messages.length === 0) {
            const state = useWizardStore.getState();
            // If we're resuming a finalized plan (CONTINUE PLAN from dashboard), fall through to the step handler below
            if (state.currentStep === 'PLAN' && state.masterPlan) {
                // intentional fall-through — step handler at line ~93 will display the plan
            } else {
                hasInitialized.current = true;

                // Check if they have a draft trip in profileStore
                const profileState = useProfileStore.getState();
                if (profileState.destination?.destination && profileState.dates?.startDate) {
                    addMessage({
                        id: uid(),
                        sender: 'bot',
                        type: 'text',
                        content: `I see you have a draft trip to **${profileState.destination.destination}**. Let me finalize the details to start...`,
                        timestamp: Date.now(),
                    });
                    setTimeout(() => {
                        navigate('/plan/confirmation');
                    }, 2500);
                } else {
                    addMessage({
                        id: uid(),
                        sender: 'bot',
                        type: 'text',
                        content: `It looks like you don't have an active trip plan right now. Let's start a new one...`,
                        timestamp: Date.now(),
                    });
                    setTimeout(() => {
                        navigate('/plan');
                    }, 2500);
                }
                return;
            }
        }

        if (messages.length > 0) {
            hasInitialized.current = true;
            return;
        }
        hasInitialized.current = true;

        const state = useWizardStore.getState();
        const step = state.currentStep;

        if (step === 'PLAN' && state.masterPlan) {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `Welcome back, ${userName}! Your trip plan is already finalized. Here is your complete itinerary:`,
                timestamp: Date.now(),
            });
            setTimeout(() => {
                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'master-plan',
                    content: state.masterPlan,
                    timestamp: Date.now(),
                });
            }, 400);
            return;
        }

        if (step === 'TRANSPORT' && state.transportOptions.length > 0) {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `Welcome back! You were selecting a transport option. Here are the choices again:`,
                timestamp: Date.now(),
            });
            setTimeout(() => {
                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'transport-options',
                    content: state.transportOptions,
                    timestamp: Date.now(),
                });
            }, 400);
            return;
        }

        if (step === 'HOTEL' && state.hotelOptions.length > 0) {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `Welcome back! You were selecting a hotel. Here are the options again:`,
                timestamp: Date.now(),
            });
            setTimeout(() => {
                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'hotel-options',
                    content: state.hotelOptions,
                    timestamp: Date.now(),
                });
            }, 400);
            return;
        }

        const parsed = typeof overviewData === 'string' ? JSON.parse(overviewData) : overviewData;

        // Greeting
        addMessage({
            id: uid(),
            sender: 'bot',
            type: 'text',
            content: `Welcome back, ${userName}! I've analyzed your preferences for **${parsed?.destination || 'your trip'}**. Here's what I found:`,
            timestamp: Date.now(),
        });

        // Overview card (delayed slightly)
        setTimeout(() => {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'overview',
                content: parsed,
                timestamp: Date.now(),
            });

            // Action buttons
            setTimeout(() => {
                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'text',
                    content: `Looks like an amazing trip ahead! When you're ready, I can search for the best hotels within your budget.`,
                    timestamp: Date.now(),
                });
            }, 600);
        }, 800);
    }, [overviewData, messages.length, userName, addMessage]);

    // ─── Core Streaming Logic ─────────────────────────────────
    const processAIResponse = async (allMessages: ChatMessageData[]) => {
        let assistantContent = "";
        const CHAT_URL = `${config.apiBaseUrl}/api/chat/stream`;

        try {
            const response = await fetch(CHAT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: allMessages.map((m) => ({
                        role: m.sender === 'bot' ? 'assistant' : m.sender,
                        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
                    })),
                    destination: useProfileStore.getState().destination?.destination,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get travel advice");
            }

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            // Add empty assistant message to start streaming
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
                
                // Process SSE lines
                const lines = chunk.split('\n');
                for (let line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.replace('data:', '').trim();
                        if (data) {
                            assistantContent += data;
                            updateLastMessage(assistantContent);
                        }
                    }
                }
            }

            // Extract places for the map
            if (assistantContent) {
                try {
                    const dest = useProfileStore.getState().destination?.destination || '';
                    const extractedPlaces = await extractAndGeocodePlaces(assistantContent, dest);
                    if (extractedPlaces.length > 0) {
                        // We can store these in the store if needed for the map
                        console.log("Extracted Places:", extractedPlaces);
                    }
                } catch (err) {
                    console.warn("Failed to extract places:", err);
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

    const handleFindHotels = useCallback(async () => {
        if (!sessionId || isLoading) return;
        setLoading(true);

        addMessage({
            id: uid(),
            sender: 'system',
            type: 'loading',
            content: 'Searching real-time hotel prices...',
            timestamp: Date.now(),
        });

        try {
            const response = await InteractiveApi.getHotelSuggestions(sessionId);
            removeLastMessage(); // Remove loading

            if (response.success) {
                let options = response.data?.options;
                if (!options && typeof response.data === 'string') {
                    try {
                        const parsed = JSON.parse(response.data as string);
                        options = parsed.options;
                    } catch { /* ignore */ }
                }

                if (options && options.length > 0) {
                    setHotelOptions(options);
                    setStep('HOTEL');

                    addMessage({
                        id: uid(),
                        sender: 'bot',
                        type: 'text',
                        content: `I found ${options.length} great options for you. Pick the one that feels right:`,
                        timestamp: Date.now(),
                    });

                    setTimeout(() => {
                        addMessage({
                            id: uid(),
                            sender: 'bot',
                            type: 'hotel-options',
                            content: options,
                            timestamp: Date.now(),
                        });
                    }, 300);
                } else {
                    addMessage({
                        id: uid(),
                        sender: 'system',
                        type: 'error',
                        content: 'No hotel options were found. This might be a temporary issue.',
                        timestamp: Date.now(),
                    });
                }
            } else {
                addMessage({
                    id: uid(),
                    sender: 'system',
                    type: 'error',
                    content: 'Failed to fetch hotel options. Please try again.',
                    timestamp: Date.now(),
                });
            }
        } catch (e) {
            removeLastMessage();
            addMessage({
                id: uid(),
                sender: 'system',
                type: 'error',
                content: 'Something went wrong while searching for hotels. Please try again.',
                timestamp: Date.now(),
            });
        } finally {
            setLoading(false);
        }
    }, [sessionId, isLoading, setLoading, addMessage, removeLastMessage, setHotelOptions, setStep]);

    const handleHotelSelect = useCallback(async (hotel: HotelOption) => {
        if (!sessionId || isLoading) return;
        storeSelectHotel(hotel);
        setLoading(true);

        // User selection message
        addMessage({
            id: uid(),
            sender: 'user',
            type: 'selection',
            content: `I'll go with ${hotel.name}`,
            timestamp: Date.now(),
        });

        // Save selection to backend
        try {
            await InteractiveApi.selectHotel(sessionId, hotel);
        } catch { /* non-critical */ }

        // Bot acknowledges and auto-loads transport
        setTimeout(() => {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `Great choice! ${hotel.name} looks perfect. Now let me find the best way to get around...`,
                timestamp: Date.now(),
            });

            setTimeout(() => {
                loadTransportOptions();
            }, 500);
        }, 400);
    }, [sessionId, isLoading, storeSelectHotel, setLoading, addMessage]);

    const loadTransportOptions = useCallback(async () => {
        if (!sessionId) return;

        addMessage({
            id: uid(),
            sender: 'system',
            type: 'loading',
            content: 'Finding transport options...',
            timestamp: Date.now(),
        });

        try {
            const response = await InteractiveApi.getTransportOptions(sessionId);
            removeLastMessage();

            if (response.success) {
                let options = response.data?.options;
                if (!options && typeof response.data === 'string') {
                    try {
                        const parsed = JSON.parse(response.data as string);
                        options = parsed.options;
                    } catch { /* ignore */ }
                }

                if (options && options.length > 0) {
                    setTransportOptions(options);
                    setStep('TRANSPORT');

                    addMessage({
                        id: uid(),
                        sender: 'bot',
                        type: 'text',
                        content: `Here are ${options.length} transport options to get you around. Pick your preferred way:`,
                        timestamp: Date.now(),
                    });

                    setTimeout(() => {
                        addMessage({
                            id: uid(),
                            sender: 'bot',
                            type: 'transport-options',
                            content: options,
                            timestamp: Date.now(),
                        });
                    }, 300);
                } else {
                    addMessage({
                        id: uid(),
                        sender: 'system',
                        type: 'error',
                        content: 'No transport options found. Please try again.',
                        timestamp: Date.now(),
                    });
                }
            }
        } catch {
            removeLastMessage();
            addMessage({
                id: uid(),
                sender: 'system',
                type: 'error',
                content: 'Failed to fetch transport options. Please try again.',
                timestamp: Date.now(),
            });
        } finally {
            setLoading(false);
        }
    }, [sessionId, addMessage, removeLastMessage, setTransportOptions, setStep, setLoading]);

    const handleTransportSelect = useCallback(async (transport: TransportOption) => {
        if (!sessionId || isLoading) return;
        storeSelectTransport(transport);
        setLoading(true);

        addMessage({
            id: uid(),
            sender: 'user',
            type: 'selection',
            content: `I'll take the ${transport.mode}`,
            timestamp: Date.now(),
        });

        try {
            await InteractiveApi.selectTransport(sessionId, transport);
        } catch { /* non-critical */ }

        setTimeout(() => {
            addMessage({
                id: uid(),
                sender: 'bot',
                type: 'text',
                content: `Perfect! Everything is set. Let me now craft your complete travel plan...`,
                timestamp: Date.now(),
            });

            setTimeout(() => {
                generateMasterPlan();
            }, 500);
        }, 400);
    }, [sessionId, isLoading, storeSelectTransport, setLoading, addMessage]);

    const generateMasterPlan = useCallback(async () => {
        if (!sessionId) return;

        addMessage({
            id: uid(),
            sender: 'system',
            type: 'loading',
            content: 'Generating your master plan... This may take a moment.',
            timestamp: Date.now(),
        });

        try {
            const response = await InteractiveApi.finalizeTrip(sessionId);
            removeLastMessage();

            if (response.success && response.data) {
                const plan = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
                setMasterPlan(plan);
                setStep('PLAN');

                addMessage({
                    id: uid(),
                    sender: 'bot',
                    type: 'text',
                    content: `Your travel plan is ready! Here's your complete itinerary:`,
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
                    content: 'Failed to generate the master plan. Please try again.',
                    timestamp: Date.now(),
                });
            }
        } catch {
            removeLastMessage();
            addMessage({
                id: uid(),
                sender: 'system',
                type: 'error',
                content: 'Something went wrong while generating your plan. Please try again.',
                timestamp: Date.now(),
            });
        } finally {
            setLoading(false);
        }
    }, [sessionId, addMessage, removeLastMessage, setMasterPlan, setStep, setLoading]);

    const handleRetry = useCallback(() => {
        // Remove the error message and retry the last failed action
        removeLastMessage();
        const step = useWizardStore.getState().currentStep;
        if (step === 'OVERVIEW') handleFindHotels();
        else if (step === 'HOTEL') loadTransportOptions();
        else if (step === 'TRANSPORT') generateMasterPlan();
    }, [removeLastMessage, handleFindHotels, loadTransportOptions, generateMasterPlan]);

    const handlePlanAnother = useCallback(() => {
        resetWizard();
        navigate('/dashboard');
    }, [resetWizard, navigate]);

    // ─── Selection lock flags ──────────────────────────────────
    const hotelSelectionLocked = !!selectedHotel;
    const transportSelectionLocked = !!selectedTransport;

    // ─── Determine if we should show action buttons ────────────
    const showFindHotelsButton =
        messages.length > 0 &&
        !isLoading &&
        !messages.some(m => m.type === 'hotel-options') &&
        messages.some(m => m.type === 'overview');

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

    // ─── Get contextual input placeholder ──────────────────────
    const getInputPlaceholder = () => {
        if (isLoading) return 'TripWise AI is working...';
        const step = useWizardStore.getState().currentStep;
        if (step === 'PLAN') return 'Your trip plan is ready!';
        return 'Type a message to TripWise AI...';
    };

    return (
        <>
            <SiteHeader />
            <main className="relative z-10 container mx-auto px-4 pt-24 pb-32 max-w-4xl min-h-screen flex flex-col">
                
                {/* Controls Overlay */}
                <div className="flex justify-end gap-2 mb-4 sticky top-24 z-40">
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

                {/* Budget Summary Section */}
                {showBudget && (
                    <div className="mb-6 animate-in slide-in-from-top duration-300">
                        <BudgetSummary messages={messages.map(m => ({ 
                            role: m.sender === 'bot' ? 'assistant' : 'user', 
                            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
                        }))} />
                    </div>
                )}

                {/* Message List */}
                <div className="flex-1 flex flex-col gap-5 pb-4">
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            onHotelSelect={handleHotelSelect}
                            onTransportSelect={handleTransportSelect}
                            onRetry={handleRetry}
                            selectedHotelName={selectedHotel?.name}
                            selectedTransportMode={selectedTransport?.mode}
                            hotelSelectionLocked={hotelSelectionLocked}
                            transportSelectionLocked={transportSelectionLocked}
                        />
                    ))}

                    {/* Find Hotels Button — shown after overview */}
                    {showFindHotelsButton && (
                        <div className="flex items-start gap-3 max-w-[90%]">
                            <div className="w-9 h-9 shrink-0" />
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleFindHotels}
                                    disabled={isLoading}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300
                    bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 hover:scale-105 shadow-lg shadow-primary/10"
                                >
                                    <Search className="w-4 h-4" />
                                    Find Hotels
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300
                    border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                >
                                    Save for Later
                                </button>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Fixed Input Bar — Functional */}
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
