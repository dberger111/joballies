"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, ArrowLeft, Send } from "lucide-react";

export default function PostProjectPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Weston, CT");
  const [trade, setTrade] = useState("Masonry & Concrete");
  const [budget, setBudget] = useState("$5,000 - $10,000");
  const [urgency, setUrgency] = useState("Immediate (Within 1 Week)");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);

  const handleHomeownerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !title || !description) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "parse_raw_post",
          rawPostText: title + " - " + description + " Budget: " + budget,
          sourceUrl: "https://joballies.com/post-project",
          contactPhone: phone,
          contactEmail: email,
          zip: location
        })
      });
      const data = await res.json();
      if (data.lead) {
        const enriched = { ...data.lead, author: name, source: "Direct Homeowner Portal • JobAllies.com", trade, budget, urgency, title, desc: description };
        try {
          const existing = JSON.parse(localStorage.getItem("ja_leads_v5") || "[]");
          localStorage.setItem("ja_leads_v5", JSON.stringify([enriched, ...existing]));
        } catch (err) {}
        setSubmittedLead(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 flex items-center justify-center font-black text-slate-950 text-lg">JA</div>
          <div>
            <span className="text-lg font-black text-white">JobAllies</span>
            <span className="text-[11px] text-emerald-400 block font-bold leading-none">Homeowner Project Portal</span>
          </div>
        </Link>
        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500 text-slate-950">100% Free Homeowner Intake</span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-3">Post a Project Free to Verified Local Pros</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Describe your project once. It routes immediately into the Lead Radar for licensed local tradespeople in your area.</p>
          </div>

          {submittedLead ? (
            <div className="bg-slate-950 border border-emerald-500 rounded-2xl p-6 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-black text-white">Project Broadcasted to Local Contractors!</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">Your project <strong>{submittedLead.title}</strong> in <strong>{submittedLead.location}</strong> is now live in the Lead Radar.</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
                  <span>View Your Lead in the Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => setSubmittedLead(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs">Post Another Project</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleHomeownerSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div><label className="block font-bold text-slate-300 mb-1">Your Full Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jordan Taylor" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" /></div>
              <div><label className="block font-bold text-slate-300 mb-1">Mobile Phone *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="(203) 555-0195" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" /></div>
              <div><label className="block font-bold text-slate-300 mb-1">Email Address *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" /></div>
              <div><label className="block font-bold text-slate-300 mb-1">City / Postal Code *</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Weston, CT" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" /></div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Trade Needed *</label>
                <select value={trade} onChange={(e) => setTrade(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                  <option>Masonry & Concrete</option><option>Landscaping & Excavation</option><option>Framing & Carpentry</option><option>Electrical</option><option>Plumbing & Mechanical</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Budget Range *</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                  <option>$1,000 - $2,500</option><option>$2,500 - $5,000</option><option>$5,000 - $10,000</option><option>$10,000 - $25,000</option><option>$25,000+</option>
                </select>
              </div>
              <div className="md:col-span-2"><label className="block font-bold text-slate-300 mb-1">Project Headline *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. 400 sq ft Bluestone Patio & Retaining Wall" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" /></div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Urgency *</label>
                <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                  <option>Emergency / ASAP</option><option>Immediate (Within 1 Week)</option><option>Within 2-4 Weeks</option><option>Flexible</option>
                </select>
              </div>
              <div className="md:col-span-3"><label className="block font-bold text-slate-300 mb-1">Detailed Scope of Work *</label><textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe measurements, materials, or site details..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" /></div>
              <div className="md:col-span-3 pt-2">
                <button type="submit" disabled={submitting} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Broadcasting Project..." : "Submit Project Free"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
