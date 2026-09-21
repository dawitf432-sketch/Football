import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Building2, 
  Globe, 
  Award, 
  FileText, 
  Save, 
  Check, 
  Loader2, 
  MapPin, 
  Calendar 
} from "lucide-react";
import { ScoutProfileData } from "../../../types";
import { scoutService } from "../services/scoutService";
import { getCountryFlag } from "../components/ScoutPlayerCard";

interface ScoutProfileViewProps {
  user: any;
  onProfileUpdated?: (updated: ScoutProfileData) => void;
}

const AGE_GROUPS = ["U15", "U17", "U19", "U21", "Senior"];
const REGIONS = ["East Africa", "West Africa", "North Africa", "Europe", "South America", "Global"];

export default function ScoutProfileView({ user, onProfileUpdated }: ScoutProfileViewProps) {
  const [profile, setProfile] = useState<ScoutProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [scoutingLicense, setScoutingLicense] = useState("");
  const [bio, setBio] = useState("");
  const [preferredAgeGroups, setPreferredAgeGroups] = useState<string[]>([]);
  const [scoutingRegions, setScoutingRegions] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<"VERIFIED" | "PENDING" | "REJECTED">("VERIFIED");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await scoutService.getScoutProfile(user.uid);
        setProfile(data);
        setName(data.name || user.name || "");
        setOrganization(data.organization || user.organization || "");
        setCountry(data.country || "United Kingdom");
        setScoutingLicense(data.scoutingLicense || "UEFA Talent Identification Certificate");
        setBio(data.bio || "Senior talent scout focusing on technical ceiling, athletic explosiveness, and tactical adaptation in youth academy pipelines.");
        setPreferredAgeGroups(data.preferredAgeGroups || ["U17", "U19"]);
        setScoutingRegions(data.scoutingRegions || ["East Africa", "Global"]);
        setVerificationStatus(data.verificationStatus || "VERIFIED");
      } catch (err) {
        console.error("Error loading scout profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.uid) {
      loadProfile();
    }
  }, [user]);

  const handleToggleAgeGroup = (group: string) => {
    if (preferredAgeGroups.includes(group)) {
      setPreferredAgeGroups(preferredAgeGroups.filter(g => g !== group));
    } else {
      setPreferredAgeGroups([...preferredAgeGroups, group]);
    }
  };

  const handleToggleRegion = (reg: string) => {
    if (scoutingRegions.includes(reg)) {
      setScoutingRegions(scoutingRegions.filter(r => r !== reg));
    } else {
      setScoutingRegions([...scoutingRegions, reg]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedData: Partial<ScoutProfileData> = {
        name,
        organization,
        country,
        scoutingLicense,
        bio,
        preferredAgeGroups,
        scoutingRegions,
        verificationStatus
      };

      await scoutService.updateScoutProfile(user.uid, updatedData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);

      if (onProfileUpdated && profile) {
        onProfileUpdated({ ...profile, ...updatedData });
      }
    } catch (err) {
      console.error("Error saving scout profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 text-[#00f59b] animate-spin" />
        <p className="text-sm">Loading scout credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Scout Accreditation & Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Manage your accredited scouting credentials, club affiliation, and regional search parameters.
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="flex items-center gap-2">
          {verificationStatus === "VERIFIED" ? (
            <div className="px-3.5 py-1.5 rounded-lg bg-[#00f59b]/10 border border-[#00f59b]/30 text-[#00f59b] text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited Verified Scout</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Pending Accreditation</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verification Status Banner / Fast-track control */}
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-3 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-[#00f59b]" /> Scouting Authorization Status
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Only verified scouts have access to contact academy prospects and browse tactical dossiers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVerificationStatus(verificationStatus === "VERIFIED" ? "PENDING" : "VERIFIED")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  verificationStatus === "VERIFIED"
                    ? "bg-[#00f59b]/10 border-[#00f59b] text-[#00f59b]"
                    : "bg-amber-500/10 border-amber-500 text-amber-400"
                }`}
              >
                Switch to {verificationStatus === "VERIFIED" ? "Pending" : "Verified"}
              </button>
            </div>
          </div>
        </div>

        {/* Credentials & Organization Details */}
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-white text-base border-b border-white/10 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#00f59b]" /> Official Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name / Representative
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Club / Scouting Agency / Network
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                placeholder="e.g. Premier Scouting Network, Global Talent Agency"
                className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Country of Operation
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Scouting License / Accreditation ID
              </label>
              <input
                type="text"
                value={scoutingLicense}
                onChange={(e) => setScoutingLicense(e.target.value)}
                required
                placeholder="e.g. UEFA Talent ID, FA Scout Level 3, FIFA Agent ID"
                className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Professional Scouting Bio & Criteria
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detail your recruitment profile, club philosophy, trial criteria..."
              className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Scouting Focus & Target Regions */}
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-white text-base border-b border-white/10 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00f59b]" /> Scouting Target Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5">
              Target Age Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map(age => {
                const active = preferredAgeGroups.includes(age);
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => handleToggleAgeGroup(age)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? "bg-[#00f59b] text-black border-[#00f59b]"
                        : "bg-[#070d18] border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5">
              Scouting Geographical Regions
            </label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(reg => {
                const active = scoutingRegions.includes(reg);
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => handleToggleRegion(reg)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? "bg-[#00f59b] text-black border-[#00f59b]"
                        : "bg-[#070d18] border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-[#00f59b] font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Profile Successfully Saved
            </span>
          ) : (
            <span className="text-xs text-gray-500">All fields verified by academy system</span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#00f59b] hover:bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,155,0.2)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
