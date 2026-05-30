import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check, AlertCircle } from "lucide-react";
import { SidebarNav } from "@/components/ui/sidebar-nav";

const tiers = [
  { id: 'bronze', name: 'Bronze', number: 1, color: '#CD7F32' },
  { id: 'silver', name: 'Silver', number: 2, color: '#C0C0C0' },
  { id: 'gold', name: 'Gold', number: 3, color: '#FFD700' },
  { id: 'platinum', name: 'Platinum', number: 4, color: '#E5E4E2' },
  { id: 'diamond', name: 'Diamond', number: 5, color: '#B9F2FF' }
];

export default function AdminCertificates() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadedTiers, setUploadedTiers] = useState<Set<string>>(new Set());

  const handleFileUpload = async (tier: string, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setUploading(tier);

    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await fetch(`/api/admin/certificates/${tier}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedTiers(prev => new Set([...prev, tier]));
        toast({
          title: "Upload Successful",
          description: `${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} certificate template uploaded successfully!`,
        });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload certificate template",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex">
      <SidebarNav />
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
              Certificate Templates
            </h1>
            <p className="text-gold-200 text-lg">
              Upload your Canva-designed certificate backgrounds for each tier
            </p>
          </div>

          {/* Instructions */}
          <Card className="mb-8 bg-gradient-to-br from-navy-800 to-navy-700 border-2 border-gold-400">
            <CardHeader>
              <CardTitle className="text-gold-400">Upload Instructions</CardTitle>
              <CardDescription className="text-white/80">
                Upload 5 certificate background images (one for each tier level)
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white space-y-2">
              <p>• Create your luxurious certificate designs in Canva</p>
              <p>• <strong className="text-gold-400">All certificates should say "Certificate of Achievement" at the top</strong></p>
              <p>• Export as PNG or JPG images (landscape orientation recommended)</p>
              <p>• Upload one design for each numbered option below</p>
              <p>• The system will automatically overlay member names, tier names, and earned dates</p>
              <p>• Leave space in your design for the member's name (typically center, around 30-40% from top)</p>
            </CardContent>
          </Card>

          {/* Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card 
                key={tier.id}
                className="bg-gradient-to-br from-navy-800 to-navy-700 border-2"
                style={{ borderColor: tier.color }}
                data-testid={`card-certificate-upload-${tier.id}`}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Option {tier.number}) {tier.name}
                    {uploadedTiers.has(tier.id) && (
                      <Check className="w-6 h-6 text-green-400" />
                    )}
                  </CardTitle>
                  <CardDescription style={{ color: tier.color }}>
                    Upload {tier.name} certificate background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Color Preview */}
                    <div 
                      className="h-24 rounded-lg border-2 border-white/20 flex items-center justify-center"
                      style={{ backgroundColor: tier.color }}
                    >
                      <span className="text-navy-900 font-bold text-lg">
                        {tier.name}
                      </span>
                    </div>

                    {/* File Input */}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(tier.id, file);
                          }
                        }}
                        disabled={uploading === tier.id}
                        className="bg-navy-900 text-white border-gold-400"
                        data-testid={`input-certificate-${tier.id}`}
                      />
                    </div>

                    {/* Upload Button State */}
                    {uploading === tier.id && (
                      <div className="flex items-center justify-center text-gold-400">
                        <Upload className="w-4 h-4 mr-2 animate-pulse" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}

                    {uploadedTiers.has(tier.id) && (
                      <div className="flex items-center justify-center text-green-400">
                        <Check className="w-4 h-4 mr-2" />
                        <span className="text-sm">Template uploaded</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status Summary */}
          {uploadedTiers.size > 0 && (
            <Card className="mt-8 bg-gradient-to-br from-green-900/30 to-green-800/30 border-2 border-green-400">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Check className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-xl font-bold text-green-400">
                      {uploadedTiers.size} of 5 Certificates Uploaded
                    </h3>
                    <p className="text-white/80">
                      {uploadedTiers.size === 5 
                        ? "All certificate templates are ready! Members can now download their personalized certificates." 
                        : `Upload ${5 - uploadedTiers.size} more to complete the set.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
