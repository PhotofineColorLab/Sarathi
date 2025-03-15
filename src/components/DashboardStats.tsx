import React from 'react';
import { DashboardStats as DashboardStatsType } from '../types';
import { Package, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const StatCard = ({ icon: Icon, title, value, color }: { icon: any, title: string, value: string | number, color: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Package}
        title="Total Orders"
        value={stats.totalOrders}
        color="bg-blue-500"
      />
      <StatCard
        icon={Clock}
        title="Pending Orders"
        value={stats.pendingOrders}
        color="bg-yellow-500"
      />
      <StatCard
        icon={CheckCircle}
        title="Completed Orders"
        value={stats.completedOrders}
        color="bg-green-500"
      />
      <StatCard
        icon={DollarSign}
        title="Total Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        color="bg-purple-500"
      />
    </div>
  );
};

export default DashboardStats;