
import React, { useState, useEffect } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<TreeNodeData | null>(treeData);

  // Search function that recursively filters the tree
  const filterTree = (node: TreeNodeData, query: string): TreeNodeData | null => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const filteredChildren = node.children
        .map(child => filterTree(child, query))
        .filter(Boolean) as TreeNodeData[];

      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }
    }

    return null;
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(treeData);
    } else {
      const filtered = filterTree(treeData, searchQuery);
      setFilteredData(filtered);
    }
  }, [searchQuery, treeData]);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 bg-secondary/50 border-none focus:ring-1 focus:ring-primary/30 focus:outline-none rounded-md w-full text-sm transition-all duration-200 hover:bg-secondary/80"
          />
        </div>
      </div>
      <div className="p-2 flex-1 overflow-y-auto">
        {filteredData ? (
          <TreeNode
            node={filteredData}
            depth={0}
            selectedNode={selectedNode}
            onSelect={onNodeSelect}
            isOpen={true}
          />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeNavigation;
