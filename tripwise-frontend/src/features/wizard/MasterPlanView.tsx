import React from 'react';
import { useWizardStore } from '@/store/wizardStore';
import ReactMarkdown from 'react-markdown';
import { Download, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MasterPlanView() {
    const { masterPlan } = useWizardStore();
    const navigate = useNavigate();

    if (!masterPlan) return <div>Error: No plan generated.</div>;

    return (
        <div className="flex flex-col h-full bg-slate-950/30 rounded-xl overflow-hidden">
            {/* Header Actions */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-bold text-white">Your Master Itinerary</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Download className="w-5 h-5 text-slate-300" />
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Home className="w-5 h-5 text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Markdown Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <article className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="space-y-2 my-4" {...props} />,
                            li: ({ node, ...props }) => <li className="flex gap-2 items-start" {...props} />,
                            strong: ({ node, ...props }) => <strong className="text-green-300 font-semibold" {...props} />
                        }}
                    >
                        {masterPlan}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    );
}
