import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/canvas/Canvas';
import { usePersistence } from './hooks/usePersistence';

function AppInner() {
  usePersistence();

  return <Canvas />;
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
