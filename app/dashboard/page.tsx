'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin, Mic, Users, Link2, Plus,
  CheckCircle, ShieldCheck, Sliders, RefreshCw,
  Send, Navigation, CreditCard, Lock, Unlock,
  ExternalLink, Download, Printer, Mail,
  MessageSquare, Sparkles, Check, Building, Copy
} from 'lucide-react';

interface MaterialItem {
  item: string;
  qty: number;
  cost: number;
  vendor: string;
  sku: string;
}

interface LaborItem {
  tier: string;
  hours: number;
  rate: number;
}

interface DictationLog {
  id: string;
  timestamp: string;
  rawText: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  materials: MaterialItem[];
  labor: LaborItem[];
}

interface LeadItem {
  id: string;
  source: string;
  sourceUrl: string;
  time: string;
  author: string;
  phone: string;
  email: string;
  location: string;
  distanceMiles: number;
  trade: string;
  title: string;
  desc: string;
  budget: string;
  urgency: string;
  claimed: boolean;
}

interface BillingState {
  planStatus: 'FREE_EXPLORER' | 'TRIAL_ACTIVE' | 'PRO_SUBSCRIBED';
  acceptedLeadsCount: number;
  firstLeadAcceptedAt: string | null;
  trialEndsAt: string | null;
  triggerLeadTitle: string | null;
  monthlyRate: number;
}

const DEFAULT_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    source: 'Facebook Group • Weston & Westport Neighbors',
    sourceUrl: 'https://www.facebook.com/groups/search/groups/?q=Weston%20CT%20Neighbors',
    time: '12 mins ago',
    author: 'Mark Henderson',
    phone: '(203) 555-0142',
    email: 'm.henderson.weston@gmail.com',
    location: 'Weston, CT',
    distanceMiles: 2.4,
    trade: 'Masonry & Concrete',
    title: 'Full Backyard Bluestone Patio & Retaining Wall (350 sq ft)',
    desc: 'Looking for a licensed mason/hardscape contractor to install a 350 sq ft paver patio with a low fieldstone sitting wall and steps.',
    budget: '$8,500 - $12,000',
    urgency: 'Immediate',
    claimed: false
  },
  {
    id: 'lead-2',
    source: 'Nextdoor • Greens Farms & Westport',
    sourceUrl: 'https://nextdoor.com/find-neighborhood/ct/westport/',
    time: '38 mins ago',
    author: 'Elena Rostova',
    phone: '(203) 555-0189',
    email: 'elena.rostova@outlook.com',
    location: 'Westport, CT',
    distanceMiles: 4.1,
    trade: 'Landscaping & Excavation',
    title: 'Emergency Oak Limb Clearing & 120ft Curtain Drain Excavation',
    desc: 'Large oak branch down near driveway plus standing water pooling by foundation. Need crew with chipper and mini-excavator.',
    budget: '$3,200 - $4,800',
    urgency: 'Emergency / ASAP',
    claimed: false
  },
  {
    id: 'lead-3',
    source: 'Fairfield County Homeowner Trade Board',
    sourceUrl: 'https://www.facebook.com/groups/search/groups/?q=Fairfield%20CT%20Homeowners',
    time: '1 hour ago',
    author: 'David Kowalski',
    phone: '(203) 555-0164',
    email: 'dkowalski@fairfieldprop.com',
    location: 'Fairfield, CT',
    distanceMiles: 6.8,
    trade: 'Framing & Carpentry',
    title: 'Custom Cedar Timber Pergola & Deck Rebuild (16x20)',
    desc: 'Replacing rotted pressure-treated deck boards and building a heavy cedar pergola with recessed low-voltage lighting.',
    budget: '$9,000 - $14,500',
    urgency: 'This Week',
    claimed: false
  },
  {
    id: 'lead-4',
    source: 'Facebook Group • Wilton Community Exchange',
    sourceUrl: 'https://www.facebook.com/groups/search/groups/?q=Wilton%20CT',
    time: '2 hours ago',
    author: 'Rachel Vance',
    phone: '(203) 555-0177',
    email: 'rachel.vance@me.com',
    location: 'Wilton, CT',
    distanceMiles: 8.2,
    trade: 'Electrical',
    title: '200A Panel Upgrade + Level 2 EV Charger & Outdoor Kitchen Subpanel',
    desc: 'Need licensed electrician to upgrade 100A panel to 200A service and run conduit to patio outdoor kitchen.',
    budget: '$4,200 - $6,000',
    urgency: 'Immediate',
    claimed: false
  },
  {
    id: 'lead-5',
    source: 'Nextdoor • New Canaan & Ridgefield',
    sourceUrl: 'https://nextdoor.com/find-neighborhood/ct/new-canaan/',
    time: '3 hours ago',
    author: 'Thomas Grant',
    phone: '(203) 555-0199',
    email: 'thomas.grant@yahoo.com',
    location: 'New Canaan, CT',
    distanceMiles: 14.6,
    trade: 'Plumbing & Mechanical',
    title: 'Tankless Navien Boiler Conversion & Radiant Zone Manifold',
    desc: 'Looking to replace old cast iron boiler with high-efficiency wall-hung combi unit before winter.',
    budget: '$7,500 - $11,000',
    urgency: 'Flexible',
    claimed: false
  }
];

