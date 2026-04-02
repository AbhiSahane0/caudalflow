import { ChevronDown, ChevronRight, Minus, Maximize2, X, Palette } from 'lucide-react';

interface ChatNodeHeaderProps {
  topic: string;
  collapsed: boolean;
  maximized: boolean;
  onToggleCollapse: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onTogglePalette:() => void
  color?:string
  label?:string
}

export function ChatNodeHeader({
  topic,
  collapsed,
  maximized,
  onToggleCollapse,
  onMinimize,
  onMaximize,
  onClose,
  onTogglePalette,
  color,
  label
}: ChatNodeHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-700/50 bg-neutral-800/30 rounded-t-xl cursor-grab active:cursor-grabbing">
      <button
        onClick={onToggleCollapse}
        className="nodrag text-neutral-400 hover:text-neutral-200 transition-colors"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full truncate">
            {topic}
          </span>

          {label && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: color ? `${color}20` : "bg-neutral-800",
                color: color ? color : "text-neutral-400",
              }}
            >
              {label}
            </span>
          )}
      </div>
      </div>
      <button
        onClick={onMinimize}
        className="nodrag text-neutral-500 hover:text-amber-400 transition-colors"
        title="Minimize"
      >
        <Minus size={14} />
      </button>
      <button
        onClick={onMaximize}
        className={`nodrag transition-colors ${
          maximized
            ? 'text-accent-400 hover:text-accent-300'
            : 'text-neutral-500 hover:text-neutral-200'
        }`}
        title={maximized ? 'Restore size' : 'Maximize'}
      >
        <Maximize2 size={14} />
      </button>
      <button
        onClick={onTogglePalette}
        className="nodrag transition-colors text-neutral-500 hover:text-neutral-200"
        title="Add label and color"
        >
        <Palette size={14} />
      </button>
      <button
        onClick={onClose}
        className="nodrag text-neutral-500 hover:text-red-400 transition-colors"
        title="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}
