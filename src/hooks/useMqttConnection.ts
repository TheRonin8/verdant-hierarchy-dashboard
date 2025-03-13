
import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient, IClientOptions, MqttProtocol } from 'mqtt';
import { toast } from "sonner";

interface MqttConfig {
  host: string;
  port: number;
  clientId: string;
  username?: string;
  password?: string;
  protocol?: string;
}

export const useMqttConnection = (config: MqttConfig) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Connect to MQTT broker
  useEffect(() => {
    const { host, port, clientId, username, password, protocol = 'mqtt' } = config;
    
    // Handle WebSocket protocol for HTTPS sites
    let websocketProtocol: 'ws' | 'wss' = 'ws';
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      websocketProtocol = 'wss';
    }
    
    // Determine the correct URL based on the provided protocol and environment
    let url: string;
    if (protocol === 'ws' || protocol === 'wss') {
      url = `${websocketProtocol}://${host}:${port}/mqtt`;
    } else {
      url = `${protocol}://${host}:${port}`;
    }
    
    console.log(`Connecting to MQTT broker at ${url}`);
    
    // Create proper MQTT client options with typed protocol
    const mqttProtocol = (protocol === 'ws' || protocol === 'wss') ? protocol as MqttProtocol : 'mqtt' as MqttProtocol;
    
    const mqttOptions: IClientOptions = {
      clientId,
      protocol: mqttProtocol,
    };
    
    // Add optional auth credentials if provided
    if (username) mqttOptions.username = username;
    if (password) mqttOptions.password = password;
    
    // Connect to the broker
    const mqttClient = mqtt.connect(url, mqttOptions);

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to MQTT broker');
      toast.success('Connected to broker');
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
      toast.error('Failed to connect to MQTT broker');
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Received message on topic ${topic}:`, data);
        setSensorData(prev => ({
          ...prev,
          [topic]: data
        }));
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
        // Try to display as plain text if not JSON
        setSensorData(prev => ({
          ...prev,
          [topic]: { value: message.toString() }
        }));
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, [config]);

  // Subscribe to topics
  const subscribe = useCallback((topic: string) => {
    if (client && isConnected) {
      console.log(`Subscribing to topic: ${topic}`);
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log(`Successfully subscribed to ${topic}`);
        }
      });
    }
  }, [client, isConnected]);

  // Unsubscribe from topics
  const unsubscribe = useCallback((topic: string) => {
    if (client && isConnected) {
      client.unsubscribe(topic);
      setSensorData(prev => {
        const newData = { ...prev };
        delete newData[topic];
        return newData;
      });
    }
  }, [client, isConnected]);

  return {
    isConnected,
    sensorData,
    subscribe,
    unsubscribe
  };
};
