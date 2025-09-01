'use client';

import { useState, useCallback } from 'react';
import { X, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import useDashboardStore from '../store/dashboardStore';
import { validateApiUrl } from '../utils/helpers';
import { Widget } from '../types';

interface AddWidgetModalProps {
  children: React.ReactNode;
}

export default function AddWidgetModal({ children }: AddWidgetModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    apiUrl: '',
    refreshInterval: 30,
    type: 'card' as Widget['type'],
    selectedFields: [] as string[],
  });
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    fields?: string[];
    error?: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArraysOnly, setShowArraysOnly] = useState(false);

  const { addWidget, testApiConnection } = useDashboardStore();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestApi = async () => {
    if (!formData.apiUrl || !validateApiUrl(formData.apiUrl)) {
      setApiTestResult({ success: false, error: 'Please enter a valid API URL' });
      return;
    }

    setIsTesting(true);
    try {
      const result = await testApiConnection(formData.apiUrl);
      setApiTestResult(result);
      if (result.success) {
        setStep(2);
      }
    } catch (error) {
      setApiTestResult({ success: false, error: 'Failed to test API connection' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleFieldToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(field)
        ? prev.selectedFields.filter(f => f !== field)
        : [...prev.selectedFields, field]
    }));
  };

  const handleSubmit = () => {
    if (formData.selectedFields.length === 0) {
      alert('Please select at least one field to display');
      return;
    }

    addWidget({
      name: formData.name,
      type: formData.type,
      apiUrl: formData.apiUrl,
      refreshInterval: formData.refreshInterval,
      selectedFields: formData.selectedFields,
      position: { x: 0, y: 0 },
      size: { width: 4, height: 3 },
      config: {
        title: formData.name,
        showTimestamp: true,
        formatOptions: {},
      },
    });

    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setFormData({
      name: '',
      apiUrl: '',
      refreshInterval: 30,
      type: 'card',
      selectedFields: [],
    });
    setApiTestResult(null);
    setSearchTerm('');
    setShowArraysOnly(false);
  };

  const filteredFields = apiTestResult?.fields?.filter(field => {
    const matchesSearch = field.toLowerCase().includes(searchTerm.toLowerCase());
    if (showArraysOnly) {
      // This is a simplified check - in a real app you'd want more sophisticated array detection
      return matchesSearch && field.includes('[]');
    }
    return matchesSearch;
  }) || [];

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-white">Add New Widget</h2>
              <button
                onClick={handleClose}
                className="text-dark-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {step === 1 ? (
                // Step 1: Basic Configuration
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Widget Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Bitcoin Price Tracker"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      API URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={formData.apiUrl}
                        onChange={(e) => handleInputChange('apiUrl', e.target.value)}
                        placeholder="e.g., https://api.coinbase.com/v2/exchange-rates/currency/BTC"
                        className="input-field flex-1"
                      />
                      <button
                        onClick={handleTestApi}
                        disabled={isTesting || !formData.apiUrl}
                        className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                      >
                        {isTesting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <TestTube className="w-4 h-4" />
                        )}
                        <span>Test</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="number"
                      value={formData.refreshInterval}
                      onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value))}
                      min="10"
                      max="3600"
                      className="input-field w-full"
                    />
                  </div>

                  {apiTestResult && (
                    <div className={`p-3 rounded-lg ${
                      apiTestResult.success 
                        ? 'bg-green-900/20 border border-green-700 text-green-300'
                        : 'bg-red-900/20 border border-red-700 text-red-300'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {apiTestResult.success ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span>
                          {apiTestResult.success 
                            ? `API connection successful! ${apiTestResult.fields?.length || 0} fields found.`
                            : apiTestResult.error
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Step 2: Field Selection and Display Configuration
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Widget Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      API URL
                    </label>
                    <input
                      type="url"
                      value={formData.apiUrl}
                      disabled
                      className="input-field w-full bg-dark-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="number"
                      value={formData.refreshInterval}
                      onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value))}
                      min="10"
                      max="3600"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Display Mode
                    </label>
                    <div className="flex space-x-2">
                      {(['card', 'table', 'chart'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleInputChange('type', type)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            formData.type === type
                              ? 'bg-primary-500 text-white'
                              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Search Fields
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for fields..."
                      className="input-field w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showArraysOnly"
                      checked={showArraysOnly}
                      onChange={(e) => setShowArraysOnly(e.target.checked)}
                      className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="showArraysOnly" className="text-sm text-white">
                      Show arrays only (for table view)
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Available Fields
                      </label>
                      <div className="bg-dark-700 rounded-lg p-3 max-h-48 overflow-y-auto">
                        {filteredFields.map((field) => (
                          <button
                            key={field}
                            onClick={() => handleFieldToggle(field)}
                            className="w-full text-left p-2 hover:bg-dark-600 rounded flex items-center justify-between"
                          >
                            <span className="text-sm text-white">{field}</span>
                            <span className="text-primary-500">+</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Selected Fields
                      </label>
                      <div className="bg-dark-700 rounded-lg p-3 max-h-48 overflow-y-auto">
                        {formData.selectedFields.map((field) => (
                          <button
                            key={field}
                            onClick={() => handleFieldToggle(field)}
                            className="w-full text-left p-2 hover:bg-dark-600 rounded flex items-center justify-between"
                          >
                            <span className="text-sm text-white">{field}</span>
                            <span className="text-red-400">-</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-dark-700">
                <button
                  onClick={handleClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                
                {step === 1 ? (
                  <button
                    onClick={handleTestApi}
                    disabled={!formData.name || !formData.apiUrl || isTesting}
                    className="btn-primary disabled:opacity-50"
                  >
                    Test Connection
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={formData.selectedFields.length === 0}
                    className="btn-primary disabled:opacity-50"
                  >
                    Add Widget
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 