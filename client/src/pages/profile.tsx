import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, User, Users, CreditCard, Shield, Info, Heart, PiggyBank, Calendar, Search, Eye, EyeOff } from "lucide-react";
import type { Member, Transaction, BankingInformation, SavingsAccount, CharitySearchResult } from "@shared/schema";
import { TierBanner } from "@/components/ui/tier-display";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isEditingBanking, setIsEditingBanking] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });
  const [bankingData, setBankingData] = useState<{
    accountHolderName: string;
    bankName: string;
    routingNumber: string;
    accountNumber: string;
    accountType: "checking" | "savings";
  }>({
    accountHolderName: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
  });
  const [charityDialogOpen, setCharityDialogOpen] = useState(false);
  const [charitySearchQuery, setCharitySearchQuery] = useState("");
  const [charitySearchResults, setCharitySearchResults] = useState<CharitySearchResult[]>([]);
  const [isSearchingCharities, setIsSearchingCharities] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const { data: memberData, isLoading } = useQuery<{ member: Member }, Error, Member>({
    queryKey: ["/api/member", DEMO_USER_ID],
    select: (data) => data.member,
  });

  const { data: transactionsData } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ["/api/transactions", DEMO_USER_ID],
  });

  const { data: bankingInfoData } = useQuery<{ bankingInformation: BankingInformation | null }>({
    queryKey: ["/api/members", DEMO_USER_ID, "banking"],
  });

  const { data: savingsData } = useQuery<{ success: boolean; account: SavingsAccount | null; balance: number; withdrawalEligible: boolean; nextWithdrawalDate?: string }>({
    queryKey: ["/api/savings", DEMO_USER_ID],
  });

  const { data: charityData } = useQuery<{ preference: any | null }>({
    queryKey: ["/api/member", DEMO_USER_ID, "charity"],
  });

  const { data: networkGrowthData } = useQuery<{
    totalMembers: number;
    foundingMembers: number;
    recentJoins: Array<{
      id: string;
      name: string;
      email: string;
      joinDate: string;
      memberNumber: number | null;
      isFoundingMember: boolean;
    }>;
  }>({
    queryKey: ["/api/network-growth", DEMO_USER_ID],
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<typeof formData>) => {
      const response = await apiRequest("PUT", `/api/member/${DEMO_USER_ID}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member", DEMO_USER_ID] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadProfilePictureMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await fetch(`/api/members/${DEMO_USER_ID}/profile-picture`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member", DEMO_USER_ID] });
      setIsUploadingPicture(false);
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated.",
      });
    },
    onError: () => {
      setIsUploadingPicture(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProfilePictureMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/members/${DEMO_USER_ID}/profile-picture`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member", DEMO_USER_ID] });
      toast({
        title: "Profile Picture Removed",
        description: "Your profile picture has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove profile picture. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set form data when member data loads
  useEffect(() => {
    if (memberData && !isEditing) {
      setFormData({
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        username: memberData.username,
        address: memberData.address || "",
        city: memberData.city || "",
        state: memberData.state || "",
        zipCode: memberData.zipCode || "",
        phoneNumber: memberData.phoneNumber || "",
      });
    }
  }, [memberData, isEditing]);

  const handleEdit = () => {
    setFormData({
      firstName: memberData?.firstName || "",
      lastName: memberData?.lastName || "",
      email: memberData?.email || "",
      username: memberData?.username || "",
      address: memberData?.address || "",
      city: memberData?.city || "",
      state: memberData?.state || "",
      zipCode: memberData?.zipCode || "",
      phoneNumber: memberData?.phoneNumber || "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (memberData) {
      setFormData({
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        username: memberData.username,
        address: memberData.address || "",
        city: memberData.city || "",
        state: memberData.state || "",
        zipCode: memberData.zipCode || "",
        phoneNumber: memberData.phoneNumber || "",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image under 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      setIsUploadingPicture(true);
      uploadProfilePictureMutation.mutate(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    deleteProfilePictureMutation.mutate();
  };

  const saveBankingMutation = useMutation({
    mutationFn: async (bankingInfo: typeof bankingData) => {
      const response = await apiRequest("POST", `/api/members/${DEMO_USER_ID}/banking`, bankingInfo);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members", DEMO_USER_ID, "banking"] });
      setIsEditingBanking(false);
      toast({
        title: "Banking Information Saved",
        description: "Your banking information has been successfully saved for commission payments.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save banking information. Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const deleteBankingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/members/${DEMO_USER_ID}/banking`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members", DEMO_USER_ID, "banking"] });
      setBankingData({
        accountHolderName: "",
        bankName: "",
        routingNumber: "",
        accountNumber: "",
        accountType: "checking",
      });
      setIsEditingBanking(false);
      toast({
        title: "Banking Information Removed",
        description: "Your banking information has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove banking information. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set banking form data when banking info loads
  useEffect(() => {
    if (bankingInfoData?.bankingInformation && !isEditingBanking) {
      setBankingData({
        accountHolderName: bankingInfoData.bankingInformation.accountHolderName,
        bankName: bankingInfoData.bankingInformation.bankName,
        routingNumber: bankingInfoData.bankingInformation.routingNumber,
        accountNumber: bankingInfoData.bankingInformation.accountNumber,
        accountType: bankingInfoData.bankingInformation.accountType as "checking" | "savings",
      });
    }
  }, [bankingInfoData, isEditingBanking]);

  const handleEditBanking = () => {
    if (bankingInfoData?.bankingInformation) {
      setBankingData({
        accountHolderName: bankingInfoData.bankingInformation.accountHolderName,
        bankName: bankingInfoData.bankingInformation.bankName,
        routingNumber: bankingInfoData.bankingInformation.routingNumber,
        accountNumber: bankingInfoData.bankingInformation.accountNumber,
        accountType: bankingInfoData.bankingInformation.accountType as "checking" | "savings",
      });
    }
    setIsEditingBanking(true);
  };

  const handleSaveBanking = () => {
    saveBankingMutation.mutate(bankingData);
  };

  const handleCancelBanking = () => {
    setIsEditingBanking(false);
    if (bankingInfoData?.bankingInformation) {
      setBankingData({
        accountHolderName: bankingInfoData.bankingInformation.accountHolderName,
        bankName: bankingInfoData.bankingInformation.bankName,
        routingNumber: bankingInfoData.bankingInformation.routingNumber,
        accountNumber: bankingInfoData.bankingInformation.accountNumber,
        accountType: bankingInfoData.bankingInformation.accountType as "checking" | "savings",
      });
    } else {
      setBankingData({
        accountHolderName: "",
        bankName: "",
        routingNumber: "",
        accountNumber: "",
        accountType: "checking",
      });
    }
  };

  const handleRemoveBanking = () => {
    deleteBankingMutation.mutate();
  };

  const selectCharityMutation = useMutation({
    mutationFn: async (charity: CharitySearchResult) => {
      const response = await apiRequest("POST", `/api/member/${DEMO_USER_ID}/charity`, {
        ein: String(charity.ein),
        name: charity.name,
        city: charity.city || undefined,
        state: charity.state || undefined,
        website: charity.website || undefined,
        source: "propublica",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member", DEMO_USER_ID, "charity"] });
      setCharityDialogOpen(false);
      setCharitySearchQuery("");
      setCharitySearchResults([]);
      toast({
        title: "Charity Preference Updated",
        description: "Your charity preference has been successfully saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save charity preference. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearchCharities = async () => {
    if (!charitySearchQuery.trim()) {
      toast({
        title: "Enter Search Term",
        description: "Please enter a charity name to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingCharities(true);
    try {
      const response = await fetch(`/api/charities/search?q=${encodeURIComponent(charitySearchQuery)}&pageSize=10`);
      const data = await response.json();
      const organizations = data?.organizations || [];
      setCharitySearchResults(organizations);
      
      if (organizations.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try a different search term or check your spelling.",
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search charities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingCharities(false);
    }
  };

  const handleSelectCharity = (charity: CharitySearchResult) => {
    selectCharityMutation.mutate(charity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex">
        <SidebarNav />
        <div className="flex-1 md:ml-64">
          <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Profile</h1>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="h-8 bg-muted rounded w-64 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen bg-secondary flex">
        <SidebarNav />
        <div className="flex-1 md:ml-64">
          <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Profile</h1>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Profile not found</h2>
              <p className="text-muted-foreground">Please contact support if this issue persists.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        {/* Top Header with User Info */}
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Profile</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {memberData ? `${memberData.firstName} ${memberData.lastName}` : "Loading..."}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={memberData?.profilePicture || undefined} 
                  alt={memberData ? `${memberData.firstName} ${memberData.lastName}` : "User"}
                />
                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                  {memberData ? `${memberData.firstName[0]}${memberData.lastName[0]}` : "JD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">FR2P Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information, view your membership details, and track your savings progress
          </p>
          
          {/* Founding Member Status */}
          {memberData.isFoundingMember && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full shadow-lg" data-testid="badge-founding-member">
              <span className="text-sm font-bold">🏆 FOUNDING MEMBER #{memberData.memberNumber}</span>
              <span className="text-xs bg-background/20 px-2 py-1 rounded-full">2x Rewards</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Picture Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a profile picture to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={memberData?.profilePicture || undefined} 
                      alt={`${memberData?.firstName} ${memberData?.lastName}`}
                    />
                    <AvatarFallback className="text-lg">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Button
                        onClick={handleUploadClick}
                        disabled={isUploadingPicture}
                        size="sm"
                        data-testid="button-upload-picture"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingPicture ? "Uploading..." : "Upload Picture"}
                      </Button>
                      
                      {memberData?.profilePicture && (
                        <Button
                          onClick={handleRemovePicture}
                          disabled={deleteProfilePictureMutation.isPending}
                          size="sm"
                          variant="outline"
                          data-testid="button-remove-picture"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Upload a square image for best results. Maximum file size: 5MB.
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-profile-picture"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Banking Information
                </CardTitle>
                <CardDescription>
                  Provide your ACH banking details to receive commission payments. 
                  <br />
                  <span className="inline-flex items-center gap-1 mt-1 text-blue-600 dark:text-blue-400">
                    <Info className="h-4 w-4" />
                    Commissions are paid monthly on the last day of each month
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {bankingInfoData?.bankingInformation && !isEditingBanking ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Banking information on file</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Account Holder</Label>
                          <p className="font-medium">{bankingInfoData.bankingInformation.accountHolderName}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Bank Name</Label>
                          <p className="font-medium">{bankingInfoData.bankingInformation.bankName}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Account Type</Label>
                          <p className="font-medium capitalize">{bankingInfoData.bankingInformation.accountType}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Account Number</Label>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {showAccountNumber 
                                ? bankingInfoData.bankingInformation.accountNumber 
                                : `****${bankingInfoData.bankingInformation.accountNumber.slice(-4)}`}
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowAccountNumber(!showAccountNumber)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                              aria-label={showAccountNumber ? "Hide account number" : "Show account number"}
                              data-testid="toggle-account-number"
                            >
                              {showAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleEditBanking} 
                        size="sm"
                        data-testid="button-edit-banking"
                      >
                        Update Banking Info
                      </Button>
                      <Button 
                        onClick={handleRemoveBanking}
                        disabled={deleteBankingMutation.isPending}
                        size="sm" 
                        variant="outline"
                        data-testid="button-remove-banking"
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                        <Input
                          id="accountHolderName"
                          value={bankingData.accountHolderName}
                          onChange={(e) => setBankingData({ ...bankingData, accountHolderName: e.target.value })}
                          placeholder="Full name on account"
                          data-testid="input-account-holder"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={bankingData.bankName}
                          onChange={(e) => setBankingData({ ...bankingData, bankName: e.target.value })}
                          placeholder="e.g., Chase Bank"
                          data-testid="input-bank-name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={bankingData.routingNumber}
                          onChange={(e) => setBankingData({ ...bankingData, routingNumber: e.target.value })}
                          placeholder="9-digit routing number"
                          maxLength={9}
                          data-testid="input-routing-number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={bankingData.accountNumber}
                          onChange={(e) => setBankingData({ ...bankingData, accountNumber: e.target.value })}
                          placeholder="Account number"
                          data-testid="input-account-number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        value={bankingData.accountType}
                        onValueChange={(value: "checking" | "savings") => 
                          setBankingData({ ...bankingData, accountType: value })
                        }
                      >
                        <SelectTrigger data-testid="select-account-type">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">Commission Payment Schedule</p>
                          <p>
                            Commission payments are processed monthly on the last day of each month. 
                            Please ensure your banking information is accurate and up-to-date to receive 
                            payments on time. ACH transfers typically take 1-3 business days to complete.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveBanking}
                        disabled={saveBankingMutation.isPending}
                        data-testid="button-save-banking"
                      >
                        {saveBankingMutation.isPending ? "Saving..." : "Save Banking Info"}
                      </Button>
                      {bankingInfoData?.bankingInformation && (
                        <Button 
                          variant="outline" 
                          onClick={handleCancelBanking}
                          data-testid="button-cancel-banking"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="address">Street Address</Label>
                    {!isEditing && formData.address && (
                      <button
                        type="button"
                        onClick={() => setShowAddress(!showAddress)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showAddress ? "Hide address" : "Show address"}
                        data-testid="toggle-address"
                      >
                        {showAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  <Input
                    id="address"
                    value={!isEditing && !showAddress && formData.address ? "•••••••••••••••" : formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="123 Main Street"
                    data-testid="input-address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="City"
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="State"
                      maxLength={2}
                      data-testid="input-state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="12345"
                      maxLength={10}
                      data-testid="input-zip-code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone-number"
                  />
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={handleEdit}>Edit Profile</Button>
                  ) : (
                    <>
                      <Button 
                        onClick={handleSave} 
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership Details */}
          <div className="space-y-6">
            {/* Tier Banner Display */}
            <TierBanner 
              tier={
                memberData.rank === "Diamond" ? "diamond" : 
                memberData.rank === "Platinum" ? "platinum" : 
                "gold"
              } 
              className="shadow-2xl"
            />

            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-300">Membership Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Status:</span>
                  <Badge 
                    variant={memberData.isActive ? "default" : "secondary"}
                    className={memberData.isActive ? "bg-green-500 text-white" : ""}
                  >
                    {memberData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Rank:</span>
                  <span className="font-bold text-amber-300 text-lg">{memberData.rank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Level:</span>
                  <span className="font-medium text-white">Level {memberData.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Member Since:</span>
                  <span className="font-medium text-white">
                    {new Date(memberData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Network Growth Tracker */}
            <Card className="bg-gradient-to-br from-navy-800 to-navy-900 text-white border-2 border-gold-400 shadow-xl" data-testid="card-network-growth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-300">
                  <Users className="h-5 w-5" />
                  Network Growth Tracker
                </CardTitle>
                <CardDescription className="text-white/80">
                  Track your growing FR2P community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg border border-gold-400/30">
                    <div className="text-3xl font-bold text-amber-400">
                      {networkGrowthData?.totalMembers || 0}
                    </div>
                    <div className="text-xs text-white/70 mt-1">Total Members</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gold-400/30">
                    <div className="text-3xl font-bold text-amber-400">
                      {networkGrowthData?.foundingMembers || 0}
                    </div>
                    <div className="text-xs text-white/70 mt-1">Founding Members</div>
                  </div>
                </div>

                {/* Recent Joins */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-300 mb-3">Recent Joins</h4>
                  {networkGrowthData?.recentJoins && networkGrowthData.recentJoins.length > 0 ? (
                    <div className="space-y-2">
                      {networkGrowthData.recentJoins.map((member) => (
                        <div key={member.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {member.name}
                              {member.isFoundingMember && (
                                <span className="ml-2 text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                                  #{member.memberNumber}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-white/60">{member.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/80">
                              {new Date(member.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/70">No recent joins</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Membership & Financial Flow */}
            <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-2 border-purple-400 shadow-xl" data-testid="card-financial-flow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-200">
                  <CreditCard className="h-5 w-5" />
                  Membership & Financial Flow
                </CardTitle>
                <CardDescription className="text-white/80">
                  Your membership type and financial activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Membership Type */}
                <div className="bg-black/40 p-4 rounded-lg border border-purple-400/30">
                  <h4 className="text-sm font-semibold text-purple-200 mb-2">Membership Plan</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      {(memberData as any).membershipType === 'annual' ? '🎯 Annual Membership' : '📅 Monthly Membership'}
                    </span>
                    <span className="text-2xl font-bold text-amber-400">
                      {(memberData as any).membershipType === 'annual' ? '$350/year' : '$35/mo'}
                    </span>
                  </div>
                  {(memberData as any).membershipType === 'annual' && (
                    <p className="text-xs text-green-300 mt-2">✓ Saving $70/year (17% discount)</p>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Expenses Out */}
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-400/30">
                    <div className="text-center">
                      <div className="text-red-300 text-xs font-semibold mb-1">💸 Expenses Out</div>
                      <div className="text-2xl font-bold text-red-200">
                        ${(memberData as any).totalExpenses ? ((memberData as any).totalExpenses / 100).toFixed(2) : '0.00'}
                      </div>
                      <div className="text-xs text-red-200/70 mt-1">Membership & Purchases</div>
                    </div>
                  </div>

                  {/* Assets In */}
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/30">
                    <div className="text-center">
                      <div className="text-green-300 text-xs font-semibold mb-1">💰 Assets In</div>
                      <div className="text-2xl font-bold text-green-200">
                        ${(memberData as any).totalEarnings ? ((memberData as any).totalEarnings / 100).toFixed(2) : '0.00'}
                      </div>
                      <div className="text-xs text-green-200/70 mt-1">Commissions Earned</div>
                    </div>
                  </div>
                </div>

                {/* Net Position */}
                <div className="bg-black/60 p-4 rounded-lg border-2 border-amber-400/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Net Position:</span>
                    <span className={`text-2xl font-bold ${
                      ((memberData as any).totalEarnings || 0) - ((memberData as any).totalExpenses || 0) >= 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      ${((((memberData as any).totalEarnings || 0) - ((memberData as any).totalExpenses || 0)) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-1 text-center">
                    Total earnings minus total expenses
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactionsData.transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-white capitalize">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-white/70">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            ${(transaction.amount / 100).toFixed(2)}
                          </p>
                          <Badge 
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No transactions found</p>
                )}
              </CardContent>
            </Card>

            {/* Financial Asset Savings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Financial Asset Savings
                </CardTitle>
                <CardDescription>
                  Your Financial Asset Savings automatically receives $35 from every commission. 
                  Funds are locked for 1 year to promote financial discipline.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      ${((savingsData?.balance || 0) / 100).toFixed(2)}
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Savings Balance</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700 dark:text-blue-300">Total Deposited:</span>
                      <span className="font-medium text-blue-900 dark:text-blue-100">
                        ${((savingsData?.account?.totalDeposited || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700 dark:text-blue-300">Withdrawal Status:</span>
                      <Badge variant={savingsData?.withdrawalEligible ? "default" : "secondary"}>
                        {savingsData?.withdrawalEligible ? "Available" : "Locked"}
                      </Badge>
                    </div>
                    
                    {savingsData?.nextWithdrawalDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700 dark:text-blue-300">Next Withdrawal:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(savingsData.nextWithdrawalDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 <strong>Smart Savings:</strong> Earning just 1 commission per month saves $300/year - 
                      essentially paying back your membership fee through disciplined saving!
                    </p>
                  </div>
                </div>
                
                {savingsData?.withdrawalEligible && (
                  <Button className="w-full" variant="outline">
                    Request Annual Withdrawal
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Charity Preference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Charity Preference
                </CardTitle>
                <CardDescription>
                  Choose your preferred charity for potential future giving opportunities. 
                  This helps us understand your values and interests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {charityData?.preference ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Selected Charity</span>
                      </div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        {charityData.preference.name}
                      </h4>
                      {charityData.preference.city && charityData.preference.state && (
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {charityData.preference.city}, {charityData.preference.state}
                        </p>
                      )}
                      {charityData.preference.website && (
                        <a 
                          href={charityData.preference.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 dark:text-green-400 hover:underline"
                        >
                          Visit Website →
                        </a>
                      )}
                    </div>
                    
                    <Dialog open={charityDialogOpen} onOpenChange={setCharityDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          data-testid="button-change-charity"
                        >
                          Change Charity Preference
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Select a Charity</DialogTitle>
                          <DialogDescription>
                            Search for and select your preferred charity. We use ProPublica's nonprofit database.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Search for a charity name..."
                              value={charitySearchQuery}
                              onChange={(e) => setCharitySearchQuery(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSearchCharities()}
                              data-testid="input-charity-search"
                            />
                            <Button 
                              onClick={handleSearchCharities} 
                              disabled={isSearchingCharities || selectCharityMutation.isPending}
                              data-testid="button-search-charity"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              {isSearchingCharities ? "Searching..." : "Search"}
                            </Button>
                          </div>
                          
                          {charitySearchResults.length > 0 && (
                            <div className="space-y-2">
                              {charitySearchResults.map((charity) => (
                                <div
                                  key={charity.ein}
                                  className={`p-4 border rounded-lg transition-colors ${
                                    selectCharityMutation.isPending
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                                  }`}
                                  onClick={() => !selectCharityMutation.isPending && handleSelectCharity(charity)}
                                  data-testid={`charity-result-${charity.ein}`}
                                >
                                  <h4 className="font-semibold">{charity.name}</h4>
                                  {charity.city && charity.state && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {charity.city}, {charity.state}
                                    </p>
                                  )}
                                  {charity.website && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                      {charity.website}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No charity selected yet. Choose one to personalize your giving preferences.
                      </p>
                    </div>
                    
                    <Dialog open={charityDialogOpen} onOpenChange={setCharityDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" data-testid="button-select-charity">
                          Select Charity Preference
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Select a Charity</DialogTitle>
                          <DialogDescription>
                            Search for and select your preferred charity. We use ProPublica's nonprofit database.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Search for a charity name..."
                              value={charitySearchQuery}
                              onChange={(e) => setCharitySearchQuery(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSearchCharities()}
                              data-testid="input-charity-search"
                            />
                            <Button 
                              onClick={handleSearchCharities} 
                              disabled={isSearchingCharities || selectCharityMutation.isPending}
                              data-testid="button-search-charity"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              {isSearchingCharities ? "Searching..." : "Search"}
                            </Button>
                          </div>
                          
                          {charitySearchResults.length > 0 && (
                            <div className="space-y-2">
                              {charitySearchResults.map((charity) => (
                                <div
                                  key={charity.ein}
                                  className={`p-4 border rounded-lg transition-colors ${
                                    selectCharityMutation.isPending
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                                  }`}
                                  onClick={() => !selectCharityMutation.isPending && handleSelectCharity(charity)}
                                  data-testid={`charity-result-${charity.ein}`}
                                >
                                  <h4 className="font-semibold">{charity.name}</h4>
                                  {charity.city && charity.state && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {charity.city}, {charity.state}
                                    </p>
                                  )}
                                  {charity.website && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                      {charity.website}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                  <strong>Privacy Note:</strong> Your charity preference is private and used only to better 
                  understand our community's values. This may inform future platform features or giving opportunities.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
