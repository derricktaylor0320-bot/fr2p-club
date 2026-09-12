import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { MemberResponse } from "@shared/schema";
import { HIHELLO_APP_STORE_URL, HIHELLO_GOOGLE_PLAY_URL } from "@shared/schema";
import { getLoggedInMemberId } from "@/lib/auth";
import {
  Download, Printer, QrCode, Smartphone, ExternalLink,
  CreditCard, Megaphone, BookOpen, Mail, Star,
  Info, X, CheckCircle2, User, Phone, Globe, AtSign, Briefcase,
  Search, Users, Zap, Share2, MessageSquare, Bluetooth,
  type LucideIcon,
} from "lucide-react";

export interface MarketingMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  file: string;
  downloadName: string;
  icon: LucideIcon;
  printNote: string;
}

export interface PrintTip {
  title: string;
  detail: string;
  link?: string;
}

export interface MarketingToolsConfig {
  programName: string;
  programShortName: string;
  tagline: string;
  defaultMemberTitle: string;
  referralLinkLabel: string;
  referralLinkPlaceholder: string;
  buildReferralLink: (memberId: string) => string;
  materials: MarketingMaterial[];
  printTips: PrintTip[];
  showProspectIdentifier?: boolean;
  hiHelloExtraNote?: string;
  showShareTools?: boolean;
}

const categoryColors: Record<string, string> = {
  "Print Ready": "bg-blue-500/20 text-blue-300 border-blue-400/30",
  "Flyer": "bg-purple-500/20 text-purple-300 border-purple-400/30",
  "Brochure": "bg-green-500/20 text-green-300 border-green-400/30",
  "Postcard": "bg-amber-500/20 text-amber-300 border-amber-400/30",
  "Field Marketing": "bg-orange-500/20 text-orange-300 border-orange-400/30",
  "Logo": "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30",
};

interface MemberInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  referralLink: string;
}

interface PrintModalProps {
  material: MarketingMaterial;
  info: MemberInfo;
  config: MarketingToolsConfig;
  onClose: () => void;
}

