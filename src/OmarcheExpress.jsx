import React, { useState, useMemo, useRef, useEffect, lazy, Suspense } from "react";
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2, ChevronRight, ChevronLeft,
  Menu, User, Package, TrendingUp, Users, Wallet, Clock, CheckCircle2,
  Truck, LayoutGrid, Tag, Pencil, LogOut, Star, AlertCircle, Apple,
  Coffee, Milk, Cookie, SprayCan, ShoppingBasket, PlusCircle, ArrowLeft,
  MapPin, Phone, MessageSquare, Eye, EyeOff, PackageCheck, PackageX,
  BarChart3, Home as HomeIcon, ClipboardList, Settings, Flame,
  Sparkles, Baby, HeartPulse, UtensilsCrossed, Smartphone, Shirt, Upload,
  Headphones, ShieldCheck, RotateCcw, ChevronDown, Facebook, Instagram, Send, MessageCircle,
  Cable, Store, Gamepad2, Luggage, Cpu, Glasses, Dumbbell, BookOpen, Car, Heart
} from "lucide-react";
import { supabase } from "./supabaseClient";
const AdminApp = lazy(() => import("./Admin.jsx"));

const WHATSAPP_NUMBER_RAW = "+225 0748372316";
const toWaDigits = (raw) => raw.replace(/[^\d]/g, ""); // garde le 0 : numérotation ivoirienne à 10 chiffres
const WHATSAPP_NUMBER = toWaDigits(WHATSAPP_NUMBER_RAW);
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const trackPixel = (event, params) => {
  if (typeof window !== "undefined" && window.fbq) window.fbq("track", event, params);
};

/* Icône WhatsApp dessinée (silhouette officielle du logo) */
function WhatsAppIcon({ size = 24, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        d="M16.004 2.667c-7.364 0-13.333 5.97-13.333 13.333 0 2.352.615 4.56 1.69 6.475L2.667 29.333l7.03-1.844a13.26 13.26 0 0 0 6.307 1.607h.006c7.363 0 13.333-5.97 13.333-13.334 0-3.56-1.387-6.906-3.905-9.424a13.24 13.24 0 0 0-9.434-3.671Zm0 24.4h-.005a11.06 11.06 0 0 1-5.636-1.543l-.404-.24-4.172 1.095 1.114-4.067-.264-.418a11.04 11.04 0 0 1-1.69-5.894c0-6.114 4.977-11.09 11.093-11.09a11.02 11.02 0 0 1 7.845 3.254 11.02 11.02 0 0 1 3.246 7.85c-.003 6.115-4.98 11.053-11.127 11.053Zm6.086-8.29c-.334-.167-1.97-.972-2.275-1.083-.305-.111-.527-.167-.75.167-.222.334-.86 1.083-1.054 1.306-.194.223-.389.25-.723.084-.334-.167-1.409-.52-2.684-1.657-.992-.885-1.663-1.978-1.858-2.312-.194-.334-.02-.514.147-.68.15-.15.334-.39.5-.585.168-.195.223-.334.334-.557.111-.223.056-.418-.028-.585-.083-.167-.75-1.807-1.028-2.475-.27-.65-.545-.562-.75-.573-.194-.01-.417-.012-.639-.012a1.23 1.23 0 0 0-.889.417c-.306.334-1.166 1.14-1.166 2.78 0 1.639 1.194 3.223 1.361 3.446.167.222 2.352 3.59 5.696 5.036.796.344 1.417.549 1.9.702.798.254 1.524.218 2.098.132.64-.095 1.97-.805 2.248-1.583.278-.778.278-1.445.194-1.584-.083-.139-.305-.222-.639-.39Z"
      />
    </svg>
  );
}

/* ============================== FONTS / GLOBAL STYLE ============================== */
const GlobalStyle = () => (
  <style>{`
    /* Polices chargées via index.html (preconnect + display=swap) pour un rendu plus rapide */
    .oe-root, .oe-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
    .oe-display { font-family: 'Space Grotesk', sans-serif; }
    .oe-mono { font-family: 'IBM Plex Mono', monospace; }
    .oe-scrollbar-none::-webkit-scrollbar { display: none; }
    .oe-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
    .oe-ticket-edge {
      background-image: radial-gradient(circle at 0 50%, transparent 7px, #FAF8F6 7.5px),
                         radial-gradient(circle at 100% 50%, transparent 7px, #FAF8F6 7.5px);
      background-size: 100% 20px;
      background-repeat: repeat-y;
    }
    .oe-dash { background-image: repeating-linear-gradient(to right, #1C1C1E 0, #1C1C1E 6px, transparent 6px, transparent 13px); height:1px; }
    @keyframes oe-rise { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:translateY(0);} }
    .oe-rise { animation: oe-rise .35s ease both; }
    .oe-focus:focus-visible { outline: 2px solid #1C1C1E; outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .oe-rise { animation: none; } }
  `}</style>
);

/* ============================== MOCK DATA ============================== */
const CATS = [
  { id: "c1", name: "Fruits & Légumes", icon: Apple },
  { id: "c2", name: "Épicerie", icon: ShoppingBasket },
  { id: "c3", name: "Boissons", icon: Coffee },
  { id: "c4", name: "Produits laitiers", icon: Milk },
  { id: "c5", name: "Snacks", icon: Cookie },
  { id: "c6", name: "Hygiène", icon: SprayCan },
];

