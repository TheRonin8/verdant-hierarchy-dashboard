
import React from 'react';
import { TreeNodeData } from '@/utils/treeData';
import TreeNode from './TreeNode';
import { Search } from 'lucide-react';

interface TreeNavigationProps {
  treeData: TreeNodeData;
  selectedNode: TreeNodeData | null;
  onNodeSelect: (node: TreeNodeData) => void;
}

const TreeNavigation: React.FC<TreeNavigationProps> = ({ 
  treeData, 
  selectedNode, 
  onNodeSelect 
}) => {
  return (
    <div className="w-full h-full flex flex-col border-r border-border bg-card">
      <div className="p-3 border-b border-border">
        <div className="relative rounded-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 py-2 bg-secondary/50 border-none focus:ring-1 focus:ring-primary/30 focus:outline-none rounded-md w-full text-sm"
          />
        </div>
      </div>
      <div className="p-2 flex-1 overflow-y-auto">
        <TreeNode
          node={treeData}
          depth={0}
          selectedNode={selectedNode}
          onSelect={onNodeSelect}
          isOpen={true}
        />
      </div>
    </div>
  );
};

export default TreeNavigation;
