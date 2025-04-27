import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const SpecsDashboard: React.FC = () => {
  const { data: specs } = useQuery({
    queryKey: ['specs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/specs');
      if (!response.ok) throw new Error('Failed to fetch specs');
      return response.json();
    }
  });

  const businessTypeStats = React.useMemo(() => {
    if (!specs) return [];
    const stats = specs.reduce((acc: any, spec: any) => {
      acc[spec.businessType] = (acc[spec.businessType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [specs]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-xl p-6 mt-8"
    >
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h-[400px]"
        >
          <h3 className="text-lg font-semibold mb-4">Specifications by Business Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={businessTypeStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h-[400px]"
        >
          <h3 className="text-lg font-semibold mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={businessTypeStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {businessTypeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}; 