'use client';

import { useEffect } from 'react';
import Header from '../components/Header';
import WidgetGrid from '../components/WidgetGrid';
import AddWidgetModal from '../components/AddWidgetModal';
import useDashboardStore from '../store/dashboardStore';

export default function Dashboard() {
  const { widgets, refreshAllWidgets, isLoading } = useDashboardStore();

  useEffect(() => {
    // Refresh all widgets on mount
    if (widgets.length > 0) {
      refreshAllWidgets();
    }
  }, [refreshAllWidgets, widgets.length]);

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {widgets.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl p-12 text-center">
                <div className="text-6xl text-primary-500 mb-4">+</div>
                <h3 className="text-xl font-semibold text-white mb-2">Add Widget</h3>
                <p className="text-dark-300 mb-6">
                  Connect to a finance API and create a custom widget
                </p>
                <AddWidgetModal>
                  <button className="btn-primary flex items-center space-x-2">
                    <span>Add Widget</span>
                  </button>
                </AddWidgetModal>
              </div>
            </div>
          </div>
        ) : (
          <WidgetGrid />
        )}
      </main>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-white">Refreshing widgets...</p>
          </div>
        </div>
      )}
    </div>
  );
} 