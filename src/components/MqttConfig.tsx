
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MqttConfigProps {
  onConnect: (config: {
    host: string;
    port: number;
    clientId: string;
    username?: string;
    password?: string;
  }) => void;
}

const MqttConfig: React.FC<MqttConfigProps> = ({ onConnect }) => {
  const [config, setConfig] = useState({
    host: 'localhost',
    port: 8083,
    clientId: `client-${Math.random().toString(16).slice(2)}`,
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(config);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>MQTT Configuration</CardTitle>
        <CardDescription>Enter your MQTT broker details to connect</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="host">Broker Host</Label>
            <Input
              id="host"
              value={config.host}
              onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
              placeholder="e.g., localhost or broker.hivemq.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">WebSocket Port</Label>
            <Input
              id="port"
              type="number"
              value={config.port}
              onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
              placeholder="e.g., 8083"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username (optional)</Label>
            <Input
              id="username"
              value={config.username}
              onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password (optional)</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Password"
            />
          </div>

          <Button type="submit" className="w-full">
            Connect to Broker
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MqttConfig;
