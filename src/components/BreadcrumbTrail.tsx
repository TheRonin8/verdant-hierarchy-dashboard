
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TreeNodeData } from '@/utils/treeData';
import { getNodeTextColor } from '@/utils/nodeStyleUtils';

interface BreadcrumbTrailProps {
  node: TreeNodeData | null;
  onNavigate: (node: TreeNodeData) => void;
}

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
        <span className={`font-medium ${getNodeTextColor(node.type)}`}>{node.name}</span>
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
            className={`cursor-pointer transition-colors ${getNodeTextColor(item.type)} hover:opacity-80`}
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
