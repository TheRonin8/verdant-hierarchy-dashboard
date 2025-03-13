
import React from 'react';
import { TreeNodeData } from '@/utils/treeData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getNodeIcon, getTypeLabel, getNodeTextColor, getNodeBgColor } from '@/utils/nodeStyleUtils';

interface ChildNodesProps {
  node: TreeNodeData;
}

const ChildNodes: React.FC<ChildNodesProps> = ({ node }) => {
  if (!node.children || node.children.length === 0) {
    return null;
  }

  const typeLabel = getTypeLabel(node.type);

  return (
    <Card className="backdrop-blur-panel border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-md hover:shadow-indigo-100/20 dark:hover:shadow-indigo-900/10 transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {node.children.length} {node.children.length === 1 ? 'Child' : 'Children'}
        </CardTitle>
        <CardDescription>Items contained within this {typeLabel.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {node.children.map((child) => {
            const ChildIcon = getNodeIcon(child.type);
            const childTextColor = getNodeTextColor(child.type);
            const childBgColor = getNodeBgColor(child.type);
            
            return (
              <div 
                key={child.id} 
                className={`flex items-center space-x-2 p-3 rounded-md bg-gradient-to-r ${childBgColor} hover:translate-x-1 cursor-pointer transition-all duration-200`}
              >
                <div className={childTextColor}>
                  <ChildIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">{child.name}</div>
                  <div className={`text-xs ${childTextColor}`}>{getTypeLabel(child.type)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildNodes;
