import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  X, 
  Sparkles,
  ShieldAlert,
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import { Scholarship, ScholarshipStatus, ProviderProfile } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderCreateScholarshipProps {
  providerId: string;
  profile: ProviderProfile | null;
  editingScholarship?: Scholarship | null;
  onNavigate: (tab: string) => void;
  onSuccess: () => void;
}

const AVAILABLE_POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"];

const DEFAULT_BENEFITS_SUGGESTIONS = [
  "100% Full Academy Tuition & Training Fees",
  "Residential Accommodation & Boarding",
  "Professional High-Performance Sports Nutrition",
  "Official Club Match Kits & Training Gear",
  "Direct Showcases with Professional Club Scouts",
  "Accredited Secondary / Higher Education Program",
  "Physiotherapy & Sports Injury Medical Coverage"
];

export default function ProviderCreateScholarship({
  providerId,
  profile,
  editingScholarship,
  onNavigate,
  onSuccess
}: ProviderCreateScholarshipProps) {
  const isEditing = !!editingScholarship;
  const isVerified = profile?.verificationStatus === "VERIFIED";

  const [title, setTitle] = useState(editingScholarship?.title || "");
  const [organizationName, setOrganizationName] = useState(
    editingScholarship?.organizationName || profile?.organizationName || "Global Football Foundation"
  );
  const [description, setDescription] = useState(editingScholarship?.description || "");
  const [country, setCountry] = useState(editingScholarship?.country || profile?.country || "Spain");
  const [location, setLocation] = useState(editingScholarship?.location || "");
  const [ageRequirements, setAgeRequirements] = useState(editingScholarship?.ageRequirements || "16 - 19 Years");
  const [minAge, setMinAge] = useState<number>(editingScholarship?.minAge || 16);
  const [maxAge, setMaxAge] = useState<number>(editingScholarship?.maxAge || 19);
  const [eligiblePositions, setEligiblePositions] = useState<string[]>(
    editingScholarship?.eligiblePositions || ["Midfielder", "Winger", "Striker"]
  );
  const [playerRequirements, setPlayerRequirements] = useState(editingScholarship?.playerRequirements || "");
  const [benefits, setBenefits] = useState<string[]>(
    editingScholarship?.benefits && editingScholarship.benefits.length > 0
      ? editingScholarship.benefits
      : [
          "100% Full Academy Tuition & Coaching Fees",
          "Residential Boarding & Professional Athlete Nutrition",
          "Official Match Kit & GPS Performance Tracking",
          "Direct Scouting Showcases with Professional Clubs"
        ]
  );
  const [newBenefitInput, setNewBenefitInput] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState(
    editingScholarship?.applicationDeadline || "2026-11-30"
  );
  const [availablePlaces, setAvailablePlaces] = useState<number>(editingScholarship?.availablePlaces || 4);
  const [applicationInstructions, setApplicationInstructions] = useState(
    editingScholarship?.applicationInstructions || 
    "Submit your player bio, verified showcase video reels, academic transcripts, and a brief statement on your football ambitions."
  );
  const [status, setStatus] = useState<ScholarshipStatus>(editingScholarship?.status || "PUBLISHED");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const togglePosition = (pos: string) => {
    if (eligiblePositions.includes(pos)) {
      setEligiblePositions(eligiblePositions.filter(p => p !== pos));
    } else {
      setEligiblePositions([...eligiblePositions, pos]);
    }
  };

  const addBenefit = (b?: string) => {
    const textToAdd = b || newBenefitInput.trim();
    if (!textToAdd) return;
    if (!benefits.includes(textToAdd)) {
      setBenefits([...benefits, textToAdd]);
    }
    if (!b) setNewBenefitInput("");
  };

  const removeBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus?: ScholarshipStatus) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const chosenStatus = targetStatus || status;

    if (!title.trim()) {
      setError("Please provide a scholarship title.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a description of the program.");
      return;
    }
    if (eligiblePositions.length === 0) {
      setError("Please select at least one eligible position.");
      return;
    }

    if (chosenStatus === "PUBLISHED" && !isVerified) {
      setError("Your organization must be verified by administrators before publishing live scholarships to players. You may save it as DRAFT in the meantime.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && editingScholarship) {
        await providerService.updateScholarship(editingScholarship.id, {
          title,
          organizationName,
          description,
          country,
          location,
          ageRequirements,
          minAge: Number(minAge),
          maxAge: Number(maxAge),
          eligiblePositions,
          playerRequirements,
          benefits,
          applicationDeadline,
          availablePlaces: Number(availablePlaces),
          applicationInstructions,
          status: chosenStatus
        });
        setSuccessMessage("Scholarship program updated successfully!");
      } else {
        await providerService.createScholarship({
          providerId,
          organizationName,
          title,
          description,
          country,
          location,
          ageRequirements,
          minAge: Number(minAge),
          maxAge: Number(maxAge),
          eligiblePositions,
          playerRequirements,
          benefits,
          applicationDeadline,
          availablePlaces: Number(availablePlaces),
          applicationInstructions,
          status: chosenStatus
        });
        setSuccessMessage("Scholarship created successfully!");
      }

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the scholarship.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("scholarships")}
          className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scholarships List
        </button>

        <span className="text-xs text-gray-400">
          Organization: <strong className="text-white">{organizationName}</strong>
        </span>
      </div>

      {/* Header */}
      <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              {isEditing ? "Edit Football Scholarship Program" : "Create New Scholarship Program"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Publish eligibility criteria, academy benefits, and application guidelines for youth talent worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Error & Success notifications */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl flex items-center gap-3 text-xs text-[#00ff88]">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#00ff88]" />
          <span>{successMessage}</span>
        </div>
      )}

      {!isVerified && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
          <span>
            Note: You can save this program as a <strong>DRAFT</strong> right now. Once your organization profile is verified, you can publish it live to applicant players.
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">1. Core Program Details</h3>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Scholarship Title <span className="text-[#00ff88]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Elite European Academy Full Tuition & Residential Scholarship"
              className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Hosting Organization Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Global Football Foundation"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Country & Region
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Spain, United Kingdom, Portugal"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Campus / Facility Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Valencia Elite Campus, Spain"
              className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Program Description & Overview <span className="text-[#00ff88]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the opportunity, academy philosophy, training schedule, coaching staff credentials, and pathway to professional clubs..."
              className="w-full bg-[#070d18] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Eligibility & Player Requirements */}
        <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">2. Player Eligibility & Positions</h3>

          {/* Positions multi-select */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              Eligible Positions <span className="text-[#00ff88]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_POSITIONS.map((pos) => {
                const isSelected = eligiblePositions.includes(pos);
                return (
                  <button
                    type="button"
                    key={pos}
                    onClick={() => togglePosition(pos)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                        : "bg-[#070d18] text-gray-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Age Requirements Text
              </label>
              <input
                type="text"
                value={ageRequirements}
                onChange={(e) => setAgeRequirements(e.target.value)}
                placeholder="e.g. 16 - 19 Years"
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Minimum Age
              </label>
              <input
                type="number"
                min={12}
                max={25}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Maximum Age
              </label>
              <input
                type="number"
                min={12}
                max={25}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Player Requirements & Prerequisites
            </label>
            <textarea
              rows={3}
              value={playerRequirements}
              onChange={(e) => setPlayerRequirements(e.target.value)}
              placeholder="e.g. Proven competitive match experience at regional or national level, clean disciplinary record, passing academic scores, medical fitness clearance..."
              className="w-full bg-[#070d18] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Benefits & Coverage */}
        <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">3. Scholarship Benefits</h3>
            <span className="text-xs text-gray-400">{benefits.length} items added</span>
          </div>

          <div className="space-y-2">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-[#070d18] border border-white/5 rounded-xl text-xs text-white">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
                  {b}
                </span>
                <button
                  type="button"
                  onClick={() => removeBenefit(idx)}
                  className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom benefit */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefitInput}
              onChange={(e) => setNewBenefitInput(e.target.value)}
              placeholder="Add custom benefit (e.g. Visa sponsorship, Flights allowance, Mentorship)"
              className="flex-1 bg-[#070d18] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addBenefit();
                }
              }}
            />
            <button
              type="button"
              onClick={() => addBenefit()}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Add
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-gray-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00ff88]" />
              Quick Suggestions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_BENEFITS_SUGGESTIONS.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => addBenefit(sug)}
                  disabled={benefits.includes(sug)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] transition-all ${
                    benefits.includes(sug)
                      ? "bg-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-[#070d18] text-gray-300 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Places, Deadlines & Application Instructions */}
        <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider">4. Availability & Instructions</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Number of Available Places
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={availablePlaces}
                onChange={(e) => setAvailablePlaces(Number(e.target.value))}
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full bg-[#070d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Application Instructions for Candidates
            </label>
            <textarea
              rows={3}
              value={applicationInstructions}
              onChange={(e) => setApplicationInstructions(e.target.value)}
              placeholder="Explain required documents, showcase video links, references, guardian consent, and selection timeline..."
              className="w-full bg-[#070d18] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Publication Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"] as ScholarshipStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`p-3 rounded-xl text-xs font-bold transition-all text-center border ${
                    status === st
                      ? "bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]"
                      : "bg-[#070d18] border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate("scholarships")}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e, "DRAFT")}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#00ff88] hover:bg-[#00e67a] text-black text-xs font-black transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isEditing ? "Update Scholarship" : "Publish Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
}
