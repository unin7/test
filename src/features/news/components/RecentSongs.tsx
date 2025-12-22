import { Music } from "lucide-react";

export function RecentSongs() {
  const songs = [
    { title: "Shut Down", album: "BORN PINK", date: "2022.09.16" },
    { title: "Pink Venom", album: "BORN PINK", date: "2022.08.19" },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100/50">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-purple-500" />
        <h3 className="text-gray-800">최근 발매곡</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {songs.map((song, idx) => (
          <div
            key={idx}
            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl"
          >
            <div className="w-full aspect-square bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg mb-3 flex items-center justify-center">
              <Music className="w-12 h-12 text-white/70" />
            </div>

            <p className="text-sm text-gray-800 mb-1">{song.title}</p>
            <p className="text-xs text-gray-600">{song.album}</p>
            <p className="text-xs text-purple-500 mt-1">{song.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
