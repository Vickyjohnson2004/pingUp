import React, { useState } from "react";
import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = () => {
    // Logic to create story
  };

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex justify-between items-center">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create a Story</h2>
          <span className="w-10"></span>
        </div>
        <div
          className="rounded-lg h-96 flex items-center justify-center relative"
          style={{ background: background }}
        >
          {mode === "text" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-full bg-transparent text-white p-6 focus:outline-none resize-none text-2xl font-medium"
              placeholder="What's on your mind?"
            />
          )}

          {mode === "media" &&
            (previewUrl ? (
              media?.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Media Preview"
                  className="h-full w-full object-cover max-h-full"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="h-full w-full object-cover max-h-full"
                />
              )
            ) : (
              <p className="text-white">No media selected</p>
            ))}
        </div>

        <div className="mt-4 flex gap-2">
          {bgColors.map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full cursor-pointer ring border-2 border-transparent hover:border-white transition-all duration-200 ease-in-out`}
              style={{ background: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className={`flex-1 flex cursor-pointer items-center justify-center gap-2 p-2 rounded transition-all duration-200 ease-in-out ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
          >
            <TextIcon size={18} /> Text
          </button>

          <label
            htmlFor="media-upload"
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded transition-all duration-200 ease-in-out bg-zinc-800 cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              type="file"
              id="media-upload"
              accept="image/*,video/*"
              onChange={(e) => {
                handleMediaUpload(e);
                setMode("media");
              }}
              className="hidden"
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>

        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Creating story...",
              success: "Story created successfully!",
              error: "Error creating story.",
            })
          }
          className="flex items-center justify-center gap-2 w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 cursor-pointer text-white p-3 rounded-lg font-semibold transition-all duration-200 ease-in-out"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModal;
