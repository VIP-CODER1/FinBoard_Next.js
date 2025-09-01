'use client';

import { TrendingUp, Plus } from 'lucide-react';
import AddWidgetModal from './AddWidgetModal';

export default function Header() {
  return (
    <header className="bg-dark-900 border-b border-dark-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Finance Dashboard</h1>
              <p className="text-sm text-dark-300">Connect to APIs and build your custom dashboard</p>
            </div>
          </div>
          
          <AddWidgetModal>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Widget</span>
            </button>
          </AddWidgetModal>
        </div>
      </div>
    </header>
  );
} 