import { useState, useRef } from "react";

const INITIAL_CONTACTS = [
  { id: 1, name: "Sarah Chen", company: "NovaTech Labs", email: "s.chen@novatech.io", phone: "+1 (415) 882-3201", status: "Active", deal: "$42,000", stage: "Negotiation", avatar: "SC", color: "#185FA5", lastContact: "2026-05-18" },
  { id: 2, name: "Marcus Dillon", company: "Apex Ventures", email: "m.dillon@apexv.com", phone: "+1 (312) 556-7890", status: "Lead", deal: "$18,500", stage: "Proposal", avatar: "MD", color: "#3B6D11", lastContact: "2026-05-15" },
  { id: 3, name: "Priya Nair", company: "Crest Financial", email: "priya@crestfin.com", phone: "+44 20 7946 0291", status: "Active", deal: "$97,000", stage: "Closed Won", avatar: "PN", color: "#993556", lastContact: "2026-05-20" },
  { id: 4, name: "James Okafor", company: "Meridian Group", email: "j.okafor@meridian.co", phone: "+1 (646) 772-4431", status: "Inactive", deal: "$5,200", stage: "Lost", avatar: "JO", color: "#854F0B", lastContact: "2026-04-30" },
  { id: 5, name: "Elena Vasquez", company: "Orbit SaaS", email: "evasquez@orbit.io", phone: "+34 91 123 4567", status: "Lead", deal: "$63,000", stage: "Discovery", avatar: "EV", color: "#533AB7", lastContact: "2026-05-19" },
];

const INITIAL_QA = [
  { id: 1, author: "Marcus Dillon", avatar: "MD", color: "#3B6D11", question: "How do I reset my 2FA for the client portal?", timestamp: "2026-05-18 09:14", status: "answered", reply: "Hi Marcus, you can reset your 2FA by going to Account Settings → Security → Reset Authenticator. If you've lost access, email support@crm.io with your employee ID for manual reset.", repliedBy: "IT Team", replyTimestamp: "2026-05-18 10:02" },
  { id: 2, author: "Elena Vasquez", avatar: "EV", color: "#533AB7", question: "Is there a bulk import template for contacts from Salesforce?", timestamp: "2026-05-19 14:37", status: "pending", reply: null, repliedBy: null, replyTimestamp: null },
  { id: 3, author: "Sarah Chen", avatar: "SC", color: "#185FA5", question: "The deal pipeline is not loading correctly on Edge browser. Getting a blank screen after login.", timestamp: "2026-05-20 08:55", status: "in-progress", reply: "Hi Sarah, we've reproduced the issue and are working on a fix. Workaround: use Chrome or Firefox for now. ETA for the patch: today EOD.", repliedBy: "IT Team", replyTimestamp: "2026-05-20 09:30" },
];

const INITIAL_FILES = [
  { id: 1, name: "Q2_Sales_Report.pdf", size: "2.4 MB", type: "pdf", uploadedBy: "Priya Nair", date: "2026-05-15", category: "Reports" },
  { id: 2, name: "Orbit_SaaS_Proposal_v2.docx", size: "890 KB", type: "docx", uploadedBy: "Elena Vasquez", date: "2026-05-18", category: "Proposals" },
  { id: 3, name: "NovaTech_Contract_Signed.pdf", size: "1.1 MB", type: "pdf", uploadedBy: "Sarah Chen", date: "2026-05-20", category: "Contracts" },
  { id: 4, name: "Competitor_Analysis_2026.xlsx", size: "540 KB", type: "xlsx", uploadedBy: "Marcus Dillon", date: "2026-05-12", category: "Analysis" },
];

const ACTIVITIES = [
  { id: 1, type: "call", text: "Call with Sarah Chen — NovaTech contract review", time: "Today, 10:30", icon: "📞" },
  { id: 2, type: "email", text: "Proposal sent to Orbit SaaS", time: "Today, 08:15", icon: "✉️" },
  { id: 3, type: "deal", text: "Crest Financial deal marked Closed Won", time: "Yesterday", icon: "🏆" },
  { id: 4, type: "note", text: "Meeting notes added for Meridian Group", time: "May 18", icon: "📝" },
];

