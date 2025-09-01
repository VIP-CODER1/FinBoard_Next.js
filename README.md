# FinBoard - Finance Dashboard

A customizable finance dashboard where users can build their own real-time finance monitoring dashboard by connecting to various financial APIs and displaying real-time data through customizable widgets.

<img width="1919" height="846" alt="image" src="https://github.com/user-attachments/assets/b1501d6c-28c2-487b-9be6-61cd7584a7f9" />

## Features

### 🎯 Widget Management System
- **Add Widgets**: Create new finance data widgets by connecting to any financial API
  - **Table**: Paginated list or grid of stocks with filters and search functionality
  - **Finance Cards**: List or single card view for watchlist, market gainers, performance data
  - **Charts**: Candle or Line graphs showing stock prices over different intervals
- **Remove Widgets**: Easy deletion of unwanted widgets
- **Rearrange Layout**: Drag-and-drop functionality to reorganize widget positions
- **Widget Configuration**: Each widget includes a configuration panel for customization

### 🔌 API Integration & Data Handling
- **Dynamic Data Mapping**: Explore API responses and select specific fields to display
- **Real-time Updates**: Automatic data refresh with configurable intervals
- **Data Caching**: Intelligent caching system to optimize API calls

### 🎨 User Interface & Experience
- **Customizable Widgets**: Each widget displayed as a finance card with editable titles
- **Responsive Design**: Fully responsive layout supporting multiple screen sizes
- **Loading & Error States**: Comprehensive handling for loading, error, and empty data states

### 💾 Data Persistence
- **Browser Storage Integration**: All widget configurations and dashboard layouts persist across sessions
- **State Recovery**: Dashboard completely restored upon page refresh or browser restart
- **Configuration Backup**: Export/import functionality for dashboard configurations

### 🚀 Advanced Widget Features
- **Field Selection Interface**: Interactive JSON explorer for choosing display fields
- **Custom Formatting**: Support for different data formats (currency, percentage)
- **Widget Naming**: Define widget titles and descriptions
- **API Endpoint Management**: Easy switching between different API endpoints per widget

## Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Zustand with persistence
- **Data Visualization**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Drag & Drop**: React Grid Layout
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinBoard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding a Widget

1. Click the **"+ Add Widget"** button
2. Enter a widget name and API URL
3. Test the API connection
4. Select the fields you want to display
5. Choose the display mode (Card, Table, or Chart)
6. Set the refresh interval
7. Click **"Add Widget"**

### Widget Types

#### Card Widget
- Displays selected field values in a clean card format
- Perfect for single metrics like stock prices, currency rates
- Supports custom formatting (currency, percentage, decimal places)

#### Table Widget
- Shows data in a paginated table format
- Includes search functionality
- Ideal for displaying lists of stocks, funds, or financial data

#### Chart Widget
- Visualizes data using line charts
- Great for tracking price movements over time
- Responsive and interactive

### API Integration

The dashboard supports any REST API that returns JSON data. Popular financial APIs include:

- **Alpha Vantage**: Stock market data, forex, crypto
- **Finnhub**: Real-time stock data, financial statements
- **IndianAPI**: Indian stock market data
- **Coinbase**: Cryptocurrency exchange rates
- **Any custom API**: As long as it returns JSON

### Widget Management

- **Drag & Drop**: Use the grip handle to move widgets around
- **Resize**: Drag the corners to resize widgets
- **Refresh**: Click the refresh button to manually update data
- **Configure**: Access widget settings through the menu
- **Delete**: Remove widgets you no longer need

## Project Structure

```
FinBoard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/             # React components
│   ├── Header.tsx         # Dashboard header
│   ├── AddWidgetModal.tsx # Widget creation modal
│   ├── WidgetGrid.tsx     # Widget grid layout
│   ├── WidgetCard.tsx     # Individual widget
│   ├── WidgetChart.tsx    # Chart widget
│   └── WidgetTable.tsx    # Table widget
├── store/                  # State management
│   └── dashboardStore.ts  # Zustand store
├── types/                  # TypeScript types
│   └── index.ts           # Type definitions
├── utils/                  # Utility functions
│   └── helpers.ts         # Helper functions
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
└── README.md              # This file
```

## Customization

### Styling
The dashboard uses Tailwind CSS with a custom dark theme. You can customize colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Green accent colors
  },
  dark: {
    // Dark theme colors
  }
}
```

### Adding New Widget Types
To add new widget types, extend the `Widget` type in `types/index.ts` and create corresponding components.

### API Response Handling
Modify the `extractFields` function in `store/dashboardStore.ts` to handle different API response structures.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ using Next.js, Tailwind CSS, and modern web technologies. 