const IMG = (seed, w = 400, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const INIT_PRODUCTS = [
  { id: "p1", name: "Ananas Victoria", cat: "c1", price: 1500, promo: false, stock: 24, popular: true, isNew: false, active: true, img: IMG("ananas"), desc: "Ananas mûr et sucré, sélectionné chez nos producteurs locaux." },
  { id: "p2", name: "Tomates fraîches (1kg)", cat: "c1", price: 800, promo: true, promoPrice: 600, stock: 40, popular: true, isNew: false, active: true, img: IMG("tomates"), desc: "Tomates rouges bien mûres, idéales pour vos sauces." },
  { id: "p3", name: "Riz parfumé (5kg)", cat: "c2", price: 4500, promo: false, stock: 15, popular: true, isNew: false, active: true, img: IMG("riz"), desc: "Riz parfumé longue conservation, sac de 5kg." },
  { id: "p4", name: "Huile végétale (1L)", cat: "c2", price: 1800, promo: false, stock: 0, popular: false, isNew: false, active: true, img: IMG("huile"), desc: "Huile végétale raffinée, bouteille d'un litre." },
  { id: "p5", name: "Jus d'orange (1L)", cat: "c3", price: 1200, promo: false, stock: 30, popular: false, isNew: true, active: true, img: IMG("jus"), desc: "Jus d'orange 100% naturel sans sucre ajouté." },
  { id: "p6", name: "Eau minérale (pack 6)", cat: "c3", price: 1500, promo: false, stock: 50, popular: true, isNew: false, active: true, img: IMG("eau"), desc: "Pack de 6 bouteilles d'eau minérale 1,5L." },
  { id: "p7", name: "Lait en poudre (400g)", cat: "c4", price: 2500, promo: true, promoPrice: 2100, stock: 18, popular: false, isNew: false, active: true, img: IMG("lait"), desc: "Lait en poudre entier, boîte de 400g." },
  { id: "p8", name: "Yaourt nature (x4)", cat: "c4", price: 1300, promo: false, stock: 22, popular: false, isNew: true, active: true, img: IMG("yaourt"), desc: "Pack de 4 yaourts nature." },
  { id: "p9", name: "Chips nature (150g)", cat: "c5", price: 700, promo: false, stock: 35, popular: false, isNew: false, active: true, img: IMG("chips"), desc: "Chips croustillantes légèrement salées." },
  { id: "p10", name: "Biscuits chocolat", cat: "c5", price: 900, promo: false, stock: 3, popular: false, isNew: true, active: true, img: IMG("biscuits"), desc: "Biscuits fourrés au chocolat, paquet familial." },
  { id: "p11", name: "Savon liquide (500ml)", cat: "c6", price: 1600, promo: false, stock: 12, popular: false, isNew: false, active: true, img: IMG("savon"), desc: "Savon liquide pour les mains, parfum frais." },
  { id: "p12", name: "Dentifrice (75ml)", cat: "c6", price: 950, promo: false, stock: 27, popular: false, isNew: false, active: true, img: IMG("dentifrice"), desc: "Dentifrice protection complète, tube 75ml." },
];

export const STATUS_STEPS = ["Reçue", "En préparation", "En livraison", "Livrée"];
const STATUS_STYLE = {
  "Reçue": { bg: "#F1F0EE", fg: "#4B4B4E", icon: ClipboardList },
  "En préparation": { bg: "#FFF3DB", fg: "#8A5A00", icon: Clock },
  "En livraison": { bg: "#FFE7D6", fg: "#C6480A", icon: Truck },
  "Livrée": { bg: "#E3F5EA", fg: "#1F8A50", icon: CheckCircle2 },
  "Annulée": { bg: "#FBE4E4", fg: "#B42318", icon: PackageX },
};

const INIT_ORDERS = [
  { id: "OE-1042", clientName: "Awa Koné", phone: "07 01 23 45 67", address: "Rue 12, Villa 4", quartier: "Cocody Angré", ville: "Abidjan", comment: "", items: [{ id: "p1", name: "Ananas Victoria", qty: 2, price: 1500 }, { id: "p6", name: "Eau minérale (pack 6)", qty: 1, price: 1500 }], total: 4500, status: "En livraison", date: "2026-07-07T10:20:00" },
  { id: "OE-1041", clientName: "Yao Bertin", phone: "07 09 88 77 66", address: "Carrefour Sicogi", quartier: "Yopougon", ville: "Abidjan", comment: "Appeler avant livraison", items: [{ id: "p3", name: "Riz parfumé (5kg)", qty: 1, price: 4500 }], total: 4500, status: "En préparation", date: "2026-07-07T09:05:00" },
  { id: "OE-1040", clientName: "Fatou Diabaté", phone: "05 55 12 34 56", address: "Rue des Jardins", quartier: "Marcory", ville: "Abidjan", comment: "", items: [{ id: "p2", name: "Tomates fraîches (1kg)", qty: 3, price: 600 }, { id: "p9", name: "Chips nature (150g)", qty: 2, price: 700 }], total: 3200, status: "Livrée", date: "2026-07-06T16:40:00" },
];

const INIT_CLIENTS = [
  { id: "cl1", name: "Awa Koné", phone: "07 01 23 45 67", email: "awa.kone@example.com", orders: 6 },
  { id: "cl2", name: "Yao Bertin", phone: "07 09 88 77 66", email: "yao.bertin@example.com", orders: 2 },
  { id: "cl3", name: "Fatou Diabaté", phone: "05 55 12 34 56", email: "fatou.d@example.com", orders: 9 },
];

export const money = (n) => n.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";

/* ============================== SMALL UI PIECES ============================== */
function Logo({ compact }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-[#FF6A00] flex items-center justify-center shrink-0">
        <ShoppingBasket size={18} color="#fff" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="oe-display font-bold text-[#1C1C1E] text-[17px] tracking-tight">Omarché<span className="text-[#FF6A00]">Express</span></div>
        </div>
      )}
    </div>
  );
}

