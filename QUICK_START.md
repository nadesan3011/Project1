# Quick Start Guide - Banking Cards Dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js v24 or higher
- npm or yarn package manager

### Installation & Setup

1. **Navigate to project directory**
```bash
cd /workspaces/Project1/cards-dashboard
```

2. **Install dependencies** (if not already installed)
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run build` | Create production build |
| `npm test` | Run test suite in watch mode |
| `npm test -- --coverage` | Run tests with coverage report |

---

## 🎯 Features to Try

1. **Filter by Date Range**
   - Click on "Start Date" and "End Date" fields
   - Select date ranges to filter data

2. **Filter by Card Type**
   - Use the "Card Type" dropdown
   - Options: All, Credit Card, Debit Card, Prepaid Card

3. **Filter by Transaction Type**
   - Use the "Transaction Type" dropdown
   - Options: All, Purchase, Withdrawal, Refund, Transfer

4. **Manual Refresh**
   - Click the "Refresh" button to reload data
   - Auto-refresh happens every 5 minutes automatically

5. **View Charts**
   - Transaction Volume (Bar chart)
   - Card Type Distribution (Pie chart)
   - Fraud Alerts (Line chart)
   - Transaction Types (Bar chart)

---

## 🔧 Configuration

### Change Auto-Refresh Interval

Edit `/src/pages/DashboardPage.tsx`:

```typescript
// Change 300000 (5 minutes) to your preferred interval in milliseconds
const { data, loading, error, refetch } = useFetchData(filters, 300000);
```

Examples:
- 1 minute: `60000`
- 5 minutes: `300000`
- 10 minutes: `600000`
- Disable: `0`

### Connect to Real API

Edit `/src/services/api.ts`:

```typescript
// Change constructor defaults
export const apiService = new ApiService(
  'https://your-api-endpoint.com', // Your API URL
  false // Set to false to use real API
);
```

### Customize Theme Colors

Edit `/src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    secondary: {
      main: '#dc004e', // Change secondary color
    },
  },
});
```

---

## 📱 Responsive Breakpoints

The dashboard adapts to different screen sizes:

- **Mobile** (xs): < 600px - Single column layout
- **Tablet** (sm): 600px - 900px - Two column layout
- **Desktop** (md): 900px - 1200px - Two column layout
- **Large Desktop** (lg): > 1200px - Two column layout

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### Issue: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails
```bash
# Clear build cache
rm -rf build
npm run build
```

### Issue: Tests fail
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

---

## 📊 Understanding the Mock Data

The application uses mock data by default. Here's what each chart shows:

1. **Transaction Volume**: Random volumes between 1000-6000 for each day of the week
2. **Card Type Distribution**: Random distribution of 3 card types
3. **Fraud Alerts**: Random alerts between 1-20 per day
4. **Transaction Types**: Random counts for 4 transaction types

Data regenerates on each refresh and respects the selected filters.

---

## 🎨 Customizing Components

### Adding a New Filter

1. Add to types (`/src/types/index.ts`):
```typescript
export interface DashboardFilters {
  // ... existing filters
  newFilter: string;
}
```

2. Add to FilterPanel (`/src/components/molecules/FilterPanel.tsx`)
3. Update API service to handle the new filter

### Adding a New Chart

1. Add data type to `/src/types/index.ts`
2. Update API service to provide data
3. Add chart to DashboardGrid component
4. Use ChartCard wrapper for consistency

---

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage --watchAll=false
```

### Run specific test file
```bash
npm test Button.test
```

### Debug tests
```bash
npm test -- --verbose
```

---

## 🚢 Deploying to Production

### Build for production
```bash
npm run build
```

### Serve production build locally
```bash
npm install -g serve
serve -s build
```

### Deploy to popular platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
1. Add to `package.json`: `"homepage": "https://yourusername.github.io/repo-name"`
2. Run: `npm run build`
3. Deploy the `build` folder

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Material UI Documentation](https://mui.com)
- [Chart.js Documentation](https://www.chartjs.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)

---

## ✨ Pro Tips

1. **Hot Reload**: Save any file to see changes instantly
2. **TypeScript Errors**: Check the terminal and browser console
3. **Component Inspector**: Use React DevTools browser extension
4. **Performance**: Use Chrome DevTools Profiler for optimization
5. **Accessibility**: Test with keyboard navigation (Tab key)

---

## 🤝 Getting Help

If you encounter issues:

1. Check browser console for errors
2. Check terminal for compilation errors
3. Review error messages carefully
4. Verify all dependencies are installed
5. Ensure Node version is v24+

---

## 🎉 You're All Set!

Your Banking Cards Dashboard is ready to use. Start the development server and begin exploring the features!

```bash
npm start
```

Happy coding! 🚀
