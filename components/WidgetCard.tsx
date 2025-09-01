'use client';

import { useState, useEffect } from 'react';
import { MoreVertical, RefreshCw, Edit, Trash2, GripVertical } from 'lucide-react';
import { Widget } from '../types';
import { formatValue, extractFieldValue, createChartData, createTableData } from '../utils/helpers';
import WidgetChart from './WidgetChart';
import WidgetTable from './WidgetTable';
import useDashboardStore from '../store/dashboardStore';

interface WidgetCardProps {
  widget: Widget;
}

export default function WidgetCard({ widget }: WidgetCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { removeWidget, refreshWidget } = useDashboardStore();

  useEffect(() => {
    // Set up auto-refresh interval
    const interval = setInterval(() => {
      refreshWidget(widget.id);
    }, widget.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [widget.id, widget.refreshInterval, refreshWidget]);

  const handleRefresh = () => {
    refreshWidget(widget.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this widget?')) {
      removeWidget(widget.id);
    }
  };

  const renderWidgetContent = () => {
    if (!widget.data) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
            <p className="text-dark-300 text-sm">Loading...</p>
          </div>
        </div>
      );
    }

    switch (widget.type) {
      case 'card':
        return (
          <div className="space-y-3">
            {widget.selectedFields.map((field) => {
              const value = extractFieldValue(widget.data, field);
              return (
                <div key={field} className="text-center">
                  <p className="text-sm text-dark-300 mb-1">
                    {field.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatValue(value, widget.config.formatOptions)}
                  </p>
                </div>
              );
            })}
          </div>
        );

      case 'table':
        const tableData = createTableData(widget);
        return <WidgetTable data={tableData} />;

      case 'chart':
        const chartData = createChartData(widget);
        return <WidgetChart data={chartData} />;

      default:
        return <div>Unsupported widget type</div>;
    }
  };

  return (
    <div className="card h-full relative group">
      {/* Drag Handle */}
      <div className="drag-handle absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-dark-400" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-white">{widget.config.title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-1 text-dark-300 hover:text-primary-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-dark-300 hover:text-white transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-dark-600 rounded-t-lg flex items-center space-x-2"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-600 rounded-b-lg flex items-center space-x-2"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {renderWidgetContent()}
      </div>

      {/* Footer */}
      {widget.config.showTimestamp && (
        <div className="mt-4 pt-3 border-t border-dark-700">
          <p className="text-xs text-dark-400 text-center">
            Last updated: {widget.lastUpdated}
          </p>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
} 