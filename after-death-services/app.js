/**
 * Sahaay - High-End Premium Logic
 * Handles the SPA routing, data binding, UI animations, and advanced Toast system.
 */

// --- GLOBAL MOCK DATA --- //
const DB = {
    users: [
        { id: 'u1', name: 'Ramesh Kumar', district: 'Patna, Bihar' }
    ],
    lawyers: [
        { id: 'l1', name: 'Adv. Anjali Deshmukh', experience: '8 Years', casesSolved: 124, rating: 4.8, language: 'Hindi, Maithili', rate: 25 },
        { id: 'l2', name: 'Adv. Suresh Mehta', experience: '12 Years', casesSolved: 310, rating: 4.9, language: 'Hindi, Bhojpuri', rate: 25 },
        { id: 'l3', name: 'Adv. Priya Sharma', experience: '5 Years', casesSolved: 89, rating: 4.6, language: 'Hindi, English', rate: 25 },
        { id: 'l4', name: 'Adv. Vikram Singh', experience: '15 Years', casesSolved: 502, rating: 5.0, language: 'Hindi, Marathi', rate: 25 }
    ],
    cases: [
        { id: 'c1', userId: 'u1', lawyerId: 'l1', type: 'Pension Claim Restitution', status: 'In Review', tier: 'Tier 1', date: 'Mar 01, 2026', documents: ['pension_claim_req.pdf'], description: 'Pending since 6 months.' },
        { id: 'c2', userId: 'u1', lawyerId: 'null', type: 'Death Certificate Assistance', status: 'Pending Assign', tier: 'Tier 2', date: 'Mar 05, 2026', documents: [], description: 'Need name correction.' }
    ]
};

// --- STATE MANAGEMENT --- //
const state = {
    role: 'user', // 'user', 'lawyer', 'admin'
    currentRoute: 'dashboard',
    activeCaseContext: null,
    activeLawyerContext: null
};

