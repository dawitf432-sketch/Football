import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Star, 
  PlayCircle, 
  MessageSquare, 
  Send, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  Activity, 
  Clock, 
  Sparkles,
  Award
} from "lucide-react";
import { scoutService } from "../services/scoutService";
import { PlayerPublicProfile, ShortlistItem, ShowcaseVideo, ContactRequest, ChatMessage } from "../../../types";
import { getCountryFlag } from "../components/ScoutPlayerCard";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface ScoutOverviewProps {
  user: any;
  onOpenPlayer: (player: PlayerPublicProfile) => void;
}

export default function ScoutOverview({ user, onOpenPlayer }: ScoutOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [discoverableCount, setDiscoverableCount] = useState(0);
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [showcases, setShowcases] = useState<ShowcaseVideo[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([]);
  const [featuredTalents, setFeaturedTalents] = useState<PlayerPublicProfile[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Real data from Firestore
        const [players, sList, videos, inquiries] = await Promise.all([
          scoutService.getDiscoverablePlayers(),
          scoutService.getScoutShortlist(user.uid),
          scoutService.getApprovedShowcases(),
          scoutService.getScoutContactRequests(user.uid)
        ]);

        setDiscoverableCount(players.length);
        setFeaturedTalents(players.slice(0, 3));
        setShortlist(sList);
        setShowcases(videos);
        setContactRequests(inquiries);

        // Fetch recent messages involving this scout
        try {
          const msgQuery = query(
            collection(db, "messages"),
            where("receiverId", "==", user.uid),
            limit(5)
          );
          const msgSnap = await getDocs(msgQuery);
          const msgs: ChatMessage[] = msgSnap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
          setRecentMessages(msgs);
        } catch (e) {
          // fallback if index isn't ready
        }
      } catch (err) {
        console.error("Error loading scout overview:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.uid) {
      loadDashboardData();
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#070d18] via-[#0b1326] to-[#0d1b33] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00f59b]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f59b]/10 border border-[#00f59b]/30 text-[#00f59b] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accredited Scout Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, <span className="text-[#00f59b]">{user.name || "Scout"}</span>
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Monitor real-time academy prospect development, review authenticated match footage, maintain private tactical shortlists, and submit authorized club trial inquiries.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/scout/discover"
              className="px-5 py-2.5 bg-[#00f59b] hover:bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,155,0.2)]"
            >
              <Search className="w-4 h-4" /> Discover Players
            </Link>
            <Link
              to="/scout/shortlist"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-[#00f59b]" /> View Shortlist ({shortlist.length})
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b1326] border border-white/10 hover:border-[#00f59b]/40 rounded-xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Discoverable Talent</span>
            <div className="w-8 h-8 rounded-lg bg-[#00f59b]/10 border border-[#00f59b]/30 flex items-center justify-center text-[#00f59b]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {loading ? "..." : discoverableCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-[#00f59b]">●</span> Public Scouting Profiles
          </div>
        </div>

        <div className="bg-[#0b1326] border border-white/10 hover:border-[#00f59b]/40 rounded-xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">My Shortlist</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {loading ? "..." : shortlist.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Private Tactical Dossiers
          </div>
        </div>

        <div className="bg-[#0b1326] border border-white/10 hover:border-[#00f59b]/40 rounded-xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Showcase Reels</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {loading ? "..." : showcases.length}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            Approved Match Highlights
          </div>
        </div>

        <div className="bg-[#0b1326] border border-white/10 hover:border-[#00f59b]/40 rounded-xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {loading ? "..." : contactRequests.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Controlled Contact Requests
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Featured Prospect Spotlights & Recent Showcases */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Discoverable Talent */}
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00f59b]" />
                <h3 className="font-bold text-white text-base">Top Academy Prospects</h3>
              </div>
              <Link to="/scout/discover" className="text-xs text-[#00f59b] hover:underline flex items-center gap-1 font-semibold">
                Explore Database <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredTalents.map(player => (
                <div 
                  key={player.id}
                  onClick={() => onOpenPlayer(player)}
                  className="bg-[#070d18] border border-white/5 hover:border-[#00f59b]/50 p-4 rounded-lg cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{getCountryFlag(player.country)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f59b]/10 text-[#00f59b] font-bold">
                      {player.position}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white group-hover:text-[#00f59b] transition-colors truncate">
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {player.age} yrs • {player.country}
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <span className="text-gray-400 text-[11px]">Skill Index</span>
                    <span className="font-mono font-bold text-white">{player.skills?.overall || 82}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Verified Match Showcases */}
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Verified Showcase Footage</h3>
              </div>
              <Link to="/scout/showcases" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                View All Showcases <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showcases.slice(0, 2).map(video => (
                <Link
                  key={video.id}
                  to="/scout/showcases"
                  className="bg-[#070d18] border border-white/5 hover:border-cyan-500/40 rounded-lg p-3.5 flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span className="font-semibold text-white truncate">{video.playerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {video.playerPosition || "Academy"}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-200 group-hover:text-cyan-300 line-clamp-2 mb-2">
                      {video.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-white/5">
                    <span>{video.matchInfo?.competition || "Youth Match"}</span>
                    <span className="text-[#00f59b] font-medium flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" /> Watch Reel
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity & Inquiries */}
        <div className="space-y-6">
          {/* Quick Scouting Inquiries Summary */}
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Contact Inquiries</h3>
              <Link to="/scout/inquiries" className="text-xs text-[#00f59b] hover:underline">
                View All
              </Link>
            </div>

            {contactRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-[#070d18] rounded-lg border border-white/5">
                No active contact requests yet. Find talent in Discovery to submit an inquiry.
              </div>
            ) : (
              <div className="space-y-2.5">
                {contactRequests.slice(0, 4).map(req => (
                  <div key={req.id} className="p-3 bg-[#070d18] rounded-lg border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{req.playerName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        req.status === "ACCEPTED" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : req.status === "DECLINED"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{req.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Messages */}
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00f59b]" />
                <h3 className="font-bold text-white text-sm">Messages</h3>
              </div>
              <Link to="/scout/messages" className="text-xs text-[#00f59b] hover:underline">
                Open Messenger
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-[#070d18] rounded-lg border border-white/5">
                Platform messages open once contact requests are approved by academy coordinators.
              </div>
            ) : (
              <div className="space-y-2">
                {recentMessages.slice(0, 3).map(m => (
                  <Link 
                    key={m.id} 
                    to="/scout/messages" 
                    className="block p-3 bg-[#070d18] rounded-lg border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-white">{m.senderName || "Player"}</span>
                      <span className="text-gray-500 text-[10px]">Recent</span>
                    </div>
                    <p className="text-xs text-gray-300 truncate">{m.text}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
