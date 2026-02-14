import React from 'react';
import { cn } from '../utils/cn';

interface PanelProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    headerAction?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ children, title, className, headerAction }) => {
    return (
        <div className={cn('panel transition-theme', className)}>
            {title && (
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border))]">
                    <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{title}</h3>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
};