// --- Custom Toast System --- //
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'ph-check-circle text-success';
    if (type === 'info') icon = 'ph-info';

    toast.innerHTML = `<i class="ph ${icon}" style="font-size:1.25rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- ROUTING & RENDERING --- //
const $app = document.getElementById('app');
const $pageTitle = document.getElementById('page-title');
const $pageSubtitle = document.getElementById('page-subtitle');
const $navLinks = document.getElementById('nav-links');

// Navigation Config using Duotone icons for premium feel
const navConfig = {
    user: [
        { id: 'dashboard', label: 'Overview', icon: 'ph-duotone ph-squares-four', sub: 'Your cases' },
        { id: 'lawyer-directory', label: 'Service Partners', icon: 'ph-duotone ph-scales', sub: 'Find an expert' },
        { id: 'new-case', label: 'Submit Documents', icon: 'ph-duotone ph-file-arrow-up', sub: 'Start process' }
    ],
    lawyer: [
        { id: 'dashboard', label: 'Assigned Cases', icon: 'ph-duotone ph-briefcase', sub: 'Active work' },
        { id: 'profile', label: 'My Practice', icon: 'ph-duotone ph-user', sub: 'Settings' }
    ],
    admin: [
        { id: 'dashboard', label: 'Platform Metrics', icon: 'ph-duotone ph-chart-pie-slice', sub: 'Global view' },
        { id: 'lawyer-management', label: 'Lawyers Roster', icon: 'ph-duotone ph-users', sub: 'Management' },
        { id: 'case-management', label: 'All Cases', icon: 'ph-duotone ph-folders', sub: 'Operations' }
    ]
};

window.switchRole = function (targetRole) {
    state.role = targetRole;
    state.currentRoute = 'dashboard';
    renderNavigation();
    renderPage();
};

function renderNavigation() {
    const links = navConfig[state.role];
    $navLinks.innerHTML = links.map(link => `
        <div class="nav-item ${state.currentRoute === link.id ? 'active' : ''}" onclick="window.navigate('${link.id}')">
            <i class="${link.icon}"></i>
            <span>${link.label}</span>
        </div>
    `).join('');
}

window.navigate = function (route, context = null) {
    state.currentRoute = route;
    if (context) {
        if (route === 'lawyer-profile') state.activeLawyerContext = context;
        if (route === 'case-details') state.activeCaseContext = context;
    }
    renderNavigation();
    renderPage();
    // Scroll back to top smoothly
    document.querySelector('.app-container').scrollTo(0, 0);
};

function renderPage() {
    // Re-trigger animation
    $app.classList.remove('fade-enter');
    void $app.offsetWidth;
    $app.classList.add('fade-enter');

    const role = state.role;
    const route = state.currentRoute;

    if (role === 'user') {
        if (route === 'dashboard') renderUserDashboard();
        else if (route === 'lawyer-directory') renderLawyerDirectory();
        else if (route === 'lawyer-profile') renderLawyerProfile();
        else if (route === 'new-case') renderNewCase();
    } else if (role === 'lawyer') {
        if (route === 'dashboard') renderLawyerDashboard();
        else if (route === 'case-details') renderCaseDetails();
        else renderComingSoon();
    } else if (role === 'admin') {
        if (route === 'dashboard') renderAdminDashboard();
        else renderComingSoon();
    }
}

function renderComingSoon() {
    $pageTitle.innerText = "Module Offline";
    $pageSubtitle.innerText = "This section is under active development.";
    $app.innerHTML = `<div class="empty-state">
        <div class="empty-state-icon"><i class="ph-duotone ph-paint-brush"></i></div>
        <h3 class="font-semibold text-lg mb-2">Coming Soon</h3>
        <p>Our engineers are crafting a premium experience for this module.</p>
    </div>`;
}

// --- USER VIEWS --- //

function renderUserDashboard() {
    $pageTitle.innerText = "Overview";
    $pageSubtitle.innerText = "Track the progress of your government paperwork and claims.";
    const myCases = DB.cases.filter(c => c.userId === 'u1');

    let html = ``;

    if (myCases.length === 0) {
        html += `<div class="empty-state">
            <div class="empty-state-icon"><i class="ph-duotone ph-folder-dashed"></i></div>
            <h3 class="font-semibold text-lg mb-2">No active cases</h3>
            <p class="text-secondary mb-6">Start by uploading your documents securely.</p>
            <button class="btn btn-primary" onclick="window.navigate('new-case')"><i class="ph-bold ph-plus"></i> Upload Documents</button>
        </div>`;
    } else {
        html += `<div class="grid grid-cols-2">`;
        myCases.forEach(c => {
            const lawyer = c.lawyerId !== 'null' ? DB.lawyers.find(l => l.id === c.lawyerId) : null;
            const isAssigned = !!lawyer;

            html += `
            <div class="card ${isAssigned ? '' : 'card-clickable'}" ${!isAssigned ? 'onclick="window.navigate(\'lawyer-directory\')"' : ''}>
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <div>
                        <div class="text-xs text-muted mb-1">REQ-${c.id.toUpperCase()}</div>
                        <h3 class="font-semibold text-lg">${c.type}</h3>
                    </div>
                    <div>
                        <span class="badge ${c.status === 'In Review' ? 'badge-success' : 'badge-warning'}">${c.status}</span>
                    </div>
                </div>
                
                <div class="mb-6 p-4" style="background:var(--bg-subtle); border-radius:12px; border:1px solid var(--border-light);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span class="text-sm text-secondary">Initiated</span>
                        <span class="text-sm font-medium">${c.date}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="text-sm text-secondary">Service Partner</span>
                        ${isAssigned
                    ? `<span class="text-sm font-semibold" style="display:flex; align-items:center; gap:6px;"><i class="ph-fill ph-check-circle" style="color:var(--success)"></i> ${lawyer.name}</span>`
                    : `<span class="text-sm font-semibold" style="color:var(--warning)">Pending Assign</span>`
                }
                    </div>
                </div>

                ${!isAssigned ? `
                    <button class="btn btn-primary" style="width:100%; border-radius:10px;">
                        Assign Partner for Fixed Fee (₹25)
                    </button>
                    <p class="text-xs text-center text-secondary mt-3">Transparent Escrow Payment</p>
                ` : ''}
            </div>`;
        });
        html += `</div>`;
    }

    $app.innerHTML = html;
}

function renderLawyerDirectory() {
    $pageTitle.innerText = "Service Partners";
    $pageSubtitle.innerText = "All verified legal experts charge a highly transparent fixed fee of ₹25 to assist with your paperwork.";

    let html = `<div class="grid grid-cols-2 mt-4">`; // 2 cols for better card aesthetics

    DB.lawyers.forEach(l => {
        html += `
        <div class="card card-clickable" onclick="window.navigate('lawyer-profile', '${l.id}')">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;" class="mb-4">
                <div style="display:flex; gap:16px; align-items:center;">
                    <img src="https://ui-avatars.com/api/?name=${l.name}&background=18181b&color=fff&rounded=true&bold=true" style="width:56px; height:56px; border-radius:50%; box-shadow:var(--shadow-sm);">
                    <div>
                        <h3 class="font-semibold text-lg serif">${l.name}</h3>
                        <p class="text-sm text-secondary">${l.experience} Expertise</p>
                    </div>
                </div>
                <div>
                     <span class="badge badge-success" style="font-size:0.85rem;"><i class="ph-fill ph-star" style="margin-right:4px; color:#fbbf24;"></i> ${l.rating}</span>
                </div>
            </div>
            
            <div style="display:flex; gap:16px; margin-bottom:24px; padding-top:16px; border-top:1px solid var(--border-light);">
                <div style="flex:1;">
                    <div class="text-xs text-muted mb-1">Languages</div>
                    <div class="text-sm font-medium">${l.language}</div>
                </div>
                <div style="flex:1;">
                    <div class="text-xs text-muted mb-1">Resolved</div>
                    <div class="text-sm font-medium">${l.casesSolved} Families</div>
                </div>
            </div>

            <button class="btn btn-outline" style="width:100%; justify-content:space-between;">
                <span>View Full Profile</span>
                <span class="font-semibold text-primary">₹${l.rate}</span>
            </button>
        </div>`;
    });

    html += `</div>`;
    $app.innerHTML = html;
}

function renderLawyerProfile() {
    const l = DB.lawyers.find(x => x.id === state.activeLawyerContext);
    $pageTitle.innerText = "Partner Details";
    $pageSubtitle.innerText = "Review credentials and assign to your active case.";

    $app.innerHTML = `
    <button class="btn btn-ghost mb-6" style="padding:0; gap:4px;" onclick="window.navigate('lawyer-directory')">
        <i class="ph-bold ph-arrow-left"></i> Back to Directory
    </button>
    
    <div class="card" style="max-width:700px; padding:0;">
        <div style="padding:40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                <div style="display:flex; gap:20px; align-items:center;">
                    <img src="https://ui-avatars.com/api/?name=${l.name}&background=18181b&color=fff&rounded=true&bold=true" style="width:80px; height:80px; border-radius:50%; box-shadow:var(--shadow-md);">
                    <div>
                        <h2 class="font-bold serif" style="font-size:2rem; line-height:1.2;">${l.name}</h2>
                        <p class="text-secondary text-lg mt-1">${l.experience} Experience • Legal Aid</p>
                    </div>
                </div>
                <div class="price-tag">
                    <span class="amount">₹${l.rate}</span>
                    <span class="text-xs text-muted">Fixed Transparent Fee</span>
                </div>
            </div>
            
            <h3 class="font-semibold mb-3">Professional Summary</h3>
            <p class="text-secondary mb-8" style="font-size:1.05rem; line-height:1.7;">
                Highly experienced in assisting rural families navigate the bureaucratic complexities of post-death paperwork. Specializes in expediting pension claims, succession certificates, and navigating documentation at the district level across ${l.language.split(',').join(' and ')} speaking regions.
            </p>

            <div class="grid grid-cols-3 mb-8">
                <div style="background:var(--bg-subtle); padding:20px; border-radius:16px; border:1px solid var(--border-light);">
                    <div class="text-xs text-muted mb-2">Cases Resolved</div>
                    <div class="font-bold text-lg">${l.casesSolved}</div>
                </div>
                <div style="background:var(--bg-subtle); padding:20px; border-radius:16px; border:1px solid var(--border-light);">
                    <div class="text-xs text-muted mb-2">Client Rating</div>
                    <div class="font-bold text-lg flex align-center"><i class="ph-fill ph-star" style="color:#fbbf24; margin-right:6px;"></i> ${l.rating}</div>
                </div>
                <div style="background:var(--bg-subtle); padding:20px; border-radius:16px; border:1px solid var(--border-light);">
                    <div class="text-xs text-muted mb-2">Primary Fluency</div>
                    <div class="font-bold text-sm mt-1" style="line-height:1.4;">${l.language}</div>
                </div>
            </div>
        </div>

        <div style="background:var(--bg-subtle); border-top:1px solid var(--border-light); padding:24px 40px; display:flex; justify-content:space-between; align-items:center;">
            <p class="text-sm text-secondary font-medium"><i class="ph-fill ph-lock-key"></i> Payment held securely in escrow until completion.</p>
            <button class="btn btn-primary" style="padding:16px 32px; font-size:1rem; border-radius:16px;" onclick="assignLawyer('${l.id}')">
                Appoint & Pay ₹${l.rate}
            </button>
        </div>
    </div>
    `;
}

function renderNewCase() {
    $pageTitle.innerText = "Submit Documents";
    $pageSubtitle.innerText = "Securely upload certificates via our streamlined process.";

    $app.innerHTML = `
    <div class="card" style="max-width:640px;">
        
        <div class="form-group">
            <label>Select Requirement Type</label>
            <select id="case-type" class="form-input">
                <option>Death Certificate Issuance/Correction</option>
                <option>Widow Pension Claim Facilitation</option>
                <option>Life Insurance Claim Settlement</option>
                <option>Immovable Asset Transfer & Succession</option>
            </select>
        </div>

        <div class="form-group">
            <label style="display:flex; justify-content:space-between; align-items:center;">
                <span>Case Details</span>
                <button id="voice-btn" class="btn btn-ghost btn-record" style="padding:4px 8px; font-size:0.8rem; border-radius:8px;" onclick="toggleVoiceInput()">
                    <i class="ph-duotone ph-microphone"></i> Voice Translate (Hindi)
                </button>
            </label>
            <textarea id="case-description" class="form-input" rows="3" placeholder="Describe your case or what help you need..."></textarea>
            <p id="voice-status" class="text-xs mt-2" style="display:none; color:var(--warning);">Listening... Speak now.</p>
        </div>

        <div class="form-group mb-8">
            <label>Document Upload (PDF or Photo)</label>
            <div class="upload-area" onclick="document.getElementById('file-upload').click()">
                <div class="upload-icon-wrapper" style="display:flex; justify-content:center; gap:20px;">
                    <i class="ph-duotone ph-camera upload-icon"></i>
                    <i class="ph-duotone ph-file-pdf upload-icon"></i>
                </div>
                <h4 class="font-semibold text-lg">Take Photo or Upload File</h4>
                <p class="text-secondary mt-2">Use mobile camera directly or attach PDF</p>
                <input type="file" id="file-upload" accept="image/*,application/pdf" capture="environment" style="display:none;" onchange="handleFileUpload(event)">
            </div>
            <div id="file-list" class="mt-4"></div>
        </div>

        <button class="btn btn-primary" style="width:100%; border-radius: 14px; padding:16px; font-size:1rem;" onclick="submitCase()">
            Verify and Submit Request
        </button>
    </div>
    `;
}

// --- LAWYER VIEWS --- //

function renderLawyerDashboard() {
    $pageTitle.innerText = "Assigned Cases Board";
    let myCases = DB.cases.filter(c => c.lawyerId === 'l1');

    // Sort so Tier 1 cases appear first
    myCases.sort((a, b) => {
        if (a.tier === 'Tier 1' && b.tier !== 'Tier 1') return -1;
        if (a.tier !== 'Tier 1' && b.tier === 'Tier 1') return 1;
        return 0;
    });

    $pageSubtitle.innerText = `You have ${myCases.length} assignments requiring attention.`;

    let html = `
    <div style="display:flex; justify-content:space-between; margin-top:12px; margin-bottom:16px;">
        <h3 class="font-semibold">Review Queue</h3>
        <div style="display:flex; gap:8px;">
            <span class="badge badge-success">Ongoing (${myCases.filter(c => c.status !== 'Approved/Completed').length})</span>
            <span class="badge badge-tier1" style="font-size:0.75rem; padding:4px 10px;">Urgent (${myCases.filter(c => c.tier === 'Tier 1').length})</span>
        </div>
    </div>
    <div class="grid grid-cols-2">`;

    myCases.forEach(c => {
        const family = DB.users.find(u => u.id === c.userId);
        const tierClass = c.tier === 'Tier 1' ? 'badge-tier1' : 'badge-tier2';
        html += `
        <div class="card card-clickable" style="${c.tier === 'Tier 1' ? 'border-left: 4px solid #ef4444;' : ''}" onclick="window.navigate('case-details', '${c.id}')">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;" class="mb-3">
                <div style="display:flex; gap:8px;">
                    <span class="badge ${c.status === 'In Review' ? 'badge-success' : 'badge-warning'}">${c.status}</span>
                    <span class="badge ${tierClass}">${c.tier}</span>
                </div>
                <span class="text-xs font-medium text-secondary">${c.date}</span>
            </div>
            <h3 class="font-semibold text-lg mb-1">${c.type}</h3>
            ${c.description ? `<p class="text-sm text-secondary mb-3" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">"${c.description}"</p>` : '<div class="mb-3"></div>'}
            
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; padding:12px; background:var(--bg-subtle); border-radius:12px;">
                <img src="https://ui-avatars.com/api/?name=${family.name}&background=f4f4f5&color=09090b&rounded=true" style="width:32px; height:32px; border-radius:50%;">
                <div>
                    <p class="text-sm font-semibold">${family.name}</p>
                    <p class="text-xs text-muted">${family.district}</p>
                </div>
            </div>

            <button class="btn btn-outline" style="width:100%; border-radius:10px;">Review Work</button>
        </div>`;
    });

    html += `</div>`;
    $app.innerHTML = html;
}

function renderCaseDetails() {
    const c = DB.cases.find(x => x.id === state.activeCaseContext);
    const family = DB.users.find(u => u.id === c.userId);
    $pageTitle.innerText = `Workspace: ${c.type}`;
    $pageSubtitle.innerText = `Client: ${family.name}`;

    $app.innerHTML = `
    <button class="btn btn-ghost mb-6" style="padding:0; gap:4px;" onclick="window.navigate('dashboard')">
        <i class="ph-bold ph-arrow-left"></i> Back to Workload
    </button>
    
    <div class="grid" style="grid-template-columns: 320px 1fr; align-items:start;">
        <div class="card" style="padding:24px;">
            <h3 class="font-semibold text-lg mb-4">Client Overview</h3>
            
            <div class="mb-4">
                <p class="text-xs text-muted mb-1">Primary Contact</p>
                <p class="font-medium">${family.name}</p>
            </div>
            <div class="mb-6">
                <p class="text-xs text-muted mb-1">District / Jurisdiction</p>
                <p class="font-medium">${family.district}</p>
            </div>

            <hr style="border:0; border-top:1px solid var(--border-light); margin:24px 0;">

            <h3 class="font-semibold mb-3">Workflow Status</h3>
            <div class="form-group mb-6">
                <select id="case-status-select" class="form-input" style="background:var(--bg-subtle);">
                    <option value="In Review" ${c.status === 'In Review' ? 'selected' : ''}>Phase 1: In Review</option>
                    <option value="Submitted to Authority" ${c.status === 'Submitted to Authority' ? 'selected' : ''}>Phase 2: Submitted to Gov</option>
                    <option value="Approved/Completed" ${c.status === 'Approved/Completed' ? 'selected' : ''}>Phase 3: Completed</option>
                </select>
            </div>
            <button class="btn btn-primary" style="width:100%; border-radius:10px;" onclick="updateCaseStatus('${c.id}')">Save Progression</button>
        </div>

        <div class="card" style="padding:24px; min-height:600px; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h3 class="font-semibold text-lg">Document Ledger (${c.documents.length})</h3>
                <button class="btn btn-ghost"><i class="ph-duotone ph-download-simple"></i> Download All</button>
            </div>
            
            ${c.documents.length === 0 ? '<div class="empty-state" style="flex:1;"><div class="empty-state-icon"><i class="ph-duotone ph-file-x"></i></div><p>No documents provided.</p></div>' : ''}
            
            ${c.documents.length > 0 ? `
            <div style="flex:1; background:var(--bg-subtle); border-radius:16px; border:1px solid var(--border-light); overflow:hidden; position:relative;">
                
                <!-- Mockup toolbar inside PDF viewer -->
                <div style="padding:12px 20px; border-bottom:1px solid var(--border-light); background:white; display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:0.85rem; font-family:monospace; font-weight:600;">${c.documents[0]}</div>
                    <div style="display:flex; gap:16px; color:var(--text-tertiary);">
                        <i class="ph-bold ph-magnifying-glass-plus"></i>
                        <i class="ph-bold ph-printer"></i>
                    </div>
                </div>

                <div style="display:flex; align-items:center; justify-content:center; height:100%; flex-direction:column; padding-bottom:40px;">
                     <i class="ph-duotone ph-file-pdf" style="font-size:4rem; color:#ef4444; margin-bottom:16px;"></i>
                     <p class="font-medium">PDF Display Sandbox</p>
                     <p class="text-sm text-secondary">Document rendering occurs here via standard embed / iframe.</p>
                </div>
            </div>
            ` : ''}
        </div>
    </div>
    `;
}

// --- ADMIN VIEWS --- //

function renderAdminDashboard() {
    $pageTitle.innerText = "Admin Console";
    $pageSubtitle.innerText = "Real-time metrics and platform oversight.";

    $app.innerHTML = `
    <div class="grid grid-cols-3 mb-10 mt-2">
        <div class="card" style="padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div class="text-xs text-muted">Active Workflows</div>
                <i class="ph-duotone ph-activity" style="color:var(--accent); font-size:1.5rem;"></i>
            </div>
            <div class="font-bold serif" style="font-size:2.5rem; line-height:1;">${DB.cases.length}</div>
        </div>
        <div class="card" style="padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div class="text-xs text-muted">Service Partners</div>
                <i class="ph-duotone ph-scales" style="color:var(--accent); font-size:1.5rem;"></i>
            </div>
            <div class="font-bold serif" style="font-size:2.5rem; line-height:1;">${DB.lawyers.length}</div>
        </div>
        <div class="card" style="padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                 <div class="text-xs text-muted">Families Supported</div>
                 <i class="ph-duotone ph-users" style="color:var(--accent); font-size:1.5rem;"></i>
            </div>
            <div class="font-bold serif" style="font-size:2.5rem; line-height:1;">${DB.users.length}</div>
        </div>
    </div>

    <h3 class="font-semibold text-lg mb-4">Live Ledger</h3>
    <div class="card" style="padding:0;">
        <table style="width:100%; text-align:left; border-collapse:collapse;">
            <thead>
                <tr style="border-bottom:1px solid var(--border-medium);">
                    <th style="padding:20px 24px; font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Case Ref</th>
                    <th style="padding:20px 24px; font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Request Type</th>
                    <th style="padding:20px 24px; font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Status Pipeline</th>
                    <th style="padding:20px 24px; font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Escrow Lock</th>
                </tr>
            </thead>
            <tbody>
                ${DB.cases.map((c, i) => `
                <tr style="border-bottom:1px solid var(--border-light); transition:background 0.2s;" onmouseover="this.style.background='var(--bg-subtle)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:20px 24px; font-size:0.9rem font-family:monospace; font-weight:500;">req-${c.id}</td>
                    <td style="padding:20px 24px; font-size:0.95rem; font-weight:500;">${c.type}</td>
                    <td style="padding:20px 24px;"><span class="badge ${c.status === 'In Review' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
                    <td style="padding:20px 24px; font-size:0.95rem; font-weight:700;">₹${c.lawyerId !== 'null' ? '25' : '—'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
}

// --- ACTIONS & UTILS --- //

window.assignLawyer = function (lawyerId) {
    const unassignedCase = DB.cases.find(c => c.lawyerId === 'null');
    if (unassignedCase) {
        unassignedCase.lawyerId = lawyerId;
        unassignedCase.status = 'In Review';
        showToast(`Partner assigned. Escrow ₹25 locked.`, 'success');
        window.navigate('dashboard');
    } else {
        showToast('No pending cases available for assignment.', 'info');
    }
}

window.submitCase = function () {
    const type = document.getElementById('case-type').value;
    const desc = document.getElementById('case-description').value;

    // Smart Tier Routing Logic
    // Urgent keywords: Insurance, Transfer, Claim, Urgent
    const urgentKeywords = ['insurance', 'claim', 'transfer', 'urgent', 'life'];
    const textToCheck = (type + " " + desc).toLowerCase();

    let tier = 'Tier 2';
    for (let word of urgentKeywords) {
        if (textToCheck.includes(word)) {
            tier = 'Tier 1';
            break;
        }
    }

    DB.cases.push({
        id: 'c' + (DB.cases.length + 1),
        userId: 'u1',
        lawyerId: 'null',
        type: type,
        description: desc,
        status: 'Pending Assign',
        tier: tier,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        documents: ['uploaded_document.pdf']
    });

    showToast(`Case Submitted. Routed to ${tier}.`, 'success');
    window.navigate('lawyer-directory');
}

let recognition = null;
window.toggleVoiceInput = function () {
    const btn = document.getElementById('voice-btn');
    const statusText = document.getElementById('voice-status');
    const textArea = document.getElementById('case-description');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice input is not supported in this browser.', 'warning');
        return;
    }

    if (btn.classList.contains('recording')) {
        if (recognition) recognition.stop();
        btn.classList.remove('recording');
        statusText.style.display = 'none';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Defaults to Hindi
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        btn.classList.add('recording');
        statusText.style.display = 'block';
    };

    recognition.onresult = function (event) {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript) {
            const currentVal = textArea.value;
            textArea.value = currentVal ? currentVal + ' ' + finalTranscript : finalTranscript;
        }
    };

    recognition.onerror = function (event) {
        showToast('Microphone error: ' + event.error, 'warning');
        btn.classList.remove('recording');
        statusText.style.display = 'none';
    };

    recognition.onend = function () {
        btn.classList.remove('recording');
        statusText.style.display = 'none';
    };

    recognition.start();
}

window.handleFileUpload = function (e) {
    const files = e.target.files;
    if (files.length > 0) {
        document.getElementById('file-list').innerHTML = `
            <div style="background:var(--bg-surface); padding:16px 20px; border-radius:12px; display:flex; align-items:center; gap:16px; border:1px solid var(--border-medium); box-shadow:var(--shadow-sm);">
                <div style="background:#fef2f2; padding:8px; border-radius:8px;">
                    <i class="ph-duotone ph-file-pdf" style="font-size:1.5rem; color:#ef4444;"></i>
                </div>
                <div style="flex:1;">
                    <span class="font-semibold text-sm block" style="line-height:1.2">${files[0].name}</span>
                    <span class="text-xs text-muted">Ready for submission</span>
                </div>
                <i class="ph-fill ph-check-circle" style="font-size:1.5rem; color:var(--success);"></i>
            </div>
        `;
        showToast('File loaded successfully.', 'info');
    }
}

window.updateCaseStatus = function (caseId) {
    const caseObj = DB.cases.find(c => c.id === caseId);
    if (caseObj) {
        const val = document.getElementById('case-status-select').value;
        caseObj.status = val;
        showToast(`Pipeline transitioned to: ${val}`, 'success');
        setTimeout(() => renderCaseDetails(), 100);
    }
}

// --- ADVANCED AUDIO FEATURE UI --- //
window.readPageContent = function () {
    const synth = window.speechSynthesis;
    const btn = document.getElementById('audio-btn');
    const btnText = btn.querySelector('.btn-text');

    if (!synth) {
        showToast("Text-to-speech not supported.", 'info');
        return;
    }

    if (synth.speaking) {
        synth.cancel();
        btn.classList.remove('playing');
        btnText.innerText = "Listen (Hindi)";
        return;
    }

    let contentToRead = "नमस्ते. " + $pageTitle.innerText + ". " + $pageSubtitle.innerText;

    if (state.currentRoute === 'dashboard' && state.role === 'user') {
        contentToRead += "यहाँ आप अपने सरकारी कागजी कार्रवाई की प्रगति देख सकते हैं|";
    }

    const utterance = new SpeechSynthesisUtterance(contentToRead);

    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('hi-IN'));
    if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
    } else {
        utterance.lang = 'en-US';
        utterance.text = "Reading localized interface content. " + $pageTitle.innerText;
    }

    // Trigger Magical UI state
    btn.classList.add('playing');
    btnText.innerText = "Synthesizing...";

    utterance.onend = () => {
        btn.classList.remove('playing');
        btnText.innerText = "Listen (Hindi)";
    };

    synth.speak(utterance);
}

// Ensure voices load
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
}

// Init
renderNavigation();
renderPage();
