
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TreeNodeData } from '@/utils/treeData';

interface BreadcrumbTrailProps {
  node: TreeNodeData | null;
  onNavigate: (node: TreeNodeData) => void;
}

const getNodeColor = (type: string) => {
  switch (type) {
    case 'company':
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300';
    case 'location':
      return 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300';
    case 'building':
      return 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300';
    case 'sensor':
      return 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300';
    case 'dashboard':
      return 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300';
    case 'planthead':
      return 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300';
    default:
      return 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300';
  }
};

const findPathToNode = (
  root: TreeNodeData,
  targetId: string,
  currentPath: TreeNodeData[] = []
): TreeNodeData[] | null => {
  const newPath = [...currentPath, root];
  
  if (root.id === targetId) {
    return newPath;
  }
  
  if (root.children) {
    for (const child of root.children) {
      const path = findPathToNode(child, targetId, newPath);
      if (path) return path;
    }
  }
  
  return null;
};

const BreadcrumbTrail: React.FC<BreadcrumbTrailProps> = ({ node, onNavigate }) => {
  if (!node) return null;
  
  // For root node, just show the name
  if (!node.id.includes('-') || node.type === 'company') {
    return (
      <div className="flex items-center text-sm">
        <span className={`font-medium ${getNodeColor(node.type)}`}>{node.name}</span>
      </div>
    );
  }
  
  // Find path from root to current node
  const rootNodeId = 'company-1'; // Assuming this is the ID of the root node
  const rootNode = { id: rootNodeId, name: 'EcoTech Solutions', type: 'company' } as TreeNodeData;
  const path = findPathToNode(rootNode, node.id);
  
  if (!path) return null;
  
  return (
    <div className="flex items-center flex-wrap text-sm animate-fade-in py-1">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <span 
            className={`cursor-pointer transition-colors ${getNodeColor(item.type)}`}
            onClick={() => onNavigate(item)}
          >
            {item.name}
          </span>
          {index < path.length - 1 && (
            <ChevronRight className="mx-1 h-3 w-3 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbTrail;