function StockGauge({ stock, max = 50 }) {
  const pct = Math.max(3, Math.min(100, Math.round((stock / max) * 100)));
  const color = stock === 0 ? "#B42318" : stock <= 5 ? "#C6480A" : "#FF6A00";
  return (
    <div className="w-full h-1.5 rounded-full bg-[#F1F0EE] overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function StatusBadge({ status, size = "sm" }) {
  const st = STATUS_STYLE[status] || STATUS_STYLE["Reçue"];
  const Icon = st.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${size === "sm" ? "text-[11px] px-2.5 py-1" : "text-[13px] px-3 py-1.5"}`}
      style={{ background: st.bg, color: st.fg }}
    >
      <Icon size={size === "sm" ? 12 : 14} /> {status}
    </span>
  );
}

function QtyStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center border border-[#E7E4DF] rounded-full overflow-hidden">
      <button
        className="oe-focus w-8 h-8 flex items-center justify-center text-[#1C1C1E] disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      ><Minus size={14} /></button>
      <span className="w-8 text-center oe-mono text-sm font-medium">{value}</span>
      <button
        className="oe-focus w-8 h-8 flex items-center justify-center text-[#1C1C1E] disabled:opacity-30"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
      ><Plus size={14} /></button>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mb-4">
        <Icon size={22} className="text-[#8A8781]" />
      </div>
      <div className="oe-display font-semibold text-[#1C1C1E] text-[15px]">{title}</div>
      {subtitle && <div className="text-[13px] text-[#8A8781] mt-1 max-w-xs">{subtitle}</div>}
      {action}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] oe-rise">
      <div className="bg-[#1C1C1E] text-white text-[13px] font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
        <CheckCircle2 size={15} className="text-[#FF6A00]" /> {message}
      </div>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Bonjour OmarchéExpress, j'ai une question.")}
      target="_blank" rel="noopener noreferrer"
      className="oe-focus fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Discuter sur WhatsApp"
      style={{ width: 52, height: 52 }}
    >
      <WhatsAppIcon size={26} color="#fff" />
    </a>
  );
}

/* ============================== MESSAGERIE PAR COMMANDE ============================== */
export function OrderChat({ orderUuid, orderNumber, sender, notify }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("order_messages").select("*").eq("order_id", orderUuid).order("created_at", { ascending: true });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Temps réel : les nouveaux messages arrivent instantanément, sans revérifier en boucle
    const channel = supabase
      .channel(`order-messages-${orderUuid}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${orderUuid}` }, (payload) => {
        setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [orderUuid]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const { error } = await supabase.from("order_messages").insert({ order_id: orderUuid, sender, content: text.trim() });
    if (!error) setText(""); else notify && notify("Erreur d'envoi du message");
    setSending(false);
  };

  return (
    <div className="border border-[#EFEDE8] rounded-2xl overflow-hidden">
      <div className="bg-[#F5F3EF] px-4 py-2.5 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#1C1C1E] flex items-center gap-1.5"><MessageSquare size={14} className="text-[#FF6A00]" /> Discussion — {orderNumber}</span>
        <a href={waLink(`Bonjour, je vous contacte au sujet de ma commande ${orderNumber}.`)} target="_blank" rel="noopener noreferrer" className="oe-focus text-[10px] font-semibold text-[#1F8A50] flex items-center gap-1">
          <WhatsAppIcon size={12} color="#1F8A50" /> WhatsApp
        </a>
      </div>
      <div className="max-h-64 overflow-y-auto p-3 flex flex-col gap-2 bg-white">
        {loading ? (
          <div className="text-[12px] text-[#8A8781] text-center py-4">Chargement...</div>
        ) : messages.length === 0 ? (
          <div className="text-[12px] text-[#8A8781] text-center py-4">Aucun message pour l'instant.</div>
        ) : messages.map((m) => (
          <div key={m.id} className={`max-w-[75%] rounded-2xl px-3 py-2 text-[12.5px] ${m.sender === sender ? "self-end bg-[#1C1C1E] text-white" : "self-start bg-[#F5F3EF] text-[#1C1C1E]"}`}>
            {m.content}
            <div className={`text-[9.5px] mt-1 ${m.sender === sender ? "text-white/50" : "text-[#8A8781]"}`}>{new Date(m.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-2.5 border-t border-[#EFEDE8]">
        <input
          value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écrire un message..."
          className="oe-focus flex-1 bg-[#F5F3EF] rounded-full px-3.5 py-2 text-[12.5px]"
        />
        <button onClick={send} disabled={sending || !text.trim()} className="oe-focus w-9 h-9 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center disabled:opacity-30 shrink-0">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}


function ProductCard({ p, onOpen, onAdd }) {
  const outOfStock = p.stock <= 0;
  const price = p.promo ? p.promoPrice : p.price;
  return (
    <div className="oe-rise group bg-white rounded-2xl border border-[#EFEDE8] overflow-hidden flex flex-col hover:shadow-[0_6px_24px_rgba(28,28,30,0.08)] transition-shadow">
      <button className="oe-focus relative aspect-square w-full overflow-hidden bg-[#F5F3EF]" onClick={() => onOpen(p)}>
        <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {p.promo && !outOfStock && (
          <span className="absolute top-2 left-2 bg-[#1C1C1E] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Flame size={10} className="text-[#FF6A00]" /> PROMO
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-white/95 text-[#B42318] text-[10px] font-bold px-2 py-1 rounded-full">RUPTURE DE STOCK</span>
        )}
      </button>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <button className="oe-focus text-left" onClick={() => onOpen(p)}>
          <div className="text-[13px] font-semibold text-[#1C1C1E] leading-snug line-clamp-2">{p.name}</div>
        </button>
        <div className="flex items-baseline gap-1.5">
          <span className="oe-mono font-semibold text-[#1C1C1E] text-[14px]">{money(price)}</span>
          {p.promo && <span className="oe-mono text-[11px] text-[#8A8781] line-through">{money(p.price)}</span>}
        </div>
        <StockGauge stock={p.stock} />
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[11px] text-[#8A8781]">{outOfStock ? "Indisponible" : `${p.stock} en stock`}</span>
          <button
            className="oe-focus w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center disabled:opacity-25 hover:bg-[#FF6A00] transition-colors"
            disabled={outOfStock}
            onClick={() => onAdd(p, 1)}
            aria-label="Ajouter au panier"
          ><Plus size={15} /></button>
        </div>
      </div>
    </div>
  );
}

/* ============================== HEADER + BOTTOM NAV ============================== */
function TopBar() {
  return (
    <div className="hidden md:block bg-[#1C1C1E] text-white/80">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5"><Truck size={12} className="text-[#FF6A00]" /> Livraison gratuite partout à Abidjan</span>
          <span className="flex items-center gap-1.5"><Package size={12} className="text-[#FF6A00]" /> Expédition dans toute la Côte d'Ivoire (frais à la charge du client)</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5"><Wallet size={12} className="text-[#FF6A00]" /> Paiement à la livraison</span>
          <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#FF6A00]" /> Service client 7j/7</span>
        </div>
      </div>
    </div>
  );
}

function CategoryMenu({ categories, goCategory, open, setOpen }) {
  if (!open) return null;
  return (
    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-[#EFEDE8] shadow-xl py-2 z-50" onMouseLeave={() => setOpen(false)}>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => { goCategory(c.id); setOpen(false); }}
          className="oe-focus w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F3EF] text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FFF1E6] flex items-center justify-center shrink-0">
            <c.icon size={15} className="text-[#FF6A00]" />
          </div>
          <span className="text-[13px] font-medium text-[#1C1C1E]">{c.name}</span>
          <ChevronRight size={14} className="ml-auto text-[#8A8781]" />
        </button>
      ))}
    </div>
  );
}

function Header({ query, setQuery, onSearch, cartCount, onCart, onGoHome, onGoAccount, isAdmin, setIsAdmin, categories, goCategory, goSearchAll }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#EFEDE8]">
      <TopBar />
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="oe-focus" onClick={onGoHome}><Logo /></button>
          <div className="hidden md:flex flex-1 items-center gap-2 relative">
            <div className="relative shrink-0" onMouseEnter={() => setMenuOpen(true)}>
              <button className="oe-focus flex items-center gap-2 bg-[#1C1C1E] text-white text-[12px] font-semibold rounded-full pl-3.5 pr-3 py-2.5 hover:bg-[#FF6A00] transition-colors">
                <LayoutGrid size={14} /> Toutes les catégories <ChevronRight size={13} className="rotate-90" />
              </button>
              <CategoryMenu categories={categories} goCategory={goCategory} open={menuOpen} setOpen={setMenuOpen} />
            </div>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8781]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder="Rechercher un produit, une catégorie..."
                className="oe-focus w-full bg-[#F5F3EF] rounded-full pl-10 pr-4 py-2.5 text-[13px] text-[#1C1C1E] placeholder:text-[#8A8781]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="oe-focus hidden md:flex items-center gap-1.5 text-[12px] font-medium text-[#4B4B4E] px-3 py-2 rounded-full hover:bg-[#F5F3EF]" onClick={onGoAccount}>
              <User size={16} /> Compte
            </button>
            <button className="oe-focus relative w-10 h-10 rounded-full bg-[#F5F3EF] flex items-center justify-center hover:bg-[#EFEDE8]" onClick={onCart} aria-label="Panier">
              <ShoppingCart size={17} className="text-[#1C1C1E]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6A00] text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center px-1">{cartCount}</span>
              )}
            </button>
            <button className="oe-focus hidden md:block text-[11px] font-semibold text-[#8A8781] border border-[#EFEDE8] rounded-full px-3 py-2 hover:border-[#1C1C1E]" onClick={() => setIsAdmin(!isAdmin)}>
              {isAdmin ? "← Espace client" : "Espace admin"}
            </button>
          </div>
        </div>
        <div className="md:hidden mt-3 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8781]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Rechercher..."
            className="oe-focus w-full bg-[#F5F3EF] rounded-full pl-10 pr-4 py-2.5 text-[13px] placeholder:text-[#8A8781]"
          />
        </div>
      </div>
      {/* Category quick nav (desktop) */}
      <div className="hidden md:block bg-[#1C1C1E]">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-6 overflow-x-auto oe-scrollbar-none">
          <button onClick={onGoHome} className="oe-focus shrink-0 text-[12px] font-semibold text-white py-2.5 border-b-2 border-[#FF6A00]">Accueil</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => goCategory(c.id)} className="oe-focus shrink-0 text-[12px] font-medium text-white/70 hover:text-white py-2.5">{c.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BottomNav({ view, go, cartCount }) {
  const items = [
    { id: "home", label: "Accueil", icon: HomeIcon },
    { id: "search", label: "Recherche", icon: Search },
    { id: "cart", label: "Panier", icon: ShoppingCart, badge: cartCount },
    { id: "account", label: "Compte", icon: User },
  ];
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EFEDE8] px-2 py-1.5 flex items-center justify-around">
      {items.map((it) => {
        const active = view === it.id;
        return (
          <button key={it.id} className="oe-focus flex flex-col items-center gap-0.5 px-3 py-1.5 relative" onClick={() => go(it.id)}>
            <it.icon size={19} className={active ? "text-[#FF6A00]" : "text-[#8A8781]"} strokeWidth={active ? 2.4 : 2} />
            {it.badge > 0 && <span className="absolute top-0 right-1 bg-[#FF6A00] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{it.badge}</span>}
            <span className={`text-[10px] font-medium ${active ? "text-[#1C1C1E]" : "text-[#8A8781]"}`}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================== COMPTE À REBOURS (offre du jour) ============================== */
function useMidnightCountdown() {
  const calc = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = Math.max(0, midnight - now);
    return {
      h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
      m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
      s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function TrustBar() {
  const items = [
    { icon: Wallet, label: "Paiement à la livraison", sub: "Réglez en espèces à la réception" },
    { icon: Truck, label: "Livraison gratuite", sub: "Partout à Abidjan" },
    { icon: Package, label: "Expédition Côte d'Ivoire", sub: "Frais à la charge du client" },
    { icon: ShieldCheck, label: "Boutique unique", sub: "OmarchéExpress, un seul vendeur de confiance" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 mt-5">
      {items.map((it) => (
        <div key={it.label} className="bg-white border border-[#EFEDE8] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1E6] flex items-center justify-center shrink-0"><it.icon size={16} className="text-[#FF6A00]" /></div>
          <div className="min-w-0">
            <div className="text-[11.5px] font-semibold text-[#1C1C1E] leading-tight">{it.label}</div>
            <div className="text-[10.5px] text-[#8A8781] leading-tight mt-0.5">{it.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategorySidebar({ categories, goCategory }) {
  return (
    <div className="hidden md:flex flex-col w-60 shrink-0 bg-white border border-[#EFEDE8] rounded-3xl py-3 h-fit">
      {categories.map((c) => (
        <button key={c.id} onClick={() => goCategory(c.id)} className="oe-focus flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F3EF] text-left">
          <c.icon size={16} className="text-[#FF6A00] shrink-0" />
          <span className="text-[12.5px] font-medium text-[#1C1C1E]">{c.name}</span>
          <ChevronRight size={13} className="ml-auto text-[#C9C6C0]" />
        </button>
      ))}
    </div>
  );
}

function PromoCountdown({ products, onOpen, onAdd }) {
  const promo = products.filter((p) => p.promo && p.active);
  const t = useMidnightCountdown();
  if (!promo.length) return null;
  return (
    <div className="px-4 mt-9">
      <div className="bg-[#1C1C1E] rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#FF6A00]" />
            <div>
              <h2 className="oe-display font-bold text-white text-[16px]">Offres du jour</h2>
              <p className="text-[11px] text-white/50">Promotions valables jusqu'à minuit</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 oe-mono">
            {[["h", t.h], ["m", t.m], ["s", t.s]].map(([k, v], i) => (
              <React.Fragment key={k}>
                <span className="bg-white/10 text-white text-[13px] font-semibold rounded-lg px-2.5 py-1.5">{v}</span>
                {i < 2 && <span className="text-white/40">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {promo.map((p) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
        </div>
      </div>
    </div>
  );
}

/* ============================== HOME VIEW ============================== */
function HomeView({ products, categories, onOpen, onAdd, goCategory, goSearchAll }) {
  const popular = products.filter((p) => p.popular && p.active);
  const news = products.filter((p) => p.isNew && p.active);
  return (
    <div className="pb-8">
      <div className="max-w-6xl mx-auto md:flex md:gap-4 md:px-4 md:mt-4">
        <CategorySidebar categories={categories} goCategory={goCategory} />
        {/* Hero */}
        <div className="relative overflow-hidden bg-[#1C1C1E] mx-4 mt-4 md:mx-0 md:mt-0 rounded-3xl flex-1">
          <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-[#FF6A00] opacity-90" />
          <div className="absolute right-10 bottom-[-40px] w-24 h-24 rounded-full border-4 border-white/10" />
          <div className="relative px-6 py-9 md:py-12 md:px-10 max-w-lg">
            <span className="oe-mono text-[11px] tracking-widest text-[#FF6A00] font-semibold">MARCHÉ DU JOUR</span>
            <h1 className="oe-display text-white text-[26px] md:text-[34px] font-bold leading-[1.08] mt-2">
              Achetez simplement,<br />recevez rapidement.
            </h1>
            <p className="text-white/70 text-[13px] mt-3 max-w-xs">Paiement uniquement à la livraison. Livré gratuitement à Abidjan par OmarchéExpress, votre boutique unique.</p>
            <button onClick={goSearchAll} className="oe-focus mt-5 bg-white text-[#1C1C1E] text-[13px] font-semibold rounded-full px-5 py-2.5 inline-flex items-center gap-1.5 hover:bg-[#FF6A00] hover:text-white transition-colors">
              Voir tous les produits <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <TrustBar />

      {/* Categories (mobile-first grid, visible on all sizes) */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="oe-display font-bold text-[#1C1C1E] text-[16px]">Catégories</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto oe-scrollbar-none pb-1 -mx-4 px-4">
          {categories.map((c) => (
            <button key={c.id} onClick={() => goCategory(c.id)} className="oe-focus flex flex-col items-center gap-2 shrink-0 w-[76px]">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF1E6] flex items-center justify-center hover:bg-[#FF6A00] group">
                <c.icon size={22} className="text-[#FF6A00] group-hover:text-white" />
              </div>
              <span className="text-[11px] font-medium text-[#4B4B4E] text-center leading-tight">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <PromoCountdown products={products} onOpen={onOpen} onAdd={onAdd} />
      {/* Popular */}
      <Section title="Produits populaires" subtitle="Les préférés de nos clients cette semaine" items={popular} onOpen={onOpen} onAdd={onAdd} />
      {/* New */}
      <Section title="Nouveautés" subtitle="Fraîchement ajoutés à la boutique" items={news} onOpen={onOpen} onAdd={onAdd} />
    </div>
  );
}

function Section({ title, subtitle, items, onOpen, onAdd }) {
  if (!items.length) return null;
  return (
    <div className="px-4 mt-9">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="oe-display font-bold text-[#1C1C1E] text-[16px]">{title}</h2>
          <p className="text-[12px] text-[#8A8781]">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((p) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
      </div>
    </div>
  );
}

/* ============================== PRODUCT LIST (search/category) ============================== */
function ProductListView({ products, categories, query, setQuery, catId, setCatId, onOpen, onAdd, onBack }) {
  const filtered = products.filter((p) => {
    if (!p.active) return false;
    const matchCat = catId ? p.cat === catId : true;
    const matchQuery = query ? p.name.toLowerCase().includes(query.toLowerCase()) : true;
    return matchCat && matchQuery;
  });
  const catName = catId ? categories.find((c) => c.id === catId)?.name : null;
  return (
    <div className="px-4 py-5 pb-24">
      <button onClick={onBack} className="oe-focus md:hidden flex items-center gap-1 text-[12px] font-medium text-[#8A8781] mb-3"><ArrowLeft size={14} /> Retour</button>
      <div className="flex items-center justify-between mb-4">
        <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px]">{catName || (query ? `Résultats pour "${query}"` : "Tous les produits")}</h1>
        <span className="text-[12px] text-[#8A8781]">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto oe-scrollbar-none mb-5 pb-1">
        <button onClick={() => setCatId(null)} className={`oe-focus shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full border ${!catId ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-[#EFEDE8] text-[#4B4B4E]"}`}>Toutes</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCatId(c.id)} className={`oe-focus shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full border ${catId === c.id ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-[#EFEDE8] text-[#4B4B4E]"}`}>{c.name}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="Aucun produit trouvé" subtitle="Essayez un autre mot-clé ou une autre catégorie." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filtered.map((p) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
        </div>
      )}
    </div>
  );
}

