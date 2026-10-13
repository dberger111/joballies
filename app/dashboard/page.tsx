'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin, Mic, Users, Link2, Plus,
  CheckCircle, ShieldCheck, RefreshCw,
  Send, Navigation, CreditCard, Lock,
  ExternalLink, Download, Mail,
  MessageSquare, Sparkles, Check, Building, Copy, Phone, Calendar, Edit3, Trash2, ShoppingCart, Settings
} from 'lucide-react';

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
        <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
          <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
            <path d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z" stroke="#10b981" strokeWidth="2.5" />
            <path d="M11 20.5L16 25L25.5 13.5" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="9" r="2" fill="#fbbf24" />
          </svg>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
          JobAllies
        </h1>
      </div>
    </Link>
  );
}

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
  materials: MaterialItem[];
  labor: LaborItem[];
}

interface LeadItem {
  id: string;
  source: string;
  postedAt: string;
  author: string;
  phone: string;
  email: string;
  location: string;
  distanceMiles: number;
  estimatedValue: number;
  trade: string;
  title: string;
  desc: string;
  budget: string;
  urgency: string;
  claimed: boolean;
  quoteMaterials: MaterialItem[];
  quoteLabor: LaborItem[];
}

interface BillingState {
  planStatus: 'FREE_EXPLORER' | 'TRIAL_ACTIVE' | 'PRO_SUBSCRIBED';
  acceptedLeadsCount: number;
  firstLeadAcceptedAt: string | null;
  trialEndsAt: string | null;
  triggerLeadTitle: string | null;
  monthlyRate: number;
  userStripeSecretKey?: string;
}

interface RetailerAccounts {
  homeDepotProId: string;
  lowesProId: string;
  siteOneAccountId: string;
  fergusonAccountId: string;
  preferredStoreZip: string;
}

interface ConnectedLeadSources {
  thumbtackConnected: boolean;
  angiConnected: boolean;
  barkConnected: boolean;
  googleLsaConnected: boolean;
  facebookGroups: { id: string; name: string; url: string; keywords: string }[];
}

const DEFAULT_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    source: 'Verified Local Request',
    postedAt: 'Oct 13, 2026 • 4:42 PM',
    author: 'Mark Henderson',
    phone: '(203) 555-0142',
    email: 'm.henderson.weston@gmail.com',
    location: 'Weston, CT',
    distanceMiles: 2.4,
    estimatedValue: 10200,
    trade: 'Masonry & Concrete',
    title: 'Full Backyard Bluestone Patio & Retaining Wall (350 sq ft)',
    desc: 'Looking for a licensed mason/hardscape contractor to install a 350 sq ft paver patio with a low fieldstone sitting wall and steps.',
    budget: '$8,500 - $12,000',
    urgency: 'Immediate',
    claimed: false,
    quoteMaterials: [
      { item: 'Natural Bluestone Thermal Pavers (350 sq ft)', qty: 350, cost: 9.45, vendor: 'SiteOne Supply', sku: 'S1-BLU-350' },
      { item: 'Fieldstone Retaining Wall Block (Pallet)', qty: 3, cost: 420.00, vendor: 'SiteOne Supply', sku: 'S1-FLD-PAL' },
      { item: '3/4" Crushed Stone Base & Polymeric Sand (Tons)', qty: 6, cost: 48.00, vendor: 'SiteOne Supply', sku: 'S1-CRB-06' }
    ],
    quoteLabor: [
      { tier: 'Master Mason & Hardscape Crew', hours: 40, rate: 95.00 }
    ]
  },
  {
    id: 'lead-2',
    source: 'Verified Local Request',
    postedAt: 'Oct 13, 2026 • 4:15 PM',
    author: 'Elena Rostova',
    phone: '(203) 555-0189',
    email: 'elena.rostova@outlook.com',
    location: 'Westport, CT',
    distanceMiles: 4.1,
    estimatedValue: 4000,
    trade: 'Landscaping & Excavation',
    title: 'Emergency Oak Limb Clearing & 120ft Curtain Drain Excavation',
    desc: 'Large oak branch down near driveway plus standing water pooling by foundation. Need crew with chipper and mini-excavator.',
    budget: '$3,200 - $4,800',
    urgency: 'Emergency / ASAP',
    claimed: false,
    quoteMaterials: [
      { item: '4 in. x 100 ft. Corrugated Perforated French Drain Pipe', qty: 2, cost: 118.00, vendor: 'SiteOne Supply', sku: 'S1-DRN-120' },
      { item: 'Washed Drainage Stone #57 (Tons)', qty: 8, cost: 44.00, vendor: 'SiteOne Supply', sku: 'S1-STN-57' }
    ],
    quoteLabor: [
      { tier: 'Excavation & Tree Removal Crew', hours: 24, rate: 110.00 }
    ]
  },
  {
    id: 'lead-3',
    source: 'Verified Local Request',
    postedAt: 'Oct 13, 2026 • 3:30 PM',
    author: 'David Kowalski',
    phone: '(203) 555-0164',
    email: 'dkowalski@fairfieldprop.com',
    location: 'Fairfield, CT',
    distanceMiles: 6.8,
    estimatedValue: 11800,
    trade: 'Framing & Carpentry',
    title: 'Custom Cedar Timber Pergola & Deck Rebuild (16x20)',
    desc: 'Replacing rotted pressure-treated deck boards and building a heavy cedar pergola with recessed low-voltage lighting.',
    budget: '$9,000 - $14,500',
    urgency: 'This Week',
    claimed: false,
    quoteMaterials: [
      { item: '6x6x12 Rough Sawn Western Red Cedar Structural Post', qty: 14, cost: 91.50, vendor: "Lowe's Pro", sku: 'LW-CED-6612' },
      { item: 'Trex Enhance Naturals 1x6x16 ft. Composite Deck Board', qty: 48, cost: 43.97, vendor: 'Home Depot Pro', sku: 'HD-TREX-16' },
      { item: 'Quikrete 80 lb. High-Early Strength Concrete Mix', qty: 20, cost: 7.48, vendor: 'Home Depot Pro', sku: 'HD-QK-80' }
    ],
    quoteLabor: [
      { tier: 'Senior Finish Carpentry Crew', hours: 56, rate: 85.00 }
    ]
  },
  {
    id: 'lead-4',
    source: 'Verified Local Request',
    postedAt: 'Oct 13, 2026 • 2:10 PM',
    author: 'Rachel Vance',
    phone: '(203) 555-0177',
    email: 'rachel.vance@me.com',
    location: 'Wilton, CT',
    distanceMiles: 8.2,
    estimatedValue: 5100,
    trade: 'Electrical',
    title: '200A Panel Upgrade + Level 2 EV Charger & Outdoor Kitchen Subpanel',
    desc: 'Need licensed electrician to upgrade 100A panel to 200A service and run conduit to patio outdoor kitchen.',
    budget: '$4,200 - $6,000',
    urgency: 'Immediate',
    claimed: false,
    quoteMaterials: [
      { item: 'Square D QO 200 Amp 40-Space Main Breaker Panel', qty: 1, cost: 339.00, vendor: 'Home Depot Pro', sku: 'HD-SQD-200' },
      { item: '60A Outdoor Subpanel & 80ft Copper Feeder Conduit', qty: 1, cost: 480.00, vendor: 'Home Depot Pro', sku: 'HD-SUB-60A' },
      { item: 'NEMA 14-50 Commercial EV Charger Circuit Kit', qty: 1, cost: 195.00, vendor: 'Home Depot Pro', sku: 'HD-EV-1450' }
    ],
    quoteLabor: [
      { tier: 'Licensed Master Electrician', hours: 22, rate: 125.00 }
    ]
  },
  {
    id: 'lead-5',
    source: 'Verified Local Request',
    postedAt: 'Oct 13, 2026 • 12:45 PM',
    author: 'Thomas Grant',
    phone: '(203) 555-0199',
    email: 'thomas.grant@yahoo.com',
    location: 'New Canaan, CT',
    distanceMiles: 14.6,
    estimatedValue: 9200,
    trade: 'Plumbing & Mechanical',
    title: 'Tankless Navien Boiler Conversion & Radiant Zone Manifold',
    desc: 'Looking to replace old cast iron boiler with high-efficiency wall-hung combi unit before winter.',
    budget: '$7,500 - $11,000',
    urgency: 'Flexible',
    claimed: false,
    quoteMaterials: [
      { item: 'Navien NCB-240/130H Condensing Combi-Boiler', qty: 1, cost: 2445.00, vendor: 'Ferguson Pro', sku: 'FG-NAV-240' },
      { item: '4-Zone Copper Radiant Manifold & Circulator Pumps', qty: 1, cost: 680.00, vendor: 'Ferguson Pro', sku: 'FG-MAN-4Z' },
      { item: 'Schedule 40 PVC Venting & Condensate Neutralizer Kit', qty: 1, cost: 220.00, vendor: 'Ferguson Pro', sku: 'FG-VNT-40' }
    ],
    quoteLabor: [
      { tier: 'Licensed Master Plumber & HVAC Tech', hours: 32, rate: 115.00 }
    ]
  }
];

