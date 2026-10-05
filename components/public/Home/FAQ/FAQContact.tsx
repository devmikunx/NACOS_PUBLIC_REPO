"use client";

import { Mail, MessageCircle } from "lucide-react";
import { usePublicContactInfo } from "@/hooks/use-contact-info";

export function FAQContact() {
  const { data: contactInfo } = usePublicContactInfo();
  const email = contactInfo?.softwareDirector?.email;
  const whatsapp = contactInfo?.softwareDirector?.whatsapp;

  return (
    <div className="text-center mt-16 pt-8 border-t border-white/10">
      <p className="text-white font-black text-xl tracking-tighter mb-1">Need more help?</p>
      <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-8">
    
        We&apos;re here to assist via email or WhatsApp
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-tr-xl rounded-bl-xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <Mail className="w-4 h-4 text-[#168706]" />
            Email Support
          </a>
        )}

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#168706] text-white text-xs font-bold uppercase tracking-widest rounded-tr-xl rounded-bl-xl hover:bg-[#0D5104] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}