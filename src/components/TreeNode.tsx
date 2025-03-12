
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building, Globe, Cpu, LayoutDashboard, Flower2, Database, Building2 } from 'lucide-react';
import { TreeNodeData } from '@/utils/treeData';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  selectedNode: TreeNodeData | null;
  onSelect: (node: TreeNodeData) => void;
  isOpen?: boolean;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'company':
      return <Building2 className="h-4 w-4" />;
    case 'location':
      return <Globe className="h-4 w-4" />;
    case 'building':
      return <Building className="h-4 w-4" />;
    case 'sensor':
      return <Cpu className="h-4 w-4" />;
    case 'dashboard':
      return <LayoutDashboard className="h-4 w-4" />;
    case 'planthead':
      return <Flower2 className="h-4 w-4" />;
    case 'data':
      return <Database className="h-4 w-4" />;
    default:
      return <Database className="h-4 w-4" />;
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
          "hover:bg-primary/5",
          isSelected ? "tree-node-active" : "",
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
              <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            }
          </span>
        ) : (
          <span className="w-5 h-5" />
        )}
        <span className="mr-2 flex items-center justify-center text-muted-foreground">
          {getNodeIcon(node.type)}
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
