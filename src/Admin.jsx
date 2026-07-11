import React, { useState, useEffect } from "react";
import {
  BarChart3, Package, Tag, ClipboardList, Users, Wallet, Clock,
  PlusCircle, Pencil, Trash2, Upload, MessageSquare, User,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import { money, parsePriceInput, StatusBadge, EmptyState, STATUS_STEPS, OrderChat } from "./OmarcheExpress.jsx";

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
  const emptyForm = { name: "", cat: categories[0]?.id, price: "", stock: "", promo: false, promoPrice: "", images: [], videoUrl: "", desc: "", active: true, popular: false, isNew: true, minOrderQty: "1", wholesalePrice: "", wholesaleMinQty: "" };
  const [form, setForm] = useState(emptyForm);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const openNew = () => { setForm(emptyForm); setEditing("new"); };
  const openEdit = (p) => { setForm({ ...emptyForm, ...p, images: p.images && p.images.length ? p.images : (p.img ? [p.img] : []), price: String(p.price ?? ""), promoPrice: String(p.promoPrice ?? ""), minOrderQty: String(p.minOrderQty || 1), wholesalePrice: String(p.wholesalePrice ?? ""), wholesaleMinQty: String(p.wholesaleMinQty ?? "") }); setEditing(p.id); };

  const uploadFile = async (file, bucket = "product-images") => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePhotosPick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const room = 8 - form.images.length;
    if (room <= 0) { notify("Maximum 8 photos par produit"); return; }
    setUploadingPhotos(true);
    const urls = [];
    for (const file of files.slice(0, room)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length) setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    if (files.length > room) notify(`Seules ${room} photo(s) ont été ajoutées (maximum 8)`);
    setUploadingPhotos(false);
    e.target.value = "";
  };

  const removePhoto = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleVideoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    const url = await uploadFile(file);
    if (url) setForm((f) => ({ ...f, videoUrl: url })); else notify("Erreur lors de l'envoi de la vidéo");
    setUploadingVideo(false);
    e.target.value = "";
  };

  const save = async () => {
    if (!form.name.trim() || form.price === "" || form.stock === "") { notify("Veuillez remplir les champs obligatoires"); return; }
    if (!form.images.length) { notify("Ajoutez au moins une photo pour le produit"); return; }
    const payload = {
      ...form,
      price: parsePriceInput(form.price),
      stock: Number(form.stock),
      promoPrice: form.promo ? parsePriceInput(form.promoPrice) : undefined,
      img: form.images[0],
      minOrderQty: Math.max(1, Number(form.minOrderQty) || 1),
      wholesalePrice: form.wholesalePrice ? parsePriceInput(form.wholesalePrice) : null,
      wholesaleMinQty: form.wholesaleMinQty ? Number(form.wholesaleMinQty) : null,
    };
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-[#1C1C1E] truncate">{p.name}</span>
                {!p.active && <span className="text-[10px] font-bold bg-[#F1F0EE] text-[#8A8781] px-2 py-0.5 rounded-full">DÉSACTIVÉ</span>}
                {p.stock <= 0 && <span className="text-[10px] font-bold bg-[#FBE4E4] text-[#B42318] px-2 py-0.5 rounded-full">RUPTURE</span>}
                {p.promo && <span className="text-[10px] font-bold bg-[#FFF3DB] text-[#8A5A00] px-2 py-0.5 rounded-full">PROMO</span>}
                {p.videoUrl && <span className="text-[10px] font-bold bg-[#E6F0FF] text-[#1D4ED8] px-2 py-0.5 rounded-full flex items-center gap-1"><Video size={10} /> Vidéo</span>}
              </div>
              <div className="text-[11px] text-[#8A8781] mt-0.5">{categories.find((c) => c.id === p.cat)?.name} · {money(p.price)} · {p.stock} en stock{p.minOrderQty > 1 ? ` · min. ${p.minOrderQty}` : ""}</div>
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
                  <input type="text" inputMode="numeric" placeholder="Ex : 14000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B4B4E]">Quantité en stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
              </div>
              <p className="text-[10px] text-[#8A8781] -mt-2">Saisis juste les chiffres (ex : 14000). Les points ou espaces sont ignorés automatiquement.</p>

              <div>
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Photos du produit ({form.images.length}/8)</label>
                <div className="mt-1 grid grid-cols-4 gap-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#F5F3EF] border border-[#EFEDE8] group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removePhoto(i)} className="oe-focus absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"><X size={11} /></button>
                      {i === 0 && <span className="absolute bottom-1 left-1 bg-white/90 text-[8px] font-bold px-1.5 py-0.5 rounded-full">Principale</span>}
                    </div>
                  ))}
                  {form.images.length < 8 && (
                    <label className="oe-focus cursor-pointer aspect-square rounded-xl border border-dashed border-[#EFEDE8] flex flex-col items-center justify-center text-[#8A8781] hover:border-[#1C1C1E] text-center px-1">
                      <Upload size={16} />
                      <span className="text-[9px] font-semibold mt-1">{uploadingPhotos ? "Envoi..." : "Ajouter"}</span>
                      <input type="file" accept="image/*" multiple onChange={handlePhotosPick} disabled={uploadingPhotos} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Vidéo du produit (facultatif)</label>
                {form.videoUrl ? (
                  <div className="mt-1 flex items-center gap-2">
                    <video src={form.videoUrl} className="w-20 h-14 rounded-xl object-cover bg-[#F5F3EF]" />
                    <button onClick={() => setForm({ ...form, videoUrl: "" })} className="oe-focus text-[11px] font-semibold text-[#B42318]">Retirer la vidéo</button>
                  </div>
                ) : (
                  <label className="oe-focus mt-1 cursor-pointer flex items-center justify-center gap-1.5 border border-[#EFEDE8] rounded-xl px-3 py-2.5 text-[12px] font-semibold text-[#4B4B4E] hover:border-[#1C1C1E]">
                    <Video size={14} /> {uploadingVideo ? "Envoi en cours..." : "Ajouter une vidéo"}
                    <input type="file" accept="video/*" onChange={handleVideoPick} disabled={uploadingVideo} className="hidden" />
                  </label>
                )}
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
                  <input type="text" inputMode="numeric" placeholder="Ex : 12000" value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
              )}

              <div className="border-t border-[#EFEDE8] pt-3 mt-1">
                <label className="text-[11px] font-semibold text-[#4B4B4E]">Quantité minimum de commande</label>
                <input type="number" min="1" value={form.minOrderQty} onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B4B4E]">Prix grossiste (FCFA)</label>
                  <input type="text" inputMode="numeric" placeholder="Facultatif" value={form.wholesalePrice} onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B4B4E]">Dès combien d'unités</label>
                  <input type="number" placeholder="Ex : 10" value={form.wholesaleMinQty} onChange={(e) => setForm({ ...form, wholesaleMinQty: e.target.value })} className="oe-focus w-full border border-[#EFEDE8] rounded-xl px-3 py-2 text-[13px] mt-1" />
                </div>
              </div>
              <p className="text-[10px] text-[#8A8781] -mt-2">Laisse ces deux champs vides si tu ne proposes pas de tarif grossiste pour ce produit.</p>

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

