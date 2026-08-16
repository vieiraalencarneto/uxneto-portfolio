"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  bucket?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/jpeg,image/png,image/webp",
  bucket = "portfolio",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("bucket", bucket);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) {
        alert("Upload failed");
        return;
      }
      const { url } = await res.json();
      onChange(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="image-upload-input"
        className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)] mb-1.5"
      >
        {label}
      </label>
      <button
        type="button"
        className="w-full border border-dashed border-[var(--border)] p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-[var(--coffee-bean)] transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        {value ? (
          <div className="relative w-full aspect-video">
            <Image src={value} alt="Preview" fill className="object-cover" />
          </div>
        ) : (
          <p className="text-[var(--muted)] text-xs">
            {uploading ? "Uploading..." : "Click or drag image here"}
          </p>
        )}
        {value && (
          <p className="text-[var(--muted)] text-[10px]">
            {uploading ? "Uploading..." : "Click to replace"}
          </p>
        )}
      </button>
      {value && (
        <div className="mt-1.5 flex gap-2 items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-[10px] text-[var(--muted)] border border-[var(--border)] px-2 py-1 bg-[var(--background)]"
            placeholder="Or paste URL directly"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-[var(--ember-red)] hover:opacity-70"
          >
            Remove
          </button>
        </div>
      )}
      {!value && (
        <input
          type="text"
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full text-[10px] text-[var(--muted)] border border-[var(--border)] px-2 py-1 bg-[var(--background)]"
          placeholder="Or paste URL directly"
        />
      )}
      <input
        ref={inputRef}
        id="image-upload-input"
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
