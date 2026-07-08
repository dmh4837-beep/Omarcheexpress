import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2, ChevronRight, ChevronLeft,
  Menu, User, Package, TrendingUp, Users, Wallet, Clock, CheckCircle2,
  Truck, LayoutGrid, Tag, Pencil, LogOut, Star, AlertCircle, Apple,
  Coffee, Milk, Cookie, SprayCan, ShoppingBasket, PlusCircle, ArrowLeft,
  MapPin, Phone, MessageSquare, Eye, EyeOff, PackageCheck, PackageX,
  BarChart3, Home as HomeIcon, ClipboardList, Settings, Flame
} from "lucide-react";

/* ============================== FONTS / GLOBAL STYLE ============================== */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
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

const STATUS_STEPS = ["Reçue", "En préparation", "En livraison", "Livrée"];
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

const money = (n) => n.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";

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

function StatusBadge({ status, size = "sm" }) {
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

function EmptyState({ icon: Icon, title, subtitle, action }) {
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

/* ============================== PRODUCT CARD ============================== */
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
function Header({ query, setQuery, onSearch, cartCount, onCart, onGoHome, onGoAccount, isAdmin, setIsAdmin }) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#EFEDE8]">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="oe-focus" onClick={onGoHome}><Logo /></button>
          <div className="hidden md:flex flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8781]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Rechercher un produit, une catégorie..."
              className="oe-focus w-full bg-[#F5F3EF] rounded-full pl-10 pr-4 py-2.5 text-[13px] text-[#1C1C1E] placeholder:text-[#8A8781]"
            />
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

/* ============================== HOME VIEW ============================== */
function HomeView({ products, categories, onOpen, onAdd, goCategory, goSearchAll }) {
  const popular = products.filter((p) => p.popular && p.active);
  const news = products.filter((p) => p.isNew && p.active);
  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1C1C1E] mx-4 mt-4 rounded-3xl">
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-[#FF6A00] opacity-90" />
        <div className="absolute right-10 bottom-[-40px] w-24 h-24 rounded-full border-4 border-white/10" />
        <div className="relative px-6 py-9 md:py-12 md:px-10 max-w-lg">
          <span className="oe-mono text-[11px] tracking-widest text-[#FF6A00] font-semibold">MARCHÉ DU JOUR</span>
          <h1 className="oe-display text-white text-[26px] md:text-[34px] font-bold leading-[1.08] mt-2">
            Achetez simplement,<br />recevez rapidement.
          </h1>
          <p className="text-white/70 text-[13px] mt-3 max-w-xs">Paiement uniquement à la livraison. Livré par OmarchéExpress, chez vous, aujourd'hui.</p>
          <button onClick={goSearchAll} className="oe-focus mt-5 bg-white text-[#1C1C1E] text-[13px] font-semibold rounded-full px-5 py-2.5 inline-flex items-center gap-1.5 hover:bg-[#FF6A00] hover:text-white transition-colors">
            Voir tous les produits <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Categories */}
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

      <button onClick={onContinueShopping} className="oe-focus w-full mt-4 bg-[#1C1C1E] text-white font-semibold text-[14px] rounded-full py-3.5">Continuer mes achats</button>
    </div>
  );
}

/* ============================== ACCOUNT VIEW ============================== */
function AccountView({ currentUser, onLogin, onLogout, orders }) {
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
            <div className="oe-display font-bold text-[#1C1C1E] text-[16px]">{currentUser.name}</div>
            <div className="text-[12px] text-[#8A8781]">{currentUser.phone}</div>
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
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom complet" className="oe-focus border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px]" />
        )}
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="oe-focus border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px]" />
        <div className="relative">
          <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mot de passe" className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px] pr-10" />
          <button className="oe-focus absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8781]" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
        </div>
      </div>
      <button
        onClick={() => onLogin({ name: form.name || "Client OmarchéExpress", phone: form.phone || "07 00 00 00 00" })}
        className="oe-focus w-full mt-5 bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white font-semibold text-[14px] rounded-full py-3"
      >{mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
      <p className="text-[11px] text-[#8A8781] text-center mt-4">Démo : aucune vérification réelle n'est effectuée.</p>
    </div>
  );
}

