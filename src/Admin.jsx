import React, { useState } from "react";
import {
  BarChart3, Package, Tag, ClipboardList, Users, Wallet, Clock,
  PlusCircle, Pencil, Trash2, Upload, MessageSquare, User,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import { money, StatusBadge, EmptyState, STATUS_STEPS, OrderChat } from "./OmarcheExpress.jsx";

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
        {orders.length === 0 && <div className="px-4 py-6 text-center text-[12px] text-[#8A8781]">Aucune commande pour l'instant.</div>}
      </div>

      <div className="flex items-center justify-between mt-8 mb-3">
        <h2 className="oe-display font-bold text-[#1C1C1E] text-[15px]">Produits</h2>
        <span className="text-[11px] text-[#8A8781]">{products.length} au catalogue</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.slice(0, 12).map((p) => (
          <div key={p.id} className="bg-white border border-[#EFEDE8] rounded-2xl overflow-hidden">
            <div className="aspect-square bg-[#F5F3EF] relative">
              {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center text-[#C9C6C0]"><Package size={20} /></div>
              )}
              {p.stock <= 0 && <span className="absolute top-1.5 left-1.5 bg-white/95 text-[#B42318] text-[9px] font-bold px-1.5 py-0.5 rounded-full">RUPTURE</span>}
              {!p.active && <span className="absolute top-1.5 right-1.5 bg-[#1C1C1E]/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">OFF</span>}
            </div>
            <div className="p-2">
              <div className="text-[11px] font-semibold text-[#1C1C1E] truncate">{p.name}</div>
              <div className="oe-mono text-[10.5px] text-[#8A8781] mt-0.5">{money(p.promo ? p.promoPrice : p.price)} · {p.stock} en stock</div>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="col-span-full text-center py-6 text-[12px] text-[#8A8781]">Aucun produit au catalogue.</div>}
      </div>
    </div>
  );
}

function AdminProducts({ products, categories, onSaveProduct, onDeleteProduct, onToggleProduct, notify }) {
  const [editing, setEditing] = useState(null); // product or "new"
  const emptyForm = { name: "", cat: categories[0]?.id, price: "", stock: "", promo: false, promoPrice: "", img: "", desc: "", active: true, popular: false, isNew: true };
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const openNew = () => { setForm(emptyForm); setEditing("new"); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); };

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) {
      notify("Erreur lors de l'envoi de la photo");
    } else {
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setForm((f) => ({ ...f, img: data.publicUrl }));
    }
    setUploading(false);
  };

  const save = async () => {
    if (!form.name.trim() || form.price === "" || form.stock === "") { notify("Veuillez remplir les champs obligatoires"); return; }
    if (!form.img) { notify("Ajoutez une photo pour le produit"); return; }
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), promoPrice: form.promo ? Number(form.promoPrice || 0) : undefined };
    const isNewProduct = editing === "new";
    const ok = await onSaveProduct(payload, isNewProduct ? null : editing);
    if (ok) notify(isNewProduct ? "Produit ajouté" : "Produit modifié");
    else notify("Erreur lors de l'enregistrement");
    setEditing(null);
  };

  const remove = async (id) => { const ok = await onDeleteProduct(id); notify(ok ? "Produit supprimé" : "Erreur lors de la suppression"); };
  const toggleActive = (id) => onToggleProduct(id);

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
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Photo du produit</label>
                <div className="mt-1 flex items-center gap-3">
                  {form.img ? (
                    <img src={form.img} alt="Aperçu" className="w-16 h-16 rounded-xl object-cover bg-[#F5F3EF] border border-[#EFEDE8]" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#F5F3EF] border border-dashed border-[#EFEDE8] flex items-center justify-center text-[#8A8781]">
                      <Upload size={18} />
                    </div>
                  )}
                  <label className="oe-focus cursor-pointer flex-1 text-center border border-[#EFEDE8] rounded-xl px-3 py-2.5 text-[12px] font-semibold text-[#4B4B4E] hover:border-[#1C1C1E]">
                    {uploading ? "Envoi en cours..." : form.img ? "Changer la photo" : "Choisir une photo dans la galerie"}
                    <input type="file" accept="image/*" onChange={handlePhotoPick} disabled={uploading} className="hidden" />
                  </label>
                </div>
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

