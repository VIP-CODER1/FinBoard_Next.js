export interface Widget {
  id: string;
  name: string;
  type: 'card' | 'table' | 'chart';
  apiUrl: string;
  refreshInterval: number;
  selectedFields: string[];
  data: any;
  lastUpdated: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: WidgetConfig;
}

export interface WidgetConfig {
  title: string;
  description?: string;
  showTimestamp: boolean;
  formatOptions: {
    currency?: string;
    percentage?: boolean;
    decimalPlaces?: number;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  fields?: string[];
}

export interface DashboardState {
  widgets: Widget[];
  layout: LayoutItem[];
  isLoading: boolean;
  error: string | null;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface TableData {
  columns: string[];
  rows: any[][];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
} 