/* ============================== ADMIN ============================== */
function AdminSidebar({ tab, setTab }) {
  const items = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { id: "products", label: "Produits", icon: Package },
    { id: "categories", label: "Catégories", icon: Tag },
    { id: "orders", label: "Commandes", icon: ClipboardList },
    { id: "clients", label: "Clients", icon: Users },
  ];
  return (
    <div className="hidden md:flex flex-col w-56 shrink-0 border-r border-[#EFEDE8] py-6 px-3 gap-1 min-h-[calc(100vh-73px)]">
      {items.map((it) => (
        <button key={it.id} onClick={() => setTab(it.id)} className={`oe-focus flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-left ${tab === it.id ? "bg-[#1C1C1E] text-white" : "text-[#4B4B4E] hover:bg-[#F5F3EF]"}`}>
          <it.icon size={16} /> {it.label}
        </button>
      ))}
    </div>
  );
}

function AdminTabsMobile({ tab, setTab }) {
  const items = [
    { id: "dashboard", icon: BarChart3, label: "Stats" },
    { id: "products", icon: Package, label: "Produits" },
    { id: "categories", icon: Tag, label: "Catégories" },
    { id: "orders", icon: ClipboardList, label: "Commandes" },
    { id: "clients", icon: Users, label: "Clients" },
  ];
  return (
    <div className="md:hidden flex gap-2 overflow-x-auto oe-scrollbar-none px-4 py-3 border-b border-[#EFEDE8]">
      {items.map((it) => (
        <button key={it.id} onClick={() => setTab(it.id)} className={`oe-focus shrink-0 flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-full ${tab === it.id ? "bg-[#1C1C1E] text-white" : "bg-[#F5F3EF] text-[#4B4B4E]"}`}>
          <it.icon size={13} /> {it.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-[#EFEDE8] rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + "20" }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <div>
        <div className="oe-display font-bold text-[#1C1C1E] text-[20px]">{value}</div>
        <div className="text-[11px] text-[#8A8781] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function AdminDashboard({ orders, products, clients }) {
  const revenue = orders.filter((o) => o.status !== "Annulée").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status !== "Livrée" && o.status !== "Annulée").length;
  return (
    <div className="p-5 md:p-8">
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-1">Tableau de bord</h1>
      <p className="text-[12px] text-[#8A8781] mb-6">Aperçu de l'activité OmarchéExpress</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={ClipboardList} label="Commandes" value={orders.length} accent="#FF6A00" />
        <StatCard icon={Users} label="Clients" value={clients.length} accent="#1C1C1E" />
        <StatCard icon={Package} label="Produits disponibles" value={products.filter((p) => p.active && p.stock > 0).length} accent="#1F8A50" />
        <StatCard icon={Wallet} label="Chiffre d'affaires" value={money(revenue)} accent="#C6480A" />
        <StatCard icon={Clock} label="En attente" value={pending} accent="#8A5A00" />
      </div>

      <h2 className="oe-display font-bold text-[#1C1C1E] text-[15px] mt-8 mb-3">Dernières commandes</h2>
      <div className="bg-white border border-[#EFEDE8] rounded-2xl overflow-hidden">
        {orders.slice(0, 5).map((o, i) => (
          <div key={o.id} className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? "border-t border-[#F1F0EE]" : ""}`}>
            <div>
              <div className="oe-mono text-[12px] font-semibold text-[#1C1C1E]">{o.id}</div>
              <div className="text-[11px] text-[#8A8781]">{o.clientName} · {money(o.total)}</div>
            </div>
            <StatusBadge status={o.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProducts({ products, categories, setProducts, notify }) {
  const [editing, setEditing] = useState(null); // product or "new"
  const emptyForm = { name: "", cat: categories[0]?.id, price: "", stock: "", promo: false, promoPrice: "", img: IMG("nouveau-" + Date.now()), desc: "", active: true, popular: false, isNew: true };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditing("new"); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); };

  const save = () => {
    if (!form.name.trim() || form.price === "" || form.stock === "") { notify("Veuillez remplir les champs obligatoires"); return; }
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), promoPrice: form.promo ? Number(form.promoPrice || 0) : undefined };
    if (editing === "new") {
      setProducts((prev) => [{ ...payload, id: "p" + Date.now() }, ...prev]);
      notify("Produit ajouté");
    } else {
      setProducts((prev) => prev.map((p) => (p.id === editing ? { ...p, ...payload } : p)));
      notify("Produit modifié");
    }
    setEditing(null);
  };

  const remove = (id) => { setProducts((prev) => prev.filter((p) => p.id !== id)); notify("Produit supprimé"); };
  const toggleActive = (id) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px]">Produits</h1>
          <p className="text-[12px] text-[#8A8781]">{products.length} produits au catalogue</p>
        </div>
        <button onClick={openNew} className="oe-focus flex items-center gap-1.5 bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white text-[12px] font-semibold rounded-full px-4 py-2.5">
          <PlusCircle size={15} /> Ajouter un produit
        </button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-[#EFEDE8] rounded-2xl p-3 flex items-center gap-3">
            <img src={p.img} className="w-14 h-14 rounded-xl object-cover bg-[#F5F3EF]" alt={p.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#1C1C1E] truncate">{p.name}</span>
                {!p.active && <span className="text-[10px] font-bold bg-[#F1F0EE] text-[#8A8781] px-2 py-0.5 rounded-full">DÉSACTIVÉ</span>}
                {p.stock <= 0 && <span className="text-[10px] font-bold bg-[#FBE4E4] text-[#B42318] px-2 py-0.5 rounded-full">RUPTURE</span>}
                {p.promo && <span className="text-[10px] font-bold bg-[#FFF3DB] text-[#8A5A00] px-2 py-0.5 rounded-full">PROMO</span>}
              </div>
              <div className="text-[11px] text-[#8A8781] mt-0.5">{categories.find((c) => c.id === p.cat)?.name} · {money(p.price)} · {p.stock} en stock</div>
            </div>
            <button onClick={() => toggleActive(p.id)} className="oe-focus text-[11px] font-semibold text-[#4B4B4E] px-2.5 py-1.5 rounded-full border border-[#EFEDE8] hover:border-[#1C1C1E] shrink-0">{p.active ? "Désactiver" : "Activer"}</button>
            <button onClick={() => openEdit(p)} className="oe-focus w-8 h-8 rounded-full bg-[#F5F3EF] flex items-center justify-center shrink-0"><Pencil size={13} /></button>
            <button onClick={() => remove(p.id)} className="oe-focus w-8 h-8 rounded-full bg-[#FBE4E4] text-[#B42318] flex items-center justify-center shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="oe-rise bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="oe-display font-bold text-[#1C1C1E] text-[16px] mb-4">{editing === "new" ? "Ajouter un produit" : "Modifier le produit"}</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Nom du produit</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Catégorie</label>
                <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B4B4E]">Prix (FCFA)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B4B4E]">Quantité en stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B4B4E]">URL photo</label>
                <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Description</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={2} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
              </div>
              <label className="flex items-center gap-2 text-[12px] font-medium text-[#1C1C1E]">
                <input type="checkbox" checked={form.promo} onChange={(e) => setForm({ ...form, promo: e.target.checked })} /> En promotion
              </label>
              {form.promo && (
                <div>
                  <label className="text-[11px] font-semibold text-[#4B4B4E]">Prix promo (FCFA)</label>
                  <input type="number" value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
              )}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[12px] font-medium text-[#1C1C1E]"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Populaire</label>
                <label className="flex items-center gap-2 text-[12px] font-medium text-[#1C1C1E]"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Actif</label>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="oe-focus flex-1 border border-[#EFEDE8] text-[#4B4B4E] font-semibold text-[13px] rounded-full py-2.5">Annuler</button>
              <button onClick={save} className="oe-focus flex-1 bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white font-semibold text-[13px] rounded-full py-2.5">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCategories({ categories, setCategories, products, notify }) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);

  const add = () => {
    if (!newName.trim()) return;
    setCategories((prev) => [...prev, { id: "c" + Date.now(), name: newName.trim(), icon: Tag }]);
    setNewName("");
    notify("Catégorie créée");
  };
  const remove = (id) => { setCategories((prev) => prev.filter((c) => c.id !== id)); notify("Catégorie supprimée"); };
  const rename = (id, name) => setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));

  return (
    <div className="p-5 md:p-8 max-w-xl">
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-1">Catégories</h1>
      <p className="text-[12px] text-[#8A8781] mb-5">Organisez les produits de la boutique</p>

      <div className="flex gap-2 mb-5">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nouvelle catégorie..." className="oe-focus flex-1 border border-[#EFEDE8] rounded-xl px-3.5 py-2.5 text-[13px]" />
        <button onClick={add} className="oe-focus bg-[#1C1C1E] hover:bg-[#FF6A00] transition-colors text-white text-[12px] font-semibold rounded-xl px-4">Ajouter</button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-white border border-[#EFEDE8] rounded-2xl p-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF1E6] flex items-center justify-center shrink-0"><c.icon size={16} className="text-[#FF6A00]" /></div>
            {editing === c.id ? (
              <input autoFocus defaultValue={c.name} onBlur={(e) => { rename(c.id, e.target.value); setEditing(null); }} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} className="oe-focus flex-1 border border-[#EFEDE8] rounded-lg px-2 py-1 text-[13px]" />
            ) : (
              <span className="flex-1 text-[13px] font-medium text-[#1C1C1E]">{c.name}</span>
            )}
            <span className="text-[11px] text-[#8A8781]">{products.filter((p) => p.cat === c.id).length} produits</span>
            <button onClick={() => setEditing(c.id)} className="oe-focus w-8 h-8 rounded-full bg-[#F5F3EF] flex items-center justify-center"><Pencil size={13} /></button>
            <button onClick={() => remove(c.id)} className="oe-focus w-8 h-8 rounded-full bg-[#FBE4E4] text-[#B42318] flex items-center justify-center"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminOrders({ orders, setOrders, notify }) {
  const [filter, setFilter] = useState("Toutes");
  const filters = ["Toutes", ...STATUS_STEPS, "Annulée"];
  const setStatus = (id, status) => { setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))); notify(`Commande ${id} → ${status}`); };
  const shown = filter === "Toutes" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-5 md:p-8">
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-1">Commandes</h1>
      <p className="text-[12px] text-[#8A8781] mb-4">{orders.length} commandes au total</p>
      <div className="flex gap-2 overflow-x-auto oe-scrollbar-none mb-5 pb-1">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`oe-focus shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full border ${filter === f ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-[#EFEDE8] text-[#4B4B4E]"}`}>{f}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {shown.map((o) => (
          <div key={o.id} className="bg-white border border-[#EFEDE8] rounded-2xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="oe-mono text-[13px] font-semibold text-[#1C1C1E]">{o.id}</div>
                <div className="text-[11px] text-[#8A8781] mt-0.5">{o.clientName} · {o.phone} · {new Date(o.date).toLocaleString("fr-FR")}</div>
                <div className="text-[11px] text-[#8A8781]">{o.address}, {o.quartier}, {o.ville}</div>
                {o.comment && <div className="text-[11px] text-[#8A8781] italic mt-0.5">"{o.comment}"</div>}
              </div>
              <StatusBadge status={o.status} size="md" />
            </div>
            <div className="oe-dash my-3" />
            <div className="flex flex-col gap-1">
              {o.items.map((it) => (
                <div key={it.id} className="flex justify-between text-[12px] text-[#4B4B4E]"><span>{it.name} × {it.qty}</span><span className="oe-mono">{money(it.price * it.qty)}</span></div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F0EE]">
              <span className="oe-mono font-bold text-[#1C1C1E] text-[14px]">{money(o.total)}</span>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {STATUS_STEPS.map((s) => (
                  <button key={s} onClick={() => setStatus(o.id, s)} disabled={o.status === s} className={`oe-focus text-[10px] font-semibold px-2.5 py-1.5 rounded-full border ${o.status === s ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-[#EFEDE8] text-[#4B4B4E] hover:border-[#1C1C1E]"}`}>{s}</button>
                ))}
                <button onClick={() => setStatus(o.id, "Annulée")} disabled={o.status === "Annulée"} className="oe-focus text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-[#FBE4E4] text-[#B42318] disabled:opacity-40">Annuler</button>
              </div>
            </div>
          </div>
        ))}
        {shown.length === 0 && <EmptyState icon={ClipboardList} title="Aucune commande" subtitle="Aucune commande ne correspond à ce filtre." />}
      </div>
    </div>
  );
}

function AdminClients({ clients }) {
  return (
    <div className="p-5 md:p-8">
      <h1 className="oe-display font-bold text-[#1C1C1E] text-[19px] mb-1">Clients</h1>
      <p className="text-[12px] text-[#8A8781] mb-5">{clients.length} clients enregistrés</p>
      <div className="bg-white border border-[#EFEDE8] rounded-2xl overflow-hidden">
        {clients.map((c, i) => (
          <div key={c.id} className={`flex items-center gap-3 px-4 py-3.5 ${i !== 0 ? "border-t border-[#F1F0EE]" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-[#FFF1E6] flex items-center justify-center shrink-0"><User size={15} className="text-[#FF6A00]" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#1C1C1E]">{c.name}</div>
              <div className="text-[11px] text-[#8A8781]">{c.phone} · {c.email}</div>
            </div>
            <div className="text-right">
              <div className="oe-mono text-[13px] font-semibold text-[#1C1C1E]">{c.orders}</div>
              <div className="text-[10px] text-[#8A8781]">commandes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminApp({ orders, setOrders, products, setProducts, categories, setCategories, clients, notify }) {
  const [tab, setTab] = useState("dashboard");
  return (
    <div className="flex">
      <AdminSidebar tab={tab} setTab={setTab} />
      <div className="flex-1 min-w-0">
        <AdminTabsMobile tab={tab} setTab={setTab} />
        {tab === "dashboard" && <AdminDashboard orders={orders} products={products} clients={clients} />}
        {tab === "products" && <AdminProducts products={products} categories={categories} setProducts={setProducts} notify={notify} />}
        {tab === "categories" && <AdminCategories categories={categories} setCategories={setCategories} products={products} notify={notify} />}
        {tab === "orders" && <AdminOrders orders={orders} setOrders={setOrders} notify={notify} />}
        {tab === "clients" && <AdminClients clients={clients} />}
      </div>
    </div>
  );
}

/* ============================== ROOT APP ============================== */
export default function OmarcheExpress() {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [categories, setCategories] = useState(CATS);
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [clients, setClients] = useState(INIT_CLIENTS);

  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("home"); // home | search | product | cart | checkout | tracking | account
  const [query, setQuery] = useState("");
  const [catId, setCatId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]); // {id, qty}
  const [currentUser, setCurrentUser] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (msg) => { setToast(msg); window.clearTimeout(notify._t); notify._t = window.setTimeout(() => setToast(""), 2200); };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === product.id);
      const nextQty = Math.min(product.stock, (exists?.qty || 0) + qty);
      if (exists) return prev.map((c) => (c.id === product.id ? { ...c, qty: nextQty } : c));
      return [...prev, { id: product.id, qty: nextQty }];
    });
    notify(`${product.name} ajouté au panier`);
  };
  const updateQty = (id, qty) => setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const goHome = () => { setView("home"); setIsAdmin(false); };
  const goCategory = (id) => { setCatId(id); setQuery(""); setView("search"); };
  const goSearchAll = () => { setCatId(null); setQuery(""); setView("search"); };
  const doSearch = () => { setView("search"); };

  const submitOrder = (form, total, lines) => {
    const orderId = "OE-" + (1043 + orders.length);
    const order = {
      id: orderId, clientName: form.name, phone: form.phone, address: form.address,
      quartier: form.quartier, ville: form.ville, comment: form.comment,
      items: lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, price: l.product.promo ? l.product.promoPrice : l.product.price })),
      total, status: "Reçue", date: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    // decrement stock
    setProducts((prev) => prev.map((p) => {
      const line = lines.find((l) => l.id === p.id);
      return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
    }));
    // upsert client
    setClients((prev) => {
      const exists = prev.find((c) => c.name === form.name);
      if (exists) return prev.map((c) => (c.name === form.name ? { ...c, orders: c.orders + 1, phone: form.phone } : c));
      return [...prev, { id: "cl" + Date.now(), name: form.name, phone: form.phone, email: "-", orders: 1 }];
    });
    setCart([]);
    setLastOrder(order);
    setView("tracking");
    notify("Commande envoyée !");
  };

  // keep lastOrder status synced if admin changes it
  const trackedOrder = lastOrder ? orders.find((o) => o.id === lastOrder.id) || lastOrder : null;

  const bottomNavGo = (id) => {
    if (id === "search") goSearchAll();
    else setView(id);
  };

  return (
    <div className="oe-root min-h-screen bg-[#FAF8F6]">
      <GlobalStyle />
      {!isAdmin && (
        <Header
          query={query} setQuery={setQuery} onSearch={doSearch}
          cartCount={cartCount} onCart={() => setView("cart")}
          onGoHome={goHome} onGoAccount={() => setView("account")}
          isAdmin={isAdmin} setIsAdmin={setIsAdmin}
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
        <AdminApp orders={orders} setOrders={setOrders} products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} clients={clients} notify={notify} />
      ) : (
        <div className="max-w-6xl mx-auto">
          {view === "home" && <HomeView products={products} categories={categories} onOpen={setSelectedProduct} onAdd={addToCart} goCategory={goCategory} goSearchAll={goSearchAll} />}
          {view === "search" && <ProductListView products={products} categories={categories} query={query} setQuery={setQuery} catId={catId} setCatId={setCatId} onOpen={setSelectedProduct} onAdd={addToCart} onBack={goHome} />}
          {view === "cart" && <CartView cart={cart} products={products} onQty={updateQty} onRemove={removeFromCart} onCheckout={() => setView("checkout")} onContinue={goSearchAll} />}
          {view === "checkout" && <CheckoutView cart={cart} products={products} onSubmit={submitOrder} onBack={() => setView("cart")} currentUser={currentUser} />}
          {view === "tracking" && <TrackingView order={trackedOrder} onContinueShopping={goHome} />}
          {view === "account" && <AccountView currentUser={currentUser} onLogin={(u) => { setCurrentUser(u); notify("Connecté avec succès"); }} onLogout={() => setCurrentUser(null)} orders={orders} />}
        </div>
      )}

      {!isAdmin && <div className="hidden md:block text-center py-6 text-[11px] text-[#8A8781]">Bouton "Espace admin" en haut à droite pour accéder au back-office.</div>}
      {!isAdmin && <div className="md:hidden text-center pb-24 pt-4 text-[11px] text-[#8A8781]">
        <button onClick={() => setIsAdmin(true)} className="oe-focus underline">Accéder à l'espace admin</button>
      </div>}

      {!isAdmin && <BottomNav view={view} go={bottomNavGo} cartCount={cartCount} />}

      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      <Toast message={toast} />
    </div>
  );
}