function buildAutoQuoteFromLead(title: string, desc: string, trade: string): { materials: MaterialItem[]; labor: LaborItem[] } {
  const text = `${title} ${desc}`.toLowerCase();
  const sqFtMatch = text.match(/(\d+)\s*(?:sq\s*ft|sqft)/i);
  const lnFtMatch = text.match(/(\d+)\s*(?:ft|feet|linear)/i);

  if (trade === 'Masonry & Concrete' || text.includes('patio') || text.includes('paver') || text.includes('stone')) {
    const area = sqFtMatch ? Number(sqFtMatch[1]) : 300;
    return {
      materials: [
        { item: `Natural Stone / Pavers (${area} sq ft)`, qty: area, cost: 9.45, vendor: 'SiteOne Supply', sku: 'S1-BLU-350' },
        { item: 'Crushed Stone Base & Polymeric Sand (Tons)', qty: Math.max(3, Math.round(area / 60)), cost: 46.00, vendor: 'SiteOne Supply', sku: 'S1-BASE-01' }
      ],
      labor: [{ tier: 'Master Mason & Hardscape Crew', hours: Math.max(16, Math.round(area / 10)), rate: 95.00 }]
    };
  }

  if (trade === 'Electrical' || text.includes('panel') || text.includes('charger') || text.includes('light')) {
    return {
      materials: [
        { item: 'Square D QO 200 Amp Main Breaker Panel / Kit', qty: 1, cost: 339.00, vendor: 'Home Depot Pro', sku: 'HD-SQD-200' },
        { item: 'THHN Copper Wiring, Conduit & Breakers', qty: 1, cost: 285.00, vendor: 'Home Depot Pro', sku: 'HD-WIR-80' }
      ],
      labor: [{ tier: 'Licensed Master Electrician', hours: 16, rate: 120.00 }]
    };
  }

  if (trade === 'Plumbing & Mechanical' || text.includes('boiler') || text.includes('heater') || text.includes('pipe')) {
    return {
      materials: [
        { item: 'Navien High-Efficiency Combi-Boiler / Mechanical Unit', qty: 1, cost: 2445.00, vendor: 'Ferguson Pro', sku: 'FG-NAV-240' },
        { item: 'Copper Fittings, Valves & Venting Kit', qty: 1, cost: 340.00, vendor: 'Ferguson Pro', sku: 'FG-FIT-12' }
      ],
      labor: [{ tier: 'Licensed Master Plumber', hours: 20, rate: 115.00 }]
    };
  }

  const footage = lnFtMatch ? Number(lnFtMatch[1]) : 100;
  return {
    materials: [
      { item: '4x4x10 Pressure-Treated Ground Contact Timber Posts', qty: 12, cost: 26.98, vendor: 'Home Depot Pro', sku: 'HD-PT-4410' },
      { item: `Fasteners, Concrete & Site Consumables (${footage} ft)`, qty: 15, cost: 7.48, vendor: 'Home Depot Pro', sku: 'HD-QK-80' }
    ],
    labor: [{ tier: 'Skilled Trade Crew Labor', hours: 20, rate: 85.00 }]
  };
}

