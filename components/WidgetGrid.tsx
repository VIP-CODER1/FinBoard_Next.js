'use client';

import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetCard from './WidgetCard';
import AddWidgetModal from './AddWidgetModal';
import useDashboardStore from '../store/dashboardStore';
import { Plus } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function WidgetGrid() {
  const { widgets, layout, updateLayout } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLayoutChange = (newLayout: any) => {
    updateLayout(newLayout);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <AddWidgetModal>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Widget</span>
          </button>
        </AddWidgetModal>
      </div>

      {widgets.length > 0 && (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="widget-container">
              <WidgetCard widget={widget} />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}

      {widgets.length === 0 && (
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
                  <Plus className="w-4 h-4" />
                  <span>Add Widget</span>
                </button>
              </AddWidgetModal>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 