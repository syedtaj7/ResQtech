import { motion } from 'framer-motion';
import { DISASTER_GUIDES } from '../data/disasterGuides';

export const MitigationCard = ({ title, type, activeTab, onClick, category }) => {
  const categoryColors = {
    natural: 'border-blue-500/50',
    technological: 'border-purple-500/50',
    environmental: 'border-green-500/50',
    health: 'border-red-500/50'
  };

  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 
        cursor-pointer border-2 ${categoryColors[category]} 
        hover:shadow-lg hover:shadow-blue-500/10 transition-all`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          activeTab === 'pre' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'
        }`}>
          {activeTab === 'pre' ? 'Prevention' : 'Recovery'}
        </span>
      </div>
      
      <div className="space-y-3">
        {DISASTER_GUIDES[activeTab][type]?.map((guide, index) => (
          <motion.div 
            key={index}
            whileHover={{ x: 4 }}
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
          >
            <span>•</span>
            <span>{guide.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};