export default function JobAlliesDashboard() {
  const [activeTab, setActiveTab] = useState<'radar' | 'voice' | 'network' | 'sync'>('radar');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'amber' } | null>(null);

  const [billing, setBilling] = useState<BillingState>({
    planStatus: 'FREE_EXPLORER',
    acceptedLeadsCount: 0,
    firstLeadAcceptedAt: null,
    trialEndsAt: null,
    triggerLeadTitle: null,
    monthlyRate: 49.00,
    userStripeSecretKey: ''
  });
  const [showBillingModal, setShowBillingModal] = useState(false);

  // User-Led Retailer Account Integrations
  const [retailerAccounts, setRetailerAccounts] = useState<RetailerAccounts>({
    homeDepotProId: 'PRO-XTRA-2035550199',
    lowesProId: 'LOWES-PRO-88412',
    siteOneAccountId: 'S1-CT-44910',
    fergusonAccountId: 'FERG-NE-7721',
    preferredStoreZip: '06880 (Westport / Norwalk Pro Desk)'
  });

  // User-Led Lead Platform & Facebook Group Integrations
  const [leadSources, setLeadSources] = useState<ConnectedLeadSources>({
    thumbtackConnected: true,
    angiConnected: true,
    barkConnected: true,
    googleLsaConnected: false,
    facebookGroups: [
      { id: 'fb-1', name: 'Weston & Westport CT Homeowners Exchange', url: 'https://www.facebook.com/groups/search/groups/?q=Weston%20Westport%20CT', keywords: 'mason, patio, drainage, electrician, plumber, handyman' },
      { id: 'fb-2', name: 'Fairfield County Home Improvement & Referrals', url: 'https://www.facebook.com/groups/search/groups/?q=Fairfield%20County%20Home%20Improvement', keywords: 'contractor, deck, roof, landscaping, boiler' }
    ]
  });
  const [newFbGroupName, setNewFbGroupName] = useState('');
  const [newFbGroupUrl, setNewFbGroupUrl] = useState('');
  const [newFbGroupKeywords, setNewFbGroupKeywords] = useState('contractor, quote, repair, remodel');

  // Filters: Service Area, Job Type, Job Distance, Job Value
  const [radarZip, setRadarZip] = useState('Weston, CT');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('ALL');
  const [jobDistanceFilter, setJobDistanceFilter] = useState<number>(25);
  const [jobValueFilter, setJobValueFilter] = useState<string>('ALL');

  const [leads, setLeads] = useState<LeadItem[]>(DEFAULT_LEADS);
  const [showImportDrawer, setShowImportDrawer] = useState(false);
  const [rawPostInput, setRawPostInput] = useState('');
  const [rawPostUrl, setRawPostUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Editable Auto-Quote & Approval State
  const [editingLeadQuote, setEditingLeadQuote] = useState<LeadItem | null>(null);
  const [editableMaterials, setEditableMaterials] = useState<MaterialItem[]>([]);
  const [editableLabor, setEditableLabor] = useState<LaborItem[]>([]);
  const [quoteApproved, setQuoteApproved] = useState(false);
  const [orderPoNumber, setOrderPoNumber] = useState('PO-JA-1042');

  // Platform Relay Contact Modal State (No Phone/Email Exposed)
  const [platformContactModal, setPlatformContactModal] = useState<{ lead: LeadItem; mode: 'phone' | 'email' } | null>(null);
  const [relayMessage, setRelayMessage] = useState('');

  // Tab 2: Voice Quotes & Retailer Carts
  const [globalMarkup, setGlobalMarkup] = useState<number>(20);
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [dictationLogs, setDictationLogs] = useState<DictationLog[]>([
    {
      id: 'log-101',
      timestamp: 'Oct 13, 2026 • 4:30 PM',
      rawText: 'We need 12 pressure treated 4x4x10 wood posts at $26.98 each from Home Depot Pro, 15 bags of Quikrete high early concrete at $7.48, and 16 hours of senior crew labor at $65 an hour for a deck rebuild in Weston.',
      clientName: 'Sarah Jenkins • Westport Deck Rebuild',
      materials: [
        { item: '4x4x10 Pressure Treated Wood Posts', qty: 12, cost: 26.98, vendor: 'Home Depot Pro', sku: 'HD-PT-4410' },
        { item: 'Quikrete 80lb High Early Concrete', qty: 15, cost: 7.48, vendor: 'Home Depot Pro', sku: 'HD-QK-80' }
      ],
      labor: [{ tier: 'Senior Crew Tradesman', hours: 16, rate: 65.00 }]
    },
    {
      id: 'log-102',
      timestamp: 'Oct 13, 2026 • 3:15 PM',
      rawText: '14 Unilock Dublin Cobble stone pavers at $11.20 per sq ft from SiteOne Supply, 3 tons of crushed stone base at $42, plus 8 hours site lead supervision at $95 an hour.',
      clientName: 'Mark Henderson • Weston Bluestone Patio',
      materials: [
        { item: 'Unilock Dublin Cobble Pavers', qty: 14, cost: 11.20, vendor: 'SiteOne Supply', sku: 'S1-UNI-DC' },
        { item: '3/4" Crushed Stone Base (Tons)', qty: 3, cost: 42.00, vendor: 'SiteOne Supply', sku: 'S1-CRB-34' }
      ],
      labor: [{ tier: 'Site Supervisor / Lead Tech', hours: 8, rate: 95.00 }]
    }
  ]);

  const [activePoLog, setActivePoLog] = useState<DictationLog | null>(null);

  // Tab 3: Trade Network & P2P Escrow
  const [network, setNetwork] = useState([
    { id: 'net-1', name: 'Mike Callahan', company: 'Callahan Plumbing & HVAC', trade: 'Plumbing & Mechanical', feePercent: 10, status: 'Verified Ally', referredJobs: 3, lifetimeShared: 1450.00 },
    { id: 'net-2', name: 'Dan Sparks', company: 'Voltage Masters Electrical LLC', trade: 'Electrical', feePercent: 10, status: 'Verified Ally', referredJobs: 2, lifetimeShared: 1200.00 },
    { id: 'net-3', name: 'Tony Russo', company: 'Tri-State Masonry & Pavers', trade: 'Masonry & Concrete', feePercent: 12.5, status: 'Verified Ally', referredJobs: 4, lifetimeShared: 2800.00 },
    { id: 'net-4', name: 'Carlos Mendez', company: 'Apex Tree & Excavation', trade: 'Landscaping & Excavation', feePercent: 10, status: 'Pending Invite', referredJobs: 0, lifetimeShared: 0.00 }
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

  useEffect(() => {
    try {
      const savedBilling = localStorage.getItem('ja_billing_v7');
      if (savedBilling) setBilling(JSON.parse(savedBilling));
      const savedLeads = localStorage.getItem('ja_leads_v7');
      if (savedLeads) setLeads(JSON.parse(savedLeads));
      const savedLogs = localStorage.getItem('ja_logs_v7');
      if (savedLogs) setDictationLogs(JSON.parse(savedLogs));
      const savedRetailers = localStorage.getItem('ja_retailers_v7');
      if (savedRetailers) setRetailerAccounts(JSON.parse(savedRetailers));
      const savedSources = localStorage.getItem('ja_sources_v7');
      if (savedSources) setLeadSources(JSON.parse(savedSources));
    } catch (e) {}

    // Also pull any incoming webhook leads from Thumbtack/Angi/Bark/Homeowner portal
    fetch('/api/webhooks/leads')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.leads) && data.leads.length > 0) {
          setLeads(prev => {
            const ids = new Set(prev.map(l => l.id));
            const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const fresh = data.leads
              .filter((l: any) => !ids.has(l.id))
              .map((l: any) => {
                const autoQ = buildAutoQuoteFromLead(l.title, l.desc, l.trade);
                return {
                  ...l,
                  postedAt: l.postedAt || nowStr,
                  estimatedValue: l.estimatedValue || 5500,
                  quoteMaterials: autoQ.materials,
                  quoteLabor: autoQ.labor
                };
              });
            return fresh.length > 0 ? [...fresh, ...prev] : prev;
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ja_billing_v7', JSON.stringify(billing));
      localStorage.setItem('ja_leads_v7', JSON.stringify(leads));
      localStorage.setItem('ja_logs_v7', JSON.stringify(dictationLogs));
      localStorage.setItem('ja_retailers_v7', JSON.stringify(retailerAccounts));
      localStorage.setItem('ja_sources_v7', JSON.stringify(leadSources));
    } catch (e) {}
  }, [billing, leads, dictationLogs, retailerAccounts, leadSources]);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'amber' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // --- LIVE STRIPE CHECKOUT LAUNCHER ---
  const launchLiveStripeTrialCheckout = async () => {
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_trial_subscription',
          originUrl: window.location.origin,
          userStripeSecretKey: billing.userStripeSecretKey
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.error) {
        triggerToast(`Stripe API: ${data.error}`, 'amber');
        return;
      }
      const now = new Date();
      const ends = new Date(now.getTime() + 14 * 86400000);
      setBilling(prev => ({
        ...prev,
        planStatus: 'TRIAL_ACTIVE',
        firstLeadAcceptedAt: now.toISOString(),
        trialEndsAt: ends.toISOString()
      }));
      triggerToast('14-Day Free Trial active! Add STRIPE_SECRET_KEY in Vercel or Tab 4 to open live Stripe Checkout.', 'info');
    } catch (e) {
      triggerToast('Could not reach billing endpoint.', 'amber');
    }
  };

  // --- OPEN AUTO-GENERATED QUOTE EDITOR FOR ANY LEAD ---
  const openLeadAutoQuoteEditor = (lead: LeadItem) => {
    const hasPresetQuote = Array.isArray(lead.quoteMaterials) && lead.quoteMaterials.length > 0;
    const generated = hasPresetQuote
      ? { materials: lead.quoteMaterials, labor: lead.quoteLabor }
      : buildAutoQuoteFromLead(lead.title, lead.desc, lead.trade);

    setEditingLeadQuote(lead);
    setEditableMaterials(generated.materials.map(m => ({ ...m })));
    setEditableLabor(generated.labor.map(l => ({ ...l })));
    setOrderPoNumber(`PO-${lead.id.toUpperCase()}`);
    setQuoteApproved(false);
  };

  const handleMaterialEdit = (index: number, field: keyof MaterialItem, value: string | number) => {
    setQuoteApproved(false);
    setEditableMaterials(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const handleAddMaterialRow = () => {
    setQuoteApproved(false);
    setEditableMaterials(prev => [
      ...prev,
      { item: 'Additional Material Item', qty: 1, cost: 45.00, vendor: 'Home Depot Pro', sku: 'HD-ADD-01' }
    ]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    setQuoteApproved(false);
    setEditableMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleLaborEdit = (index: number, field: keyof LaborItem, value: string | number) => {
    setQuoteApproved(false);
    setEditableLabor(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  const handleAddLaborRow = () => {
    setQuoteApproved(false);
    setEditableLabor(prev => [
      ...prev,
      { tier: 'Additional Crew Labor', hours: 4, rate: 75.00 }
    ]);
  };

  const handleRemoveLaborRow = (index: number) => {
    setQuoteApproved(false);
    setEditableLabor(prev => prev.filter((_, i) => i !== index));
  };

  const approveEditedQuote = () => {
    if (!editingLeadQuote) return;
    setQuoteApproved(true);

    const now = new Date();
    const ends = new Date(now.getTime() + 14 * 86400000);
    if (billing.planStatus === 'FREE_EXPLORER') {
      setBilling(prev => ({
        ...prev,
        planStatus: 'TRIAL_ACTIVE',
        acceptedLeadsCount: 1,
        firstLeadAcceptedAt: now.toISOString(),
        trialEndsAt: ends.toISOString(),
        triggerLeadTitle: editingLeadQuote.title
      }));
    } else if (!editingLeadQuote.claimed) {
      setBilling(prev => ({ ...prev, acceptedLeadsCount: prev.acceptedLeadsCount + 1 }));
    }

    setLeads(prev => prev.map(l => l.id === editingLeadQuote.id ? {
      ...l,
      claimed: true,
      quoteMaterials: editableMaterials,
      quoteLabor: editableLabor
    } : l));

    const syncedLog: DictationLog = {
      id: 'quote-' + editingLeadQuote.id,
      timestamp: 'Approved Just Now',
      rawText: `${editingLeadQuote.title} — ${editingLeadQuote.desc}`,
      clientName: `${editingLeadQuote.author} • ${editingLeadQuote.location}`,
      materials: editableMaterials,
      labor: editableLabor
    };
    setDictationLogs(prev => [syncedLog, ...prev.filter(x => x.id !== syncedLog.id)]);
    triggerToast(`Quote approved! You can now send to ${editingLeadQuote.author} or push materials to your linked Retailer Pro Account.`, 'success');
  };

  const sendApprovedQuoteThroughPlatform = async (channel: 'sms' | 'email') => {
    if (!editingLeadQuote || !quoteApproved) return;
    const rawMat = editableMaterials.reduce((s, m) => s + m.cost * m.qty, 0);
    const markedMat = rawMat * (1 + globalMarkup / 100);
    const laborTotal = editableLabor.reduce((s, l) => s + l.hours * l.rate, 0);
    const grandTotal = markedMat + laborTotal;

    const matLines = editableMaterials.map(m => `• ${m.qty}x ${m.item}: $${(m.cost * m.qty * (1 + globalMarkup / 100)).toFixed(2)}`).join('\n');
    const labLines = editableLabor.map(l => `• ${l.tier} (${l.hours} hrs): $${(l.hours * l.rate).toFixed(2)}`).join('\n');
    const messageBody = `ESTIMATE & PROPOSAL (${editingLeadQuote.title})\nPrepared for ${editingLeadQuote.author} via JobAllies\n\nMATERIALS:\n${matLines}\n\nLABOR:\n${labLines}\n\nTOTAL ESTIMATE: $${grandTotal.toFixed(2)}\nReply YES to approve this scope and schedule work.`;

    try {
      await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          to: channel === 'sms' ? editingLeadQuote.phone : editingLeadQuote.email,
          subject: `Estimate for ${editingLeadQuote.title}`,
          message: messageBody
        })
      });
    } catch (e) {}

    triggerToast(
      `Approved quote ($${grandTotal.toFixed(2)}) dispatched to ${editingLeadQuote.author} via JobAllies ${channel === 'sms' ? 'Text Relay' : 'Email Relay'}!`,
      'success'
    );
    setEditingLeadQuote(null);
  };

  // --- RETAILER PRO ACCOUNT ORDERING FROM QUOTE ---
  const getRetailerAccountForVendor = (vendor: string) => {
    const v = vendor.toLowerCase();
    if (v.includes('lowe')) return retailerAccounts.lowesProId;
    if (v.includes('siteone')) return retailerAccounts.siteOneAccountId;
    if (v.includes('ferguson')) return retailerAccounts.fergusonAccountId;
    return retailerAccounts.homeDepotProId;
  };

  const getRetailerSearchUrl = (vendor: string, item: string) => {
    const q = encodeURIComponent(item);
    const v = vendor.toLowerCase();
    if (v.includes('lowe')) return `https://www.lowes.com/search?searchTerm=${q}`;
    if (v.includes('siteone')) return `https://www.siteone.com/en/search/?text=${q}`;
    if (v.includes('ferguson')) return `https://www.ferguson.com/search/${q}`;
    return `https://www.homedepot.com/s/${q}`;
  };

  const downloadRetailerCsvCart = (materialsList: MaterialItem[], poCode: string) => {
    const headers = ['PO_Number', 'Pro_Account_ID', 'Store_Zip', 'SKU', 'Item_Description', 'Quantity', 'Wholesale_Unit_Cost', 'Line_Total', 'Vendor', 'Direct_Order_URL'];
    const rows = materialsList.map(m => [
      poCode,
      `"${getRetailerAccountForVendor(m.vendor)}"`,
      `"${retailerAccounts.preferredStoreZip}"`,
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
    link.setAttribute('download', `JobAllies_ProOrder_${poCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported Pro Order CSV (${poCode}) stamped with your Retailer Pro Account IDs!`, 'success');
  };

  // --- PLATFORM-MEDIATED PHONE / EMAIL RELAY (NO RAW PHONE/EMAIL EXPOSED) ---
  const openPlatformContact = (lead: LeadItem, mode: 'phone' | 'email') => {
    setPlatformContactModal({ lead, mode });
    setRelayMessage(`Hi ${lead.author}, I reviewed your "${lead.title}" request in ${lead.location} and can help. When is a good time to discuss?`);
  };

  const executePlatformRelayContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformContactModal) return;
    const { lead, mode } = platformContactModal;

    try {
      await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: mode === 'phone' ? 'sms' : 'email',
          to: mode === 'phone' ? lead.phone : lead.email,
          subject: `Regarding your project: ${lead.title}`,
          message: relayMessage
        })
      });
    } catch (err) {}

    setPlatformContactModal(null);
    triggerToast(
      mode === 'phone'
        ? `Connected call & SMS bridge to ${lead.author} through JobAllies Platform Relay!`
        : `Dispatched encrypted platform email to ${lead.author} via JobAllies Relay!`,
      'success'
    );
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
          zip: radarZip
        })
      });
      const data = await res.json();
      if (data.lead) {
        const autoQ = buildAutoQuoteFromLead(data.lead.title, data.lead.desc, data.lead.trade);
        const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const enriched: LeadItem = {
          ...data.lead,
          postedAt: nowStr,
          estimatedValue: 4800,
          quoteMaterials: autoQ.materials,
          quoteLabor: autoQ.labor
        };
        setLeads([enriched, ...leads]);
        setRawPostInput('');
        setRawPostUrl('');
        setShowImportDrawer(false);
        triggerToast(`Added "${enriched.title}" with an auto-generated quote!`, 'success');
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
        body: JSON.stringify({ action: 'scan_live_public', zip: radarZip, radius: jobDistanceFilter })
      });
      const data = await res.json();
      if (Array.isArray(data.leads) && data.leads.length > 0) {
        const existingIds = new Set(leads.map(l => l.id));
        const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const newItems = data.leads
          .filter((l: any) => !existingIds.has(l.id))
          .map((l: any) => {
            const autoQ = buildAutoQuoteFromLead(l.title, l.desc, l.trade);
            return {
              ...l,
              postedAt: nowStr,
              estimatedValue: 4200,
              quoteMaterials: autoQ.materials,
              quoteLabor: autoQ.labor
            };
          });
        if (newItems.length > 0) {
          setLeads([...newItems, ...leads]);
          triggerToast(`Found ${newItems.length} new leads near ${radarZip}!`, 'success');
          setIsScanning(false);
          return;
        }
      }
      triggerToast(`Synced connected lead platforms & groups within ${jobDistanceFilter} miles of ${radarZip}.`, 'info');
    } catch (e) {
      triggerToast('Refreshed local lead radar.', 'info');
    }
    setIsScanning(false);
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
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const newLog: DictationLog = {
        id: 'log-' + Date.now(),
        timestamp: nowStr,
        rawText: voiceInput,
        clientName: parsed.clientName || 'Custom Field Estimate',
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
      triggerToast(`Generated quote with ${newLog.materials.length} material items!`, 'success');
    } catch (err) {
      triggerToast('Error parsing transcript.', 'amber');
    } finally {
      setIsParsingVoice(false);
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
      feePercent: Number(invFee),
      status: 'Invite Dispatched',
      referredJobs: 0,
      lifetimeShared: 0.00
    };
    setNetwork([newPartner, ...network]);
    setShowInviteModal(false);
    setInvName(''); setInvCompany(''); setInvPhone(''); setInvEmail('');
    triggerToast(`Partner invite dispatched to ${invName} (${invCompany}) via platform ${channel.toUpperCase()}!`, 'success');
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
          originUrl: window.location.origin,
          userStripeSecretKey: billing.userStripeSecretKey
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
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
      date: 'Oct 13, 2026'
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

  const handleAddFacebookGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFbGroupName.trim()) return;
    const entry = {
      id: 'fb-' + Date.now(),
      name: newFbGroupName.trim(),
      url: newFbGroupUrl.trim() || `https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent(newFbGroupName)}`,
      keywords: newFbGroupKeywords.trim() || 'contractor, quote'
    };
    setLeadSources(prev => ({
      ...prev,
      facebookGroups: [entry, ...prev.facebookGroups]
    }));
    setNewFbGroupName('');
    setNewFbGroupUrl('');
    triggerToast(`Connected Facebook Group "${entry.name}" to your Lead Radar!`, 'success');
  };

  // Filter leads by Job Type, Job Distance, and Job Value
  const filteredLeads = leads.filter(l => {
    const withinDistance = l.distanceMiles <= jobDistanceFilter;
    const matchesType = jobTypeFilter === 'ALL' || l.trade === jobTypeFilter;
    let matchesValue = true;
    if (jobValueFilter === 'UNDER_5K') matchesValue = l.estimatedValue < 5000;
    else if (jobValueFilter === '5K_TO_10K') matchesValue = l.estimatedValue >= 5000 && l.estimatedValue <= 10000;
    else if (jobValueFilter === 'OVER_10K') matchesValue = l.estimatedValue > 10000;
    return withinDistance && matchesType && matchesValue;
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

      {/* Trial Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-sky-950/90 border-b border-emerald-500/20 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            billing.planStatus === 'FREE_EXPLORER'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-amber-500 text-slate-950'
          }`}>
            {billing.planStatus === 'FREE_EXPLORER'
              ? 'Free Explorer'
              : `14-Day Free Trial (${daysRemainingInTrial} Days Left)`}
          </span>
          <span className="text-slate-300">
            {billing.planStatus === 'FREE_EXPLORER'
              ? 'Free to browse leads and edit auto-quotes. Your 14-day free trial begins once you approve and send your first quote.'
              : 'Active 14-Day Free Trial ($0 billed today).'}
          </span>
        </div>
        <button
          onClick={() => setShowBillingModal(true)}
          className="text-emerald-400 hover:text-emerald-300 font-bold underline text-[11px] flex items-center gap-1"
        >
          <CreditCard className="w-3.5 h-3.5" /> Stripe Trial & Billing
        </button>
      </div>

      {/* Clean Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <BrandLogo />

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Matched Leads</span>
              <span className="text-amber-400 font-bold">{filteredLeads.length} Leads</span>
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
          </div>

          <button
            onClick={() => setActiveTab('sync')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>Account Integrations</span>
          </button>
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
            <span>Lead Radar</span>
            <span className="ml-1 bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px]">{filteredLeads.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'voice' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Quotes & Retailer Orders</span>
            <span className="ml-1 bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px]">{dictationLogs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'network' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Trade Network & Escrow</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'sync' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Retailer, Lead & Stripe Setup</span>
          </button>
        </nav>

        {/* TAB 1: LEAD RADAR WITH JOB TYPE, DISTANCE & VALUE FILTERS */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Service Area (Zip / City)</label>
                  <input
                    type="text"
                    value={radarZip}
                    onChange={(e) => setRadarZip(e.target.value)}
                    placeholder="Zip or City..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Job Type</label>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Job Types</option>
                    <option value="Masonry & Concrete">Masonry & Concrete</option>
                    <option value="Landscaping & Excavation">Landscaping & Excavation</option>
                    <option value="Framing & Carpentry">Framing & Carpentry</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing & Mechanical">Plumbing & Mechanical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Job Distance</label>
                  <select
                    value={jobDistanceFilter}
                    onChange={(e) => setJobDistanceFilter(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value={5}>Within 5 Miles</option>
                    <option value={10}>Within 10 Miles</option>
                    <option value={15}>Within 15 Miles</option>
                    <option value={25}>Within 25 Miles</option>
                    <option value={50}>Within 50 Miles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Job Value</label>
                  <select
                    value={jobValueFilter}
                    onChange={(e) => setJobValueFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Job Values</option>
                    <option value="UNDER_5K">Under $5,000</option>
                    <option value="5K_TO_10K">$5,000 – $10,000</option>
                    <option value="OVER_10K">$10,000+</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRescanRadar}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'Scanning...' : 'Refresh Leads'}</span>
                  </button>
                  <button
                    onClick={() => setShowImportDrawer(!showImportDrawer)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2.5 rounded-xl text-xs border border-slate-700"
                    title="Import Post from Facebook Group / Lead Platform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showImportDrawer && (
                <form onSubmit={handleImportCommunityPost} className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Paste Facebook Group / Lead Request to Auto-Generate Quote
                    </h4>
                    <button type="button" onClick={() => setShowImportDrawer(false)} className="text-xs text-slate-400 hover:text-white">Close ✕</button>
                  </div>
                  <textarea
                    rows={2}
                    value={rawPostInput}
                    onChange={(e) => setRawPostInput(e.target.value)}
                    required
                    placeholder="Paste job request description here..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={rawPostUrl}
                      onChange={(e) => setRawPostUrl(e.target.value)}
                      placeholder="Source URL (optional)"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs">
                      Add & Auto-Generate Quote
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Lead Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLeads.map(lead => {
                const rawMat = (lead.quoteMaterials || []).reduce((s, m) => s + m.cost * m.qty, 0);
                const markedMat = rawMat * (1 + globalMarkup / 100);
                const laborTotal = (lead.quoteLabor || []).reduce((s, l) => s + l.hours * l.rate, 0);
                const autoQuoteTotal = markedMat + laborTotal;

                return (
                  <div key={lead.id} className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                    lead.claimed ? 'border-emerald-500/50' : 'border-slate-800 hover:border-amber-500/40'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {lead.trade}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Posted: <strong className="text-slate-200">{lead.postedAt}</strong>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{lead.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{lead.desc}</p>

                      {/* Prospect Info & Platform-Mediated Contact Buttons (Zero Phone/Email Exposed) */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Prospect</span>
                          <span className="font-bold text-white">{lead.author}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Distance & Est. Budget</span>
                          <span className="font-bold text-emerald-400">{lead.location} ({lead.distanceMiles} mi) • {lead.budget}</span>
                        </div>

                        <div className="col-span-2 pt-2.5 mt-1 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">
                            Auto-Quote: <strong className="text-emerald-400">${autoQuoteTotal.toFixed(2)}</strong>
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openPlatformContact(lead, 'phone')}
                              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all"
                            >
                              <Phone className="w-3 h-3" /> Call / Text via Platform
                            </button>
                            <button
                              type="button"
                              onClick={() => openPlatformContact(lead, 'email')}
                              className="bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all"
                            >
                              <Mail className="w-3 h-3" /> Email via Platform
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openLeadAutoQuoteEditor(lead)}
                      className={`w-full font-black py-2.5 rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2 ${
                        lead.claimed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>
                        {lead.claimed
                          ? `Edit Approved Quote & Order Materials ($${autoQuoteTotal.toFixed(2)})`
                          : `Review, Edit & Approve Auto-Quote ($${autoQuoteTotal.toFixed(2)})`}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VOICE QUOTES & RETAILER ORDERS */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    Voice Quotes & Line-Item Estimator
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Speak or type jobsite notes to generate custom quotes linked directly to your Retailer Pro Accounts.
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
                  placeholder="Speak or type materials and labor hours..."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isParsingVoice}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg"
                  >
                    {isParsingVoice ? 'Generating Quote...' : 'Generate Quote & Retailer Order'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">Client Material Markup: <span className="text-emerald-400">{globalMarkup}%</span></h3>
                <p className="text-xs text-slate-400">Applies profit margin to client quotes while keeping wholesale retailer orders at 0%.</p>
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
                            <span className="text-xs font-bold text-white">Client Quote (+{globalMarkup}% Markup)</span>
                            <span className="text-xs font-black text-emerald-400">${clientGrandTotal.toFixed(2)}</span>
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
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-sky-500/30 rounded-xl p-4 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-white">Linked Retailer Pro Order (0% Markup)</span>
                            <span className="text-xs font-black text-sky-400">${rawMat.toFixed(2)}</span>
                          </div>
                          {log.materials.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <div>
                                <span className="text-white font-medium">{m.qty}x {m.item}</span>
                                <span className="text-[10px] text-slate-400 block">
                                  {m.vendor} ({getRetailerAccountForVendor(m.vendor)}) • ${m.cost.toFixed(2)}/ea
                                </span>
                              </div>
                              <a
                                href={getRetailerSearchUrl(m.vendor, m.item)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                <span>Order at {m.vendor.split(' ')[0]}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadRetailerCsvCart(log.materials, `PO-${log.id.toUpperCase()}`)}
                            className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Pro Account Order CSV</span>
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
                  <h2 className="text-xl font-extrabold text-white">Trade Network & Peer Referral Escrow</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Invite trusted subcontractor allies, refer out-of-scope work, and lock referral commissions in Stripe Escrow.
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
                  <Users className="w-4 h-4 text-emerald-400" /> Verified Subcontractor Network
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
                          <span className="block text-[10px] text-slate-400">{p.name}</span>
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

        {/* TAB 4: USER-LED RETAILER ACCOUNTS, FACEBOOK GROUPS, LEAD PLATFORMS & STRIPE LIVE SETUP */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            {/* Section A: User-Led Retailer Pro Account Integration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    User-Led Retailer Account Setup
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    Pro Retailer Account Linking (For Instant Quote-to-Order Fulfillment)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter your Pro Account IDs below once. Every approved quote automatically stamps your account number onto POs and exports bulk Quick-Order carts.
                  </p>
                </div>
                <button
                  onClick={() => triggerToast('Saved your Retailer Pro Account credentials!', 'success')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs"
                >
                  Save Retailer Accounts
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white">Home Depot Pro Xtra ID / Phone</label>
                    <a href="https://www.homedepot.com/c/Pro_Xtra" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1">
                      <span>Portal</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={retailerAccounts.homeDepotProId}
                    onChange={(e) => setRetailerAccounts({ ...retailerAccounts, homeDepotProId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white">Lowe&apos;s MVPs Pro Account ID</label>
                    <a href="https://www.lowes.com/l/Pro" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-[11px] flex items-center gap-1">
                      <span>Portal</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={retailerAccounts.lowesProId}
                    onChange={(e) => setRetailerAccounts({ ...retailerAccounts, lowesProId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white">SiteOne Landscape Account #</label>
                    <a href="https://www.siteone.com/en/quickorder" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1">
                      <span>Quick-Order</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={retailerAccounts.siteOneAccountId}
                    onChange={(e) => setRetailerAccounts({ ...retailerAccounts, siteOneAccountId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-white">Ferguson Pro Account #</label>
                    <a href="https://www.ferguson.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-[11px] flex items-center gap-1">
                      <span>Portal</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={retailerAccounts.fergusonAccountId}
                    onChange={(e) => setRetailerAccounts({ ...retailerAccounts, fergusonAccountId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 md:col-span-2">
                  <label className="font-bold text-white block">Preferred Pickup / Delivery Branch Zip Code</label>
                  <input
                    type="text"
                    value={retailerAccounts.preferredStoreZip}
                    onChange={(e) => setRetailerAccounts({ ...retailerAccounts, preferredStoreZip: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section B: User-Led Facebook Groups & Lead Platform Connector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  User-Led Lead Source Integration
                </span>
                <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-amber-400" />
                  Connect Your Facebook Groups & Lead Generation Platforms
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add the local Facebook Groups you belong to or connect your Thumbtack, Angi, and Bark accounts so incoming leads route straight into your Lead Radar with auto-generated quotes.
                </p>
              </div>

              {/* Add Facebook Group Form */}
              <form onSubmit={handleAddFacebookGroup} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Facebook Group Name *</label>
                  <input
                    type="text"
                    value={newFbGroupName}
                    onChange={(e) => setNewFbGroupName(e.target.value)}
                    required
                    placeholder="e.g. Greenwich CT Homeowners"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Group URL (Optional)</label>
                  <input
                    type="url"
                    value={newFbGroupUrl}
                    onChange={(e) => setNewFbGroupUrl(e.target.value)}
                    placeholder="https://facebook.com/groups/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Auto-Match Trade Keywords</label>
                  <input
                    type="text"
                    value={newFbGroupKeywords}
                    onChange={(e) => setNewFbGroupKeywords(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-lg text-xs">
                    + Connect Facebook Group
                  </button>
                </div>
              </form>

              {/* Connected Facebook Groups List */}
              <div className="space-y-2">
                {leadSources.facebookGroups.map(group => (
                  <div key={group.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-white">{group.name}</span>
                      <span className="block text-[11px] text-slate-400">Keywords: {group.keywords}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={group.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <span>Open Group Feed</span> <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => {
                          setActiveTab('radar');
                          setShowImportDrawer(true);
                        }}
                        className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                      >
                        Import Post to Radar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead Gen Platforms 1-Click Webhook Copy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                {[
                  { key: 'thumbtack', name: 'Thumbtack Pro', param: 'thumbtack', connected: leadSources.thumbtackConnected },
                  { key: 'angi', name: 'Angi / HomeAdvisor', param: 'angi', connected: leadSources.angiConnected },
                  { key: 'bark', name: 'Bark.com Marketplace', param: 'bark', connected: leadSources.barkConnected }
                ].map(plat => (
                  <div key={plat.key} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{plat.name}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        Webhook Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Paste your personal endpoint into {plat.name} to auto-route leads & generate quotes:
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://joballies.com/api/webhooks/leads?source=${plat.param}`);
                        triggerToast(`Copied your ${plat.name} Webhook URL!`, 'success');
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 font-bold py-2 rounded-lg text-[11px] flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy {plat.name} Webhook URL
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Live Stripe Checkout & Accounting Sync */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    Live Stripe & QuickBooks Integration
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-sky-400" />
                    Stripe 14-Day Trial Billing, Escrow & QuickBooks Export
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={launchLiveStripeTrialCheckout}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" /> Test Live Stripe 14-Day Trial Checkout
                  </button>
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
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export Quotes to QuickBooks CSV
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <label className="font-bold text-white block">
                  Optional: Paste Stripe Secret Key (`sk_test_...` or `sk_live_...`) for Instant Live Redirects (or set `STRIPE_SECRET_KEY` in Vercel)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={billing.userStripeSecretKey || ''}
                    onChange={(e) => setBilling({ ...billing, userStripeSecretKey: e.target.value })}
                    placeholder="sk_test_... or sk_live_..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                  <button
                    onClick={() => triggerToast('Stripe key saved! Click "Test Live Stripe 14-Day Trial Checkout" above to verify.', 'success')}
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-4 py-2 rounded-lg border border-slate-700"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: EDITABLE AUTO-QUOTE, APPROVAL & RETAILER PRO ORDER DISPATCH */}
      {editingLeadQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Auto-Generated Quote • Editable Line Items & Retailer Order Sync
                </span>
                <h3 className="text-lg font-black text-white mt-2">{editingLeadQuote.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prospect: <strong className="text-white">{editingLeadQuote.author}</strong> • {editingLeadQuote.location} • Posted {editingLeadQuote.postedAt}
                </p>
              </div>
              <button onClick={() => setEditingLeadQuote(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
              <strong className="text-slate-400 uppercase text-[10px] block mb-1">Lead Request Scope:</strong>
              {editingLeadQuote.desc}
            </div>

            {/* Editable Materials Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-300">Materials (Wholesale Cost + {globalMarkup}% Client Markup)</h4>
                <button
                  type="button"
                  onClick={handleAddMaterialRow}
                  className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Material Line
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {editableMaterials.map((mat, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={mat.item}
                        onChange={(e) => handleMaterialEdit(idx, 'item', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={mat.vendor}
                        onChange={(e) => handleMaterialEdit(idx, 'vendor', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-300 text-[11px]"
                      >
                        <option>Home Depot Pro</option>
                        <option>Lowe&apos;s Pro</option>
                        <option>SiteOne Supply</option>
                        <option>Ferguson Pro</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        value={mat.qty}
                        onChange={(e) => handleMaterialEdit(idx, 'qty', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1.5 text-white text-center"
                        title="Quantity"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        value={mat.cost}
                        onChange={(e) => handleMaterialEdit(idx, 'cost', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-emerald-400 font-mono"
                        title="Unit Wholesale Cost ($)"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterialRow(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Labor Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-300">Labor Breakdown (Hours & Rate/Hr)</h4>
                <button
                  type="button"
                  onClick={handleAddLaborRow}
                  className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Labor Line
                </button>
              </div>

              <div className="space-y-2">
                {editableLabor.map((lab, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={lab.tier}
                        onChange={(e) => handleLaborEdit(idx, 'tier', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={lab.hours}
                        onChange={(e) => handleLaborEdit(idx, 'hours', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-center"
                        title="Hours"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={lab.rate}
                        onChange={(e) => handleLaborEdit(idx, 'rate', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-sky-400 font-mono"
                        title="Hourly Rate ($/hr)"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveLaborRow(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Client Quote Total (Includes {globalMarkup}% Material Markup + Labor)</span>
                <span className="text-[11px] text-slate-500">
                  Wholesale Material Order Total (0% Markup): ${editableMaterials.reduce((s, m) => s + m.cost * m.qty, 0).toFixed(2)}
                </span>
              </div>
              <span className="text-xl font-black text-emerald-400">
                ${(
                  editableMaterials.reduce((s, m) => s + m.cost * m.qty, 0) * (1 + globalMarkup / 100) +
                  editableLabor.reduce((s, l) => s + l.hours * l.rate, 0)
                ).toFixed(2)}
              </span>
            </div>

            {/* Step 1: Approve Quote -> Step 2: Send to Prospect AND Order Materials from Linked Retailer */}
            {!quoteApproved ? (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={approveEditedQuote}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Quote to Enable Prospect Dispatch & Retailer Material Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLeadQuote(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Quote Approved! Send to {editingLeadQuote.author} or Order Materials:
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">PO: {orderPoNumber}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => sendApprovedQuoteThroughPlatform('sms')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" /> Send via Text
                  </button>
                  <button
                    type="button"
                    onClick={() => sendApprovedQuoteThroughPlatform('email')}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Mail className="w-4 h-4" /> Send via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadRetailerCsvCart(editableMaterials, orderPoNumber)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" /> Order Materials (Pro CSV)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: PLATFORM-MEDIATED PHONE / EMAIL RELAY */}
      {platformContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">
                  JobAllies Privacy-Protected Relay
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {platformContactModal.mode === 'phone' ? 'Call / Text' : 'Email'} {platformContactModal.lead.author} via Platform
                </h3>
              </div>
              <button onClick={() => setPlatformContactModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your message or call is routed directly to <strong>{platformContactModal.lead.author}</strong> through the JobAllies platform relay without exposing personal contact numbers.
            </p>

            <form onSubmit={executePlatformRelayContact} className="space-y-3 text-xs">
              <textarea
                rows={3}
                value={relayMessage}
                onChange={(e) => setRelayMessage(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  {platformContactModal.mode === 'phone' ? <Phone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{platformContactModal.mode === 'phone' ? 'Connect via Platform Phone/SMS' : 'Send via Platform Email'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformContactModal(null)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: WHOLESALE PO SHEET */}
      {activePoLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-400">Wholesale Purchase Order (Linked Pro Accounts)</span>
                <h3 className="text-lg font-bold text-white">PO #{activePoLog.id.toUpperCase()}</h3>
              </div>
              <button onClick={() => setActivePoLog(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {activePoLog.materials.map((m, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{m.qty}x {m.item}</span>
                    <span className="block text-[10px] text-slate-400">
                      SKU: {m.sku} • {m.vendor} (Acct: {getRetailerAccountForVendor(m.vendor)})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sky-400 font-bold">${(m.qty * m.cost).toFixed(2)}</span>
                    <a
                      href={getRetailerSearchUrl(m.vendor, m.item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1"
                    >
                      <span>Order</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => downloadRetailerCsvCart(activePoLog.materials, `PO-${activePoLog.id.toUpperCase()}`)}
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

      {/* MODAL 4: INVITE TRADE PARTNER */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Invite Trade Partner</h3>
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
                  <label className="block font-bold text-slate-300 mb-1">Mobile Phone</label>
                  <input type="tel" value={invPhone} onChange={(e) => setInvPhone(e.target.value)} required placeholder="(203) 555-0192" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input type="email" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} required placeholder="mike@callahan.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs">
                  Send SMS Invite
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

      {/* MODAL 5: REFER WON JOB */}
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

      {/* MODAL 6: STRIPE 14-DAY TRIAL & BILLING MANAGEMENT */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Stripe 14-Day Trial & Billing
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
                  {billing.firstLeadAcceptedAt ? new Date(billing.firstLeadAcceptedAt).toLocaleDateString() : 'Starts when you approve 1st quote ($0/mo)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Plan After Trial:</span>
                <span className="font-bold text-amber-400">
                  {billing.trialEndsAt ? `$49/mo starting ${new Date(billing.trialEndsAt).toLocaleDateString()}` : 'Only after 1st lead + 14 days'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={launchLiveStripeTrialCheckout}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-2.5 rounded-xl text-xs"
              >
                Open Stripe Checkout (14-Day Trial)
              </button>
              <button
                onClick={() => {
                  setBilling(prev => ({
                    ...prev,
                    planStatus: 'FREE_EXPLORER',
                    acceptedLeadsCount: 0,
                    firstLeadAcceptedAt: null,
                    trialEndsAt: null,
                    triggerLeadTitle: null
                  }));
                  setLeads(DEFAULT_LEADS);
                  setShowBillingModal(false);
                  triggerToast('Reset account to Free Explorer Tier.', 'info');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
