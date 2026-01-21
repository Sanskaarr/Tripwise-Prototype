import { motion } from "framer-motion";
import { CreditCard, Wallet, History, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WalletSection = () => {
    return (
        <div className="space-y-6">
            {/* Main Wallet Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="ios-glass relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
            >
                {/* Decorative Gradients */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground/60">
                                TripWise Pay
                            </p>
                            <h2 className="mt-2 text-4xl font-light tracking-tight text-foreground md:text-5xl">
                                $2,450<span className="text-2xl text-muted-foreground/40">.00</span>
                            </h2>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                            <Wallet className="h-6 w-6 text-primary" />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Button className="h-12 flex-1 rounded-2xl bg-white text-black hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" /> Add Money
                        </Button>
                        <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10">
                            <History className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Saved Cards & Recent Transactions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Saved Cards Mini */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium">Saved Cards</h4>
                                <p className="text-xs text-muted-foreground">Manage methods</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                </motion.div>

                {/* Transaction History Mini */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                                <History className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium">History</h4>
                                <p className="text-xs text-muted-foreground">View statements</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