const fileIcon = (type) => {
  if (type === "pdf") return { icon: "ti-file-type-pdf", color: "#E24B4A", bg: "#FCEBEB" };
  if (type === "docx") return { icon: "ti-file-type-doc", color: "#185FA5", bg: "#E6F1FB" };
  if (type === "xlsx") return { icon: "ti-file-spreadsheet", color: "#3B6D11", bg: "#EAF3DE" };
  return { icon: "ti-file", color: "#5F5E5A", bg: "#F1EFE8" };
};

const statusColor = (status) => {
  if (status === "Active") return { bg: "#EAF3DE", color: "#3B6D11" };
  if (status === "Lead") return { bg: "#E6F1FB", color: "#185FA5" };
  if (status === "Inactive") return { bg: "#F1EFE8", color: "#5F5E5A" };
  return { bg: "#F1EFE8", color: "#5F5E5A" };
};

const stageColor = (stage) => {
  const map = {
    "Discovery": { bg: "#E6F1FB", color: "#185FA5" },
    "Proposal": { bg: "#FAEEDA", color: "#854F0B" },
    "Negotiation": { bg: "#EEEDFE", color: "#534AB7" },
    "Closed Won": { bg: "#EAF3DE", color: "#3B6D11" },
    "Lost": { bg: "#FCEBEB", color: "#A32D2D" },
  };
  return map[stage] || { bg: "#F1EFE8", color: "#5F5E5A" };
};

const qaStatusStyle = (status) => {
  if (status === "answered") return { bg: "#EAF3DE", color: "#3B6D11", label: "Answered" };
  if (status === "in-progress") return { bg: "#FAEEDA", color: "#854F0B", label: "In Progress" };
  return { bg: "#E6F1FB", color: "#185FA5", label: "Pending" };
};

