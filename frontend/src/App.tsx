import { Web3Provider } from './contexts/Web3Context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <div className="app">
          <header className="app-header">
            <div className="header-left">
              <h1>🌳 ChariTree</h1>
              <p className="subtitle">Plant Trees, Change Lives</p>
            </div>
            <WalletConnect />
          </header>
          
          <main className="app-main">
            {/* Dashboard will go here */}
            <Dashboard />
          </main>
          
          <footer className="app-footer">
            <p>Powered by Moonbase Alpha (Polkadot)</p>
          </footer>
        </div>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