function AdminCategories({ categories, products, onAddCategory, onDeleteCategory, onRenameCategory, notify }) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);

  const add = async () => {
    if (!newName.trim()) return;
    const ok = await onAddCategory(newName.trim());
    setNewName("");
    notify(ok ? "Catégorie créée" : "Erreur lors de la création");
  };
  const remove = async (id) => { const ok = await onDeleteCategory(id); notify(ok ? "Catégorie supprimée" : "Erreur lors de la suppression"); };
  const rename = async (id, name) => { await onRenameCategory(id, name); };

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
            <div className="w-9 h-9 rounded-xl bg-[#FFF1E6] flex items-center justify-center shrink-0">{React.createElement(c.icon || Tag, { size: 16, className: "text-[#FF6A00]" })}</div>
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

function AdminOrders({ orders, onSetStatus, notify }) {
  const [filter, setFilter] = useState("Toutes");
  const [openChat, setOpenChat] = useState(null);
  const filters = ["Toutes", ...STATUS_STEPS, "Annulée"];
  const setStatus = async (id, status) => { const ok = await onSetStatus(id, status); notify(ok ? `Commande ${id} → ${status}` : "Erreur lors de la mise à jour"); };
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
              <div className="flex gap-1.5 flex-wrap justify-end items-center">
                <button onClick={() => setOpenChat(openChat === o.id ? null : o.id)} className="oe-focus text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-[#EFEDE8] text-[#4B4B4E] hover:border-[#1C1C1E] flex items-center gap-1">
                  <MessageSquare size={11} /> {openChat === o.id ? "Fermer" : "Discussion"}
                </button>
                {STATUS_STEPS.map((s) => (
                  <button key={s} onClick={() => setStatus(o.id, s)} disabled={o.status === s} className={`oe-focus text-[10px] font-semibold px-2.5 py-1.5 rounded-full border ${o.status === s ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-[#EFEDE8] text-[#4B4B4E] hover:border-[#1C1C1E]"}`}>{s}</button>
                ))}
                <button onClick={() => setStatus(o.id, "Annulée")} disabled={o.status === "Annulée"} className="oe-focus text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-[#FBE4E4] text-[#B42318] disabled:opacity-40">Annuler</button>
              </div>
            </div>
            {openChat === o.id && (
              <div className="mt-3">
                <OrderChat orderUuid={o.uuid} orderNumber={o.id} sender="admin" notify={notify} />
              </div>
            )}
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

function AdminApp({ orders, products, categories, clients, notify, handlers }) {
  const [tab, setTab] = useState("dashboard");
  return (
    <div className="flex">
      <AdminSidebar tab={tab} setTab={setTab} />
      <div className="flex-1 min-w-0">
        <AdminTabsMobile tab={tab} setTab={setTab} />
        {tab === "dashboard" && <AdminDashboard orders={orders} products={products} clients={clients} />}
        {tab === "products" && <AdminProducts products={products} categories={categories} onSaveProduct={handlers.saveProduct} onDeleteProduct={handlers.deleteProduct} onToggleProduct={handlers.toggleProduct} notify={notify} />}
        {tab === "categories" && <AdminCategories categories={categories} products={products} onAddCategory={handlers.addCategory} onDeleteCategory={handlers.deleteCategory} onRenameCategory={handlers.renameCategory} notify={notify} />}
        {tab === "orders" && <AdminOrders orders={orders} onSetStatus={handlers.setOrderStatus} notify={notify} />}
        {tab === "clients" && <AdminClients clients={clients} />}
      </div>
    </div>
  );
}


export default AdminApp;
