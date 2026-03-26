import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
} from '@xyflow/react';
import type { TopicEdgeData } from '../../types/flow';

export function TopicEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<TopicEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const label = data?.label ?? '';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#818cf8' : '#404040',
          strokeWidth: selected ? 2 : 1.5,
          transition: 'stroke 0.2s',
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-all px-2 py-0.5 text-[10px] rounded-full border bg-surface-800 border-neutral-700 text-neutral-400 truncate max-w-[150px] hover:max-w-[300px] hover:text-neutral-200 transition-all"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
