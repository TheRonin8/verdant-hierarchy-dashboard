
import React from 'react';
import { TreeNodeData } from '@/utils/treeData';
import { getNodeIcon, getTypeLabel, getNodeBgColor, getNodeTextColor } from '@/utils/nodeStyleUtils';
import StatusBadge from './StatusBadge';

interface NodeHeaderProps {
  node: TreeNodeData;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({ node }) => {
  const { name, type, details } = node;
  const Icon = getNodeIcon(type);
  const typeLabel = getTypeLabel(type);
  const bgGradient = getNodeBgColor(type);
  const textColor = getNodeTextColor(type);

  return (
    <div className={`flex items-center space-x-3 mb-6 animate-fade-in p-4 rounded-lg bg-gradient-to-r ${bgGradient}`}>
      <div className={`rounded-full bg-white/80 dark:bg-gray-800/80 p-2 ${textColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          {name}
          {details?.status && <StatusBadge status={details.status} />}
        </h1>
        <p className={`text-sm ${textColor}`}>{typeLabel}</p>
      </div>
    </div>
  );
};

export default NodeHeader;
