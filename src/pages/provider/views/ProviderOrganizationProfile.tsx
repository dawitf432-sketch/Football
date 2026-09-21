import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, 
  Upload, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FileBadge,
  Loader2,
  ExternalLink
} from "lucide-react";
import { ProviderProfile } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderOrganizationProfileProps {
  providerId: string;
  profile: ProviderProfile | null;
  onProfileUpdated: (updated: ProviderProfile) => void;
}

export default function ProviderOrganizationProfile({
  providerId,
  profile,
  onProfileUpdated
}: ProviderOrganizationProfileProps) {
  const [organizationName, setOrganizationName] = useState(profile?.organizationName || "");
  const [logoUrl, setLogoUrl] = useState(profile?.logoUrl || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [description, setDescription] = useState(profile?.description || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [contactEmail, setContactEmail] = useState(profile?.contactEmail || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [accreditationNumber, setAccreditationNumber] = useState(profile?.accreditationNumber || "");
  const [verificationStatus, setVerificationStatus] = useState<"VERIFIED" | "PENDING_VERIFICATION" | "REJECTED">(
    profile?.verificationStatus || "VERIFIED"
  );

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setOrganizationName(profile.organizationName || "");
      setLogoUrl(profile.logoUrl || "");
      setCountry(profile.country || "");
      setLocation(profile.location || "");
      setDescription(profile.description || "");
      setWebsite(profile.website || "");
      setContactEmail(profile.contactEmail || "");
      setPhone(profile.phone || "");
      setAccreditationNumber(profile.accreditationNumber || "");
      setVerificationStatus(profile.verificationStatus || "VERIFIED");
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const url = await providerService.uploadLogo(providerId, file);
      setLogoUrl(url);
    } catch (err: any) {
      setErrorMessage("Failed to upload organization logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const updatedData: Partial<ProviderProfile> = {
        organizationName,
        logoUrl,
        country,
        location,
        description,
        website,
        contactEmail,
        phone,
        accreditationNumber,
        verificationStatus
      };

      await providerService.updateProviderProfile(providerId, updatedData);
      setSavedSuccess(true);
      onProfileUpdated({
        ...profile,
        userId: providerId,
        ...updatedData
      } as ProviderProfile);

      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const isVerified = verificationStatus === "VERIFIED";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Header */}
      <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-blue-500/20 border border-[#00ff88]/40 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Organization Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-[#00ff88]" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingLogo}
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition-opacity"
            >
              {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">{organizationName || "Organization Profile"}</h2>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black flex items-center gap-1 ${
                isVerified
                  ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }`}>
                {isVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                {verificationStatus.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Accredited Football Pathway & Scholarship Host Organization
            </p>
          </div>
        </div>

        {/* Verification Status Quick Controls */}
        <div className="flex items-center gap-2">
          {!isVerified ? (
            <button
              type="button"
              onClick={() => setVerificationStatus("VERIFIED")}
              className="px-3.5 py-1.5 bg-[#00ff88]/20 hover:bg-[#00ff88]/30 text-[#00ff88] text-xs font-bold rounded-xl border border-[#00ff88]/30 transition-colors"
            >
              Activate Verification
            </button>
          ) : (
            <div className="text-xs text-[#00ff88] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Publishing Access</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {savedSuccess && (
        <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl flex items-center gap-3 text-xs text-[#00ff88]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Organization profile updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">
            Organization Identity & Accreditation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Organization Legal Name</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Global Football Foundation"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Official Accreditation Number</label>
              <input
                type="text"
                value={accreditationNumber}
                onChange={(e) => setAccreditationNumber(e.target.value)}
                placeholder="e.g. PFC-ACCR-2026-09"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Headquarters Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Switzerland, Spain, UK"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Campus / Regional Office Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Geneva & Valencia Campus"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Organization Mission & Program Overview</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your football academy programs, international student athlete support, professional network, and success stories..."
              className="w-full bg-[#070d18] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] leading-relaxed"
            />
          </div>
        </div>

        {/* Contact and Official Channels */}
        <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">
            Official Contact & Verification Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Official Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.org"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Scholarships Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="scholarships@example.org"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Official Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+41 22 819 0000"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>

          {/* Verification Status selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Accreditation Verification Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(["VERIFIED", "PENDING_VERIFICATION", "REJECTED"] as const).map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setVerificationStatus(status)}
                  className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    verificationStatus === status
                      ? "bg-[#00ff88]/15 border-[#00ff88] text-[#00ff88]"
                      : "bg-[#070d18] border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Profile Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
