import React from 'react';

interface WorkspaceLayoutProps {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
    bottom: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
    left,
    center,
    right,
    bottom,
}) => {
    return (
        <div className="h-full flex flex-col">
            {/* Top: Three-column layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Requirements */}
                <div className="w-80 border-r border-[rgb(var(--color-border))] overflow-auto">
                    {left}
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 relative">{center}</div>

                {/* Right Panel - Configuration */}
                <div className="w-80 border-l border-[rgb(var(--color-border))] overflow-auto">
                    {right}
                </div>
            </div>

            {/* Bottom - Feedback */}
            <div className="h-64 border-t border-[rgb(var(--color-border))] overflow-auto">
                {bottom}
            </div>
        </div>
    );
};
