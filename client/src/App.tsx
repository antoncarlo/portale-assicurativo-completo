import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Policies from "./pages/Policies";
import NewPolicyWizard from "./pages/NewPolicyWizard";
import Claims from "./pages/Claims";
import Questionari from "./pages/Questionari";
import Users from "./pages/Users";
import Commissions from "./pages/Commissions";

// Check if user is logged in
function isAuthenticated() {
  return localStorage.getItem("currentUser") !== null;
}

function ProtectedRoute({ component: Component, ...rest }: any) {
  return isAuthenticated() ? <Component {...rest} /> : <Redirect to="/login" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">{() => <ProtectedRoute component={Home} />}</Route>
      <Route path="/products">{() => <ProtectedRoute component={Products} />}</Route>
      <Route path="/products/:productId/new">{() => <ProtectedRoute component={NewPolicyWizard} />}</Route>
      <Route path="/policies">{() => <ProtectedRoute component={Policies} />}</Route>
      <Route path="/claims">{() => <ProtectedRoute component={Claims} />}</Route>
      <Route path="/questionari">{() => <ProtectedRoute component={Questionari} />}</Route>
      <Route path="/users">{() => <ProtectedRoute component={Users} />}</Route>
      <Route path="/commissions">{() => <ProtectedRoute component={Commissions} />}</Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
