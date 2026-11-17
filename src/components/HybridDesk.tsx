"use client";

import { useState } from "react";
import { model } from "@/lib/ai";
import { InferenceSource } from "firebase/ai";

const PRESET_TEXTS = [
  {
    label: "🔬 Biology",
    text: "Photosynthesis is the process by which green plants convert sunlight, water, and carbon dioxide into chemical energy stored in glucose, releasing oxygen as a vital byproduct for life on Earth. Chlorophyll in the chloroplasts absorbs light energy, primarily in the blue and red wavelengths, while reflecting green light."
  },
  {
    label: "💻 Computer Science",
    text: "A binary search tree (BST) is a node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. The left and right subtree each must also be a binary search tree."
  },
  {
    label: "📜 History",
    text: "The Industrial Revolution, spanning from the 18th to the 19th century, marked a major turning point in history. It transitioned economies from agrarian and handicraft to industrial and machine manufacturing. Key innovations included the steam engine, the spinning jenny, and the power loom, which drastically increased production capabilities and urbanization."
  }
];

export default function HybridDesk() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [inferenceSource, setInferenceSource] = useState<"ON_DEVICE" | "CLOUD" | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [simulateOnDevice, setSimulateOnDevice] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setOutputText("");
    setInferenceSource(null);
    setIsCopied(false);

    try {
      await model.initializeDeviceModel((progress) => {
        setDownloadProgress(Math.round(progress * 100));
      });
      
      setDownloadProgress(null);
      const prompt = `You are a helpful study assistant. Summarize the following text and extract 3 key takeaways:\n\n${inputText}`;
      const result = await model.generateContent(prompt);
      
      setOutputText(result.response.text());
      const source = result.response.inferenceSource;
      setInferenceSource(source === InferenceSource.ON_DEVICE ? "ON_DEVICE" : "CLOUD");

    } catch (error) {
      console.error("Inference error:", error);
      setOutputText(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "hybriddesk-summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">HybridDesk AI</h1>
          <p className="text-gray-500 mt-1">Private, local-first document summarization.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
            <input 
              type="checkbox" 
              checked={simulateOnDevice} 
              onChange={(e) => setSimulateOnDevice(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Simulate On-Device
          </label>

          {inferenceSource || simulateOnDevice ? (
            <div className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-all duration-300 ${
              (simulateOnDevice || inferenceSource === "ON_DEVICE")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {(simulateOnDevice || inferenceSource === "ON_DEVICE") ? "⚡ On-Device (Private)" : "☁️ Cloud Fallback"}
            </div>
          ) : (
            <div className="px-5 py-2.5 rounded-full text-sm font-medium bg-gray-50 text-gray-400 border border-gray-200">
              Awaiting Inference
            </div>
          )}
        </div>
      </div>

      {/* Input section */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-sm text-gray-500 py-1">Try a sample:</span>
          {PRESET_TEXTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(preset.text)}
              disabled={isProcessing}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition disabled:opacity-50 whitespace-nowrap"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <textarea
          className="w-full h-48 p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none shadow-sm text-gray-800"
          placeholder="Paste your study notes, articles, or text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isProcessing}
        />

        <button
          onClick={handleAnalyze}
          disabled={isProcessing || !inputText.trim()}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isProcessing ? "Analyzing..." : "Summarize & Extract Key Points"}
        </button>
      </div>

      {/* Status / Progress section */}
      {downloadProgress !== null && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center animate-pulse">
          <p className="text-sm font-semibold text-amber-800">
            Downloading Gemini Nano model to your device: {downloadProgress}%
          </p>
        </div>
      )}

      {/* Output section */}
      {outputText && (
        <div className="space-y-3">
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl whitespace-pre-wrap text-gray-800 shadow-sm leading-relaxed">
            {outputText}
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              {isCopied ? "✅ Copied!" : "📋 Copy to Clipboard"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              💾 Export as TXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}