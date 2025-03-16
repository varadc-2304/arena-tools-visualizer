
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DataCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  delay?: number;
}

const DataCard: React.FC<DataCardProps> = ({ title, description, icon, route, delay = 0 }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fadeIn" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-arena-red/10 text-arena-red mr-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 flex-grow">{description}</p>
        <Link 
          to={route} 
          className="flex items-center justify-center w-full bg-arena-red hover:bg-arena-red/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Visualize <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default DataCard;
