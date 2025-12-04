"use client";
import React, { useMemo, useState } from "react";
import { XIcon } from "../../../components/icons";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [budgetType, setBudgetType] = useState<"hourly" | "fixed">("hourly");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const categories = useMemo(() => ["Plumbing", "Electrician", "Auto Repair", "Cleaning", "Painting", "Carpentry", "AC Repair"], []);
  const filteredCats = useMemo(() => categories.filter((c) => c.toLowerCase().includes(categoryInput.toLowerCase())), [categories, categoryInput]);
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US", { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);

  const onSelectCategory = (c: string) => { setCategoryInput(c); setCategoryOpen(false); };
  const onAttach = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); setAttachments(files); };
  const onSubmit = () => {
    const payload = { title, description, category: categoryInput, attachments: attachments.map((f) => ({ name: f.name, size: f.size })), budgetType, from: priceFrom, to: priceTo };
    console.log("post-job", payload);
    router.push("/activity");
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={() => router.back()} />
      <div className="absolute inset-x-0 bottom-0 top-0 mx-auto max-w-md rounded-t-2xl border border-[var(--color-border)] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
        <div className="sticky top-0 z-10 flex items-center justify-center px-4 py-3">
          <div className="text-[16px] font-semibold text-[var(--color-text)]">Post a Job</div>
          <button onClick={() => router.back()} className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
            <XIcon />
          </button>
        </div>
        <div className="px-4 pb-24">
          <div className="mt-2">
            <div className="text-[13px] font-semibold text-[var(--color-text)]">Title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title here..." className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold text-[var(--color-text)]">Description</div>
              <div className="text-[12px] text-[var(--color-text-muted)]">{Math.min(description.length, 300)}/{numberFormatter.format(300)}</div>
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 300))} placeholder="Enter description here..." rows={4} className="mt-1 w-full resize-none rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
          </div>

          <div className="mt-3">
            <div className="text-[13px] font-semibold text-[var(--color-text)]">Category</div>
            <div className="relative mt-1">
              <input value={categoryInput} onChange={(e) => { setCategoryInput(e.target.value); setCategoryOpen(true); }} onFocus={() => setCategoryOpen(true)} placeholder="Search and choose categories" className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
              {categoryOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-40 overflow-auto rounded-xl border border-[var(--color-border)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  {filteredCats.length === 0 && <div className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">No matches</div>}
                  {filteredCats.map((c) => (
                    <button key={c} onClick={() => onSelectCategory(c)} className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-[#f3f4f6]">
                      <span className="text-[var(--color-text)]">{c}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[13px] font-semibold text-[var(--color-text)]">Attachments</div>
            <label className="mt-1 flex h-[48px] w-full cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-[#f3f4f6] text-[13px] text-[var(--color-text-muted)]">
              <input onChange={onAttach} type="file" multiple className="hidden" />
              {attachments.length === 0 ? "Tap to upload a file, image or video" : `${attachments.length} file(s) selected`}
            </label>
          </div>

          <div className="mt-3">
            <div className="text-[13px] font-semibold text-[var(--color-text)]">Budget</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => setBudgetType("hourly")} className={`rounded-xl px-3 py-2 text-[13px] ${budgetType === "hourly" ? "border-2 border-[var(--color-green)] bg-[#eef7f1]" : "border border-[var(--color-border)] bg-white"}`}>Hourly</button>
              <button onClick={() => setBudgetType("fixed")} className={`rounded-xl px-3 py-2 text-[13px] ${budgetType === "fixed" ? "border-2 border-[var(--color-green)] bg-[#eef7f1]" : "border border-[var(--color-border)] bg-white"}`}>Fixed</button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[12px] text-[var(--color-text-muted)]">From</div>
                <div className="mt-1 flex items-center rounded-xl border border-[var(--color-border)] bg-white px-2">
                  <span className="mr-1 text-[13px]">₦</span>
                  <input value={priceFrom} inputMode="numeric" onChange={(e) => setPriceFrom(e.target.value.replace(/[^\d]/g, ""))} className="w-full bg-transparent py-2 text-[13px] outline-none" placeholder="N" />
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[var(--color-text-muted)]">To</div>
                <div className="mt-1 flex items-center rounded-xl border border-[var(--color-border)] bg-white px-2">
                  <span className="mr-1 text-[13px]">₦</span>
                  <input value={priceTo} inputMode="numeric" onChange={(e) => setPriceTo(e.target.value.replace(/[^\d]/g, ""))} className="w-full bg-transparent py-2 text-[13px] outline-none" placeholder="N" />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
            <button onClick={onSubmit} className="w-[320px] rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white">Post Job</button>
          </div>
        </div>
      </div>
    </div>
  );
}
