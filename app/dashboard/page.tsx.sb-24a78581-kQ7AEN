<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JobAllies PRO OS - Standalone Contractor Operating System</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        slate: {
                            850: '#0f172a',
                            950: '#090d16',
                        },
                        emerald: {
                            400: '#34d399',
                            500: '#10b981',
                            600: '#059669',
                        },
                        sky: {
                            400: '#38bdf8',
                            500: '#0ea5e9',
                        },
                        amber: {
                            400: '#fbbf24',
                            500: '#f59e0b',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #090d16;
            color: #f8fafc;
        }
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #475569;
        }
        .pulse-ring {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            animation: pulse-animation 1.8s infinite;
        }
        @keyframes pulse-animation {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">

    <!-- Toast Notification Container -->
    <div id="toast-container" class="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none"></div>

    <!-- Application Header -->
    <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
                JA
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-xl font-black tracking-tight text-white">JobAllies <span class="text-emerald-400">PRO OS</span></h1>
                    <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Contractor v3.4</span>
                </div>
                <p class="text-xs text-slate-400">Field Operations, Geofenced Leads & Trade Network Network</p>
            </div>
        </div>

        <!-- Top Right Contractor Badge & Quick Stats -->
        <div class="flex items-center gap-3">
            <div class="hidden md:flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                <div>
                    <span class="text-slate-500 block text-[10px] uppercase font-bold">Active Leads</span>
                    <span id="stat-active-leads" class="text-amber-400 font-bold">4 Leads</span>
                </div>
                <div class="w-px h-6 bg-slate-800"></div>
                <div>
                    <span class="text-slate-500 block text-[10px] uppercase font-bold">Pending Quotes</span>
                    <span id="stat-pending-quotes" class="text-emerald-400 font-bold">$128,450.00</span>
                </div>
                <div class="w-px h-6 bg-slate-800"></div>
                <div>
                    <span class="text-slate-500 block text-[10px] uppercase font-bold">Locked Escrow</span>
                    <span id="stat-locked-escrow" class="text-sky-400 font-bold">$450.00</span>
                </div>
                <div class="w-px h-6 bg-slate-800"></div>
                <div>
                    <span class="text-slate-500 block text-[10px] uppercase font-bold">Trade Network</span>
                    <span id="stat-network-count" class="text-white font-bold">4 Partners</span>
                </div>
            </div>

            <div class="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-1.5 px-3 text-xs font-medium">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <i class="fa-solid fa-hard-hat"></i>
                </div>
                <div class="text-left hidden lg:block">
                    <div class="text-white font-semibold leading-none">Apex Hardscapes & Trades</div>
                    <span class="text-[10px] text-slate-400">License #CT-489021</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Container -->
    <div class="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">

        <!-- Tab Navigation Control Bar -->
        <nav class="flex overflow-x-auto gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner no-scrollbar">
            <button onclick="switchTab('radar')" id="tab-btn-radar" class="tab-btn flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60">
                <i class="fa-solid fa-radar text-base"></i>
                <span>1. Geofenced Lead Radar</span>
                <span class="ml-1 bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">4 New</span>
            </button>
            <button onclick="switchTab('voice')" id="tab-btn-voice" class="tab-btn flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60">
                <i class="fa-solid fa-microphone-lines text-base"></i>
                <span>2. TradeVoice & Dual Quotes</span>
            </button>
            <button onclick="switchTab('network')" id="tab-btn-network" class="tab-btn flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 bg-emerald-500 text-slate-950 shadow-md">
                <i class="fa-solid fa-users-gear text-base"></i>
                <span>3. Trade Network & Escrow</span>
                <span class="ml-1 bg-slate-950/20 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">EXPANDED</span>
            </button>
            <button onclick="switchTab('sync')" id="tab-btn-sync" class="tab-btn flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60">
                <i class="fa-solid fa-network-wired text-base"></i>
                <span>4. Integrations & Sync Hub</span>
            </button>
        </nav>

        <!-- TAB 1: Geofenced Local Lead Radar -->
        <section id="tab-content-radar" class="tab-content hidden space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-radar text-amber-400"></i>
                            Geofenced Community Lead Scraper
                        </h2>
                        <p class="text-xs text-slate-400 mt-0.5">Scrapes Facebook Community Groups, Nextdoor, and Local Forums within your geofenced target service area.</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <div class="relative flex-1 sm:w-48">
                            <i class="fa-solid fa-location-dot absolute left-3 top-3 text-slate-500 text-xs"></i>
                            <input type="text" id="radar-zip" value="06883 (Weston, CT)" class="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none">
                        </div>
                        <select id="radar-radius" class="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                            <option value="5">5 Mile Radius</option>
                            <option value="15" selected>15 Mile Radius</option>
                            <option value="30">30 Mile Radius</option>
                        </select>
                        <button onclick="scanLeads()" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all">
                            <i class="fa-solid fa-arrows-rotate"></i>
                            <span>Rescan Radar</span>
                        </button>
                    </div>
                </div>
            </div>

            <div id="leads-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Dynamically Populated -->
            </div>
        </section>

        <!-- TAB 2: TradeVoice AI & Dual-Track Quote Builder -->
        <section id="tab-content-voice" class="tab-content hidden space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-7 shadow-xl relative overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-800/80 pb-4">
                    <div>
                        <h2 class="text-lg font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-wand-magic-sparkles text-emerald-400"></i>
                            TradeVoice Field Dictation Simulator & AI Parser
                        </h2>
                        <p class="text-xs text-slate-400 mt-0.5">Speak or type jobsite material callouts, labor estimates, and equipment needs to extract structured quotes.</p>
                    </div>

                    <button id="record-btn" onclick="toggleRecording()" class="flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs sm:text-sm">
                        <i id="mic-icon" class="fa-solid fa-microphone"></i>
                        <span id="mic-text">Start Speech Dictation</span>
                    </button>
                </div>

                <form onsubmit="handleVoiceSubmit(event)" class="space-y-4">
                    <div class="relative">
                        <textarea id="voice-input" rows="3" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-mono" placeholder="Try dictating: 'We need 12 pressure treated 4x4x10 posts at $28 each from Home Depot Pro, 15 bags of Quikrete at $7.50, and 16 man hours of crew labor at $65 an hour for a backyard deck rebuild in Westport'"></textarea>
                        
                        <div id="recording-badge" class="hidden absolute top-3 right-3 flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 text-xs px-2.5 py-1 rounded-md font-semibold animate-pulse">
                            <span class="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>Live Audio Dictating...</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 text-xs">
                        <span class="text-slate-500 font-medium text-[11px]">Quick Audio Presets:</span>
                        <button type="button" onclick="loadPreset(1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors">
                            <i class="fa-solid fa-bolt text-amber-400 mr-1"></i> Backyard Deck & Timber
                        </button>
                        <button type="button" onclick="loadPreset(2)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors">
                            <i class="fa-solid fa-cubes text-sky-400 mr-1"></i> Stone Paver Patio & SiteOne
                        </button>
                        <button type="button" onclick="loadPreset(3)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors">
                            <i class="fa-solid fa-tree text-emerald-400 mr-1"></i> Tree Removal & Excavation
                        </button>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button type="submit" class="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm">
                            <i class="fa-solid fa-network-wired"></i>
                            <span>Process Dictation & Extract Dual-Track Quote</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Global Material Markup Controller -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-percent"></i>
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-white">Global Material Markup Rate</h3>
                        <p class="text-xs text-slate-400">Controls profit margin added to wholesale materials on Client Proposals. (Wholesale POs remain 0% markup).</p>
                    </div>
                </div>

                <div class="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-between">
                    <button type="button" onclick="setMarkup(0)" id="markup-btn-0" class="markup-btn px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 transition-all">0%</button>
                    <button type="button" onclick="setMarkup(15)" id="markup-btn-15" class="markup-btn px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 transition-all">15%</button>
                    <button type="button" onclick="setMarkup(20)" id="markup-btn-20" class="markup-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 shadow">20%</button>
                    <button type="button" onclick="setMarkup(25)" id="markup-btn-25" class="markup-btn px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 transition-all">25%</button>
                    <button type="button" onclick="setMarkup(30)" id="markup-btn-30" class="markup-btn px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 transition-all">30%</button>
                </div>
            </div>

            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-emerald-400"></i>
                        Extracted Field Estimates (<span id="parsed-count">2</span>)
                    </h3>
                    <span class="text-xs text-slate-500">Real-time Dual-Track Split Rendering</span>
                </div>

                <div id="dictation-logs-container" class="space-y-4">
                    <!-- Dynamic Logs Render Here -->
                </div>
            </div>
        </section>

        <!-- TAB 3: Expanded Trade Network, Referral Hub & Escrow Engine -->
        <section id="tab-content-network" class="tab-content space-y-6">
            
            <!-- Vault & Referral Banner -->
            <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-2xl shadow-inner">
                        <i class="fa-solid fa-handshake-angle"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-xl font-extrabold text-white">Trade Network & Peer Referral Engine</h2>
                            <span class="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">P2P Escrow Active</span>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">Invite subcontractor allies, pass off won jobs outside your scope, lock referral fees into escrow, and collect fees upon job completion.</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                    <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 px-4 text-right">
                        <span class="text-[10px] font-bold text-slate-500 uppercase block">Escrow Vault</span>
                        <span id="escrow-vault-display" class="text-xl font-black text-sky-400">$450.00</span>
                    </div>
                    <button onclick="openInviteModal()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all">
                        <i class="fa-solid fa-user-plus text-sm"></i>
                        <span>Invite Trade Partner</span>
                    </button>
                </div>
            </div>

            <!-- Trade Network Roster Table -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                        <h3 class="text-sm font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-users text-emerald-400"></i>
                            Your Verified Trade Subcontractor Network
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">Trusted contractors ready to receive referred jobs for direct escrow fee sharing.</p>
                    </div>
                    
                    <button onclick="openReferralModal()" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto">
                        <i class="fa-solid fa-share-nodes"></i>
                        <span>Refer Won Job to Partner</span>
                    </button>
                </div>

                <!-- Roster Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="text-slate-500 uppercase border-b border-slate-800 font-bold text-[10px]">
                                <th class="p-3">Trade Partner</th>
                                <th class="p-3">Specialty Trade</th>
                                <th class="p-3">Verification</th>
                                <th class="p-3">Default Fee %</th>
                                <th class="p-3">Referred Jobs</th>
                                <th class="p-3">Lifetime Shared</th>
                                <th class="p-3 text-right">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody id="network-roster-tbody" class="divide-y divide-slate-800/60 font-medium">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Active Referral Contracts & Escrow Vault Grid -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-vault text-sky-400"></i>
                        Active Referral Job Contracts & Escrow Audit Trail
                    </h3>
                    <span class="text-xs text-slate-500">P2P Escrow Deposit & Smart Release</span>
                </div>

                <div id="escrow-contracts-container" class="space-y-3">
                    <!-- Populated via JS -->
                </div>
            </div>
        </section>

        <!-- TAB 4: Integration & API Sync Hub -->
        <section id="tab-content-sync" class="tab-content hidden space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div class="mb-6">
                    <h2 class="text-lg font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-network-wired text-emerald-400"></i>
                        External Software & Merchant API Direct Sync Hub
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Connect your existing contractor tech stack for zero-friction bidirectional sync of purchase orders, invoices, and estimates.</p>
                </div>

                <div id="integrations-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Populated via JS -->
                </div>
            </div>
        </section>
    </div>

    <!-- MODAL 1: Invite Trade Partner Modal -->
    <div id="modal-invite-partner" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">Invite Trade Partner to Network</h3>
                        <p class="text-xs text-slate-400">Add trusted contractor allies for referral job pass-offs.</p>
                    </div>
                </div>
                <button onclick="closeModal('modal-invite-partner')" class="text-slate-400 hover:text-white text-xl">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form onsubmit="handleInvitePartnerSubmit(event)" class="space-y-4 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Contact Full Name *</label>
                        <input type="text" id="inv-name" required placeholder="e.g. Mike Callahan" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-white focus:outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Company Name *</label>
                        <input type="text" id="inv-company" required placeholder="e.g. Callahan Plumbing & HVAC" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-white focus:outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Trade Specialty *</label>
                        <select id="inv-trade" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-white focus:outline-none">
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="HVAC">HVAC</option>
                            <option value="Masonry & Concrete">Masonry & Concrete</option>
                            <option value="Roofing">Roofing</option>
                            <option value="Framing & Carpentry">Framing & Carpentry</option>
                            <option value="Landscaping & Excavation">Landscaping & Excavation</option>
                            <option value="Painting">Painting</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Agreed Referral Fee Split *</label>
                        <select id="inv-fee" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-white focus:outline-none">
                            <option value="5">5% Fee Split</option>
                            <option value="10" selected>10% Fee Split (Standard)</option>
                            <option value="12.5">12.5% Fee Split</option>
                            <option value="15">15% Fee Split</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Phone Number (SMS Link) *</label>
                        <input type="tel" id="inv-phone" required placeholder="(203) 555-0192" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-white focus:outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Email Address *</label>
                        <input type="email" id="inv-email" required placeholder="mike@callahanplumbing.com" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-white focus:outline-none">
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-800">
                    <button type="submit" name="action" value="sms" class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all">
                        <i class="fa-solid fa-comment-sms"></i>
                        <span>Send SMS Invitation Link</span>
                    </button>
                    <button type="submit" name="action" value="email" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Send Email Invite</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL 2: Refer Won Job to Partner Modal -->
    <div id="modal-refer-job" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-share-nodes"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">Refer Won Job & Lock Escrow</h3>
                        <p class="text-xs text-slate-400">Transfer job scope to trade ally and lock referral fee.</p>
                    </div>
                </div>
                <button onclick="closeModal('modal-refer-job')" class="text-slate-400 hover:text-white text-xl">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form onsubmit="handleReferJobSubmit(event)" class="space-y-4 text-xs">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">Select Won Job / Project *</label>
                    <select id="ref-job-select" onchange="calculateReferralFeePreview()" class="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-2.5 text-white focus:outline-none">
                        <option value="12000" data-name="Westport Outdoor Kitchen Electrical Sub-Contract">Westport Outdoor Kitchen Electrical ($12,000.00)</option>
                        <option value="8500" data-name="Fairfield Bathroom Plumbing Rough-In">Fairfield Bathroom Plumbing Rough-In ($8,500.00)</option>
                        <option value="18000" data-name="Ridgefield Commercial Roofing Framing">Ridgefield Commercial Roofing Framing ($18,000.00)</option>
                        <option value="4500" data-name="Greenwich Tree & Excavation Clearing">Greenwich Tree & Excavation Clearing ($4,500.00)</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-slate-300 mb-1">Select Assigned Trade Subcontractor *</label>
                    <select id="ref-partner-select" onchange="calculateReferralFeePreview()" class="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-2.5 text-white focus:outline-none">
                        <!-- Populated via JS -->
                    </select>
                </div>

                <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div class="flex justify-between text-slate-400">
                        <span>Total Job Contract Value:</span>
                        <span id="ref-preview-val" class="font-bold text-white">$12,000.00</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                        <span>Referral Fee Split Percentage:</span>
                        <span id="ref-preview-rate" class="font-bold text-sky-400">10%</span>
                    </div>
                    <div class="flex justify-between border-t border-slate-800 pt-2 text-sm font-extrabold text-sky-400">
                        <span>Referral Fee to Lock in Escrow:</span>
                        <span id="ref-preview-fee">$1,200.00</span>
                    </div>
                </div>

                <button type="submit" class="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all">
                    <i class="fa-solid fa-lock"></i>
                    <span>Confirm Pass-Off & Lock Escrow Funds</span>
                </button>
            </form>
        </div>
    </div>

    <!-- MODAL 3: Client Proposal Modal -->
    <div id="modal-client-proposal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-file-signature"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">Formal Client Proposal</span>
                        <h3 id="prop-modal-title" class="text-lg font-bold text-white">Proposal #Q-JA-98421</h3>
                    </div>
                </div>
                <button onclick="closeModal('modal-client-proposal')" class="text-slate-400 hover:text-white text-xl">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div id="prop-modal-body" class="space-y-4 text-xs"></div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div class="flex items-center gap-2">
                    <button onclick="sendSMSProposal()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all">
                        <i class="fa-solid fa-comment-sms"></i>
                        <span>Send SMS Approval Link</span>
                    </button>
                    <button onclick="sendEmailPDF()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Email PDF</span>
                    </button>
                </div>
                <button onclick="closeModal('modal-client-proposal')" class="text-slate-400 hover:text-white font-semibold text-xs px-3 py-2">Close</button>
            </div>
        </div>
    </div>

    <!-- MODAL 4: Merchant PO Cart Transfer Modal -->
    <div id="modal-merchant-po" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-lg">
                        <i class="fa-solid fa-cart-flatbed"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">Wholesale Merchant Purchase Order</span>
                        <h3 id="po-modal-title" class="text-lg font-bold text-white">Purchase Order #PO-JA-77401</h3>
                    </div>
                </div>
                <button onclick="closeModal('modal-merchant-po')" class="text-slate-400 hover:text-white text-xl">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div id="po-modal-body" class="space-y-4 text-xs"></div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button onclick="transferToRetailerPro()" class="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all">
                    <i class="fa-solid fa-truck-ramp-box"></i>
                    <span>Transfer Cart to Retailer Pro Services</span>
                </button>
                <button onclick="closeModal('modal-merchant-po')" class="text-slate-400 hover:text-white font-semibold text-xs px-3 py-2">Close</button>
            </div>
        </div>
    </div>

    <!-- Application JavaScript Engine -->
    <script>
        const state = {
            activeTab: 'network',
            globalMarkup: 20,
            isRecording: false,
            voiceRecognition: null,
            network: [
                { id: 'net-1', name: 'Mike Callahan', company: 'Callahan Plumbing & HVAC', trade: 'Plumbing', phone: '(203) 555-0192', email: 'mike@callahanplumbing.com', feePercent: 10, status: 'Verified', referredJobs: 3, lifetimeShared: 1450.00 },
                { id: 'net-2', name: 'Dan Sparks', company: 'Voltage Masters Electrical LLC', trade: 'Electrical', phone: '(203) 555-0841', email: 'dan@voltagemasters.com', feePercent: 10, status: 'Verified', referredJobs: 2, lifetimeShared: 1200.00 },
                { id: 'net-3', name: 'Tony Russo', company: 'Tri-State Masonry & Pavers', trade: 'Masonry & Concrete', phone: '(203) 555-9921', email: 'tony@tristatemasonry.com', feePercent: 12.5, status: 'Verified', referredJobs: 4, lifetimeShared: 2800.00 },
                { id: 'net-4', name: 'Carlos Mendez', company: 'Apex Tree & Excavation', trade: 'Landscaping & Excavation', phone: '(203) 555-3301', email: 'carlos@apextree.com', feePercent: 10, status: 'Pending Invite', referredJobs: 0, lifetimeShared: 0.00 }
            ],
            escrowContracts: [
                { id: 'esc-1', project: 'Westport Estate Outdoor Lighting', referringPartner: 'Apex Hardscapes (You)', assignedPartner: 'Voltage Masters Electrical LLC', trade: 'Electrical', totalValue: 12000, feePercent: 10, escrowAmount: 1200, status: 'Released', date: 'Oct 02, 2026' },
                { id: 'esc-2', project: 'Greenwich Bathroom Plumbing Rough-In', referringPartner: 'Apex Hardscapes (You)', assignedPartner: 'Callahan Plumbing & HVAC', trade: 'Plumbing', totalValue: 4500, feePercent: 10, escrowAmount: 450, status: 'Locked in Escrow', date: 'Oct 11, 2026' }
            ],
            dictationLogs: [
                {
                    id: 'log-101',
                    timestamp: '10 mins ago',
                    rawText: 'We need 12 pressure treated 4x4x10 wood posts at $28 each from Home Depot Pro, 15 bags of Quikrete high early concrete at $7.50, and 16 hours of senior crew labor at $65 an hour for a deck rebuild in Weston.',
                    clientName: 'Sarah Jenkins - Westport Jobsite',
                    materials: [
                        { item: '4x4x10 Pressure Treated Wood Posts', qty: 12, cost: 28.00, vendor: 'Home Depot Pro', sku: 'HD-PT-4410' },
                        { item: 'Quikrete 80lb High Early Concrete', qty: 15, cost: 7.50, vendor: 'Home Depot Pro', sku: 'HD-QK-80' }
                    ],
                    labor: [ { tier: 'Senior Crew Tradesman', hours: 16, rate: 65.00 } ]
                },
                {
                    id: 'log-102',
                    timestamp: '1 hour ago',
                    rawText: '14 Unilock Dublin Cobble stone pavers at $18.50 per unit from SiteOne Supply, plus 8 hours site lead supervision at $95 an hour.',
                    clientName: 'Fairfield Residential Patio',
                    materials: [ { item: 'Unilock Dublin Cobble Pavers', qty: 14, cost: 18.50, vendor: 'SiteOne Supply', sku: 'S1-UNI-DC' } ],
                    labor: [ { tier: 'Site Supervisor / Lead Tech', hours: 8, rate: 95.00 } ]
                }
            ],
            leads: [
                { id: 'lead-1', source: 'Facebook Group - Weston Neighbors', time: '12 mins ago', author: 'Mark Henderson', location: 'Weston, CT (2.4 miles)', title: 'Full Backyard Stone Patio & Retaining Wall', desc: 'Looking for licensed contractor to install a 350 sq ft paver patio with retaining wall.', budget: '$8,000 - $12,000', urgency: 'Immediate' },
                { id: 'lead-2', source: 'Nextdoor - Greens Farms & Westport', time: '45 mins ago', author: 'Elena Rostova', location: 'Westport, CT (4.1 miles)', title: 'Emergency Tree Branch Removal & Clearing', desc: 'Storm damage caused a large oak branch to fall across driveway. Need crew with chipper.', budget: '$1,500 - $2,500', urgency: 'High Urgency' },
                { id: 'lead-3', source: 'Local Trade Forum - Fairfield', time: '2 hours ago', author: 'David K.', location: 'Fairfield, CT (6.8 miles)', title: 'Timber Frame Arbor & Pergola Construction', desc: 'Need custom heavy-timber cedar pergola constructed over existing flagstone patio.', budget: '$5,000 - $7,500', urgency: 'Flexible' },
                { id: 'lead-4', source: 'Facebook Group - Wilton Community', time: '3 hours ago', author: 'Rachel Vance', location: 'Wilton, CT (8.2 miles)', title: 'French Drain & Drainage Solution Excavation', desc: 'Basement flooding during rain. Need 120ft French drain installed.', budget: '$3,500 - $5,000', urgency: 'Immediate' }
            ],
            integrations: [
                { id: 'qbo', name: 'QuickBooks Online', category: 'Accounting & Invoicing', connected: true, icon: 'fa-file-invoice-dollar', color: 'text-emerald-400' },
                { id: 'hdp', name: 'Home Depot Pro Xtra', category: 'Wholesale Supplier', connected: true, icon: 'fa-store', color: 'text-amber-500' },
                { id: 'siteone', name: 'SiteOne Supply', category: 'Landscape Wholesale', connected: true, icon: 'fa-leaf', color: 'text-emerald-500' },
                { id: 'jobber', name: 'Jobber', category: 'Field Service Management', connected: false, icon: 'fa-calendar-check', color: 'text-sky-400' },
                { id: 'hcp', name: 'Housecall Pro', category: 'Dispatch & Billing', connected: false, icon: 'fa-headset', color: 'text-blue-400' },
                { id: 'bt', name: 'Buildertrend', category: 'Commercial Construction', connected: false, icon: 'fa-helmet-safety', color: 'text-amber-400' }
            ]
        };

        window.addEventListener('DOMContentLoaded', () => {
            renderAll();
        });

        function renderAll() {
            renderStats();
            renderTradeNetworkRoster();
            renderEscrowContracts();
            renderParsedLogs();
            renderLeads();
            renderIntegrations();
        }

        function switchTab(tabKey) {
            state.activeTab = tabKey;
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.className = 'tab-btn flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60';
            });
            const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
            if (activeBtn) {
                activeBtn.className = 'tab-btn flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 bg-emerald-500 text-slate-950 shadow-md';
            }
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            const activeContent = document.getElementById(`tab-content-${tabKey}`);
            if (activeContent) activeContent.classList.remove('hidden');
        }

        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            let bgClass = 'bg-slate-900 border-emerald-500 text-emerald-400';
            let icon = 'fa-circle-check';

            if (type === 'info') { bgClass = 'bg-slate-900 border-sky-500 text-sky-400'; icon = 'fa-circle-info'; }
            else if (type === 'amber') { bgClass = 'bg-slate-900 border-amber-500 text-amber-400'; icon = 'fa-triangle-exclamation'; }

            toast.className = `pointer-events-auto border rounded-xl p-3.5 px-4 shadow-2xl flex items-center gap-3 text-xs font-bold transition-all duration-300 transform translate-y-2 ${bgClass}`;
            toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i><span>${message}</span>`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        function renderStats() {
            document.getElementById('stat-active-leads').innerText = `${state.leads.length} Leads`;
            document.getElementById('stat-network-count').innerText = `${state.network.length} Partners`;
            
            const totalLocked = state.escrowContracts
                .filter(e => e.status === 'Locked in Escrow')
                .reduce((sum, e) => sum + e.escrowAmount, 0);

            document.getElementById('stat-locked-escrow').innerText = `$${totalLocked.toFixed(2)}`;
            document.getElementById('escrow-vault-display').innerText = `$${totalLocked.toFixed(2)}`;
        }

        function renderTradeNetworkRoster() {
            const tbody = document.getElementById('network-roster-tbody');
            tbody.innerHTML = state.network.map(p => `
                <tr class="hover:bg-slate-850 transition-colors">
                    <td class="p-3">
                        <div class="font-bold text-white text-xs">${p.company}</div>
                        <span class="text-[10px] text-slate-400">${p.name} • ${p.phone}</span>
                    </td>
                    <td class="p-3 text-slate-300">${p.trade}</td>
                    <td class="p-3">
                        ${p.status === 'Verified' 
                            ? `<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-circle-check mr-1"></i>Verified Ally</span>`
                            : `<span class="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-clock mr-1"></i>Pending Invite</span>`
                        }
                    </td>
                    <td class="p-3 font-bold text-sky-400">${p.feePercent}% Split</td>
                    <td class="p-3 text-slate-300 font-bold">${p.referredJobs} Jobs</td>
                    <td class="p-3 font-bold text-emerald-400">$${p.lifetimeShared.toFixed(2)}</td>
                    <td class="p-3 text-right">
                        <button onclick="openReferralModalForPartner('${p.id}')" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[11px] shadow transition-all">
                            Refer Won Job
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function renderEscrowContracts() {
            const container = document.getElementById('escrow-contracts-container');
            container.innerHTML = state.escrowContracts.map(esc => `
                <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-extrabold text-white">${esc.project}</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${esc.status === 'Locked in Escrow' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}">${esc.status}</span>
                        </div>
                        <div class="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                            <span><strong class="text-slate-300">Ref Partner:</strong> ${esc.referringPartner}</span>
                            <span><strong class="text-slate-300">Assigned Trade:</strong> ${esc.assignedPartner}</span>
                            <span><strong class="text-slate-300">Specialty:</strong> ${esc.trade}</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                        <div class="text-right">
                            <span class="text-[10px] text-slate-500 uppercase block font-bold">Escrow (${esc.feePercent}%)</span>
                            <span class="text-sm font-black text-sky-400">$${esc.escrowAmount.toFixed(2)}</span>
                        </div>

                        ${esc.status === 'Locked in Escrow' ? `
                            <button onclick="releaseEscrow('${esc.id}')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all">
                                <i class="fa-solid fa-lock-open"></i>
                                <span>Release Escrow Payment</span>
                            </button>
                        ` : `
                            <span class="text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">Funds Shared</span>
                        `}
                    </div>
                </div>
            `).join('');
        }

        function openInviteModal() {
            document.getElementById('modal-invite-partner').classList.remove('hidden');
        }

        function handleInvitePartnerSubmit(e) {
            e.preventDefault();
            const action = e.submitter ? e.submitter.value : 'sms';
            const name = document.getElementById('inv-name').value;
            const company = document.getElementById('inv-company').value;
            const trade = document.getElementById('inv-trade').value;
            const fee = parseFloat(document.getElementById('inv-fee').value);
            const phone = document.getElementById('inv-phone').value;
            const email = document.getElementById('inv-email').value;

            const newPartner = {
                id: 'net-' + Date.now(),
                name, company, trade, phone, email,
                feePercent: fee,
                status: 'Pending Invite',
                referredJobs: 0,
                lifetimeShared: 0.00
            };

            state.network.unshift(newPartner);
            renderAll();
            closeModal('modal-invite-partner');

            if (action === 'sms') {
                showToast(`SMS Invitation sent to ${phone} with instant JobAllies onboarding link!`, 'success');
            } else {
                showToast(`Email invitation sent to ${email}`, 'info');
            }

            // Reset inputs
            document.getElementById('inv-name').value = '';
            document.getElementById('inv-company').value = '';
            document.getElementById('inv-phone').value = '';
            document.getElementById('inv-email').value = '';
        }

        function openReferralModal() {
            populatePartnerSelect();
            calculateReferralFeePreview();
            document.getElementById('modal-refer-job').classList.remove('hidden');
        }

        function openReferralModalForPartner(partnerId) {
            populatePartnerSelect(partnerId);
            calculateReferralFeePreview();
            document.getElementById('modal-refer-job').classList.remove('hidden');
        }

        function populatePartnerSelect(selectedId = null) {
            const select = document.getElementById('ref-partner-select');
            select.innerHTML = state.network.map(p => `
                <option value="${p.id}" data-fee="${p.feePercent}" ${selectedId === p.id ? 'selected' : ''}>
                    ${p.company} (${p.trade}) - ${p.feePercent}% Fee Split
                </option>
            `).join('');
        }

        function calculateReferralFeePreview() {
            const jobSelect = document.getElementById('ref-job-select');
            const partnerSelect = document.getElementById('ref-partner-select');

            if (!jobSelect || !partnerSelect || !partnerSelect.selectedOptions[0]) return;

            const val = parseFloat(jobSelect.value || 0);
            const feePercent = parseFloat(partnerSelect.selectedOptions[0].getAttribute('data-fee') || 10);
            const feeAmount = val * (feePercent / 100);

            document.getElementById('ref-preview-val').innerText = `$${val.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            document.getElementById('ref-preview-rate').innerText = `${feePercent}%`;
            document.getElementById('ref-preview-fee').innerText = `$${feeAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        }

        function handleReferJobSubmit(e) {
            e.preventDefault();
            const jobSelect = document.getElementById('ref-job-select');
            const partnerSelect = document.getElementById('ref-partner-select');

            const jobName = jobSelect.selectedOptions[0].getAttribute('data-name');
            const val = parseFloat(jobSelect.value);
            const partnerId = partnerSelect.value;
            const partner = state.network.find(p => p.id === partnerId);

            if (!partner) return;

            const feeAmount = val * (partner.feePercent / 100);

            state.escrowContracts.unshift({
                id: 'esc-' + Date.now(),
                project: jobName,
                referringPartner: 'Apex Hardscapes (You)',
                assignedPartner: partner.company,
                trade: partner.trade,
                totalValue: val,
                feePercent: partner.feePercent,
                escrowAmount: feeAmount,
                status: 'Locked in Escrow',
                date: 'Just Now'
            });

            partner.referredJobs += 1;

            renderAll();
            closeModal('modal-refer-job');
            showToast(`Job referred to ${partner.company}! $${feeAmount.toFixed(2)} locked into P2P Escrow Vault.`, 'success');
        }

        function releaseEscrow(escId) {
            const esc = state.escrowContracts.find(e => e.id === escId);
            if (!esc) return;

            esc.status = 'Released';
            const partner = state.network.find(p => p.company === esc.assignedPartner);
            if (partner) partner.lifetimeShared += esc.escrowAmount;

            renderAll();
            showToast(`Smart contract triggered: $${esc.escrowAmount.toFixed(2)} referral fee released!`, 'success');
        }

        function setMarkup(percent) {
            state.globalMarkup = percent;
            document.querySelectorAll('.markup-btn').forEach(btn => btn.className = 'markup-btn px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 transition-all hover:text-white');
            const selectedBtn = document.getElementById(`markup-btn-${percent}`);
            if (selectedBtn) selectedBtn.className = 'markup-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 shadow';
            renderParsedLogs();
            showToast(`Global Material Markup updated to ${percent}%`, 'info');
        }

        function toggleRecording() {
            const micBtn = document.getElementById('record-btn');
            const micText = document.getElementById('mic-text');
            const micIcon = document.getElementById('mic-icon');
            const badge = document.getElementById('recording-badge');

            if (!state.isRecording) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition) {
                    state.voiceRecognition = new SpeechRecognition();
                    state.voiceRecognition.continuous = true;
                    state.voiceRecognition.interimResults = true;
                    state.voiceRecognition.onresult = (event) => {
                        let transcript = '';
                        for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
                        document.getElementById('voice-input').value = transcript;
                    };
                    state.voiceRecognition.start();
                }
                state.isRecording = true;
                micBtn.className = "flex items-center justify-center gap-2.5 bg-red-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg pulse-ring text-xs sm:text-sm";
                micText.innerText = "Stop Dictating";
                micIcon.className = "fa-solid fa-microphone-slash";
                badge.classList.remove('hidden');
                showToast("Voice engine listening...", 'info');
            } else {
                if (state.voiceRecognition) { try { state.voiceRecognition.stop(); } catch(e){} }
                state.isRecording = false;
                micBtn.className = "flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm";
                micText.innerText = "Start Speech Dictation";
                micIcon.className = "fa-solid fa-microphone";
                badge.classList.add('hidden');
            }
        }

        function loadPreset(presetNum) {
            const input = document.getElementById('voice-input');
            if (presetNum === 1) input.value = "We need 12 pressure treated 4x4x10 wood posts at $28 each from Home Depot Pro, 15 bags of Quikrete at $7.50, and 16 hours of senior crew labor at $65 an hour for a deck rebuild in Weston.";
            else if (presetNum === 2) input.value = "14 Unilock Dublin Cobble stone pavers at $18.50 per unit from SiteOne Supply, 3 tons of gravel base at $45, plus 8 hours site supervisor labor at $95 an hour.";
            else if (presetNum === 3) input.value = "1 Tree Chipper & Excavator Equipment Rental at $350 per day from Lowe's Pro, plus 12 hours crew lead labor at $85 an hour for tree removal.";
            showToast("Sample voice transcript loaded.", 'info');
        }

        function handleVoiceSubmit(e) {
            e.preventDefault();
            const text = document.getElementById('voice-input').value.trim();
            if (!text) { showToast("Please dictate or enter text.", "amber"); return; }

            const newLog = {
                id: 'log-' + Date.now(),
                timestamp: 'Just Now',
                rawText: text,
                clientName: 'New Field Work Estimate',
                materials: [ { item: '4x4x10 Pressure Treated Wood Posts', qty: 12, cost: 28.00, vendor: 'Home Depot Pro', sku: 'HD-PT-4410' } ],
                labor: [ { tier: 'Senior Crew Tradesman', hours: 16, rate: 65.00 } ]
            };

            state.dictationLogs.unshift(newLog);
            document.getElementById('voice-input').value = '';
            renderParsedLogs();
            showToast("AI Voice Dictation Parsed into Dual-Track Quotes!", "success");
        }

        function renderParsedLogs() {
            const container = document.getElementById('dictation-logs-container');
            document.getElementById('parsed-count').innerText = state.dictationLogs.length;

            container.innerHTML = state.dictationLogs.map(log => {
                const rawMaterialTotal = log.materials.reduce((sum, m) => sum + (m.cost * m.qty), 0);
                const markedUpMaterialTotal = rawMaterialTotal * (1 + (state.globalMarkup / 100));
                const laborTotal = log.labor.reduce((sum, l) => sum + (l.hours * l.rate), 0);
                const clientTotal = markedUpMaterialTotal + laborTotal;

                return `
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span class="text-xs font-mono text-slate-300 italic">"${log.rawText}"</span>
                        <span class="text-[10px] text-slate-500 font-mono">${log.timestamp}</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
                            <div>
                                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span class="text-xs font-bold text-white"><i class="fa-solid fa-user-check text-emerald-400 mr-1.5"></i>Client Proposal</span>
                                    <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">+${state.globalMarkup}% Markup</span>
                                </div>
                                <div class="mt-3 space-y-2 text-xs">
                                    <div class="flex justify-between text-slate-400"><span>Materials (Client Price):</span><span class="font-bold text-white">$${markedUpMaterialTotal.toFixed(2)}</span></div>
                                    <div class="flex justify-between text-slate-400"><span>Labor Rates:</span><span class="font-bold text-white">$${laborTotal.toFixed(2)}</span></div>
                                    <div class="flex justify-between border-t border-slate-800 pt-2 text-sm font-extrabold text-emerald-400"><span>Client Total:</span><span>$${clientTotal.toFixed(2)}</span></div>
                                </div>
                            </div>
                            <button onclick="openClientProposalModal('${log.id}')" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-lg text-xs transition-all">Preview Client Proposal</button>
                        </div>

                        <div class="bg-slate-950 border border-sky-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
                            <div>
                                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span class="text-xs font-bold text-white"><i class="fa-solid fa-truck-ramp-box text-sky-400 mr-1.5"></i>Wholesale Merchant PO</span>
                                    <span class="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">0% Markup</span>
                                </div>
                                <div class="mt-3 space-y-2 text-xs">
                                    <div class="flex justify-between text-slate-400"><span>Wholesale Material Cost:</span><span class="font-bold text-white">$${rawMaterialTotal.toFixed(2)}</span></div>
                                    <div class="flex justify-between text-slate-400"><span>Vendor:</span><span class="font-semibold text-slate-300">${[...new Set(log.materials.map(m=>m.vendor))].join(', ')}</span></div>
                                </div>
                            </div>
                            <button onclick="openMerchantPoModal('${log.id}')" class="w-full bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold py-2 rounded-lg text-xs border border-sky-500/40 transition-all">View Wholesale Cart</button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }

        function scanLeads() {
            showToast("Rescanning local neighborhood networks and Facebook groups...", "info");
            setTimeout(() => { renderLeads(); showToast("Lead Radar updated with fresh geofenced requests.", "success"); }, 800);
        }

        function renderLeads() {
            const grid = document.getElementById('leads-grid');
            grid.innerHTML = state.leads.map(lead => `
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30"><i class="fa-brands fa-facebook mr-1"></i>${lead.source}</span>
                            <h3 class="text-sm font-bold text-white mt-2 leading-snug">${lead.title}</h3>
                        </div>
                        <span class="text-[10px] text-slate-500 font-mono">${lead.time}</span>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed">${lead.desc}</p>
                    <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div><span class="text-slate-500 block">Contact:</span><span class="font-semibold text-slate-200">${lead.author}</span></div>
                        <div><span class="text-slate-500 block">Location:</span><span class="font-semibold text-emerald-400"><i class="fa-solid fa-location-dot mr-1"></i>${lead.location}</span></div>
                    </div>
                    <button onclick="claimLead('${lead.id}')" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs shadow transition-all">Claim Lead & Draft Proposal</button>
                </div>
            `).join('');
        }

        function claimLead(leadId) {
            const lead = state.leads.find(l => l.id === leadId);
            if (!lead) return;
            document.getElementById('voice-input').value = `Lead Claim: ${lead.title} for ${lead.author}. 10 hours crew labor at $75 an hour, plus $800 wholesale site materials from Home Depot Pro.`;
            switchTab('voice');
            showToast(`Lead claimed! Drafted proposal in TradeVoice.`, "success");
        }

        function renderIntegrations() {
            const grid = document.getElementById('integrations-grid');
            grid.innerHTML = state.integrations.map(item => `
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg ${item.color}">
                            <i class="fa-solid ${item.icon}"></i>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-white">${item.name}</h4>
                            <span class="text-[10px] text-slate-500 block">${item.category}</span>
                        </div>
                    </div>
                    <button onclick="toggleIntegration('${item.id}')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${item.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}">
                        ${item.connected ? 'Synced' : 'Connect'}
                    </button>
                </div>
            `).join('');
        }

        function toggleIntegration(id) {
            const item = state.integrations.find(i => i.id === id);
            if (!item) return;
            item.connected = !item.connected;
            renderIntegrations();
            showToast(`${item.name} integration ${item.connected ? 'connected' : 'disconnected'}.`, 'info');
        }

        function openClientProposalModal(logId) {
            const log = state.dictationLogs.find(l => l.id === logId);
            if (!log) return;
            document.getElementById('prop-modal-title').innerText = `Proposal #Q-JA-${log.id.replace('log-', '')}`;
            document.getElementById('prop-modal-body').innerHTML = `<p class="text-slate-300">Client Proposal for ${log.clientName} generated and ready for SMS signature.</p>`;
            document.getElementById('modal-client-proposal').classList.remove('hidden');
        }

        function openMerchantPoModal(logId) {
            const log = state.dictationLogs.find(l => l.id === logId);
            if (!log) return;
            document.getElementById('po-modal-title').innerText = `Internal PO #PO-JA-${log.id.replace('log-', '')}`;
            document.getElementById('po-modal-body').innerHTML = `<p class="text-slate-300">Wholesale Purchase order ready for Home Depot Pro / SiteOne direct cart sync.</p>`;
            document.getElementById('modal-merchant-po').classList.remove('hidden');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }

        function sendSMSProposal() { showToast("SMS Approval link sent!", "success"); closeModal('modal-client-proposal'); }
        function sendEmailPDF() { showToast("PDF Proposal emailed.", "info"); closeModal('modal-client-proposal'); }
        function transferToRetailerPro() { showToast("Cart transferred to Wholesale Pro Services!", "success"); closeModal('modal-merchant-po'); }
    </script>
</body>
</html>