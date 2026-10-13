use client;

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  MapPin, Mic, MicOff, DollarSign, ArrowRight, ShieldCheck, 
  ShoppingCart, RefreshCw, Send, Building2 
} from "lucide-react";

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState("leads");
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState([]);
  const [transcribing, setTranscribing] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [processingEscrow, setProcessingEscrow] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setContractor({
          id: "demo-contractor-uuid",
          business_name: "Apex Landscaping & Field Trades",
          primary_trade: "Landscaping & Hardscape",
          service_radius_miles: 25,
          primary_language: "EN",
        });
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("contractor_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) setContractor(profile);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const loadLeads = async () => {
    if (!contractor) return;
    setLoadingLeads(true);
    try {
      const res = await fetch(`/api/leads?contractor_id=${contractor.id}`);
      const json = await res.json();
      if (json.success) setLeads(json.leads);
    } catch (e) {
      console.error(e);
    }
    setLoadingLeads(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = contractor?.primary_language === "ES" ? "es-ES" : "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setNoteInput((prev) => currentTranscript || prev);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleVoiceSubmit = async (e) => {
    e.preventDefault();
    if (!noteInput || !contractor) return;
    setTranscribing(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractor_id: contractor.id, transcript: noteInput }),
      });
      const json = await res.json();
      if (json.success) {
        setVoiceLogs([json.log, ...voiceLogs]);
        setNoteInput("");
      }
    } catch (e) {
      console.error(e);
    }
    setTranscribing(false);
  };

  useEffect(() => {
    if (contractor) loadLeads();
  }, [contractor]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RefreshCw style={{ width: "32px", height: "32px", color: "#10b981", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#090d16", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1e293b", backgroundColor: "#0f172a", padding: "0 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#10b981", color: "#090d16", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>JA</div>
            <div>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>JobAllies</span>
              <span style={{ fontSize: "11px", color: "#10b981", display: "block" }}>PRO DASHBOARD</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#1e293b", border: "1px solid #334155", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", color: "#10b981" }}>
            <Building2 style={{ width: "14px", height: "14px" }} />
            <span>{contractor?.business_name || "Apex Field Trades"}</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #1e293b", paddingBottom: "16px", marginBottom: "32px" }}>
          <button onClick={() => setActiveTab("leads")} style={{ padding: "10px 20px", borderRadius: "10px", fontWeight: 600, border: "none", backgroundColor: activeTab === "leads" ? "#10b981" : "#0f172a", color: activeTab === "leads" ? "#090d16" : "#94a3b8", cursor: "pointer" }}>Geofenced Leads</button>
          <button onClick={() => setActiveTab("voice")} style={{ padding: "10px 20px", borderRadius: "10px", fontWeight: 600, border: "none", backgroundColor: activeTab === "voice" ? "#10b981" : "#0f172a", color: activeTab === "voice" ? "#090d16" : "#94a3b8", cursor: "pointer" }}>TradeVoice & Carts</button>
          <button onClick={() => setActiveTab("escrow")} style={{ padding: "10px 20px", borderRadius: "10px", fontWeight: 600, border: "none", backgroundColor: activeTab === "escrow" ? "#10b981" : "#0f172a", color: activeTab === "escrow" ? "#090d16" : "#94a3b8", cursor: "pointer" }}>P2P Referral Escrow</button>
        </div>

        {activeTab === "leads" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>Matching Leads in Service Zone</h2>
                <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>Geofenced within your 25 mile driving radius via PostGIS spatial engine.</p>
              </div>
              <button onClick={loadLeads} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#f8fafc", padding: "10px 18px", borderRadius: "10px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <RefreshCw style={{ width: "14px", height: "14px", color: "#10b981" }} />
                <span>Refresh Leads</span>
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {leads.map((lead) => (
                <div key={lead.job_id} style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "2px 8px", borderRadius: "12px" }}>{lead.trade_category}</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{lead.distance_miles} miles away</span>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 8px" }}>{lead.title}</h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 16px" }}>{lead.description}</p>
                  <div style={{ paddingTop: "16px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#10b981" }}>${lead.estimated_value}</span>
                    <button style={{ backgroundColor: "#10b981", color: "#090d16", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Claim Lead →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "voice" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>Field Voice Dictation</h2>
                <button type="button" onClick={toggleRecording} style={{ backgroundColor: isRecording ? "#ef4444" : "#10b981", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  {isRecording ? <MicOff style={{ width: "14px", height: "14px" }} /> : <Mic style={{ width: "14px", height: "14px" }} />}
                  <span>{isRecording ? "Listening..." : "Tap to Record"}</span>
                </button>
              </div>
              <form onSubmit={handleVoiceSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <textarea rows={5} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Dictate or type field materials..." style={{ width: "100%", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "12px", padding: "12px", color: "#ffffff" }} />
                <button type="submit" disabled={transcribing || !noteInput} style={{ backgroundColor: "#10b981", color: "#090d16", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                  {transcribing ? "Extracting..." : "Extract Wholesale Cart"}
                </button>
              </form>
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 16px" }}>Generated Material Carts</h2>
              {voiceLogs.length === 0 ? (
                <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "32px", textAlign: "center", color: "#64748b" }}>No material carts generated yet.</div>
              ) : (
                voiceLogs.map((log, idx) => (
                  <div key={idx} style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px", marginBottom: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>"{log.raw_transcript}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "escrow" && (
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>P2P Referral Escrow Hub</h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>Pass leads outside your zone and secure 10% referral splits via Stripe Connect.</p>
          </div>
        )}
      </main>
    </div>
  );
}
