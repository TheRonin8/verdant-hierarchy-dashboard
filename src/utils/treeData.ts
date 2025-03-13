
export interface TreeNodeData {
  id: string;
  name: string;
  type: 'company' | 'location' | 'building' | 'sensor' | 'dashboard' | 'planthead' | 'data';
  children?: TreeNodeData[];
  mqttTopic?: string;
  details?: {
    status?: 'online' | 'offline' | 'warning';
    lastActive?: string;
    metrics?: Record<string, number | string>;
    description?: string;
    image?: string;
  };
}

export const treeData: TreeNodeData = {
  id: 'company-1',
  name: 'CLS Behring',
  type: 'company',
  mqttTopic: 'CLS_Behring',
  details: {
    description: 'Global leader in plant monitoring and environmental solutions.',
    metrics: {
      'Total Locations': 2,
      'Total Buildings': 4,
      'Total Sensors': 12,
    }
  },
  children: [
    {
      id: 'location-1',
      name: 'Kan',
      type: 'location',
      mqttTopic: 'CLS_Behring/Kan',
      details: {
        description: 'Kan location operations hub.',
        metrics: {
          'Buildings': 3,
          'Sensors': 9,
        }
      },
      children: [
        {
          id: 'building-1',
          name: 'B16NORTH',
          type: 'building',
          mqttTopic: 'CLS_Behring/Kan/B16NORTH',
          details: {
            description: 'B16NORTH Building',
            metrics: {
              'Sensors': 3,
              'Area': '12,500 sq.ft.',
            }
          },
          children: [
            {
              id: 'dashboard-1',
              name: 'Dashboard',
              type: 'dashboard',
              mqttTopic: 'CLS_Behring/Kan/B16NORTH/Dashboard',
              details: {
                description: 'Real-time monitoring dashboard for B16NORTH',
                metrics: {}
              }
            },
            {
              id: 'planthead-1',
              name: 'Plant Head',
              type: 'planthead',
              mqttTopic: 'CLS_Behring/Kan/B16NORTH/PLANT_HEAD',
              details: {
                description: 'Plant head information',
                metrics: {}
              }
            },
            {
              id: 'sensor-1',
              name: 'Vibration Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/Kan/B16NORTH/VIBRATION',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Vibration sensors data',
                metrics: {}
              }
            },
            {
              id: 'sensor-2',
              name: 'Current Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/Kan/B16NORTH/CURRENT',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Current sensors data',
                metrics: {}
              }
            }
          ]
        },
        {
          id: 'building-2',
          name: 'B16SOUTH',
          type: 'building',
          mqttTopic: 'CLS_Behring/Kan/B16SOUTH',
          details: {
            description: 'B16SOUTH Building',
            metrics: {
              'Sensors': 3,
              'Area': '15,200 sq.ft.',
            }
          },
          children: [
            {
              id: 'dashboard-2',
              name: 'Dashboard',
              type: 'dashboard',
              mqttTopic: 'CLS_Behring/Kan/B16SOUTH/Dashboard',
              details: {
                description: 'Real-time monitoring dashboard for B16SOUTH',
                metrics: {}
              }
            },
            {
              id: 'planthead-2',
              name: 'Plant Head',
              type: 'planthead',
              mqttTopic: 'CLS_Behring/Kan/B16SOUTH/PLANT_HEAD',
              details: {
                description: 'Plant head information',
                metrics: {}
              }
            },
            {
              id: 'sensor-3',
              name: 'Vibration Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/Kan/B16SOUTH/VIBRATION',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Vibration sensors data',
                metrics: {}
              }
            },
            {
              id: 'sensor-4',
              name: 'Current Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/Kan/B16SOUTH/CURRENT',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Current sensors data',
                metrics: {}
              }
            }
          ]
        },
        {
          id: 'building-3',
          name: 'B32',
          type: 'building',
          mqttTopic: 'CLS_Behring/Kan/B32',
          details: {
            description: 'B32 Building',
            metrics: {
              'Sensors': 3,
              'Area': '18,700 sq.ft.',
            }
          },
          children: [
            {
              id: 'dashboard-3',
              name: 'Dashboard',
              type: 'dashboard',
              mqttTopic: 'CLS_Behring/Kan/B32/Dashboard',
              details: {
                description: 'Real-time monitoring dashboard for B32',
                metrics: {}
              }
            },
            {
              id: 'planthead-3',
              name: 'Plant Head',
              type: 'planthead',
              mqttTopic: 'CLS_Behring/Kan/B32/PLANT_HEAD',
              details: {
                description: 'Plant head information',
                metrics: {}
              }
            },
            {
              id: 'sensor-5',
              name: 'Vibration Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/Kan/B32/VIBRATION',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Vibration sensors data',
                metrics: {}
              }
            },
            {
              id: 'sensor-6',
              name: 'Current Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/Kan/B32/CURRENT',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Current sensors data',
                metrics: {}
              }
            }
          ]
        }
      ]
    },
    {
      id: 'location-2',
      name: 'MBR',
      type: 'location',
      mqttTopic: 'CLS_Behring/MBR',
      details: {
        description: 'MBR operations and research center.',
        metrics: {
          'Buildings': 1,
          'Sensors': 4,
        }
      },
      children: [
        {
          id: 'building-4',
          name: 'H67',
          type: 'building',
          mqttTopic: 'CLS_Behring/MBR/H67',
          details: {
            description: 'H67 Research Facility',
            metrics: {
              'Sensors': 4,
              'Area': '11,200 sq.ft.',
            }
          },
          children: [
            {
              id: 'dashboard-4',
              name: 'Dashboard',
              type: 'dashboard',
              mqttTopic: 'CLS_Behring/MBR/H67/Dashboard',
              details: {
                description: 'Real-time monitoring dashboard for H67',
                metrics: {}
              }
            },
            {
              id: 'planthead-4',
              name: 'Plant Head',
              type: 'planthead',
              mqttTopic: 'CLS_Behring/MBR/H67/PLANT_HEAD',
              details: {
                description: 'Plant head information',
                metrics: {}
              }
            },
            {
              id: 'sensor-7',
              name: 'Vibration Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/MBR/H67/VIBRATION',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Vibration sensors data',
                metrics: {}
              }
            },
            {
              id: 'sensor-8',
              name: 'Temperature Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/MBR/H67/TEMPERATURE',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Temperature sensors data',
                metrics: {}
              }
            },
            {
              id: 'sensor-9',
              name: 'Pressure Sensors',
              type: 'sensor',
              mqttTopic: 'CLS_Behring/MBR/H67/PRESSURE',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Pressure sensors data',
                metrics: {}
              }
            }
          ]
        }
      ]
    }
  ]
};
