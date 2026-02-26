import { ThemeProvider } from './shared/components/ThemeProvider';
import Router from './router';
import './styles/auth.css';

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}