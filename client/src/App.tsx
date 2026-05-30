import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Network from "@/pages/network";
import Calculator from "@/pages/calculator";
import Store from "@/pages/store";
import Profile from "@/pages/profile";
import Resources from "@/pages/resources";
import CompensationPlan from "@/pages/compensation-plan";
import Chat from "@/pages/chat";
import Join from "@/pages/join";
import JoinSuccess from "@/pages/join-success";
import Donate from "@/pages/donate";
import Terms from "@/pages/terms";
import Achievements from "@/pages/achievements";
import AdminCertificates from "@/pages/admin-certificates";
import KonnectMD from "@/pages/konnectmd";
import ExecutiveTier from "@/pages/executive-tier";
import Ambassador from "@/pages/ambassador";
import Empire from "@/pages/empire";
import Certifications from "@/pages/certifications";
import Investments from "@/pages/investments";
import Magazine from "@/pages/magazine";
import WhyJoin from "@/pages/why-join";
import Marketplace from "@/pages/marketplace";
import Advertise from "@/pages/advertise";
import Prospects from "@/pages/prospects";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/join/success" component={JoinSuccess} />
      <Route path="/join/:referrerId" component={Join} />
      <Route path="/join" component={Join} />
      <Route path="/network" component={Network} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/compensation-plan" component={CompensationPlan} />
      <Route path="/store" component={Store} />
      <Route path="/chat" component={Chat} />
      <Route path="/profile" component={Profile} />
      <Route path="/resources" component={Resources} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/admin/certificates" component={AdminCertificates} />
      <Route path="/donate" component={Donate} />
      <Route path="/terms" component={Terms} />
      <Route path="/konnectmd" component={KonnectMD} />
      <Route path="/executive-tier" component={ExecutiveTier} />
      <Route path="/ambassador" component={Ambassador} />
      <Route path="/partner" component={Ambassador} />
      <Route path="/empire" component={Empire} />
      <Route path="/consolidators" component={Empire} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/investments" component={Investments} />
      <Route path="/wealth-building" component={Investments} />
      <Route path="/magazine" component={Magazine} />
      <Route path="/why-join" component={WhyJoin} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/advertise" component={Advertise} />
      <Route path="/prospects" component={Prospects} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
