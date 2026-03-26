import type { ChatNode } from '../types/flow';

const NODE_WIDTH = 400;
const HORIZONTAL_GAP = 100;
const VERTICAL_GAP = 40;
const NODE_HEIGHT = 500;

export function calculateMergePosition(
  parentNodes: ChatNode[]
): { x: number; y: number } {
  if (parentNodes.length === 0) return { x: 0, y: 0 };

  let maxRight = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const node of parentNodes) {
    const width = (node.style?.width as number) ?? NODE_WIDTH;
    const height = (node.style?.height as number) ?? NODE_HEIGHT;
    const right = node.position.x + width;
    if (right > maxRight) maxRight = right;
    if (node.position.y < minY) minY = node.position.y;
    if (node.position.y + height > maxY) maxY = node.position.y + height;
  }

  const x = maxRight + HORIZONTAL_GAP;
  const y = (minY + maxY) / 2 - NODE_HEIGHT / 2;

  return { x, y };
}

export function calculateBranchPosition(
  parentNode: ChatNode,
  existingChildCount: number
): { x: number; y: number } {
  const parentX = parentNode.position.x;
  const parentY = parentNode.position.y;
  const parentWidth =
    (parentNode.style?.width as number) ?? NODE_WIDTH;

  const x = parentX + parentWidth + HORIZONTAL_GAP;
  const y =
    parentY + existingChildCount * (NODE_HEIGHT + VERTICAL_GAP);

  return { x, y };
}
