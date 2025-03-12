
import React, { useState, useEffect } from 'react';
import TreeNavigation from '@/components/TreeNavigation';
import DetailPanel from '@/components/DetailPanel';
import BreadcrumbTrail from '@/components/BreadcrumbTrail';
import { treeData, TreeNodeData } from '@/utils/treeData';
import { Menu, X } from 'lucide-react';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<TreeNodeData | null>(treeData);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to find a node by ID in the tree
  const findNodeById = (id: string, node: TreeNodeData = treeData): TreeNodeData | null => {
    if (node.id === id) return node;
    
    if (node.children) {
      for (const child of node.children) {
        const result = findNodeById(id, child);
        if (result) return result;
      }
    }
    
    return null;
  };

  const handleNodeSelect = (node: TreeNodeData) => {
    setSelectedNode(node);
    setMobileMenuOpen(false); // Close mobile menu when a node is selected
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = (node: TreeNodeData) => {
    // Find the current node data based on ID
    const currentNode = findNodeById(node.id);
    if (currentNode) {
      setSelectedNode(currentNode);
    }
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col">
      <header className="h-14 border-b border-border flex items-center px-6 backdrop-blur-panel">
        <h1 className="text-xl font-semibold">Plant Monitoring System</h1>
        
        {/* Mobile menu toggle */}
        <button 
          className="ml-auto md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar for tree navigation - hidden on mobile unless toggled */}
        <aside 
          className={`${mobileMenuOpen ? 'absolute inset-0 z-40 bg-background' : 'hidden'} md:relative md:block md:w-72 border-r border-border overflow-hidden flex-col animate-fade-in`}
        >
          <TreeNavigation 
            treeData={treeData} 
            selectedNode={selectedNode} 
            onNodeSelect={handleNodeSelect} 
          />
        </aside>
        
        <section className="flex-1 overflow-hidden flex flex-col">
          {/* Breadcrumb navigation */}
          <div className="border-b border-border px-4 py-2">
            <BreadcrumbTrail 
              node={selectedNode} 
              onNavigate={handleBreadcrumbNavigate} 
            />
          </div>
          
          {/* Detail panel */}
          <div className="flex-1 overflow-hidden">
            <DetailPanel selectedNode={selectedNode} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
