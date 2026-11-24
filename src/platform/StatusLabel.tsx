import React from 'react';
import {
  Check,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  Archive,
  PauseCircle,
} from 'lucide-react';

export type StatusTone = 'success' | 'accent' | 'warning' | 'danger' | 'neutral';

interface StatusLabelProps {
  label: string;
  tone?: StatusTone;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  success: 'text-[#166534]',
  accent: 'text-[#9E4A28]',
  warning: 'text-[#92400E]',
  danger: 'text-[#991B1B]',
  neutral: 'text-[#5C5B57]',
};

/**
 * Editorial unboxed status indicator (Zero-pill discipline: text + subtle semantic icon, never rounded pill badges).
 */
export const StatusLabel: React.FC<StatusLabelProps> = ({ label, tone = 'neutral' }) => {
  const Icon =
    tone === 'success'
      ? Check
      : tone === 'warning'
        ? Clock
        : tone === 'danger'
          ? AlertCircle
          : tone === 'accent'
            ? Eye
            : label.toLowerCase().includes('archiv')
              ? Archive
              : label.toLowerCase().includes('paus')
                ? PauseCircle
                : FileText;

  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold whitespace-nowrap ${TONE_CLASSES[tone]}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