export default function JobAlliesDashboard() {
  const [activeTab, setActiveTab] = useState<'radar' | 'voice' | 'network' | 'sync'>('radar');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'amber' } | null>(null);

  const [billing, setBilling] = useState<BillingState>({
    planStatus: 'FREE_EXPLORER',
    acceptedLeadsCount: 0,
    firstLeadAcceptedAt: null,
    trialEndsAt: null,
    triggerLeadTitle: null,
    monthlyRate: 49.00
  });
  const [pendingLeadForTrialModal, setPendingLeadForTrialModal] = useState<LeadItem | null>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);

  const [radarZip, setRadarZip] = useState('06883 (Weston, CT)');
  const [radarRadius, setRadarRadius] = useState<number>(20);
  const [tradeFilter, setTradeFilter] = useState<string>('ALL');
  const [leads, setLeads] = useState<LeadItem[]>(DEFAULT_LEADS);
  const [showImportDrawer, setShowImportDrawer] = useState(false);
  const [rawPostInput, setRawPostInput] = useState('');
  const [rawPostUrl, setRawPostUrl] = useState('');
  const [rawPostPhone, setRawPostPhone] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const [globalMarkup, setGlobalMarkup] = useState<number>(20);
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [dictationLogs, setDictationLogs] = useState<DictationLog[]>([
    {
      id: 'log-101',
      timestamp: '10 mins ago',
      rawText: 'We need 12 pressure treated 4x4x10 wood posts at $28 each from Home Depot Pro, 15 bags of Quikrete high early concrete at $7.50, and 16 hours of senior crew labor at $65 an hour for a deck rebuild in Weston.',
      clientName: 'Sarah Jenkins • Westport Deck Rebuild',
      clientPhone: '(203) 555-0133',
      clientEmail: 'sarah.jenkins@westport.org',
      materials: [
        { item: '4x4x10 Pressure Treated Wood Posts', qty: 12, cost: 28.00, vendor: 'Home Depot Pro', sku: 'HD-PT-4410' },
        { item: 'Quikrete 80lb High Early Concrete', qty: 15, cost: 7.50, vendor: 'Home Depot Pro', sku: 'HD-QK-80' }
      ],
      labor: [{ tier: 'Senior Crew Tradesman', hours: 16, rate: 65.00 }]
    },
    {
      id: 'log-102',
      timestamp: '1 hour ago',
      rawText: '14 Unilock Dublin Cobble stone pavers at $18.50 per unit from SiteOne Supply, 3 tons of crushed stone base at $42, plus 8 hours site lead supervision at $95 an hour.',
      clientName: 'Mark Henderson • Weston Bluestone Patio',
      clientPhone: '(203) 555-0142',
      clientEmail: 'm.henderson.weston@gmail.com',
      materials: [
        { item: 'Unilock Dublin Cobble Pavers (Pallet)', qty: 14, cost: 18.50, vendor: 'SiteOne Supply', sku: 'S1-UNI-DC' },
        { item: '3/4" Crushed Stone Base (Tons)', qty: 3, cost: 42.00, vendor: 'SiteOne Supply', sku: 'S1-CRB-34' }
      ],
      labor: [{ tier: 'Site Supervisor / Lead Tech', hours: 8, rate: 95.00 }]
    }
  ]);

  const [activeProposalLog, setActiveProposalLog] = useState<DictationLog | null>(null);
  const [activePoLog, setActivePoLog] = useState<DictationLog | null>(null);
  const [proposalPhone, setProposalPhone] = useState('');
  const [proposalEmail, setProposalEmail] = useState('');

  const [network, setNetwork] = useState([
    { id: 'net-1', name: 'Mike Callahan', company: 'Callahan Plumbing & HVAC', trade: 'Plumbing & Mechanical', phone: '(203) 555-0192', email: 'mike@callahanplumbing.com', feePercent: 10, status: 'Verified Ally', referredJobs: 3, lifetimeShared: 1450.00 },
    { id: 'net-2', name: 'Dan Sparks', company: 'Voltage Masters Electrical LLC', trade: 'Electrical', phone: '(203) 555-0841', email: 'dan@voltagemasters.com', feePercent: 10, status: 'Verified Ally', referredJobs: 2, lifetimeShared: 1200.00 },
    { id: 'net-3', name: 'Tony Russo', company: 'Tri-State Masonry & Pavers', trade: 'Masonry & Concrete', phone: '(203) 555-9921', email: 'tony@tristatemasonry.com', feePercent: 12.5, status: 'Verified Ally', referredJobs: 4, lifetimeShared: 2800.00 },
    { id: 'net-4', name: 'Carlos Mendez', company: 'Apex Tree & Excavation', trade: 'Landscaping & Excavation', phone: '(203) 555-3301', email: 'carlos@apextree.com', feePercent: 10, status: 'Pending Invite', referredJobs: 0, lifetimeShared: 0.00 }
  ]);

  const [escrowContracts, setEscrowContracts] = useState([
    { id: 'esc-1', project: 'Westport Estate Outdoor Lighting', referringPartner: 'Apex Hardscapes (You)', assignedPartner: 'Voltage Masters Electrical LLC', trade: 'Electrical', totalValue: 12000, feePercent: 10, escrowAmount: 1200, status: 'Released', date: 'Oct 02, 2026' },
    { id: 'esc-2', project: 'Greenwich Bathroom Plumbing Rough-In', referringPartner: 'Apex Hardscapes (You)', assignedPartner: 'Callahan Plumbing & HVAC', trade: 'Plumbing & Mechanical', totalValue: 4500, feePercent: 10, escrowAmount: 450, status: 'Locked in Escrow', date: 'Oct 11, 2026' }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [selectedJobValue, setSelectedJobValue] = useState(12000);
  const [selectedJobTitle, setSelectedJobTitle] = useState('Westport Outdoor Kitchen Electrical Sub-Contract');
  const [selectedPartnerId, setSelectedPartnerId] = useState('net-1');

  const [invName, setInvName] = useState('');
  const [invCompany, setInvCompany] = useState('');
  const [invTrade, setInvTrade] = useState('Plumbing & Mechanical');
  const [invFee, setInvFee] = useState(10);
  const [invPhone, setInvPhone] = useState('');
  const [invEmail, setInvEmail] = useState('');

  const [integrations, setIntegrations] = useState([
    { id: 'hdp', name: 'Home Depot Pro Xtra', category: 'Live SKU Search & CSV Bulk Cart Upload', connected: true },
    { id: 'lowes', name: "Lowe's Pro Supply", category: 'Live Catalog Deep-Linking & PO Export', connected: true },
    { id: 'siteone', name: 'SiteOne Landscape Supply', category: 'Hardscape & Nursery Wholesale Sync', connected: true },
    { id: 'qbo', name: 'QuickBooks Online', category: 'Accounting & CSV Invoice Export', connected: true },
    { id: 'twilio', name: 'Twilio / Native SMS Dispatch', category: 'Instant Client Text Proposals & Invites', connected: true },
    { id: 'stripe', name: 'Stripe 14-Day Trial & Escrow Engine', category: 'Pay-On-Success Subscription & Escrow', connected: true }
  ]);

  useEffect(() => {
    try {
      const savedBilling = localStorage.getItem('ja_billing_v5');
      if (savedBilling) setBilling(JSON.parse(savedBilling));
      const savedLeads = localStorage.getItem('ja_leads_v5');
      if (savedLeads) setLeads(JSON.parse(savedLeads));
      const savedLogs = localStorage.getItem('ja_logs_v5');
      if (savedLogs) setDictationLogs(JSON.parse(savedLogs));
      const savedNet = localStorage.getItem('ja_net_v5');
      if (savedNet) setNetwork(JSON.parse(savedNet));
      const savedEsc = localStorage.getItem('ja_esc_v5');
      if (savedEsc) setEscrowContracts(JSON.parse(savedEsc));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ja_billing_v5', JSON.stringify(billing));
      localStorage.setItem('ja_leads_v5', JSON.stringify(leads));
      localStorage.setItem('ja_logs_v5', JSON.stringify(dictationLogs));
      localStorage.setItem('ja_net_v5', JSON.stringify(network));
      localStorage.setItem('ja_esc_v5', JSON.stringify(escrowContracts));
    } catch (e) {}
  }, [billing, leads, dictationLogs, network, escrowContracts]);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'amber' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleLeadAcceptClick = (lead: LeadItem) => {
    if (billing.planStatus === 'FREE_EXPLORER' && billing.acceptedLeadsCount === 0 && !lead.claimed) {
      setPendingLeadForTrialModal(lead);
      return;
    }
    completeLeadClaimAndDraftQuote(lead, false);
  };

  const confirmFirstLeadAndStartTrial = async () => {
    if (!pendingLeadForTrialModal) return;
    const lead = pendingLeadForTrialModal;
    const now = new Date();
    const ends = new Date(now.getTime() + 14 * 86400000);

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_trial_subscription', originUrl: window.location.origin })
      });
      const data = await res.json();
      if (data.url) window.open(data.url, '_blank');
    } catch (e) {}

    setBilling({
      planStatus: 'TRIAL_ACTIVE',
      acceptedLeadsCount: 1,
      firstLeadAcceptedAt: now.toISOString(),
      trialEndsAt: ends.toISOString(),
      triggerLeadTitle: lead.title,
      monthlyRate: 49.00
    });

    setPendingLeadForTrialModal(null);
    completeLeadClaimAndDraftQuote(lead, true);
  };

  const completeLeadClaimAndDraftQuote = (lead: LeadItem, startedTrial: boolean) => {
    setLeads(leads.map(l => l.id === lead.id ? { ...l, claimed: true } : l));
    if (!startedTrial && !lead.claimed) {
      setBilling(prev => ({ ...prev, acceptedLeadsCount: prev.acceptedLeadsCount + 1 }));
    }

    const draftPrompt = `10 units of primary jobsite materials at $45 each from Home Depot Pro, 12 hours of senior crew labor at $75 an hour for ${lead.author}`;
    setVoiceInput(draftPrompt);
    setActiveTab('voice');

    if (startedTrial) {
      triggerToast(`14-Day Free Trial Activated ($0 today)! Unlocked contact info for ${lead.author} & loaded quote builder.`, 'success');
    } else {
      triggerToast(`Accepted lead from ${lead.author}! Contact info unlocked & loaded into TradeVoice.`, 'success');
    }
  };

  const handleImportCommunityPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPostInput.trim()) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'parse_raw_post',
          rawPostText: rawPostInput,
          sourceUrl: rawPostUrl,
          contactPhone: rawPostPhone,
          zip: radarZip
        })
      });
      const data = await res.json();
      if (data.lead) {
        setLeads([data.lead, ...leads]);
        setRawPostInput('');
        setRawPostUrl('');
        setRawPostPhone('');
        setShowImportDrawer(false);
        triggerToast(`Extracted & added "${data.lead.title}" to your Geofenced Radar!`, 'success');
      }
    } catch (err) {
      triggerToast('Failed to parse post text.', 'amber');
    }
  };

  const handleRescanRadar = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan_live_public', zip: radarZip, radius: radarRadius })
      });
      const data = await res.json();
      if (Array.isArray(data.leads) && data.leads.length > 0) {
        const existingIds = new Set(leads.map(l => l.id));
        const newItems = data.leads.filter((l: LeadItem) => !existingIds.has(l.id));
        if (newItems.length > 0) {
          setLeads([...newItems, ...leads]);
          triggerToast(`Pulled ${newItems.length} live public homeowner threads into your radar!`, 'success');
          setIsScanning(false);
          return;
        }
      }
    } catch (e) {}
    setTimeout(() => {
      setIsScanning(false);
      triggerToast(`Radar synced within ${radarRadius} miles of ${radarZip}.`, 'info');
    }, 500);
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      triggerToast('Browser speech recognition requires Chrome, Edge, or Safari.', 'amber');
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
        setVoiceInput(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceInput.trim()) {
      triggerToast('Speak or type your field notes first.', 'amber');
      return;
    }
    setIsParsingVoice(true);
    try {
      const resp = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: voiceInput })
      });
      const parsed = await resp.json();
      const newLog: DictationLog = {
        id: 'log-' + Date.now(),
        timestamp: 'Just Now',
        rawText: voiceInput,
        clientName: parsed.clientName || 'Custom Field Estimate',
        clientPhone: '(203) 555-0142',
        clientEmail: 'prospect@fairfieldcounty.org',
        materials: Array.isArray(parsed.materials) && parsed.materials.length > 0
          ? parsed.materials
          : [{ item: 'Jobsite Materials', qty: 1, cost: 250, vendor: 'Home Depot Pro', sku: 'HD-GEN-100' }],
        labor: Array.isArray(parsed.labor) && parsed.labor.length > 0
          ? parsed.labor
          : [{ tier: 'Skilled Trade Crew Labor', hours: 8, rate: 75 }]
      };
      setDictationLogs([newLog, ...dictationLogs]);
      setVoiceInput('');
      setIsRecording(false);
      triggerToast(`Parsed ${newLog.materials.length} material items & ${newLog.labor.length} labor tiers into Dual-Track Quote!`, 'success');
    } catch (err) {
      triggerToast('Error parsing transcript.', 'amber');
    } finally {
      setIsParsingVoice(false);
    }
  };

  const getRetailerSearchUrl = (vendor: string, item: string) => {
    const q = encodeURIComponent(item);
    const v = vendor.toLowerCase();
    if (v.includes('lowe')) return `https://www.lowes.com/search?searchTerm=${q}`;
    if (v.includes('siteone')) return `https://www.siteone.com/en/search/?text=${q}`;
    if (v.includes('ferguson')) return `https://www.ferguson.com/search/${q}`;
    return `https://www.homedepot.com/s/${q}`;
  };

  const downloadRetailerCsvCart = (log: DictationLog) => {
    const headers = ['SKU', 'Item Description', 'Quantity', 'Wholesale Unit Cost ($)', 'Line Total ($)', 'Preferred Vendor', 'Live Search URL'];
    const rows = log.materials.map(m => [
      m.sku,
      `"${m.item.replace(/"/g, '""')}"`,
      m.qty,
      m.cost.toFixed(2),
      (m.qty * m.cost).toFixed(2),
      `"${m.vendor}"`,
      getRetailerSearchUrl(m.vendor, m.item)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JobAllies_ProCart_${log.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Downloaded Retailer Quick-Order CSV for Home Depot Pro / Lowe\'s upload!', 'success');
  };

  const openProposalModal = (log: DictationLog) => {
    setActiveProposalLog(log);
    setProposalPhone(log.clientPhone || '(203) 555-0142');
    setProposalEmail(log.clientEmail || 'client@homeowner.com');
  };

  const formatProposalText = (log: DictationLog) => {
    const rawMat = log.materials.reduce((s, m) => s + m.cost * m.qty, 0);
    const markedMat = rawMat * (1 + globalMarkup / 100);
    const laborTotal = log.labor.reduce((s, l) => s + l.hours * l.rate, 0);
    const grandTotal = markedMat + laborTotal;

    const matLines = log.materials.map(m => `• ${m.qty}x ${m.item}: $${(m.cost * m.qty * (1 + globalMarkup / 100)).toFixed(2)}`).join('\n');
    const labLines = log.labor.map(l => `• ${l.tier} (${l.hours} hrs): $${(l.hours * l.rate).toFixed(2)}`).join('\n');

    return `ESTIMATE & PROPOSAL (${log.clientName})\nPrepared via JobAllies PRO OS\n\nMATERIALS:\n${matLines}\n\nLABOR:\n${labLines}\n\nTOTAL ESTIMATE: $${grandTotal.toFixed(2)}\nReply YES to approve this scope and schedule work.`;
  };

  const dispatchProposalViaChannel = async (channel: 'sms' | 'email') => {
    if (!activeProposalLog) return;
    const bodyText = formatProposalText(activeProposalLog);
    const recipient = channel === 'sms' ? proposalPhone : proposalEmail;
    const subject = `Estimate & Proposal: ${activeProposalLog.clientName}`;

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, to: recipient, subject, message: bodyText })
      });
      const data = await res.json();
      if (data.uri) {
        window.location.href = data.uri;
        triggerToast(`Opened your ${channel.toUpperCase()} app pre-filled for ${recipient}!`, 'success');
      } else {
        triggerToast(`Dispatched ${channel.toUpperCase()} proposal to ${recipient}!`, 'success');
      }
    } catch (e) {
      triggerToast('Error dispatching message.', 'amber');
    }
  };

  const handleInvitePartnerSubmit = async (e: React.FormEvent, channel: 'sms' | 'email') => {
    e.preventDefault();
    if (!invName || !invCompany) return;
    const newPartner = {
      id: 'net-' + Date.now(),
      name: invName,
      company: invCompany,
      trade: invTrade,
      phone: invPhone || '(203) 555-0199',
      email: invEmail || 'partner@tradeally.com',
      feePercent: Number(invFee),
      status: 'Invite Dispatched',
      referredJobs: 0,
      lifetimeShared: 0.00
    };
    setNetwork([newPartner, ...network]);
    setShowInviteModal(false);

    const inviteMsg = `Hey ${invName}, I'm inviting ${invCompany} to join my verified subcontractor referral network on JobAllies PRO OS (${invFee}% P2P escrow referral split). Accept here: https://joballies.com/dashboard?invite=${newPartner.id}`;
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          to: channel === 'sms' ? invPhone : invEmail,
          subject: 'Trade Partner Network Invite',
          message: inviteMsg
        })
      });
      const data = await res.json();
      if (data.uri) window.location.href = data.uri;
    } catch (err) {}

    setInvName(''); setInvCompany(''); setInvPhone(''); setInvEmail('');
    triggerToast(`Partner invite dispatched to ${invName} (${invCompany})!`, 'success');
  };

  const handleReferJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const partner = network.find(p => p.id === selectedPartnerId);
    if (!partner) return;
    const feeAmount = selectedJobValue * (partner.feePercent / 100);

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'lock_escrow',
          amount: feeAmount,
          projectTitle: selectedJobTitle,
          partnerName: partner.company,
          originUrl: window.location.origin
        })
      });
      const data = await res.json();
      if (data.url) window.open(data.url, '_blank');
    } catch (err) {}

    const newEscrow = {
      id: 'esc-' + Date.now(),
      project: selectedJobTitle,
      referringPartner: 'Apex Hardscapes (You)',
      assignedPartner: partner.company,
      trade: partner.trade,
      totalValue: selectedJobValue,
      feePercent: partner.feePercent,
      escrowAmount: feeAmount,
      status: 'Locked in Escrow',
      date: 'Just Now'
    };

    setEscrowContracts([newEscrow, ...escrowContracts]);
    setNetwork(network.map(p => p.id === partner.id ? { ...p, referredJobs: p.referredJobs + 1 } : p));
    setShowReferModal(false);
    triggerToast(`Locked $${feeAmount.toFixed(2)} (${partner.feePercent}%) into P2P Escrow for ${partner.company}!`, 'success');
  };

  const releaseEscrow = (escId: string) => {
    const target = escrowContracts.find(e => e.id === escId);
    if (!target) return;
    setEscrowContracts(escrowContracts.map(e => e.id === escId ? { ...e, status: 'Released' } : e));
    setNetwork(network.map(p => p.company === target.assignedPartner ? { ...p, lifetimeShared: p.lifetimeShared + target.escrowAmount } : p));
    triggerToast(`Released $${target.escrowAmount.toFixed(2)} from escrow to ${target.assignedPartner}!`, 'success');
  };

  const filteredLeads = leads.filter(l => {
    const withinRadius = l.distanceMiles <= radarRadius;
    const matchesTrade = tradeFilter === 'ALL' || l.trade === tradeFilter;
    return withinRadius && matchesTrade;
  });

  const totalLockedEscrow = escrowContracts
    .filter(e => e.status === 'Locked in Escrow')
    .reduce((sum, e) => sum + e.escrowAmount, 0);

  const daysRemainingInTrial = billing.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(billing.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 14;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-slate-900 border border-emerald-500/60 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Pay-On-Success Billing Top Strip */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-sky-950/90 border-b border-emerald-500/20 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            billing.planStatus === 'FREE_EXPLORER'
              ? 'bg-emerald-500 text-slate-950'
              : billing.planStatus === 'TRIAL_ACTIVE'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-sky-500 text-slate-950'
          }`}>
            {billing.planStatus === 'FREE_EXPLORER'
              ? '100% Free Explorer Tier'
              : billing.planStatus === 'TRIAL_ACTIVE'
              ? `14-Day Free Trial Active (${daysRemainingInTrial} Days Left)`
              : 'PRO OS Subscribed ($49/mo)'}
          </span>
          <span className="text-slate-300">
            {billing.planStatus === 'FREE_EXPLORER'
              ? 'Free to browse leads, use TradeVoice quoting, and invite partners. 14-day trial starts ONLY when you accept your 1st lead.'
              : `Triggered by accepting "${billing.triggerLeadTitle || 'First Lead'}". $0 billed today — $49/mo begins after 14-day trial.`}
          </span>
        </div>
        <button
          onClick={() => setShowBillingModal(true)}
          className="text-emerald-400 hover:text-emerald-300 font-bold underline text-[11px] flex items-center gap-1"
        >
          <CreditCard className="w-3.5 h-3.5" /> Manage Trial & Billing Rules
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            JA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                JobAllies <span className="text-emerald-400">PRO OS</span>
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Full-Stack v5.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Geofenced Lead Radar, Live NLP Quoting, Retailer Carts & P2P Escrow</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Matched Leads</span>
              <span className="text-amber-400 font-bold">{filteredLeads.length} in {radarRadius}mi</span>
            </div>
            <div className="w-px h-6 bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Accepted Leads</span>
              <span className="text-emerald-400 font-bold">{billing.acceptedLeadsCount} Claimed</span>
            </div>
            <div className="w-px h-6 bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Locked Escrow</span>
              <span className="text-sky-400 font-bold">${totalLockedEscrow.toFixed(2)}</span>
            </div>
            <div className="w-px h-6 bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Trade Allies</span>
              <span className="text-white font-bold">{network.length} Partners</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <nav className="flex overflow-x-auto gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'radar' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>1. Geofenced Lead Radar</span>
            <span className="ml-1 bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px]">{filteredLeads.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'voice' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>2. TradeVoice AI & Retailer Carts</span>
            <span className="ml-1 bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px]">{dictationLogs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'network' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Trade Network & P2P Escrow</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'sync' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>4. Integrations & Accounting Export</span>
          </button>
        </nav>

        {/* TAB 1: GEOFENCED LEAD RADAR */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-amber-400" />
                    Geofenced Community Lead Radar & Live Web Scanner
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pull live public homeowner threads, launch targeted Facebook Group / Nextdoor searches, or paste any community post to extract contact & scope.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={radarZip}
                    onChange={(e) => setRadarZip(e.target.value)}
                    className="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none w-44"
                  />
                  <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-2 text-xs">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Radius: <strong className="text-amber-400">{radarRadius} mi</strong></span>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      value={radarRadius}
                      onChange={(e) => setRadarRadius(Number(e.target.value))}
                      className="accent-amber-500 w-24 cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => setShowImportDrawer(!showImportDrawer)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Import FB / Nextdoor Post</span>
                  </button>
                  <button
                    onClick={handleRescanRadar}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'Pulling Live Feeds...' : 'Pull Live Web Leads'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {['ALL', 'Masonry & Concrete', 'Landscaping & Excavation', 'Framing & Carpentry', 'Electrical', 'Plumbing & Mechanical'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTradeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        tradeFilter === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.facebook.com/search/posts?q=${encodeURIComponent((tradeFilter === 'ALL' ? 'contractor recommendation' : tradeFilter) + ' ' + radarZip)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Search Live FB Posts</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://nextdoor.com/news_feed/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Open Nextdoor Feed</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {showImportDrawer && (
                <form onSubmit={handleImportCommunityPost} className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Paste Live Facebook Group / Nextdoor Post Text
                    </h4>
                    <button type="button" onClick={() => setShowImportDrawer(false)} className="text-xs text-slate-400 hover:text-white">Close ✕</button>
                  </div>
                  <textarea
                    rows={3}
                    value={rawPostInput}
                    onChange={(e) => setRawPostInput(e.target.value)}
                    required
                    placeholder="Paste raw post text here, e.g.: 'Looking for a licensed electrician in Westport to install a 240V Tesla charger and replace 6 outdoor floodlights ASAP. Budget around $1,800. Text me at 203-555-0194.'"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="url"
                      value={rawPostUrl}
                      onChange={(e) => setRawPostUrl(e.target.value)}
                      placeholder="Source Post URL (optional)"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="tel"
                      value={rawPostPhone}
                      onChange={(e) => setRawPostPhone(e.target.value)}
                      placeholder="Prospect Phone (auto-extracted if in text)"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs">
                      Extract & Add Lead to Radar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLeads.map(lead => (
                <div key={lead.id} className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                  lead.claimed ? 'border-emerald-500/50' : 'border-slate-800 hover:border-amber-500/40'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {lead.source}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {lead.trade}
                        </span>
                      </div>
                      <a
                        href={lead.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>View Post</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{lead.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{lead.desc}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Homeowner</span>
                        <span className="font-bold text-white">{lead.author}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Proximity & Budget</span>
                        <span className="font-bold text-emerald-400">{lead.location} ({lead.distanceMiles} mi) • {lead.budget}</span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        {lead.claimed ? (
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Unlock className="w-3.5 h-3.5" /> {lead.phone}
                            </span>
                            <a href={`sms:${lead.phone.replace(/[^0-9+]/g, '')}?&body=${encodeURIComponent(`Hi ${lead.author}, I saw your request for "${lead.title}" and would love to provide a quote.`)}`} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all">
                              Text Prospect
                            </a>
                            <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Estimate for ${lead.title}`)}`} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded font-bold hover:bg-sky-500 hover:text-slate-950 transition-all">
                              Email Prospect
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            Direct Phone & Email unlocked upon accepting lead
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLeadAcceptClick(lead)}
                    className={`w-full font-black py-2.5 rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2 ${
                      lead.claimed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {lead.claimed ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Lead Accepted • Re-Open in TradeVoice Quote Builder</span>
                      </>
                    ) : (
                      <span>Accept & Claim Lead {billing.planStatus === 'FREE_EXPLORER' ? '(Starts 14-Day Free Trial)' : ''}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TRADEVOICE AI & RETAILER CARTS */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    TradeVoice AI Field Dictation & Real Line-Item Parser
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Speak or type ANY combination of quantities, materials, prices, vendors, and labor hours. Every item is dynamically parsed and linked to live retailer catalogs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all ${
                    isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isRecording ? 'Listening Live... (Click to Stop)' : 'Start Live Voice Dictation'}</span>
                </button>
              </div>

              <form onSubmit={handleVoiceSubmit} className="space-y-4">
                <textarea
                  rows={3}
                  value={voiceInput}
                  onChange={(e) => setVoiceInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none"
                  placeholder="Speak or type anything, e.g.: '20 sheets of 5/8 drywall at $16.50 from Home Depot Pro, 8 recessed LED lights at $24 each, and 12 hours of crew labor at $75 an hour for Elena Rostova'"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 font-bold text-[11px]">Test Presets:</span>
                    <button
                      type="button"
                      onClick={() => setVoiceInput('16 pressure treated 4x4x10 posts at $28 each from Home Depot Pro, 20 bags of Quikrete at $7.50, and 18 hours of senior crew labor at $70 an hour for David Kowalski')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px]"
                    >
                      Deck & Timber Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceInput('18 Unilock paver pallets at $22.50 from SiteOne Supply, 4 tons of crushed gravel at $45, and 14 hours of master mason labor at $95 an hour for Mark Henderson')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px]"
                    >
                      Stone Patio & SiteOne Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceInput('1 Square D 200A main breaker panel at $340 from Home Depot Pro, 120 feet of copper feeder wire at $4.50, and 10 hours of licensed electrician labor at $110 an hour for Rachel Vance')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px]"
                    >
                      200A Electrical Upgrade
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isParsingVoice}
                    className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg"
                  >
                    {isParsingVoice ? 'Parsing Line Items...' : 'Extract Dual-Track Estimate & Retailer Cart'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">Global Client Material Markup Rate: <span className="text-emerald-400">{globalMarkup}%</span></h3>
                <p className="text-xs text-slate-400">Automatically marks up wholesale material costs on Client Proposals while keeping Wholesale POs at 0%.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {[0, 15, 20, 25, 30, 40].map(m => (
                  <button
                    key={m}
                    onClick={() => setGlobalMarkup(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      globalMarkup === m ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {dictationLogs.map(log => {
                const rawMat = log.materials.reduce((s, m) => s + m.cost * m.qty, 0);
                const clientMat = rawMat * (1 + globalMarkup / 100);
                const laborTotal = log.labor.reduce((s, l) => s + l.hours * l.rate, 0);
                const clientGrandTotal = clientMat + laborTotal;

                return (
                  <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 block">{log.clientName}</span>
                        <span className="text-xs font-mono text-slate-400 italic">"{log.rawText}"</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-white">Client Proposal (SMS / Email / PDF)</span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                              +{globalMarkup}% Material Margin
                            </span>
                          </div>
                          {log.materials.map((m, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-slate-300">
                              <span>{m.qty}x {m.item}</span>
                              <span className="font-mono text-white">${(m.qty * m.cost * (1 + globalMarkup / 100)).toFixed(2)}</span>
                            </div>
                          ))}
                          {log.labor.map((l, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-slate-300">
                              <span>{l.tier} ({l.hours} hrs @ ${l.rate}/hr)</span>
                              <span className="font-mono text-white">${(l.hours * l.rate).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-black text-emerald-400">
                            <span>Client Proposal Total:</span>
                            <span>${clientGrandTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openProposalModal(log)}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send via Text / Email / Platform DM</span>
                        </button>
                      </div>

                      <div className="bg-slate-950 border border-sky-500/30 rounded-xl p-4 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-white">Wholesale Retailer Cart (0% Markup)</span>
                            <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">
                              Direct Retailer Catalog Links
                            </span>
                          </div>
                          {log.materials.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <div>
                                <span className="text-white font-medium">{m.qty}x {m.item}</span>
                                <span className="text-[10px] text-slate-400 block">{m.vendor} • ${m.cost.toFixed(2)}/ea</span>
                              </div>
                              <a
                                href={getRetailerSearchUrl(m.vendor, m.item)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                <span>Shop {m.vendor.split(' ')[0]}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-black text-sky-400">
                            <span>Wholesale Material Subtotal:</span>
                            <span>${rawMat.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadRetailerCsvCart(log)}
                            className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Pro Xtra CSV Cart</span>
                          </button>
                          <button
                            onClick={() => setActivePoLog(log)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-700"
                          >
                            View PO Sheet
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TRADE NETWORK & P2P ESCROW */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Trade Network & Peer Referral Escrow Engine</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Invite local subcontractor allies via SMS/Email, refer out-of-scope jobs, and lock referral commissions in Stripe Escrow.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 px-4 text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Escrow Vault</span>
                  <span className="text-xl font-black text-sky-400">${totalLockedEscrow.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Invite Trade Partner
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Verified Subcontractor Referral Network
                </h3>
                <button
                  onClick={() => setShowReferModal(true)}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs"
                >
                  Refer Won Job & Lock Escrow
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-500 uppercase border-b border-slate-800 font-bold text-[10px]">
                      <th className="p-3">Partner / Company</th>
                      <th className="p-3">Trade</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Fee Split</th>
                      <th className="p-3">Referred</th>
                      <th className="p-3">Earned</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {network.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-white">
                          {p.company}
                          <span className="block text-[10px] text-slate-400">{p.name} • {p.phone}</span>
                        </td>
                        <td className="p-3 text-slate-300">{p.trade}</td>
                        <td className="p-3">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-sky-400">{p.feePercent}%</td>
                        <td className="p-3 text-slate-300 font-bold">{p.referredJobs} Jobs</td>
                        <td className="p-3 font-bold text-emerald-400">${p.lifetimeShared.toFixed(2)}</td>
                        <td className="p-3 text-right space-x-2">
                          <a
                            href={`sms:${p.phone.replace(/[^0-9+]/g, '')}?&body=${encodeURIComponent(`Hey ${p.name}, I have a ${p.trade} job referral for ${p.company} via JobAllies.`)}`}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-block"
                          >
                            Text Ally
                          </a>
                          <button
                            onClick={() => { setSelectedPartnerId(p.id); setShowReferModal(true); }}
                            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[11px]"
                          >
                            Refer Job
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-400" /> Active P2P Referral Escrow Ledger
              </h3>
              <div className="space-y-3">
                {escrowContracts.map(esc => (
                  <div key={esc.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{esc.project}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          esc.status === 'Locked in Escrow' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {esc.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Assigned Partner: <strong className="text-slate-200">{esc.assignedPartner}</strong> ({esc.trade}) • Contract Value: ${esc.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Referral Fee ({esc.feePercent}%)</span>
                        <span className="text-sm font-black text-sky-400">${esc.escrowAmount.toFixed(2)}</span>
                      </div>
                      {esc.status === 'Locked in Escrow' ? (
                        <button
                          onClick={() => releaseEscrow(esc.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs"
                        >
                          Release Payout
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg">Payout Released</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTEGRATIONS & ACCOUNTING EXPORT */}
        {activeTab === 'sync' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-emerald-400" />
                  Retailer, Accounting & Messaging API Hub
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Export invoices directly to QuickBooks CSV or connect optional cloud API keys in Vercel Environment Variables.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = ['InvoiceDate', 'Customer', 'Item', 'Quantity', 'Rate', 'Amount'];
                  const rows: string[] = [];
                  dictationLogs.forEach(l => {
                    l.materials.forEach(m => {
                      const price = m.cost * (1 + globalMarkup / 100);
                      rows.push([new Date().toLocaleDateString(), `"${l.clientName}"`, `"${m.item}"`, m.qty, price.toFixed(2), (m.qty * price).toFixed(2)].join(','));
                    });
                  });
                  const uri = encodeURI('data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n'));
                  const link = document.createElement('a');
                  link.setAttribute('href', uri);
                  link.setAttribute('download', 'JobAllies_QuickBooks_Invoices.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  triggerToast('Exported QuickBooks Online Invoice CSV!', 'success');
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export All Quotes to QuickBooks CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map(item => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{item.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIntegrations(integrations.map(i => i.id === item.id ? { ...i, connected: !i.connected } : i));
                      triggerToast(`Updated ${item.name} status.`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      item.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.connected ? 'Active' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL A: FIRST LEAD ACCEPTANCE -> 14-DAY FREE TRIAL ACTIVATION */}
      {pendingLeadForTrialModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pay-On-Success Guarantee • $0 Due Today
                </span>
                <h3 className="text-lg font-black text-white mt-2">
                  Accept Your 1st Lead & Start Your 14-Day Free Trial
                </h3>
              </div>
              <button onClick={() => setPendingLeadForTrialModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-amber-400">{pendingLeadForTrialModal.title}</div>
              <div className="text-slate-300">Homeowner: <strong>{pendingLeadForTrialModal.author}</strong> • {pendingLeadForTrialModal.location}</div>
              <div className="text-emerald-400 font-bold">Estimated Budget: {pendingLeadForTrialModal.budget}</div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Today ($0.00):</strong> Unlock {pendingLeadForTrialModal.author}&apos;s direct phone number, email, and auto-build your proposal in TradeVoice.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Next 14 Days ($0.00):</strong> Unlimited lead claims, SMS/email proposals, and retailer cart exports.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>After 14-Day Trial ($49/mo):</strong> Billed monthly only after your 14-day trial completes. Cancel anytime in 1 click.</span>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={confirmFirstLeadAndStartTrial}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg"
              >
                Accept Lead & Start 14-Day Free Trial ($0 Today)
              </button>
              <button
                onClick={() => setPendingLeadForTrialModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-3 rounded-xl text-xs"
              >
                Not Yet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: CLIENT PROPOSAL DISPATCH */}
      {activeProposalLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">Client Proposal Dispatch</span>
                <h3 className="text-lg font-bold text-white">{activeProposalLog.clientName}</h3>
              </div>
              <button onClick={() => setActiveProposalLog(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Prospect Mobile (for SMS Text)</label>
                <input
                  type="tel"
                  value={proposalPhone}
                  onChange={(e) => setProposalPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Prospect Email</label>
                <input
                  type="email"
                  value={proposalEmail}
                  onChange={(e) => setProposalEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {formatProposalText(activeProposalLog)}
            </pre>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                onClick={() => dispatchProposalViaChannel('sms')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Send SMS
              </button>
              <button
                onClick={() => dispatchProposalViaChannel('email')}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" /> Send Email
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formatProposalText(activeProposalLog));
                  triggerToast('Copied formatted proposal for Facebook Messenger / Nextdoor DM!', 'success');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Copy for DM
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL C: WHOLESALE PO SHEET */}
      {activePoLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-400">Wholesale Purchase Order (0% Markup)</span>
                <h3 className="text-lg font-bold text-white">PO #{activePoLog.id.toUpperCase()}</h3>
              </div>
              <button onClick={() => setActivePoLog(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {activePoLog.materials.map((m, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{m.qty}x {m.item}</span>
                    <span className="block text-[10px] text-slate-400">SKU: {m.sku} • Vendor: {m.vendor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sky-400 font-bold">${(m.qty * m.cost).toFixed(2)}</span>
                    <a
                      href={getRetailerSearchUrl(m.vendor, m.item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1"
                    >
                      <span>Open Item</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => downloadRetailerCsvCart(activePoLog)}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Bulk Cart CSV
              </button>
              <button
                onClick={() => setActivePoLog(null)}
                className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL D: INVITE TRADE PARTNER */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Invite Trade Partner via SMS or Email</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={(e) => handleInvitePartnerSubmit(e, 'sms')} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Contact Name</label>
                  <input type="text" value={invName} onChange={(e) => setInvName(e.target.value)} required placeholder="Mike Callahan" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Company Name</label>
                  <input type="text" value={invCompany} onChange={(e) => setInvCompany(e.target.value)} required placeholder="Callahan HVAC" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Trade Specialty</label>
                  <select value={invTrade} onChange={(e) => setInvTrade(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                    <option>Plumbing & Mechanical</option>
                    <option>Electrical</option>
                    <option>Masonry & Concrete</option>
                    <option>Landscaping & Excavation</option>
                    <option>Framing & Carpentry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Referral Split (%)</label>
                  <select value={invFee} onChange={(e) => setInvFee(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                    <option value={5}>5% Split</option>
                    <option value={10}>10% Standard Split</option>
                    <option value={12.5}>12.5% Split</option>
                    <option value={15}>15% Split</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mobile Phone (for SMS)</label>
                  <input type="tel" value={invPhone} onChange={(e) => setInvPhone(e.target.value)} required placeholder="(203) 555-0192" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input type="email" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} required placeholder="mike@callahan.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs">
                  Send SMS Invite Link
                </button>
                <button
                  type="button"
                  onClick={(e) => handleInvitePartnerSubmit(e as any, 'email')}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-3 rounded-xl text-xs"
                >
                  Send Email Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL E: REFER WON JOB */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Refer Won Job & Lock P2P Escrow</h3>
              <button onClick={() => setShowReferModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleReferJobSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Project Scope Title</label>
                <input
                  type="text"
                  value={selectedJobTitle}
                  onChange={(e) => setSelectedJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Contract Value ($)</label>
                <input
                  type="number"
                  value={selectedJobValue}
                  onChange={(e) => setSelectedJobValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Assign to Verified Partner</label>
                <select value={selectedPartnerId} onChange={(e) => setSelectedPartnerId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                  {network.map(p => (
                    <option key={p.id} value={p.id}>{p.company} ({p.trade}) — {p.feePercent}% Split</option>
                  ))}
                </select>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Total Project Contract:</span>
                  <span className="text-white font-bold">${selectedJobValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Referral Escrow Deposit:</span>
                  <span className="text-sky-400 font-black text-sm">
                    ${(selectedJobValue * ((network.find(p => p.id === selectedPartnerId)?.feePercent || 10) / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg">
                Confirm Referral & Lock Escrow Funds
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL F: BILLING & 14-DAY TRIAL MANAGEMENT */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                JobAllies Pay-On-Success Billing Engine
              </h3>
              <button onClick={() => setShowBillingModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Tier:</span>
                <span className="font-black text-emerald-400">{billing.planStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Leads Accepted:</span>
                <span className="font-bold text-white">{billing.acceptedLeadsCount} Leads</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">14-Day Trial Triggered:</span>
                <span className="font-bold text-white">
                  {billing.firstLeadAcceptedAt ? new Date(billing.firstLeadAcceptedAt).toLocaleDateString() : 'Not yet triggered ($0/mo)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">First $49/mo Auto-Charge Date:</span>
                <span className="font-bold text-amber-400">
                  {billing.trialEndsAt ? new Date(billing.trialEndsAt).toLocaleDateString() : 'Only after 1st lead + 14 days'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setBilling({
                    planStatus: 'FREE_EXPLORER',
                    acceptedLeadsCount: 0,
                    firstLeadAcceptedAt: null,
                    trialEndsAt: null,
                    triggerLeadTitle: null,
                    monthlyRate: 49.00
                  });
                  setLeads(DEFAULT_LEADS);
                  setShowBillingModal(false);
                  triggerToast('Reset account to Free Explorer Tier (0 accepted leads) for testing.', 'info');
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs border border-slate-700"
              >
                Reset to Free Tier (Test Flow)
              </button>
              <button
                onClick={() => setShowBillingModal(false)}
                className="flex-1 bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
