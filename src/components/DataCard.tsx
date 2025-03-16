
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
      className="ds-card ds-card-hover opacity-0 animate-fadeIn" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="ds-card-content flex flex-col h-full">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-arena-red/10 text-arena-red">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 flex-grow">{description}</p>
        <Link 
          to={route} 
          className="ds-btn ds-btn-primary flex items-center justify-center w-full"
        >
          Visualize <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default DataCard;