/* ============================== PRODUCT DETAIL ============================== */
function ProductDetail({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const outOfStock = product.stock <= 0;
  const price = product.promo ? product.promoPrice : product.price;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={onClose}>
      <div className="oe-rise bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-square bg-[#F5F3EF]">
          <img src={product.img} alt={product.name} className="w-full h-full object-cover md:rounded-t-3xl" />
          <button onClick={onClose} className="oe-focus absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center"><X size={16} /></button>
          {product.promo && <span className="absolute top-3 left-3 bg-[#1C1C1E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">EN PROMOTION</span>}
        </div>
        <div className="p-5">
          <h2 className="oe-display font-bold text-[#1C1C1E] text-[19px]">{product.name}</h2>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="oe-mono font-bold text-[#1C1C1E] text-[20px]">{money(price)}</span>
            {product.promo && <span className="oe-mono text-[13px] text-[#8A8781] line-through">{money(product.price)}</span>}
          </div>
          <p className="text-[13px] text-[#4B4B4E] mt-3 leading-relaxed">{product.desc}</p>
          <a href={waLink(`Bonjour, je suis intéressé(e) par : ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="oe-focus mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1F8A50]">
            <WhatsAppIcon size={14} color="#1F8A50" /> Discuter avec OmarchéExpress sur WhatsApp
          </a>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[12px] text-[#8A8781] mb-1.5">
              <span>Stock disponible</span>
              <span className="font-semibold text-[#1C1C1E]">{outOfStock ? "Rupture de stock" : `${product.stock} unités`}</span>
            </div>
            <StockGauge stock={product.stock} />
          </div>
          {!outOfStock ? (
            <div className="flex items-center gap-3 mt-6">
              <QtyStepper value={qty} onChange={setQty} max={product.stock} />
              <button onClick={() => { onAdd(product, qty); onClose(); }} className="oe-focus flex-1 bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white font-semibold text-[13px] rounded-full py-3 flex items-center justify-center gap-2">
                <ShoppingCart size={15} /> Ajouter au panier · {money(price * qty)}
              </button>
            </div>
          ) : (
            <div className="mt-6 bg-[#FBE4E4] text-[#B42318] text-[12px] font-semibold rounded-2xl py-3 text-center">Produit actuellement indisponible</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================== TICKET (signature element) ============================== */
function Ticket({ children, footer }) {
  return (
    <div>
      <div className="bg-white rounded-t-2xl border border-b-0 border-[#EFEDE8] px-5 pt-5 pb-4">{children}</div>
      <div className="oe-ticket-edge h-3 bg-white" />
      {footer}
    </div>
  );
}

/* ============================== CART VIEW ============================== */
function CartView({ cart, products, onQty, onRemove, onCheckout, onContinue }) {
  const lines = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((l) => l.product);
  const total = lines.reduce((s, l) => s + (l.product.promo ? l.product.promoPrice : l.product.price) * l.qty, 0);
  if (lines.length === 0) {
    return <EmptyState icon={ShoppingCart} title="Votre panier est vide" subtitle="Parcourez la boutique et ajoutez des produits pour commencer." action={
      <button onClick={onContinue} className="oe-focus mt-4 bg-[#1C1C1E] text-white text-[13px] font-semibold rounded-full px-5 py-2.5">Voir les produits</button>
    } />;
  }
  return (
    <div className="px-4 py-5 pb-32 max-w-lg mx-auto">
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-4">Mon panier</h1>
      <Ticket footer={
        <div className="bg-white rounded-b-2xl border border-t-0 border-[#EFEDE8] px-5 pt-4 pb-5">
          <div className="oe-dash mb-4" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#1C1C1E]">Total à payer</span>
            <span className="oe-mono font-bold text-[#1C1C1E] text-[18px]">{money(total)}</span>
          </div>
          <p className="text-[11px] text-[#8A8781] mt-1">Paiement en espèces à la livraison</p>
        </div>
      }>
        <div className="flex items-center justify-between mb-1">
          <span className="oe-mono text-[11px] text-[#8A8781] tracking-wide">TICKET OMARCHÉEXPRESS</span>
          <span className="oe-mono text-[11px] text-[#8A8781]">{lines.length} art.</span>
        </div>
        <div className="oe-dash my-3" />
        <div className="flex flex-col divide-y divide-[#F1F0EE]">
          {lines.map((l) => {
            const price = l.product.promo ? l.product.promoPrice : l.product.price;
            return (
              <div key={l.id} className="py-3 flex items-center gap-3">
                <img src={l.product.img} className="w-14 h-14 rounded-xl object-cover bg-[#F5F3EF]" alt={l.product.name} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1C1C1E] truncate">{l.product.name}</div>
                  <div className="oe-mono text-[12px] text-[#8A8781] mt-0.5">{money(price)} × {l.qty}</div>
                  <div className="mt-2"><QtyStepper value={l.qty} onChange={(v) => onQty(l.id, v)} max={l.product.stock} /></div>
                </div>
                <div className="flex flex-col items-end justify-between h-full gap-3">
                  <button onClick={() => onRemove(l.id)} className="oe-focus text-[#8A8781] hover:text-[#B42318]"><Trash2 size={15} /></button>
                  <span className="oe-mono font-semibold text-[13px] text-[#1C1C1E]">{money(price * l.qty)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Ticket>
      <button onClick={onCheckout} className="oe-focus w-full mt-5 bg-[#FF6A00] hover:bg-[#C6480A] transition-colors text-white font-semibold text-[14px] rounded-full py-3.5">Passer la commande</button>
    </div>
  );
}

/* ============================== CHECKOUT VIEW ============================== */
function CheckoutView({ cart, products, onSubmit, onBack, currentUser }) {
  const [form, setForm] = useState({
    name: currentUser?.name || "", phone: currentUser?.phone || "", address: "", quartier: "", ville: "", comment: "",
  });
  const [errors, setErrors] = useState({});
  const lines = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((l) => l.product);
  const total = lines.reduce((s, l) => s + (l.product.promo ? l.product.promoPrice : l.product.price) * l.qty, 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nom requis";
    if (!/^[0-9 +]{8,}$/.test(form.phone.trim())) e.phone = "Numéro de téléphone invalide";
    if (!form.address.trim()) e.address = "Adresse requise";
    if (!form.quartier.trim()) e.quartier = "Quartier requis";
    if (!form.ville.trim()) e.ville = "Ville requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (key, label, placeholder, Icon, optional) => (
    <div>
      <label className="text-[12px] font-semibold text-[#1C1C1E] flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-[#8A8781]" /> {label} {optional && <span className="text-[#8A8781] font-normal">(facultatif)</span>}
      </label>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`oe-focus w-full border rounded-xl px-3.5 py-2.5 text-[13px] ${errors[key] ? "border-[#B42318]" : "border-[#EFEDE8]"}`}
      />
      {errors[key] && <p className="text-[11px] text-[#B42318] mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="px-4 py-5 pb-32 max-w-lg mx-auto">
      <button onClick={onBack} className="oe-focus flex items-center gap-1 text-[12px] font-medium text-[#8A8781] mb-3"><ArrowLeft size={14} /> Retour au panier</button>
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-1">Finaliser la commande</h1>
      <p className="text-[12px] text-[#8A8781] mb-5">Livraison assurée par OmarchéExpress · Paiement à la livraison uniquement</p>

      <div className="flex flex-col gap-4">
        {field("name", "Nom complet", "Ex: Awa Koné", User)}
        {field("phone", "Téléphone", "Ex: 07 01 23 45 67", Phone)}
        {field("address", "Adresse de livraison", "Ex: Rue 12, Villa 4", MapPin)}
        <div className="grid grid-cols-2 gap-3">
          {field("quartier", "Quartier", "Ex: Cocody Angré", MapPin)}
          {field("ville", "Ville", "Ex: Abidjan", MapPin)}
        </div>
        {field("comment", "Commentaire", "Instructions pour le livreur...", MessageSquare, true)}
      </div>

      <div className="mt-6 bg-[#FFF1E6] rounded-2xl p-4 flex items-start gap-3">
        <Wallet size={18} className="text-[#FF6A00] shrink-0 mt-0.5" />
        <div>
          <div className="text-[13px] font-semibold text-[#1C1C1E]">Paiement à la livraison</div>
          <div className="text-[11px] text-[#8A8781] mt-0.5">Réglez en espèces au livreur OmarchéExpress à la réception. Aucun paiement en ligne requis.</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 border-t border-[#EFEDE8] pt-4">
        <span className="text-[13px] font-semibold text-[#1C1C1E]">Total à payer</span>
        <span className="oe-mono font-bold text-[#1C1C1E] text-[18px]">{money(total)}</span>
      </div>

      <button
        onClick={() => validate() && onSubmit(form, total, lines)}
        className="oe-focus w-full mt-5 bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white font-semibold text-[14px] rounded-full py-3.5"
      >Confirmer la commande</button>
    </div>
  );
}

/* ============================== ORDER CONFIRMATION / TRACKING ============================== */
function TrackingView({ order, onContinueShopping }) {
  if (!order) return <EmptyState icon={Package} title="Aucune commande à suivre" subtitle="Passez une commande pour voir son statut ici." />;
  const stepIndex = STATUS_STEPS.indexOf(order.status);
  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#E3F5EA] flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 size={24} className="text-[#1F8A50]" />
        </div>
        <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px]">Commande confirmée</h1>
        <p className="text-[12px] text-[#8A8781] mt-1">Référence <span className="oe-mono font-semibold text-[#1C1C1E]">{order.id}</span></p>
      </div>

      <Ticket footer={
        <div className="bg-white rounded-b-2xl border border-t-0 border-[#EFEDE8] px-5 pt-4 pb-5">
          <div className="oe-dash mb-4" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#1C1C1E]">Total</span>
            <span className="oe-mono font-bold text-[#1C1C1E] text-[16px]">{money(order.total)}</span>
          </div>
          <div className="text-[11px] text-[#8A8781] mt-2">{order.address}, {order.quartier}, {order.ville}</div>
        </div>
      }>
        <div className="flex items-center justify-between mb-3">
          <span className="oe-mono text-[11px] text-[#8A8781]">{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="oe-dash my-3" />
        {order.items.map((it) => (
          <div key={it.id} className="flex items-center justify-between py-1.5 text-[13px]">
            <span className="text-[#4B4B4E]">{it.name} × {it.qty}</span>
            <span className="oe-mono text-[#1C1C1E]">{money(it.price * it.qty)}</span>
          </div>
        ))}
      </Ticket>

      {/* Tracking steps */}
      <div className="mt-8">
        <h2 className="oe-display font-bold text-[#1C1C1E] text-[15px] mb-4">Suivi de la commande</h2>
        <div className="flex flex-col gap-0">
          {STATUS_STEPS.map((s, i) => {
            const done = i <= stepIndex;
            const st = STATUS_STYLE[s];
            const Icon = st.icon;
            return (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#FF6A00]" : "bg-[#F1F0EE]"}`}>
                    <Icon size={14} className={done ? "text-white" : "text-[#8A8781]"} />
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] ${i < stepIndex ? "bg-[#FF6A00]" : "bg-[#F1F0EE]"}`} />}
                </div>
                <div className="pb-6">
                  <div className={`text-[13px] font-semibold ${done ? "text-[#1C1C1E]" : "text-[#8A8781]"}`}>{s}</div>
                  {i === stepIndex && <div className="text-[11px] text-[#FF6A00] font-medium mt-0.5">Statut actuel</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order.uuid && (
        <div className="mt-8">
          <h2 className="oe-display font-bold text-[#1C1C1E] text-[15px] mb-4">Une question sur cette commande ?</h2>
          <OrderChat orderUuid={order.uuid} orderNumber={order.id} sender="client" notify={() => {}} />
        </div>
      )}

      <button onClick={onContinueShopping} className="oe-focus w-full mt-4 bg-[#1C1C1E] text-white font-semibold text-[14px] rounded-full py-3.5">Continuer mes achats</button>
    </div>
  );
}

/* ============================== ACCOUNT VIEW ============================== */
function AccountView({ currentUser, onLogin, onSignup, onLogout, orders, authError, authLoading }) {
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });

  if (currentUser) {
    const myOrders = orders.filter((o) => o.clientName === currentUser.name);
    return (
      <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FFF1E6] flex items-center justify-center"><User size={20} className="text-[#FF6A00]" /></div>
          <div>
            <div className="oe-display font-bold text-[#1C1C1E] text-[16px] flex items-center gap-2">
              {currentUser.name}
              {currentUser.is_admin && <span className="text-[10px] font-bold bg-[#FFF1E6] text-[#FF6A00] px-2 py-0.5 rounded-full">ADMIN</span>}
            </div>
            <div className="text-[12px] text-[#8A8781]">{currentUser.phone} · {currentUser.email}</div>
          </div>
        </div>

        <h2 className="text-[13px] font-semibold text-[#1C1C1E] mb-3">Historique des commandes</h2>
        {myOrders.length === 0 ? (
          <EmptyState icon={Package} title="Pas encore de commande" subtitle="Vos commandes passées apparaîtront ici." />
        ) : (
          <div className="flex flex-col gap-3">
            {myOrders.map((o) => (
              <div key={o.id} className="border border-[#EFEDE8] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="oe-mono text-[12px] font-semibold text-[#1C1C1E]">{o.id}</div>
                  <div className="text-[11px] text-[#8A8781] mt-0.5">{new Date(o.date).toLocaleDateString("fr-FR")} · {money(o.total)}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        )}

        <button onClick={onLogout} className="oe-focus mt-8 flex items-center gap-2 text-[13px] font-semibold text-[#B42318]"><LogOut size={15} /> Se déconnecter</button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 pb-24 max-w-sm mx-auto">
      <div className="flex bg-[#F5F3EF] rounded-full p-1 mb-6">
        <button onClick={() => setMode("login")} className={`oe-focus flex-1 text-[12px] font-semibold py-2 rounded-full ${mode === "login" ? "bg-white text-[#1C1C1E] shadow-sm" : "text-[#8A8781]"}`}>Connexion</button>
        <button onClick={() => setMode("signup")} className={`oe-focus flex-1 text-[12px] font-semibold py-2 rounded-full ${mode === "signup" ? "bg-white text-[#1C1C1E] shadow-sm" : "text-[#8A8781]"}`}>Inscription</button>
      </div>
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-1">{mode === "login" ? "Content de vous revoir" : "Créer un compte"}</h1>
      <p className="text-[12px] text-[#8A8781] mb-5">{mode === "login" ? "Connectez-vous pour suivre vos commandes." : "Rejoignez OmarchéExpress en quelques secondes."}</p>
      <div className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom complet" className="oe-focus border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px]" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="oe-focus border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px]" />
          </>
        )}
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Adresse email" className="oe-focus border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px]" />
        <div className="relative">
          <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mot de passe" className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px] pr-10" />
          <button className="oe-focus absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8781]" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
        </div>
      </div>
      {authError && <p className="text-[12px] text-[#B42318] mt-3">{authError}</p>}
      <button
        disabled={authLoading}
        onClick={() => mode === "login" ? onLogin(form.email, form.password) : onSignup(form)}
        className="oe-focus w-full mt-5 bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white font-semibold text-[14px] rounded-full py-3 disabled:opacity-50"
      >{authLoading ? "Veuillez patienter..." : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
      <p className="text-[11px] text-[#8A8781] text-center mt-4">Tes commandes sont sauvegardées sur ton compte réel OmarchéExpress.</p>
    </div>
  );
}

/* ============================== ADMIN ============================== */
/* ============================== SUPABASE HELPERS ============================== */
const CATEGORY_ICONS = {
  "Pour bébé": Baby, "Smartphones": Smartphone, "Accessoires Téléphone": Cable,
  "Dubai Mall": Store, "Maison et cuisine": UtensilsCrossed, "Mode homme": Shirt,
  "Mode femme": Shirt, "Mode enfant": Baby, "Jeux Vidéos, Consoles et Accessoires": Gamepad2,
  "Bagages et sacs de voyage": Luggage, "Electronique": Cpu, "Lunettes de vue": Glasses,
  "Sports et Loisirs": Dumbbell, "Beauté et hygiène": Sparkles,
  "Fournitures de Bureau et Scolaires": BookOpen, "Auto et moto": Car,
  "Érotisme, Sexe & Sensualité": Heart,
};
const iconForCategory = (name) => CATEGORY_ICONS[name] || Tag;

const dbProductToApp = (p) => ({
  id: p.id, name: p.name, cat: p.category_id, price: p.price,
  promo: p.promo, promoPrice: p.promo_price, stock: p.stock,
  popular: p.popular, isNew: p.is_new, active: p.active,
  img: p.image_url, desc: p.description,
});
const dbCategoryToApp = (c) => ({ id: c.id, name: c.name, icon: iconForCategory(c.name) });

/* ============================== FOOTER ============================== */
function Footer({ goHome, goSearchAll, requestAdmin }) {
  return (
    <div className="bg-[#1C1C1E] mt-10 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <button onClick={goHome} className="oe-focus"><Logo /></button>
          <p className="text-[12px] text-white/50 mt-3 max-w-[220px]">Achetez simplement, recevez rapidement. Votre boutique unique de confiance.</p>
        </div>
        <div>
          <h3 className="text-white text-[12px] font-semibold mb-3">Livraison & Paiement</h3>
          <ul className="flex flex-col gap-2 text-[12px] text-white/50">
            <li className="flex items-center gap-1.5"><Truck size={13} className="text-[#FF6A00]" /> Livraison gratuite à Abidjan</li>
            <li className="flex items-center gap-1.5"><Package size={13} className="text-[#FF6A00]" /> Expédition CI (frais client)</li>
            <li className="flex items-center gap-1.5"><Wallet size={13} className="text-[#FF6A00]" /> Paiement à la livraison</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-[12px] font-semibold mb-3">Aide</h3>
          <ul className="flex flex-col gap-2 text-[12px] text-white/50">
            <li className="flex items-center gap-1.5"><Headphones size={13} className="text-[#FF6A00]" /> Service client 7j/7</li>
            <li className="flex items-center gap-1.5"><RotateCcw size={13} className="text-[#FF6A00]" /> Retours faciles sous 7 jours</li>
            <li><button onClick={goSearchAll} className="oe-focus hover:text-white">Voir tous les produits</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-[12px] font-semibold mb-3">OmarchéExpress</h3>
          <ul className="flex flex-col gap-2 text-[12px] text-white/50">
            <li><button onClick={requestAdmin} className="oe-focus hover:text-white">Espace administrateur</button></li>
            <li className="flex items-center gap-3 mt-1">
              <Facebook size={15} className="text-white/40 hover:text-[#FF6A00] cursor-pointer" />
              <Instagram size={15} className="text-white/40 hover:text-[#FF6A00] cursor-pointer" />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} OmarchéExpress — Achetez simplement, recevez rapidement.
      </div>
    </div>
  );
}

/* ============================== ROOT APP ============================== */
export default function OmarcheExpress() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("home");
  const [query, setQuery] = useState("");
  const [catId, setCatId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (msg) => { setToast(msg); window.clearTimeout(notify._t); notify._t = window.setTimeout(() => setToast(""), 2200); };

  /* ---------- Chargement des données publiques ---------- */
  const loadCatalog = async () => {
    const [{ data: cats, error: catErr }, { data: prods, error: prodErr }] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
    ]);
    if (!catErr && cats) setCategories(cats.map(dbCategoryToApp));
    if (!prodErr && prods) setProducts(prods.map(dbProductToApp));
    setDataLoading(false);
  };

  const loadClientProfile = async (userId, email) => {
    const { data, error } = await supabase.from("clients").select("*").eq("id", userId).single();
    if (!error && data) setCurrentUser({ id: data.id, name: data.name, phone: data.phone, email: data.email || email, is_admin: !!data.is_admin });
  };

  useEffect(() => {
    loadCatalog();
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) loadClientProfile(data.session.user.id, data.session.user.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadClientProfile(session.user.id, session.user.email);
      else setCurrentUser(null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  /* ---------- Données admin (protégées par RLS) ---------- */
  const loadAdminData = async () => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (ordersData) {
      setOrders(ordersData.map((o) => ({
        id: o.order_number, uuid: o.id, clientId: o.client_id,
        clientName: o.client_name, phone: o.phone, address: o.address,
        quartier: o.quartier, ville: o.ville, comment: o.comment,
        total: o.total, status: o.status, date: o.created_at,
        items: (o.order_items || []).map((it) => ({ id: it.product_id, name: it.product_name, qty: it.quantity, price: it.unit_price })),
      })));
    }
    const { data: clientsData } = await supabase.from("clients").select("*");
    if (clientsData && ordersData) {
      setClients(clientsData.map((c) => ({
        id: c.id, name: c.name, phone: c.phone, email: c.email,
        orders: ordersData.filter((o) => o.client_id === c.id).length,
      })));
    }
  };

  useEffect(() => {
    if (currentUser) loadAdminData();
  }, [isAdmin, currentUser]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === product.id);
      const nextQty = Math.min(product.stock, (exists?.qty || 0) + qty);
      if (exists) return prev.map((c) => (c.id === product.id ? { ...c, qty: nextQty } : c));
      return [...prev, { id: product.id, qty: nextQty }];
    });
    notify(`${product.name} ajouté au panier`);
    trackPixel("AddToCart", { content_name: product.name, content_ids: [product.id], value: product.promo ? product.promoPrice : product.price, currency: "XOF" });
  };
  const updateQty = (id, qty) => setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const goHome = () => { setView("home"); setIsAdmin(false); };
  const goCategory = (id) => { setCatId(id); setQuery(""); setView("search"); };
  const goSearchAll = () => { setCatId(null); setQuery(""); setView("search"); };
  const doSearch = () => { setView("search"); };

  const requestAdmin = () => {
    if (currentUser?.is_admin) { setIsAdmin(true); }
    else { setView("account"); notify("Connecte-toi avec un compte administrateur"); }
  };

  /* ---------- Commande ---------- */
  const submitOrder = async (form, total, lines) => {
    const { data: numData } = await supabase.rpc("generate_order_number");
    const orderNumber = numData || ("OE-" + Date.now());
    const { data: orderRow, error: orderErr } = await supabase.from("orders").insert({
      order_number: orderNumber, client_id: currentUser?.id || null,
      client_name: form.name, phone: form.phone, address: form.address,
      quartier: form.quartier, ville: form.ville, comment: form.comment,
      total, status: "Reçue",
    }).select().single();
    if (orderErr || !orderRow) { notify("Erreur lors de l'envoi de la commande"); return; }

    const items = lines.map((l) => ({
      order_id: orderRow.id, product_id: l.id, product_name: l.product.name,
      quantity: l.qty, unit_price: l.product.promo ? l.product.promoPrice : l.product.price,
    }));
    await supabase.from("order_items").insert(items);

    // décrémenter le stock de chaque produit
    await Promise.all(lines.map((l) =>
      supabase.from("products").update({ stock: Math.max(0, l.product.stock - l.qty) }).eq("id", l.id)
    ));
    setProducts((prev) => prev.map((p) => {
      const line = lines.find((l) => l.id === p.id);
      return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
    }));

    const order = {
      id: orderNumber, uuid: orderRow.id, clientName: form.name, phone: form.phone,
      address: form.address, quartier: form.quartier, ville: form.ville, comment: form.comment,
      items: lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, price: l.product.promo ? l.product.promoPrice : l.product.price })),
      total, status: "Reçue", date: new Date().toISOString(),
    };
    setCart([]);
    setLastOrder(order);
    setView("tracking");
    notify("Commande envoyée !");
    trackPixel("Purchase", { value: total, currency: "XOF", content_ids: lines.map((l) => l.id), num_items: lines.length });
  };

  const trackedOrder = lastOrder
    ? (orders.find((o) => o.uuid === lastOrder.uuid) || lastOrder)
    : null;

  const bottomNavGo = (id) => { if (id === "search") goSearchAll(); else setView(id); };

  /* ---------- Auth ---------- */
  const handleLogin = async (email, password) => {
    setAuthError(""); setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) { setAuthError("Email ou mot de passe incorrect."); return; }
    if (data?.user) await loadClientProfile(data.user.id, data.user.email);
    notify("Connecté avec succès");
  };

  const handleSignup = async (form) => {
    setAuthError(""); setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setAuthLoading(false); setAuthError(error.message.includes("already") ? "Ce compte existe déjà." : "Impossible de créer le compte."); return; }
    if (data?.user) {
      await supabase.from("clients").insert({ id: data.user.id, name: form.name || "Client", phone: form.phone, email: form.email });
      if (data.session) { await loadClientProfile(data.user.id, data.user.email); notify("Compte créé avec succès"); }
      else { setAuthError("Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi."); }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setCurrentUser(null); setIsAdmin(false); goHome(); };

  /* ---------- Handlers admin (Supabase) ---------- */
  const adminHandlers = {
    saveProduct: async (payload, editingId) => {
      const row = {
        name: payload.name, category_id: payload.cat, price: payload.price,
        promo: payload.promo, promo_price: payload.promo ? payload.promoPrice : null,
        stock: payload.stock, popular: payload.popular, is_new: payload.isNew,
        active: payload.active, image_url: payload.img, description: payload.desc,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(row).eq("id", editingId);
        if (error) return false;
      } else {
        const { error } = await supabase.from("products").insert(row);
        if (error) return false;
      }
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data.map(dbProductToApp));
      return true;
    },
    deleteProduct: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
      return !error;
    },
    toggleProduct: async (id) => {
      const prod = products.find((p) => p.id === id);
      if (!prod) return;
      const { error } = await supabase.from("products").update({ active: !prod.active }).eq("id", id);
      if (!error) setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    },
    addCategory: async (name) => {
      const { data, error } = await supabase.from("categories").insert({ name }).select().single();
      if (error || !data) return false;
      setCategories((prev) => [...prev, dbCategoryToApp(data)]);
      return true;
    },
    deleteCategory: async (id) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (!error) setCategories((prev) => prev.filter((c) => c.id !== id));
      return !error;
    },
    renameCategory: async (id, name) => {
      await supabase.from("categories").update({ name }).eq("id", id);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
    },
    setOrderStatus: async (orderNumber, status) => {
      const order = orders.find((o) => o.id === orderNumber);
      if (!order) return false;
      const { error } = await supabase.from("orders").update({ status }).eq("id", order.uuid);
      if (!error) setOrders((prev) => prev.map((o) => (o.id === orderNumber ? { ...o, status } : o)));
      return !error;
    },
  };

  return (
    <div className="oe-root min-h-screen bg-[#FAF8F6]">
      <GlobalStyle />
      {!isAdmin && (
        <Header
          query={query} setQuery={setQuery} onSearch={doSearch}
          cartCount={cartCount} onCart={() => setView("cart")}
          onGoHome={goHome} onGoAccount={() => setView("account")}
          isAdmin={isAdmin} setIsAdmin={(v) => (v ? requestAdmin() : setIsAdmin(false))}
          categories={categories} goCategory={goCategory} goSearchAll={goSearchAll}
        />
      )}
      {isAdmin && (
        <div className="sticky top-0 z-40 bg-white border-b border-[#EFEDE8] px-5 py-3 flex items-center justify-between">
          <button onClick={goHome} className="oe-focus"><Logo /></button>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-[#8A8781] font-medium">Back-office</span>
            <button onClick={() => setIsAdmin(false)} className="oe-focus text-[11px] font-semibold text-[#8A8781] border border-[#EFEDE8] rounded-full px-3 py-2 hover:border-[#1C1C1E]">← Espace client</button>
          </div>
        </div>
      )}

      {isAdmin ? (
        <Suspense fallback={<div className="text-center py-24 text-[13px] text-[#8A8781]">Chargement du back-office...</div>}>
          <AdminApp orders={orders} products={products} categories={categories} clients={clients} notify={notify} handlers={adminHandlers} />
        </Suspense>
      ) : (
        <div className="max-w-6xl mx-auto">
          {dataLoading ? (
            <div className="text-center py-24 text-[13px] text-[#8A8781]">Chargement de la boutique...</div>
          ) : (
            <>
              {view === "home" && <HomeView products={products} categories={categories} onOpen={setSelectedProduct} onAdd={addToCart} goCategory={goCategory} goSearchAll={goSearchAll} />}
              {view === "search" && <ProductListView products={products} categories={categories} query={query} setQuery={setQuery} catId={catId} setCatId={setCatId} onOpen={setSelectedProduct} onAdd={addToCart} onBack={goHome} />}
              {view === "cart" && <CartView cart={cart} products={products} onQty={updateQty} onRemove={removeFromCart} onCheckout={() => { trackPixel("InitiateCheckout"); setView("checkout"); }} onContinue={goSearchAll} />}
              {view === "checkout" && <CheckoutView cart={cart} products={products} onSubmit={submitOrder} onBack={() => setView("cart")} currentUser={currentUser} />}
              {view === "tracking" && <TrackingView order={trackedOrder} onContinueShopping={goHome} />}
              {view === "account" && <AccountView currentUser={currentUser} onLogin={handleLogin} onSignup={handleSignup} onLogout={handleLogout} orders={orders} authError={authError} authLoading={authLoading} />}
            </>
          )}
        </div>
      )}

      {!isAdmin && <Footer goHome={goHome} goSearchAll={goSearchAll} requestAdmin={requestAdmin} />}

      {!isAdmin && <BottomNav view={view} go={bottomNavGo} cartCount={cartCount} />}

      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      <Toast message={toast} />
      {!isAdmin && <FloatingWhatsApp />}
    </div>
  );
}
