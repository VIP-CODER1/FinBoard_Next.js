import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Widget, DashboardState, ApiResponse, LayoutItem } from '../types';

interface DashboardStore extends DashboardState {
  // Actions
  addWidget: (widget: Omit<Widget, 'id' | 'lastUpdated' | 'data'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  updateLayout: (layout: LayoutItem[]) => void;
  refreshWidget: (id: string) => Promise<void>;
  refreshAllWidgets: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API helpers
  testApiConnection: (url: string) => Promise<ApiResponse>;
  fetchApiData: (url: string) => Promise<ApiResponse>;
  extractFields: (data: any, prefix?: string) => string[];
}

const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      widgets: [],
      layout: [],
      isLoading: false,
      error: null,

      addWidget: (widgetData) => {
        const newWidget: Widget = {
          ...widgetData,
          id: crypto.randomUUID(),
          lastUpdated: new Date().toLocaleTimeString(),
          data: null,
          position: { x: 0, y: 0 },
          size: { width: 300, height: 200 },
        };

        set((state) => ({
          widgets: [...state.widgets, newWidget],
          layout: [
            ...state.layout,
            {
              i: newWidget.id,
              x: 0,
              y: 0,
              w: 6,
              h: 4,
              minW: 3,
              minH: 2,
            },
          ],
        }));

        // Start refreshing the widget
        get().refreshWidget(newWidget.id);
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          layout: state.layout.filter((l) => l.i !== id),
        }));
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      updateLayout: (layout) => {
        set({ layout });
      },

      refreshWidget: async (id) => {
        const widget = get().widgets.find((w) => w.id === id);
        if (!widget) return;

        try {
          const response = await get().fetchApiData(widget.apiUrl);
          if (response.success && response.data) {
            get().updateWidget(id, {
              data: response.data,
              lastUpdated: new Date().toLocaleTimeString(),
            });
          }
        } catch (error) {
          console.error(`Error refreshing widget ${id}:`, error);
        }
      },

      refreshAllWidgets: async () => {
        const { widgets } = get();
        set({ isLoading: true });
        
        try {
          await Promise.all(widgets.map((w) => get().refreshWidget(w.id)));
        } catch (error) {
          console.error('Error refreshing all widgets:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      testApiConnection: async (url: string): Promise<ApiResponse> => {
        try {
          const response = await get().fetchApiData(url);
          return response;
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },

      fetchApiData: async (url: string): Promise<ApiResponse> => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          const fields = get().extractFields(data);
          
          return {
            success: true,
            data,
            fields,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },

      extractFields: (data: any, prefix = ''): string[] => {
        const fields: string[] = [];
        
        if (data && typeof data === 'object') {
          Object.keys(data).forEach((key) => {
            const fullPath = prefix ? `${prefix}.${key}` : key;
            
            if (Array.isArray(data[key])) {
              fields.push(fullPath);
            } else if (data[key] && typeof data[key] === 'object') {
              fields.push(...get().extractFields(data[key], fullPath));
            } else {
              fields.push(fullPath);
            }
          });
        }
        
        return fields;
      },
    }),
    {
      name: 'finboard-dashboard',
      partialize: (state) => ({
        widgets: state.widgets,
        layout: state.layout,
      }),
    }
  )
);

export default useDashboardStore; 