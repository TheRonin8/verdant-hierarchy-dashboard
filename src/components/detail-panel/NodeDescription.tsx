
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NodeDescriptionProps {
  description: string;
}

const NodeDescription: React.FC<NodeDescriptionProps> = ({ description }) => {
  if (!description) {
    return null;
  }

  return (
    <Card className="mb-6 backdrop-blur-panel border-green-100/50 dark:border-green-900/30 hover:shadow-md hover:shadow-green-100/20 dark:hover:shadow-green-900/10 transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default NodeDescription;
