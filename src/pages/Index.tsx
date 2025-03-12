
import React, { useState } from 'react';
import TreeNavigation from '@/components/TreeNavigation';
import DetailPanel from '@/components/DetailPanel';
import { treeData, TreeNodeData } from '@/utils/treeData';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<TreeNodeData | null>(treeData);

  const handleNodeSelect = (node: TreeNodeData) => {
    setSelectedNode(node);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <header className="h-14 border-b border-border flex items-center px-6 backdrop-blur-panel">
        <h1 className="text-xl font-semibold">Plant Monitoring System</h1>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 border-r border-border overflow-hidden flex flex-col">
          <TreeNavigation 
            treeData={treeData} 
            selectedNode={selectedNode} 
            onNodeSelect={handleNodeSelect} 
          />
        </aside>
        
        <section className="flex-1 overflow-hidden flex flex-col">
          <DetailPanel selectedNode={selectedNode} />
        </section>
      </main>
    </div>
  );
};

export default Index;
