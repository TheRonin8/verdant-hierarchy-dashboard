
export interface TreeNodeData {
  id: string;
  name: string;
  type: 'company' | 'location' | 'building' | 'sensor' | 'dashboard' | 'planthead' | 'data';
  children?: TreeNodeData[];
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
  name: 'EcoTech Solutions',
  type: 'company',
  details: {
    description: 'Global leader in plant monitoring and environmental solutions.',
    metrics: {
      'Total Locations': 4,
      'Total Buildings': 12,
      'Total Sensors': 248,
      'Plants Monitored': '1,450+',
      'Efficiency Rating': '94%',
    }
  },
  children: [
    {
      id: 'location-1',
      name: 'London',
      type: 'location',
      details: {
        description: 'London metropolitan area operations hub.',
        metrics: {
          'Buildings': 3,
          'Sensors': 86,
          'Plants Monitored': '420+',
          'Efficiency Rating': '92%',
        }
      },
      children: [
        {
          id: 'building-1',
          name: 'LDN-A12',
          type: 'building',
          details: {
            description: 'London Downtown Research Center',
            metrics: {
              'Sensors': 32,
              'Plants Monitored': '180+',
              'Efficiency Rating': '95%',
              'Area': '12,500 sq.ft.',
            }
          },
          children: [
            {
              id: 'dashboard-1',
              name: 'Operations Dashboard',
              type: 'dashboard',
              details: {
                description: 'Real-time monitoring dashboard for LDN-A12',
                metrics: {
                  'Uptime': '99.8%',
                  'Data Points': '128M+',
                  'Alerts (24h)': 2,
                }
              }
            },
            {
              id: 'sensor-1',
              name: 'Temperature Sensors',
              type: 'sensor',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Network of 12 temperature sensors located throughout the building',
                metrics: {
                  'Average Temp': '22.3°C',
                  'Min Temp': '20.1°C',
                  'Max Temp': '24.5°C',
                  'Alerts (24h)': 0,
                }
              }
            },
            {
              id: 'sensor-2',
              name: 'Humidity Sensors',
              type: 'sensor',
              details: {
                status: 'online',
                lastActive: 'Active now',
                description: 'Network of 10 humidity sensors located throughout the building',
                metrics: {
                  'Average Humidity': '45%',
                  'Min Humidity': '40%',
                  'Max Humidity': '52%',
                  'Alerts (24h)': 1,
                }
              }
            },
            {
              id: 'planthead-1',
              name: 'Plant Health Analysis',
              type: 'planthead',
              details: {
                description: 'Comprehensive plant health metrics and analysis',
                metrics: {
                  'Plants Monitored': 180,
                  'Health Score': '91/100',
                  'Growth Rate': '+3.2%/month',
                  'Intervention Needed': 4,
                }
              }
            }
          ]
        },
        {
          id: 'building-2',
          name: 'LDN-B45',
          type: 'building',
          details: {
            description: 'London East Production Facility',
            metrics: {
              'Sensors': 28,
              'Plants Monitored': '120+',
              'Efficiency Rating': '89%',
              'Area': '15,200 sq.ft.',
            }
          },
          children: [
            {
              id: 'dashboard-2',
              name: 'Operations Dashboard',
              type: 'dashboard',
              details: {
                description: 'Real-time monitoring dashboard for LDN-B45',
                metrics: {
                  'Uptime': '99.5%',
                  'Data Points': '98M+',
                  'Alerts (24h)': 5,
                }
              }
            },
            {
              id: 'sensor-3',
              name: 'Environment Sensors',
              type: 'sensor',
              details: {
                status: 'warning',
                lastActive: '2 minutes ago',
                description: 'Combined environment monitoring sensors',
                metrics: {
                  'Air Quality': '86/100',
                  'Light Levels': '72/100',
                  'CO2 Levels': '450ppm',
                  'Alerts (24h)': 2,
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'location-2',
      name: 'New York',
      type: 'location',
      details: {
        description: 'New York operations and research center.',
        metrics: {
          'Buildings': 4,
          'Sensors': 92,
          'Plants Monitored': '520+',
          'Efficiency Rating': '96%',
        }
      },
      children: [
        {
          id: 'building-3',
          name: 'NYC-H27',
          type: 'building',
          details: {
            description: 'Manhattan Research Headquarters',
            metrics: {
              'Sensors': 45,
              'Plants Monitored': '350+',
              'Efficiency Rating': '97%',
              'Area': '18,700 sq.ft.',
            }
          },
          children: []
        }
      ]
    },
    {
      id: 'location-3',
      name: 'Paris',
      type: 'location',
      details: {
        description: 'European operations headquarters located in Paris.',
        metrics: {
          'Buildings': 3,
          'Sensors': 42,
          'Plants Monitored': '310+',
          'Efficiency Rating': '93%',
        }
      },
      children: [
        {
          id: 'building-4',
          name: 'PAR-C09',
          type: 'building',
          details: {
            description: 'Central Paris Research Laboratory',
            metrics: {
              'Sensors': 25,
              'Plants Monitored': '210+',
              'Efficiency Rating': '94%',
              'Area': '11,200 sq.ft.',
            }
          },
          children: []
        }
      ]
    },
    {
      id: 'location-4',
      name: 'Oslo',
      type: 'location',
      details: {
        description: 'Nordic research and development center.',
        metrics: {
          'Buildings': 2,
          'Sensors': 28,
          'Plants Monitored': '200+',
          'Efficiency Rating': '95%',
        }
      },
      children: [
        {
          id: 'building-5',
          name: 'OSL-A04',
          type: 'building',
          details: {
            description: 'Oslo Fjord Environmental Center',
            metrics: {
              'Sensors': 18,
              'Plants Monitored': '150+',
              'Efficiency Rating': '96%',
              'Area': '9,800 sq.ft.',
            }
          },
          children: []
        }
      ]
    }
  ]
};
