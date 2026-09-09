import { SidebarNav } from "@/components/ui/sidebar-nav";
import { MarketingToolsHub, FUEL_REWARDS_MARKETING_CONFIG } from "@/components/marketing-tools-hub";
import { FileImage } from "lucide-react";
import { FR2P_MARKETING_CONFIG } from "@/components/marketing-tools-hub";

export default function MarketingTools() {
  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #001f3f 0%, #002855 50%, #001f3f 100%)" }}>
      <SidebarNav />

      <div className="flex-1 md:ml-64 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-[#FFD700]/20 border border-[#FFD700]/30">
              <FileImage className="h-6 w-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Marketing Tools</h1>
              <p className="text-white/60 text-sm">Customize, download, and print your FR2P promotional materials</p>
            </div>
          </div>
        </div>

        <MarketingToolsHub config={FR2P_MARKETING_CONFIG} />
      </div>
    </div>
  );
}
