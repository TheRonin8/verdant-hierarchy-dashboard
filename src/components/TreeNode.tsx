
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database } from 'lucide-react';
import { TreeNodeData } from '@/utils/treeData';
import { cn } from '@/lib/utils';
import { getNodeIcon } from '@/utils/nodeStyleUtils';

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  selectedNode: TreeNodeData | null;
  onSelect: (node: TreeNodeData) => void;
  isOpen?: boolean;
}

const getNodeColor = (type: string) => {
  switch (type) {
    case 'company':
      return 'text-blue-600 dark:text-blue-400';
    case 'location':
      return 'text-indigo-600 dark:text-indigo-400';
    case 'building':
      return 'text-purple-600 dark:text-purple-400';
    case 'sensor':
      return 'text-green-600 dark:text-green-400';
    case 'dashboard':
      return 'text-orange-600 dark:text-orange-400';
    case 'planthead':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'data':
      return 'text-cyan-600 dark:text-cyan-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  depth, 
  selectedNode, 
  onSelect, 
  isOpen: initialIsOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen || depth === 0);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode?.id === node.id;
  const nodeColor = getNodeColor(node.type);
  const NodeIcon = getNodeIcon(node.type);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleSelect = () => {
    onSelect(node);
  };

  const statusIndicator = node.details?.status ? (
    <span 
      className={cn(
        "inline-block h-2 w-2 rounded-full ml-2",
        node.details.status === 'online' ? "bg-green-500" : 
        node.details.status === 'warning' ? "bg-yellow-500" : 
        "bg-red-500"
      )}
    />
  ) : null;

  return (
    <div className="animate-in">
      <div 
        className={cn(
          "flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200",
          "hover:bg-primary/10 hover:translate-x-1",
          isSelected ? `bg-${nodeColor.split('-')[1]}-50/30 dark:bg-${nodeColor.split('-')[1]}-900/20 ${nodeColor} font-medium` : "",
          depth === 0 ? "font-medium text-base" : "text-sm"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <span 
            className="mr-1 flex items-center justify-center w-5 h-5 hover:bg-background/80 rounded-sm transition-colors"
            onClick={handleToggle}
          >
            {isOpen ? 
              <ChevronDown className={`h-4 w-4 ${nodeColor} animate-fade-in`} /> : 
              <ChevronRight className={`h-4 w-4 ${nodeColor} animate-fade-in`} />
            }
          </span>
        ) : (
          <span className="w-5 h-5" />
        )}
        <span className={`mr-2 flex items-center justify-center ${nodeColor}`}>
          <NodeIcon className="h-4 w-4" />
        </span>
        <span className="truncate">{node.name}</span>
        {statusIndicator}
      </div>
      
      {isOpen && hasChildren && (
        <div className="transition-all duration-300 ease-in-out animate-fade-in">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNode={selectedNode}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
