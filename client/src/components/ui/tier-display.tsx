// Using new luxury tier banner images provided by user
const diamondBanner = "/fr2p-diamond-logo.jpeg";
const goldBanner = "/tier-gold-new.jpg";
const platinumBanner = "/tier-platinum-new.jpg";

interface LevelDisplayProps {
  level: number;
  count: number;
  calculation: string;
  color: string;
}

export function LevelDisplay({ level, count, calculation, color }: LevelDisplayProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-navy-800 to-navy-700 rounded-lg border border-gold-400/30 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-500 rounded-full flex items-center justify-center shadow-lg`}>
          <span className="text-navy-900 font-bold text-lg">L{level}</span>
        </div>
        <div>
          <p className="font-semibold text-gold-400">Level {level} {level === 1 ? "(Direct Referrals)" : ""}</p>
          <p className="text-sm text-cream-200">{calculation}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gold-400">{count.toLocaleString()}</p>
        <p className="text-sm text-cream-200">affiliates</p>
      </div>
    </div>
  );
}

interface TierBannerProps {
  tier: "gold" | "platinum" | "diamond";
  className?: string;
}

export function TierBanner({ tier, className = "" }: TierBannerProps) {
  const bannerImages = {
    gold: goldBanner,
    platinum: platinumBanner,
    diamond: diamondBanner,
  };

  const tierNames = {
    gold: "Gold Level",
    platinum: "Platinum Level", 
    diamond: "Diamond Level",
  };

  const tierRequirements = {
    gold: [
      "Entry Level - Standard membership",
      "Monthly membership: $35/month",
      "Tier-based commissions ($14-$20/referral)",
      "Build your foundation network"
    ],
    platinum: [
      "Achieve 50+ active referrals",
      "Maintain consistent monthly activity",
      "Unlock enhanced commission rates",
      "Access to exclusive training materials"
    ],
    diamond: [
      "Achieve 200+ active referrals",
      "Leadership status in the network",
      "Maximum commission rates & bonuses",
      "VIP support and recognition"
    ]
  };

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-xl ${className}`}>
      <img 
        src={bannerImages[tier]} 
        alt={tierNames[tier]}
        className="w-full h-auto object-cover"
      />
      {/* Requirements Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white text-2xl font-bold mb-3 drop-shadow-lg">
          {tierNames[tier]} Requirements
        </h3>
        <ul className="space-y-2">
          {tierRequirements[tier].map((requirement, index) => (
            <li key={index} className="text-white text-sm font-medium drop-shadow-md flex items-start">
              <span className="text-amber-400 mr-2">✓</span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