function useAdminNotifications(notify) {
  const [permission, setPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const res = await Notification.requestPermission();
    setPermission(res);
  };

  const fire = (title, body) => {
    notify(title + " — " + body);
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try { new Notification(title, { body, icon: "/logo.png" }); } catch (e) {}
    }
  };

  useEffect(() => {
    const ordersChannel = supabase
      .channel("admin-new-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        fire("Nouvelle commande !", `${payload.new.order_number} — ${payload.new.client_name}`);
      })
      .subscribe();

    const messagesChannel = supabase
      .channel("admin-new-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "order_messages", filter: "sender=eq.client" }, (payload) => {
        fire("Nouveau message client", payload.new.content.slice(0, 80));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  return { permission, requestPermission };
}

function AdminApp({ orders, products, categories, clients, notify, handlers }) {
  const [tab, setTab] = useState("dashboard");
  const { permission, requestPermission } = useAdminNotifications(notify);
  return (
    <div className="flex">
      <AdminSidebar tab={tab} setTab={setTab} />
      <div className="flex-1 min-w-0">
        <AdminTabsMobile tab={tab} setTab={setTab} />
        {permission === "default" && (
          <div className="bg-[#FFF1E6] px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[12px] text-[#1C1C1E]">Active les notifications pour être alerté des nouvelles commandes et messages, même onglet fermé en arrière-plan.</span>
            <button onClick={requestPermission} className="oe-focus shrink-0 bg-[#1C1C1E] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">Activer les notifications</button>
          </div>
        )}
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
