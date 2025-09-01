import { Widget, ChartData, TableData } from '../types';

export const formatValue = (value: any, formatOptions: Widget['config']['formatOptions']): string => {
  if (value === null || value === undefined) return 'N/A';
  
  let formattedValue = value;
  
  // Handle currency formatting
  if (formatOptions.currency) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: formatOptions.currency,
        minimumFractionDigits: formatOptions.decimalPlaces || 2,
        maximumFractionDigits: formatOptions.decimalPlaces || 2,
      }).format(numValue);
    }
  }
  
  // Handle percentage formatting
  else if (formatOptions.percentage) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      formattedValue = `${(numValue * 100).toFixed(formatOptions.decimalPlaces || 2)}%`;
    }
  }
  
  // Handle decimal places
  else if (formatOptions.decimalPlaces !== undefined) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      formattedValue = numValue.toFixed(formatOptions.decimalPlaces);
    }
  }
  
  return String(formattedValue);
};

export const extractFieldValue = (data: any, fieldPath: string): any => {
  if (!data || !fieldPath) return null;
  
  const keys = fieldPath.split('.');
  let current = data;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return current;
};

export const createChartData = (widget: Widget): ChartData => {
  if (!widget.data || widget.type !== 'chart') {
    return { labels: [], datasets: [] };
  }
  
  // This is a simplified chart data creation
  // In a real app, you'd want more sophisticated logic based on the data structure
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = widget.selectedFields.map((field, index) => {
    const value = extractFieldValue(widget.data, field);
    return typeof value === 'number' ? value : Math.random() * 100;
  });
  
  return {
    labels,
    datasets: [{
      label: widget.name,
      data,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    }],
  };
};

export const createTableData = (widget: Widget): TableData => {
  if (!widget.data || widget.type !== 'table') {
    return { columns: [], rows: [], totalItems: 0, currentPage: 1, itemsPerPage: 10 };
  }
  
  // Extract array data for table view
  let arrayData: any[] = [];
  
  // Find the first array in the data
  const findArray = (obj: any): any[] | null => {
    if (Array.isArray(obj)) return obj;
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        const result = findArray(obj[key]);
        if (result) return result;
      }
    }
    return null;
  };
  
  arrayData = findArray(widget.data) || [];
  
  if (arrayData.length === 0) {
    return { columns: [], rows: [], totalItems: 0, currentPage: 1, itemsPerPage: 10 };
  }
  
  // Create columns from selected fields
  const columns = widget.selectedFields;
  
  // Create rows from data
  const rows = arrayData.map((item) => 
    columns.map((field) => extractFieldValue(item, field))
  );
  
  return {
    columns,
    rows,
    totalItems: rows.length,
    currentPage: 1,
    itemsPerPage: 10,
  };
};

export const validateApiUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getFieldDisplayName = (fieldPath: string): string => {
  const parts = fieldPath.split('.');
  return parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 