
import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
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
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Connect to MQTT broker
  useEffect(() => {
    const { host, port, clientId, username, password, protocol = 'mqtt' } = config;
    const url = protocol === 'ws' ? `ws://${host}:${port}/mqtt` : `mqtt://${host}:${port}`;
    
    console.log(`Connecting to MQTT broker at ${url}`);
    
    const mqttClient = mqtt.connect(url, {
      clientId,
      username,
      password,
      protocol,
    });

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to MQTT broker');
      toast.success('Connected to MQTT broker');
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
          [topic]: {
            ...data,
            timestamp: Date.now()
          }
        }));
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
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
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
          toast.error(`Failed to subscribe to ${topic}`);
        } else {
          console.log(`Subscribed to ${topic}`);
          toast.success(`Subscribed to ${topic}`);
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