export default function CRM() {
  const [tab, setTab] = useState("dashboard");
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [qaItems, setQaItems] = useState(INITIAL_QA);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestioner, setNewQuestioner] = useState("");
  const [replyDraft, setReplyDraft] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef();

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (fileList) => {
    Array.from(fileList).forEach(f => {
      const ext = f.name.split(".").pop().toLowerCase();
      setFiles(prev => [...prev, {
        id: Date.now() + Math.random(),
        name: f.name,
        size: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + " MB" : Math.round(f.size / 1024) + " KB",
        type: ["pdf","docx","xlsx"].includes(ext) ? ext : "file",
        uploadedBy: "You",
        date: new Date().toISOString().slice(0, 10),
        category: "Uploads"
      }]);
    });
    showNotif(`${fileList.length} file(s) uploaded successfully`);
  };

  const submitQuestion = () => {
    if (!newQuestion.trim()) return;
    setQaItems(prev => [...prev, {
      id: Date.now(),
      author: newQuestioner || "Anonymous",
      avatar: (newQuestioner || "AN").slice(0, 2).toUpperCase(),
      color: "#533AB7",
      question: newQuestion,
      timestamp: new Date().toLocaleString("en-GB").slice(0, 16).replace("T", " "),
      status: "pending",
      reply: null, repliedBy: null, replyTimestamp: null
    }]);
    setNewQuestion("");
    setNewQuestioner("");
    showNotif("Question submitted to IT Team");
  };

  const submitReply = (id) => {
    const text = replyDraft[id];
    if (!text?.trim()) return;
    setQaItems(prev => prev.map(q => q.id === id ? {
      ...q,
      status: "answered",
      reply: text,
      repliedBy: "IT Team",
      replyTimestamp: new Date().toLocaleString("en-GB").slice(0, 16).replace("T", " ")
    } : q));
    setReplyDraft(prev => { const n = { ...prev }; delete n[id]; return n; });
    showNotif("Reply posted");
  };

  const metrics = [
    { label: "Total Contacts", value: contacts.length, icon: "ti-users", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Active Deals", value: contacts.filter(c => c.status === "Active").length, icon: "ti-briefcase", color: "#3B6D11", bg: "#EAF3DE" },
    { label: "Pipeline Value", value: "$225.7K", icon: "ti-chart-bar", color: "#854F0B", bg: "#FAEEDA" },
    { label: "Closed This Month", value: "1", icon: "ti-trophy", color: "#534AB7", bg: "#EEEDFE" },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { id: "contacts", label: "Contacts", icon: "ti-users" },
    { id: "pipeline", label: "Pipeline", icon: "ti-git-branch" },
    { id: "files", label: "Files", icon: "ti-folder" },
    { id: "qa", label: "Q&A / IT Support", icon: "ti-message-question" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f7f6f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.9.0/tabler-icons.min.css" rel="stylesheet" />

      {notification && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, background: notification.type === "success" ? "#EAF3DE" : "#FCEBEB", color: notification.type === "success" ? "#3B6D11" : "#A32D2D", border: `0.5px solid ${notification.type === "success" ? "#97C459" : "#F09595"}`, borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 500, boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}>
          {notification.msg}
        </div>
      )}

      {/* Top Nav */}
      <header style={{ background: "#fff", borderBottom: "0.5px solid #e2e0d8", padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 24, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-bolt" style={{ color: "#fff", fontSize: 16 }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.3px", color: "#1a1917" }}>NexaCRM</span>
        </div>
        <nav style={{ display: "flex", gap: 2, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedContact(null); }} style={{ background: tab === t.id ? "#f0efec" : "transparent", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? "#1a1917" : "#888780", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
              <i className={`ti ${t.icon}`} style={{ fontSize: 15 }} />
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button style={{ background: "none", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#888780" }}><i className="ti ti-bell" style={{ fontSize: 16 }} /></button>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 600 }}>EL</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 200, background: "#fff", borderRight: "0.5px solid #e2e0d8", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#b4b2a9", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 8px 8px" }}>Workspace</p>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedContact(null); }} style={{ background: tab === t.id ? "#f0efec" : "transparent", border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? "#1a1917" : "#888780", display: "flex", alignItems: "center", gap: 8, textAlign: "left", width: "100%", transition: "all 0.15s" }}>
              <i className={`ti ${t.icon}`} style={{ fontSize: 16 }} />
              {t.label}
            </button>
          ))}
          <div style={{ marginTop: "auto", borderTop: "0.5px solid #e2e0d8", paddingTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
            <button style={{ background: "transparent", border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 13, color: "#888780", display: "flex", alignItems: "center", gap: 8, width: "100%" }}><i className="ti ti-settings" style={{ fontSize: 16 }} />Settings</button>
            <button style={{ background: "transparent", border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 13, color: "#888780", display: "flex", alignItems: "center", gap: 8, width: "100%" }}><i className="ti ti-help" style={{ fontSize: 16 }} />Help</button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: 24, overflowY: "auto", maxHeight: "calc(100vh - 56px)" }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 4px", color: "#1a1917" }}>Good morning, Elad 👋</h1>
              <p style={{ color: "#888780", fontSize: 14, margin: "0 0 24px" }}>Wednesday, May 20, 2026 — Here's what's happening today.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {metrics.map(m => (
                  <div key={m.label} style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={`ti ${m.icon}`} style={{ fontSize: 20, color: m.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#1a1917" }}>{m.value}</p>
                      <p style={{ fontSize: 12, color: "#888780", margin: 0 }}>{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: "18px 20px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "#1a1917" }}>Recent Activity</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {ACTIVITIES.map(a => (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#f7f6f3", borderRadius: 8 }}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "#1a1917" }}>{a.text}</p>
                          <p style={{ fontSize: 11, color: "#b4b2a9", margin: 0 }}>{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: "18px 20px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "#1a1917" }}>Pipeline Overview</h3>
                  {["Discovery", "Proposal", "Negotiation", "Closed Won"].map(stage => {
                    const count = contacts.filter(c => c.stage === stage).length;
                    const sc = stageColor(stage);
                    return (
                      <div key={stage} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: "#888780", width: 90, flexShrink: 0 }}>{stage}</span>
                        <div style={{ flex: 1, height: 8, background: "#f0efec", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${(count / contacts.length) * 100}%`, height: "100%", background: sc.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1917", width: 16, textAlign: "right" }}>{count}</span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 16, borderTop: "0.5px solid #e2e0d8", paddingTop: 12 }}>
                    <p style={{ fontSize: 12, color: "#888780", margin: "0 0 4px" }}>Open IT Tickets</p>
                    <p style={{ fontSize: 22, fontWeight: 600, color: "#1a1917", margin: 0 }}>{qaItems.filter(q => q.status !== "answered").length} <span style={{ fontSize: 13, fontWeight: 400, color: "#b4b2a9" }}>pending</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {tab === "contacts" && !selectedContact && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#1a1917" }}>Contacts</h1>
                  <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>{contacts.length} records</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "0 10px", gap: 6 }}>
                    <i className="ti ti-search" style={{ fontSize: 15, color: "#b4b2a9" }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." style={{ border: "none", outline: "none", fontSize: 13, padding: "7px 0", width: 180, background: "transparent", color: "#1a1917" }} />
                  </div>
                  <button onClick={() => showNotif("Add contact form coming soon")} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="ti ti-plus" style={{ fontSize: 15 }} /> Add Contact
                  </button>
                </div>
              </div>
              <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f7f6f3", borderBottom: "0.5px solid #e2e0d8" }}>
                      {["Contact", "Company", "Email", "Deal Value", "Stage", "Status", "Last Contact", ""].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: "#888780", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c, i) => {
                      const sc = statusColor(c.status);
                      const sg = stageColor(c.stage);
                      return (
                        <tr key={c.id} style={{ borderBottom: "0.5px solid #f0efec", background: i % 2 === 0 ? "#fff" : "#fafaf8", cursor: "pointer" }} onClick={() => setSelectedContact(c)}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: c.color, flexShrink: 0 }}>{c.avatar}</div>
                              <span style={{ fontWeight: 500, color: "#1a1917" }}>{c.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px", color: "#5F5E5A" }}>{c.company}</td>
                          <td style={{ padding: "12px 14px", color: "#5F5E5A" }}>{c.email}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 500, color: "#1a1917" }}>{c.deal}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ background: sg.bg, color: sg.color, borderRadius: 6, padding: "3px 9px", fontSize: 12, fontWeight: 500 }}>{c.stage}</span>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "3px 9px", fontSize: 12, fontWeight: 500 }}>{c.status}</span>
                          </td>
                          <td style={{ padding: "12px 14px", color: "#888780" }}>{c.lastContact}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <button onClick={e => { e.stopPropagation(); setSelectedContact(c); }} style={{ background: "none", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#5F5E5A" }}>View</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTACT DETAIL */}
          {tab === "contacts" && selectedContact && (() => {
            const c = selectedContact;
            const sc = statusColor(c.status);
            const sg = stageColor(c.stage);
            return (
              <div>
                <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888780", fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginBottom: 16, padding: 0 }}>
                  <i className="ti ti-arrow-left" style={{ fontSize: 15 }} /> Back to Contacts
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: 20 }}>
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600, color: c.color, margin: "0 auto 10px" }}>{c.avatar}</div>
                        <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px", color: "#1a1917" }}>{c.name}</h2>
                        <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>{c.company}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>{c.status}</span>
                        <span style={{ background: sg.bg, color: sg.color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>{c.stage}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[["ti-mail", c.email], ["ti-phone", c.phone], ["ti-currency-dollar", c.deal], ["ti-calendar", "Last: " + c.lastContact]].map(([icon, val]) => (
                          <div key={icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5F5E5A" }}>
                            <i className={`ti ${icon}`} style={{ fontSize: 15, color: "#b4b2a9", flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: 16 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: "#1a1917" }}>Quick Actions</h3>
                      {[["ti-phone", "Log a Call"], ["ti-mail", "Send Email"], ["ti-notes", "Add Note"], ["ti-calendar", "Schedule Meeting"]].map(([icon, label]) => (
                        <button key={label} onClick={() => showNotif(`${label} — coming soon`)} style={{ width: "100%", background: "#f7f6f3", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, color: "#1a1917", display: "flex", alignItems: "center", gap: 8, marginBottom: 6, textAlign: "left" }}>
                          <i className={`ti ${icon}`} style={{ fontSize: 15, color: "#888780" }} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: 20 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "#1a1917" }}>Deal Details</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        {[["Deal Value", c.deal], ["Stage", c.stage], ["Last Contact", c.lastContact]].map(([label, val]) => (
                          <div key={label} style={{ background: "#f7f6f3", borderRadius: 8, padding: "12px 14px" }}>
                            <p style={{ fontSize: 11, color: "#b4b2a9", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                            <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1917", margin: 0 }}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: 20 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "#1a1917" }}>Activity Timeline</h3>
                      {ACTIVITIES.slice(0, 3).map(a => (
                        <div key={a.id} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: "0.5px solid #f0efec" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0efec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 2px", color: "#1a1917" }}>{a.text}</p>
                            <p style={{ fontSize: 11, color: "#b4b2a9", margin: 0 }}>{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PIPELINE */}
          {tab === "pipeline" && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px", color: "#1a1917" }}>Pipeline</h1>
              <p style={{ fontSize: 13, color: "#888780", margin: "0 0 20px" }}>Drag-and-drop view of all deals by stage</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {["Discovery", "Proposal", "Negotiation", "Closed Won", "Lost"].map(stage => {
                  const sc = stageColor(stage);
                  const stageContacts = contacts.filter(c => c.stage === stage);
                  return (
                    <div key={stage} style={{ background: "#f7f6f3", borderRadius: 12, padding: 12, minHeight: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: sc.color }}>{stage}</span>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{stageContacts.length}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {stageContacts.map(c => (
                          <div key={c.id} onClick={() => { setSelectedContact(c); setTab("contacts"); }} style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <div style={{ width: 26, height: 26, borderRadius: "50%", background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: c.color }}>{c.avatar}</div>
                              <div>
                                <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: "#1a1917" }}>{c.name}</p>
                                <p style={{ fontSize: 11, color: "#888780", margin: 0 }}>{c.company}</p>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1917" }}>{c.deal}</span>
                              <span style={{ fontSize: 10, color: "#b4b2a9" }}>{c.lastContact}</span>
                            </div>
                          </div>
                        ))}
                        {stageContacts.length === 0 && <p style={{ fontSize: 12, color: "#b4b2a9", textAlign: "center", padding: "20px 0" }}>No deals</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FILES */}
          {tab === "files" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#1a1917" }}>Files</h1>
                  <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>{files.length} files stored</p>
                </div>
                <button onClick={() => fileInputRef.current.click()} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="ti ti-upload" style={{ fontSize: 15 }} /> Upload File
                </button>
                <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={e => handleFileUpload(e.target.files)} />
              </div>
              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }} style={{ border: `2px dashed ${dragOver ? "#185FA5" : "#d3d1c7"}`, borderRadius: 12, padding: 24, textAlign: "center", background: dragOver ? "#E6F1FB" : "#f7f6f3", marginBottom: 20, transition: "all 0.2s", cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                <i className="ti ti-cloud-upload" style={{ fontSize: 28, color: dragOver ? "#185FA5" : "#b4b2a9", display: "block", marginBottom: 8 }} />
                <p style={{ fontSize: 14, fontWeight: 500, color: dragOver ? "#185FA5" : "#888780", margin: 0 }}>Drop files here or click to upload</p>
                <p style={{ fontSize: 12, color: "#b4b2a9", margin: "4px 0 0" }}>Supports PDF, DOCX, XLSX, and more</p>
              </div>
              <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f7f6f3", borderBottom: "0.5px solid #e2e0d8" }}>
                      {["File", "Category", "Size", "Uploaded By", "Date", ""].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: "#888780", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((f, i) => {
                      const fi = fileIcon(f.type);
                      return (
                        <tr key={f.id} style={{ borderBottom: "0.5px solid #f0efec", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: fi.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <i className={`ti ${fi.icon}`} style={{ fontSize: 16, color: fi.color }} />
                              </div>
                              <span style={{ fontWeight: 500, color: "#1a1917" }}>{f.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}><span style={{ background: "#f0efec", color: "#5F5E5A", borderRadius: 6, padding: "3px 8px", fontSize: 12 }}>{f.category}</span></td>
                          <td style={{ padding: "12px 14px", color: "#888780" }}>{f.size}</td>
                          <td style={{ padding: "12px 14px", color: "#5F5E5A" }}>{f.uploadedBy}</td>
                          <td style={{ padding: "12px 14px", color: "#888780" }}>{f.date}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", gap: 4 }}>
                              <button onClick={() => showNotif("Download started")} style={{ background: "none", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#5F5E5A" }}><i className="ti ti-download" style={{ fontSize: 14 }} /></button>
                              <button onClick={() => { setFiles(prev => prev.filter(x => x.id !== f.id)); showNotif("File deleted", "error"); }} style={{ background: "none", border: "0.5px solid #d3d1c7", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#A32D2D" }}><i className="ti ti-trash" style={{ fontSize: 14 }} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Q&A */}
          {tab === "qa" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#1a1917" }}>Q&A / IT Support</h1>
                  <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>Submit questions and get answers from the IT team</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["All", "all"], ["Pending", "pending"], ["In Progress", "in-progress"], ["Answered", "answered"]].map(([label, val]) => (
                    <button key={val} style={{ background: "#fff", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, color: "#5F5E5A" }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* New question form */}
              <div style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: 20, marginBottom: 20, marginTop: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px", color: "#1a1917" }}>Submit a new question</h3>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <input value={newQuestioner} onChange={e => setNewQuestioner(e.target.value)} placeholder="Your name" style={{ flex: "0 0 200px", border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", color: "#1a1917", background: "#fafaf8" }} />
                  <input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Describe your issue or question for the IT team..." style={{ flex: 1, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", color: "#1a1917", background: "#fafaf8" }} onKeyDown={e => e.key === "Enter" && submitQuestion()} />
                  <button onClick={submitQuestion} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>Submit</button>
                </div>
                <p style={{ fontSize: 12, color: "#b4b2a9", margin: 0 }}>The IT team typically responds within 1 business hour.</p>
              </div>

              {/* Q&A items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {qaItems.map(q => {
                  const qs = qaStatusStyle(q.status);
                  return (
                    <div key={q.id} style={{ background: "#fff", border: "0.5px solid #e2e0d8", borderRadius: 12, padding: 18, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: q.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: q.color, flexShrink: 0 }}>{q.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1917" }}>{q.author}</span>
                            <span style={{ fontSize: 11, color: "#b4b2a9" }}>{q.timestamp}</span>
                            <span style={{ background: qs.bg, color: qs.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginLeft: "auto" }}>{qs.label}</span>
                          </div>
                          <p style={{ fontSize: 14, color: "#1a1917", margin: 0, lineHeight: 1.5 }}>{q.question}</p>
                        </div>
                      </div>

                      {/* IT reply */}
                      {q.reply && (
                        <div style={{ background: "#EAF3DE", borderRadius: 10, padding: "12px 14px", marginLeft: 48, marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#3B6D11", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="ti ti-tools" style={{ fontSize: 12, color: "#fff" }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#3B6D11" }}>{q.repliedBy}</span>
                            <span style={{ fontSize: 11, color: "#639922" }}>{q.replyTimestamp}</span>
                          </div>
                          <p style={{ fontSize: 13, color: "#1a1917", margin: 0, lineHeight: 1.5 }}>{q.reply}</p>
                        </div>
                      )}

                      {/* Reply input for IT */}
                      {q.status !== "answered" && (
                        <div style={{ marginLeft: 48, display: "flex", gap: 8 }}>
                          <input
                            value={replyDraft[q.id] || ""}
                            onChange={e => setReplyDraft(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="IT Team: Type your reply..."
                            style={{ flex: 1, border: "0.5px solid #d3d1c7", borderRadius: 8, padding: "7px 12px", fontSize: 13, outline: "none", background: "#f7f6f3", color: "#1a1917" }}
                          />
                          <button onClick={() => submitReply(q.id)} style={{ background: "#3B6D11", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Reply</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
