import { MousePointer2, GitBranch, BoxSelect, Maximize2, Plus, Move } from 'lucide-react';

const shortcuts = [
  { icon: Plus, label: 'New node', description: 'Double-click on canvas or press + button' },
  { icon: Move, label: 'Pan canvas', description: 'Click & drag on empty canvas' },
  { icon: MousePointer2, label: 'Select text', description: 'Highlight text in a conversation, then copy or click Branch to explore' },
  { icon: GitBranch, label: 'Branch from text', description: 'Select text → click Branch button → type a prompt or click Explore' },
  { icon: BoxSelect, label: 'Multi-select nodes', description: 'Hold Shift + drag to draw a selection rectangle around 2+ nodes' },
  { icon: GitBranch, label: 'Merge nodes', description: 'Multi-select 2+ nodes → type an action like "Compare these" in the popup' },
  { icon: Maximize2, label: 'Maximize node', description: 'Click the maximize button on a node header to fill the viewport' },
];

const tips = [
  'Esc closes any open popup',
  'Merged nodes receive context from all selected parents',
  'Follow-up messages in branch/merge nodes retain parent context',
];

export function HelpGuidePanel() {
  return (
    <div className="absolute top-4 left-16 z-40 w-80 rounded-xl border border-neutral-700/50 bg-surface-900 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-700/50">
        <h3 className="text-sm font-semibold text-neutral-200">Quick Guide</h3>
      </div>

      <div className="p-3 space-y-2">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex gap-2.5">
            <div className="shrink-0 mt-0.5">
              <s.icon size={14} className="text-accent-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-neutral-200">{s.label}</div>
              <div className="text-[11px] text-neutral-500 leading-snug">{s.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-neutral-700/50 bg-neutral-800/30">
        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Tips</div>
        <ul className="space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-[11px] text-neutral-500 leading-snug flex gap-1.5">
              <span className="text-accent-500 shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
