import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Loader2, Upload, Video, PlayCircle } from "lucide-react";

export default function PlayerShowcase({ user }: { user: any }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, "showcases"), where("playerId", "==", user.uid));
      const snap = await getDocs(q);
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpload = async () => {
    if(!title || !videoUrl) return;
    setUploading(true);
    try {
      await addDoc(collection(db, "showcases"), {
        title,
        videoUrl,
        playerId: user.uid,
        playerName: user.name,
        status: "PENDING",
        createdAt: new Date(),
      });
      await fetchVideos();
      setShowUpload(false);
      setTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">Game Showcase</h1>
          <p className="text-gray-400">Upload your game footage for scout review.</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="px-6 py-3 bg-[#00ff88] text-black font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#00e67a] transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" /> {showUpload ? "Cancel" : "Upload Video"}
        </button>
      </div>

      {showUpload && (
        <div className="bg-[#111] border border-white/10 rounded-sm p-6 mb-6">
          <h3 className="font-bold uppercase tracking-wide mb-4 text-[#00ff88]">Submit New Highlight</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Video Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-3 rounded-sm text-sm outline-none focus:border-[#00ff88]" placeholder="e.g. U17 Cup Final Highlights" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Video Link (YouTube/Vimeo)</label>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-3 rounded-sm text-sm outline-none focus:border-[#00ff88]" placeholder="https://..." />
            </div>
            <div className="pt-2">
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="px-8 py-3 bg-white text-black font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />} Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#00ff88] mx-auto mb-2" /></div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Video className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 uppercase">No Videos Uploaded</h3>
            <p className="max-w-md mx-auto mb-6">Build your profile by uploading game highlights for scouts to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 font-bold uppercase tracking-wider text-xs text-gray-400">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Date Uploaded</th>
                  <th className="p-4">Link</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {videos.map((video: any) => (
                  <tr key={video.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold">{video.title}</td>
                    <td className="p-4 text-gray-400 font-mono text-xs">{video.createdAt?.toDate ? video.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4"><a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-[#00ff88] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider text-xs"><PlayCircle className="w-4 h-4"/> Watch</a></td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase ${
                        video.status === 'APPROVED' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 
                        video.status === 'REJECTED' ? 'bg-[#ff0055]/10 text-[#ff0055]' : 
                        'bg-white/10 text-gray-400'
                      }`}>
                        {video.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