function PrintModal({ material, info, config, onClose }: PrintModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const win = window.open("", "_blank");
    if (win && printContent) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${material.title} – ${config.programName}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Georgia, serif; background: white; }
              .print-wrap { max-width: 800px; margin: 0 auto; padding: 20px; }
              .template-img { width: 100%; border-radius: 8px; margin-bottom: 20px; }
              .info-card { border: 2px solid #FFD700; border-radius: 8px; padding: 20px; background: #001f3f; color: white; }
              .info-card h2 { color: #FFD700; font-size: 22px; margin-bottom: 4px; }
              .info-card .title { color: #ccc; font-size: 14px; margin-bottom: 16px; }
              .info-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 14px; }
              .info-row span { color: #FFD700; font-weight: bold; min-width: 80px; }
              .info-row a { color: white; }
              .divider { border-top: 1px solid #FFD700; margin: 16px 0; }
              .footer { text-align: center; color: #FFD700; font-size: 12px; margin-top: 8px; }
              .note { background: #002855; padding: 12px; border-radius: 6px; font-size: 12px; color: #aaa; margin-top: 12px; }
            </style>
          </head>
          <body>
            <div class="print-wrap">
              <img src="${window.location.origin}${material.file}" class="template-img" />
              <div class="info-card">
                <h2>${info.name || "Your Name"}</h2>
                <div class="title">${info.title || config.defaultMemberTitle}</div>
                <div class="divider"></div>
                ${info.phone ? `<div class="info-row"><span>📞 Phone:</span> ${info.phone}</div>` : ""}
                ${info.email ? `<div class="info-row"><span>✉️ Email:</span> ${info.email}</div>` : ""}
                ${info.website ? `<div class="info-row"><span>🌐 Website:</span> ${info.website}</div>` : ""}
                ${info.referralLink ? `<div class="info-row"><span>🔗 Join Link:</span> ${info.referralLink}</div>` : ""}
                <div class="divider"></div>
                <div class="footer">${config.programName} · ${config.tagline} · A Division of The Consolidatus Empire</div>
                ${material.printNote ? `<div class="note">💡 Print tip: ${material.printNote}</div>` : ""}
              </div>
            </div>
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = material.file;
    link.download = material.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#001f3f] border border-[#FFD700]/30 rounded-2xl w-full max-w-2xl shadow-2xl my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FFD700]/20">
          <div>
            <h3 className="text-white font-bold text-lg">{material.title}</h3>
            <p className="text-white/50 text-sm">Preview with your personal info</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5" ref={printRef}>
          <img src={material.file} alt={material.title} className="w-full rounded-xl border border-white/10" />

          <div className="rounded-xl border-2 border-[#FFD700] overflow-hidden">
            <div className="bg-[#FFD700] px-4 py-2">
              <p className="text-[#001f3f] font-bold text-sm">✦ YOUR CONTACT INFORMATION</p>
            </div>
            <div className="bg-[#002855] p-5 space-y-3">
              <div>
                <p className="text-[#FFD700] font-bold text-xl">{info.name || <span className="text-white/30 italic">Your Name</span>}</p>
                <p className="text-white/60 text-sm">{info.title || config.defaultMemberTitle}</p>
              </div>
              <div className="border-t border-[#FFD700]/20 pt-3 space-y-2">
                {info.phone && (
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Phone className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    {info.phone}
                  </div>
                )}
                {info.email && (
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <AtSign className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    {info.email}
                  </div>
                )}
                {info.website && (
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Globe className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    {info.website}
                  </div>
                )}
                {info.referralLink && (
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <ExternalLink className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    <span className="text-[#FFD700] font-semibold break-all">{info.referralLink}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-[#FFD700]/20 pt-3">
                <p className="text-white/40 text-xs text-center">{config.programName} · {config.tagline} · A Division of The Consolidatus Empire</p>
              </div>
            </div>
          </div>

          {material.printNote && (
            <div className="flex items-start gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg p-3">
              <Info className="h-4 w-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
              <p className="text-white/70 text-xs leading-relaxed">💡 {material.printNote}</p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold py-3 rounded-xl transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl transition-colors border border-white/20"
          >
            <Download className="h-4 w-4" />
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}

interface MarketingToolsHubProps {
  config: MarketingToolsConfig;
  initialMaterialId?: string | null;
}

export function MarketingToolsHub({ config, initialMaterialId }: MarketingToolsHubProps) {
  const { toast } = useToast();
  const memberId = getLoggedInMemberId();
  const [filter, setFilter] = useState("All");
  const [previewMaterial, setPreviewMaterial] = useState<MarketingMaterial | null>(null);
  const [infoSaved, setInfoSaved] = useState(false);

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", memberId],
  });

  const member = memberData?.member;
  const defaultReferralLink = member ? config.buildReferralLink(member.id) : "";

  const [info, setInfo] = useState<MemberInfo>({
    name: "",
    title: config.defaultMemberTitle,
    phone: "",
    email: "",
    website: "",
    referralLink: "",
  });

  const [autoFilled, setAutoFilled] = useState(false);
  const [initialMaterialHandled, setInitialMaterialHandled] = useState(false);

  useEffect(() => {
    if (!initialMaterialId || initialMaterialHandled) return;
    const material = config.materials.find(m => m.id === initialMaterialId);
    if (material) {
      setPreviewMaterial(material);
      setInitialMaterialHandled(true);
    }
  }, [initialMaterialId, initialMaterialHandled, config.materials]);

  if (member && !autoFilled) {
    setAutoFilled(true);
    setInfo(prev => ({
      ...prev,
      name: `${member.firstName || ""} ${member.lastName || ""}`.trim() || prev.name,
      email: member.email || prev.email,
      phone: (member as { phoneNumber?: string }).phoneNumber || prev.phone,
      referralLink: defaultReferralLink,
    }));
  }

  const handleSaveInfo = () => {
    setInfoSaved(true);
    toast({
      title: "Info Saved!",
      description: "Your details are ready — click 'Customize & Print' on any material.",
    });
    setTimeout(() => setInfoSaved(false), 3000);
  };

  const categories = ["All", ...Array.from(new Set(config.materials.map(m => m.category)))];
  const filtered = filter === "All" ? config.materials : config.materials.filter(m => m.category === filter);

  const handleDownload = (material: MarketingMaterial) => {
    const link = document.createElement("a");
    link.href = material.file;
    link.download = material.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloading...", description: `${material.title} is saving to your device.` });
  };

  const shareMessage = `Check out ${config.programShortName} — save on fuel and build income: ${info.referralLink || config.referralLinkPlaceholder}`;

  return (
    <>
      {previewMaterial && (
        <PrintModal
          material={previewMaterial}
          info={info}
          config={config}
          onClose={() => setPreviewMaterial(null)}
        />
      )}

      <Card className="bg-[#002855] border border-[#FFD700]/30 mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#FFD700]" />
              <CardTitle className="text-white text-lg">Step 1 — Enter Your Info</CardTitle>
            </div>
            <p className="text-white/50 text-sm">This gets printed on every material you customize</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Full Name
              </Label>
              <Input
                value={info.name}
                onChange={e => setInfo(p => ({ ...p, name: e.target.value }))}
                placeholder="Your Name"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#FFD700]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Your Title / Role
              </Label>
              <Input
                value={info.title}
                onChange={e => setInfo(p => ({ ...p, title: e.target.value }))}
                placeholder={config.defaultMemberTitle}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#FFD700]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </Label>
              <Input
                value={info.phone}
                onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#FFD700]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5" /> Email Address
              </Label>
              <Input
                value={info.email}
                onChange={e => setInfo(p => ({ ...p, email: e.target.value }))}
                placeholder="you@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#FFD700]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Website (optional)
              </Label>
              <Input
                value={info.website}
                onChange={e => setInfo(p => ({ ...p, website: e.target.value }))}
                placeholder="www.yoursite.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#FFD700]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> {config.referralLinkLabel}
              </Label>
              <Input
                value={info.referralLink}
                onChange={e => setInfo(p => ({ ...p, referralLink: e.target.value }))}
                placeholder={config.referralLinkPlaceholder}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#FFD700] text-xs"
              />
            </div>
          </div>
          <button
            onClick={handleSaveInfo}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              infoSaved
                ? "bg-green-500 text-white"
                : "bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f]"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {infoSaved ? "Saved! Now click Customize & Print below" : "Save My Info"}
          </button>
        </CardContent>
      </Card>

      <div className="mb-8 rounded-2xl border border-[#FFD700]/30 overflow-hidden bg-[#002855]">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FFD700]/20 border border-[#FFD700]/30 rounded-xl flex-shrink-0">
                <QrCode className="h-7 w-7 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-[#FFD700] font-bold text-base">HiHello — Smart QR Digital Business Card</h2>
                <p className="text-white/60 text-xs mt-0.5">
                  Free app on iPhone (Apple App Store) and Android (Google Play Store). Add your role, contact info, and referral link — share your QR anywhere.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <a
                href={HIHELLO_APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-bold px-3 py-2 rounded-xl transition-colors text-xs border border-white/20"
              >
                <Smartphone className="h-3.5 w-3.5" />
                App Store (iPhone)
              </a>
              <a
                href={HIHELLO_GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-xl transition-colors text-xs"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Google Play (Android)
              </a>
              <a
                href="https://www.hihello.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold px-3 py-2 rounded-xl transition-colors text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                HiHello.me
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <Smartphone className="h-4 w-4 text-[#FFD700] mb-1.5" />
              <p className="text-white text-xs font-semibold">Never Reprint Cards</p>
              <p className="text-white/50 text-xs mt-0.5">Change your phone or link anytime — your QR code updates automatically</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <QrCode className="h-4 w-4 text-[#FFD700] mb-1.5" />
              <p className="text-white text-xs font-semibold">One QR = Everything</p>
              <p className="text-white/50 text-xs mt-0.5">Add to business cards, postcards, gas pump signs, or car magnets</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <ExternalLink className="h-4 w-4 text-[#FFD700] mb-1.5" />
              <p className="text-white text-xs font-semibold">Include Your Referral Link</p>
              <p className="text-white/50 text-xs mt-0.5">{config.hiHelloExtraNote || `Add your ${config.programShortName} link so prospects can join on the spot`}</p>
            </div>
          </div>

          {config.showShareTools !== false && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/70 text-xs font-semibold mb-3 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[#FFD700]" />
                Share Your QR Code & Referral Link
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => window.open(`sms:?body=${encodeURIComponent(shareMessage)}`, "_blank")}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#FFD700]" />
                  Send via Text
                </button>
                <button
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(config.programShortName)}&body=${encodeURIComponent(shareMessage)}`, "_blank")}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#FFD700]" />
                  Send via Email
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: config.programShortName, text: shareMessage, url: info.referralLink || undefined });
                    } else {
                      navigator.clipboard.writeText(shareMessage);
                      toast({ title: "Copied!", description: "Share message copied — paste anywhere including Bluetooth share menus." });
                    }
                  }}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                >
                  <Bluetooth className="h-3.5 w-3.5 text-[#FFD700]" />
                  Share Anywhere
                </button>
              </div>
              <p className="text-white/40 text-[10px] mt-2">Use your phone's share sheet to send via Bluetooth, WhatsApp, Messenger, or any app.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FFD700] text-[#001f3f] text-xs font-black flex items-center justify-center">2</div>
          <h2 className="text-white font-bold text-lg">Choose Your Materials</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filter === cat
                  ? "bg-[#FFD700] text-[#001f3f] border-[#FFD700]"
                  : "bg-white/5 text-white/60 border-white/20 hover:border-[#FFD700]/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
        {filtered.map(material => {
          const Icon = material.icon;
          return (
            <div key={material.id} className="bg-[#001f3f]/80 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all duration-300 rounded-xl flex flex-col overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={material.file}
                  alt={material.title}
                  className="w-full h-44 object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${categoryColors[material.category] || categoryColors["Print Ready"]}`}>
                    {material.category}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-[#FFD700]" />
                  <p className="text-white font-semibold text-sm">{material.title}</p>
                </div>
                <p className="text-white/50 text-xs leading-relaxed mb-4 flex-1">{material.description}</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPreviewMaterial(material)}
                    className="w-full flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold text-sm py-2.5 rounded-lg transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    Customize & Print
                  </button>
                  <button
                    onClick={() => handleDownload(material)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs py-2 rounded-lg transition-colors border border-white/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Image Only
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {config.showProspectIdentifier !== false && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-full bg-[#FFD700] text-[#001f3f] text-xs font-black flex items-center justify-center">3</div>
            <h2 className="text-white font-bold text-lg">Digital Prospecting Tools</h2>
          </div>

          <div className="bg-gradient-to-br from-[#001f3f] to-[#002a55] border-2 border-[#FFD700]/40 rounded-2xl overflow-hidden">
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#FFD700]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Search className="h-6 w-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl leading-tight">Prospect Identifier</h3>
                      <p className="text-[#FFD700] text-xs font-semibold">Included free with your FR2P membership</p>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    Stop guessing who to talk to. The Prospect Identifier scans social media platforms and identifies people actively looking for business opportunities.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {[
                      { icon: Search, label: "Smart Scanning", desc: "Find opportunity-seekers on LinkedIn, Facebook, Instagram & Threads" },
                      { icon: Users, label: "Warm Market Tracking", desc: "Track prospects by name, contact, and follow-up status" },
                      { icon: Zap, label: "Higher Close Rate", desc: "Talk to people already looking — not cold strangers" },
                    ].map(f => (
                      <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <f.icon className="h-4 w-4 text-[#FFD700] mb-1.5" />
                        <p className="text-white font-semibold text-xs mb-0.5">{f.label}</p>
                        <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-56 flex flex-col items-center gap-3 lg:pt-4">
                  <div className="w-full bg-white/5 border border-[#FFD700]/20 rounded-2xl p-5 text-center">
                    <Search className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
                    <p className="text-white font-bold text-sm mb-0.5">Prospect Identifier</p>
                    <p className="text-white/50 text-xs mb-4">by The FR2P Club</p>
                    <a
                      href="https://prospect-identifier.replit.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold text-sm py-3 rounded-xl transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Launch Tool
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <Printer className="h-5 w-5 text-[#FFD700]" />
          Printing Tips & Recommended Vendors
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.printTips.map(tip => (
            <div key={tip.title} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-[#FFD700] font-semibold text-sm mb-1">{tip.title}</p>
              <p className="text-white/60 text-xs leading-relaxed">{tip.detail}</p>
              {tip.link && (
                <a href={tip.link} target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs underline mt-2 inline-block hover:text-yellow-300">
                  Visit site →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const FR2P_MARKETING_MATERIALS: MarketingMaterial[] = [
  {
    id: "business-card",
    title: "Business Card",
    description: "Double-sided professional card — navy & gold. Add your HiHello QR code before printing.",
    category: "Print Ready",
    file: "/marketing/business-card.jpeg",
    downloadName: "FR2P-Business-Card.jpg",
    icon: CreditCard,
    printNote: "Print at VistaPrint as a standard business card (3.5×2 in). Glossy finish recommended.",
  },
  {
    id: "postcard",
    title: "Postcard",
    description: "Front & back postcard with membership pricing and a 'Connect With Me' section.",
    category: "Postcard",
    file: "/marketing/postcard-v1.jpeg",
    downloadName: "FR2P-Postcard.jpg",
    icon: Mail,
    printNote: "Print as 4×6 or 5×7 postcard. Great for direct mail and networking events.",
  },
  {
    id: "flyer",
    title: "Promotional Flyer",
    description: "\"Multiple Streams. One Road to Success!\" — vertical flyer for social media or print.",
    category: "Flyer",
    file: "/marketing/flyer.jpg",
    downloadName: "FR2P-Promotional-Flyer.jpg",
    icon: Megaphone,
    printNote: "Print as 8.5×11 full color. Share digitally on Facebook, Instagram, or WhatsApp.",
  },
  {
    id: "brochure",
    title: "2-Fold Brochure (Tri-Fold)",
    description: "6-panel brochure covering membership options, benefits, and the commission story.",
    category: "Brochure",
    file: "/marketing/trifold-brochure.jpeg",
    downloadName: "FR2P-Trifold-Brochure.jpg",
    icon: BookOpen,
    printNote: "Print double-sided 8.5×11 folded in thirds. Ask for 'trifold' at FedEx Office or Office Depot.",
  },
];

export const FUEL_REWARDS_MARKETING_MATERIALS: MarketingMaterial[] = [
  {
    id: "fuel-business-card",
    title: "Fuel Rewards Business Card",
    description: "Professional card for gas station partnerships — add your HiHello QR so drivers scan at the pump.",
    category: "Print Ready",
    file: "/marketing/business-card.jpeg",
    downloadName: "Fuel-Rewards-Business-Card.jpg",
    icon: CreditCard,
    printNote: "Hand to gas station managers when asking to display your QR code. Glossy finish recommended.",
  },
  {
    id: "fuel-postcard",
    title: "Fuel Savings Postcard",
    description: "4×6 postcard explaining fuel rewards savings — perfect for windshield drops and direct mail.",
    category: "Postcard",
    file: "/marketing/postcard-v1.jpeg",
    downloadName: "Fuel-Rewards-Postcard.jpg",
    icon: Mail,
    printNote: "Order at GotPrint.com — postcards starting at $49 for a professional run. Great for local campaigns.",
  },
  {
    id: "pump-qr-flyer",
    title: "Gas Pump QR Sign",
    description: "Bold sign template for gas pump displays — partner with station owners to put your QR where drivers wait.",
    category: "Field Marketing",
    file: "/marketing/flyer.jpg",
    downloadName: "Fuel-Rewards-Pump-QR-Sign.jpg",
    icon: Megaphone,
    printNote: "Print on weather-resistant material. Ask the station manager for permission before placing on pumps.",
  },
  {
    id: "car-magnet-guide",
    title: "Car Magnet & Mobile Marketing",
    description: "Use this template for vehicle magnets — turn every drive into a rolling advertisement with your QR code.",
    category: "Field Marketing",
    file: "/marketing/trifold-brochure.jpeg",
    downloadName: "Fuel-Rewards-Car-Magnet.jpg",
    icon: BookOpen,
    printNote: "Order custom car magnets through VistaPrint (bulk orders) or local sign shops. Add your HiHello QR.",
  },
];

export const FR2P_MARKETING_CONFIG: MarketingToolsConfig = {
  programName: "The FR2P Club",
  programShortName: "The FR2P Club",
  tagline: "Financial Roadway to Prosperity",
  defaultMemberTitle: "The FR2P Club Member",
  referralLinkLabel: "Your FR2P Referral Link",
  referralLinkPlaceholder: "https://fr2p-club-production.up.railway.app/join/your-id",
  buildReferralLink: (memberId) => `https://fr2p-club-production.up.railway.app/join/${memberId}`,
  materials: FR2P_MARKETING_MATERIALS,
  showProspectIdentifier: true,
  printTips: [
    { title: "Business Cards", detail: "VistaPrint.com — 500 cards ~$20. Glossy finish makes navy & gold pop." },
    { title: "Flyers & Posters", detail: "FedEx Office or Office Depot. Full color, 8.5×11, cardstock recommended." },
    { title: "Postcards", detail: "VistaPrint or Canva Print. 4×6 or 5×7 for direct mail campaigns." },
    { title: "Brochures", detail: "Print double-sided 8.5×11, folded in thirds. Ask for 'trifold' at any print shop." },
  ],
};

export const FUEL_REWARDS_MARKETING_CONFIG: MarketingToolsConfig = {
  programName: "The FR2P Club Fuel Rewards",
  programShortName: "FR2P Club Fuel Rewards",
  tagline: "Save at the Pump. Earn While You Drive.",
  defaultMemberTitle: "Fuel Rewards Partner",
  referralLinkLabel: "Your Fuel Rewards Referral Link",
  referralLinkPlaceholder: "https://fr2p-club-production.up.railway.app/fuel-rewards?ref=your-id",
  buildReferralLink: (memberId) => `https://fr2p-club-production.up.railway.app/fuel-rewards?ref=${memberId}`,
  materials: FUEL_REWARDS_MARKETING_MATERIALS,
  showProspectIdentifier: false,
  hiHelloExtraNote: "Add your Fuel Rewards referral link so drivers can sign up and start saving at the pump",
  printTips: [
    {
      title: "GotPrint.com — Postcards",
      detail: "Best for postcards and single-run campaigns. Postcards starting at $49. Ideal for fuel savings mailers.",
      link: "https://www.gotprint.com",
    },
    {
      title: "VistaPrint — Bulk Orders",
      detail: "Best for bulk business cards, car magnets, and large quantity runs — not ideal for single one-off items.",
      link: "https://www.vistaprint.com",
    },
    {
      title: "HiHello App",
      detail: "Download free on Apple App Store (iPhone) or Google Play Store (Android). Digital QR business card that updates automatically.",
      link: "https://www.hihello.me",
    },
    {
      title: "Gas Pump QR Signs",
      detail: "Print on cardstock or weather-resistant material. Partner with station managers to display at pumps.",
    },
  ],
};
