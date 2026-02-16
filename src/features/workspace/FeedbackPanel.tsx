
import React, { useState } from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Sparkles,
    ShieldAlert,
    Lightbulb,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { Panel } from '../../components/Panel';
import { useAppStore } from '../../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Simple Circular Progress Component
const CircularProgress = ({ score, size = 120, strokeWidth = 8, color = "text-emerald-500" }: { score: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-bold ${color}`}>{score}</span>
                <span className="text-xs text-gray-500 uppercase font-semibold">Score</span>
            </div>
        </div>
    );
};


// Collapsible Section Component with Premium Styling
const FeedbackSection = ({
    title,
    count,
    icon,
    children,
    defaultOpen = false,
    colorClass
}: {
    title: string;
    count: number;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    colorClass: string;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (count === 0) return null;

    return (
        <div className="group rounded-2xl bg-[rgb(var(--color-bg))] overflow-hidden transition-all duration-300 hover:shadow-lg border border-[rgb(var(--color-border))] hover:border-violet-500/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-transparent via-transparent to-transparent hover:from-[rgb(var(--color-bg-secondary))] transition-all duration-300"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-xl shadow-inner", colorClass.replace('text-', 'bg-').replace('500', '500/10'), "group-hover:scale-110 transition-transform duration-300")}>
                        <div className={cn(colorClass, "drop-shadow-sm")}>{icon}</div>
                    </div>
                    <span className="font-bold text-base text-[rgb(var(--color-text-primary))] tracking-tight">{title}</span>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm", colorClass.replace('text-', 'bg-').replace('500', '500/10'), colorClass)}>
                        {count}
                    </span>
                </div>
                <div className={cn("p-1 rounded-full bg-[rgb(var(--color-bg-secondary))] transition-all duration-300 group-hover:bg-[rgb(var(--color-border))]", isOpen ? "rotate-180" : "")}>
                    <ChevronDown className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                </div>
            </button>

            <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="p-4 pt-0 space-y-3">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgb(var(--color-border))] to-transparent mb-4 opacity-50" />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FeedbackPanel: React.FC = () => {
    const { feedback } = useAppStore();

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getGrade = (score: number) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Excellent Architecture';
        if (score >= 80) return 'Very Good Design';
        if (score >= 70) return 'Good Start';
        if (score >= 60) return 'Needs Refinement';
        return 'Requires Attention';
    };

    const scoreColor = feedback ? getScoreColor(feedback.score) : 'text-gray-400';

    return (
        <div className="h-full bg-[rgb(var(--color-surface))] flex flex-col w-full relative">
            <Panel
                title="AI Architecture Review"
                headerAction={
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 shadow-sm backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 uppercase tracking-wider">Gemini 2.0 Pro</span>
                    </div>
                }
            >
                {!feedback ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 rounded-full animate-pulse" />
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-card))] to-[rgb(var(--color-bg))] flex items-center justify-center border border-white/10 shadow-2xl relative z-10 backdrop-blur-xl">
                                <Sparkles className="w-10 h-10 text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-xs mx-auto">
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-text-primary))] to-[rgb(var(--color-text-secondary))]">
                                Ready to Evaluate
                            </h3>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                Complete your system design and click <span className="font-semibold text-violet-500">Evaluate Design</span> to get instant, AI-powered architectural feedback.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 p-1 overflow-y-auto h-full custom-scrollbar content-start pb-10">
                        {/* Summary Card with Glassmorphism */}
                        <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-fuchsia-500/20 shadow-xl">
                            <div className="absolute inset-0 backdrop-blur-3xl bg-white/5 dark:bg-black/20" />

                            <div className="relative bg-[rgb(var(--color-card))]/80 dark:bg-[rgb(var(--color-card))]/40 rounded-[1.3rem] p-6 border border-white/10 flex items-center gap-8 backdrop-blur-md">
                                {/* Decorative elements */}
                                <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl", scoreColor.replace('text-', 'bg-'))} />
                                <div className={cn("absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-20 blur-3xl delay-75", scoreColor.replace('text-', 'bg-'))} />

                                <div className="relative group cursor-default">
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                    <CircularProgress score={feedback.score} color={scoreColor} size={130} strokeWidth={10} />
                                </div>

                                <div className="flex-1 z-10 space-y-2">
                                    <div className="inline-flex flex-col items-start">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--color-text-tertiary))] mb-1">Overall Rating</span>
                                        <div className="flex items-baseline gap-3">
                                            <h2 className="text-4xl font-black text-[rgb(var(--color-text-primary))] drop-shadow-sm">
                                                Grade {getGrade(feedback.score)}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-gradient-to-r from-[rgb(var(--color-border))] to-transparent" />

                                    <div>
                                        <p className={cn("font-bold text-lg", scoreColor)}>
                                            {getScoreLabel(feedback.score)}
                                        </p>
                                        <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1 font-medium">
                                            Architecture analysis complete based on scalability, reliability, and best practices.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Sections with Premium Style */}
                        <div className="space-y-4 px-1">
                            {/* Critical Issues */}
                            <FeedbackSection
                                title="Critical Issues"
                                count={feedback.errors?.length || 0}
                                icon={<XCircle className="w-6 h-6" />}
                                colorClass="text-rose-500"
                                defaultOpen={true}
                            >
                                {feedback.errors?.map((error, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/10 flex gap-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                                        <div className="mt-0.5 p-1.5 bg-rose-500/10 rounded-full h-fit">
                                            <ShieldAlert className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <div className="text-sm font-medium text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                            {error}
                                        </div>
                                    </div>
                                ))}
                            </FeedbackSection>

                            {/* Warnings */}
                            <FeedbackSection
                                title="Warnings"
                                count={feedback.warnings?.length || 0}
                                icon={<AlertTriangle className="w-6 h-6" />}
                                colorClass="text-amber-500"
                            >
                                {feedback.warnings?.map((warning, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/10 flex gap-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                                        <div className="mt-0.5 p-1.5 bg-amber-500/10 rounded-full h-fit">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="text-sm font-medium text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                            {warning}
                                        </div>
                                    </div>
                                ))}
                            </FeedbackSection>

                            {/* Key Strengths */}
                            <FeedbackSection
                                title="Key Strengths"
                                count={feedback.strengths?.length || 0}
                                icon={<CheckCircle2 className="w-6 h-6" />}
                                colorClass="text-emerald-500"
                            >
                                {feedback.strengths?.map((strength, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10 flex gap-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                                        <div className="mt-0.5 p-1.5 bg-emerald-500/10 rounded-full h-fit">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="text-sm font-medium text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                            {strength}
                                        </div>
                                    </div>
                                ))}
                            </FeedbackSection>

                            {/* Optimization Tips */}
                            <FeedbackSection
                                title="Optimization Tips"
                                count={feedback.suggestions?.length || 0}
                                icon={<Lightbulb className="w-6 h-6" />}
                                colorClass="text-violet-500"
                            >
                                {feedback.suggestions?.map((suggestion, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/10 flex gap-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                                        <div className="mt-0.5 p-1.5 bg-violet-500/10 rounded-full h-fit">
                                            <Lightbulb className="w-4 h-4 text-violet-500" />
                                        </div>
                                        <div className="text-sm font-medium text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                            {suggestion}
                                        </div>
                                    </div>
                                ))}
                            </FeedbackSection>
                        </div>
                    </div>
                )}
            </Panel>
        </div>
    );
};
