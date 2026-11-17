"use client";

import { useState } from "react";
import { model } from "@/lib/ai";
import { InferenceSource } from "firebase/ai";

export default function HybridDesk() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [inferenceSource, setInferenceSource] = useState<"ON_DEVICE" | "CLOUD" | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setOutputText("");
    setInferenceSource(null);

    try {
      // 1. Initialize on-device model
      await model.initializeDeviceModel((progress) => {
        setDownloadProgress(Math.round(progress * 100));
      });
      
      setDownloadProgress(null);

      // 2. Send prompt
      const prompt = `You are a helpful study assistant. Summarize the following text and extract 3 key takeaways:\n\n${inputText}`;
      const result = await model.generateContent(prompt);
      
      // 3. Extract text and inference source
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">HybridDesk AI</h1>
          <p className="text-gray-500 mt-1">Private, local-first document summarization.</p>
        </div>
        
        {/* LIVE BADGE */}
        <div className="flex items-center">
          {inferenceSource ? (
            <div className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-all duration-300 ${
              inferenceSource === "ON_DEVICE" 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {inferenceSource === "ON_DEVICE" ? "⚡ On-Device (Private)" : "☁️ Cloud Fallback"}
            </div>
          ) : (
            <div className="px-5 py-2.5 rounded-full text-sm font-medium bg-gray-50 text-gray-400 border border-gray-200">
              Awaiting Inference
            </div>
          )}
        </div>
      </div>

      {/* Input section */}
      <div className="space-y-4">
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
          <p className="text-xs text-amber-600 mt-1">This only happens once. Subsequent requests will be instant.</p>
        </div>
      )}

      {/* Output section */}
      {outputText && (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl whitespace-pre-wrap text-gray-800 shadow-sm leading-relaxed">
          {outputText}
        </div>
      )}
    </div>
  );
}