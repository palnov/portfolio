"use client";

import React, { useActionState, useEffect, useState } from "react";
import { handleLeadAction } from "@/app/actions";
import { ServiceCms } from "@/lib/types";
import confetti from "canvas-confetti";

interface ContactFormProps {
  services: ServiceCms[];
}

export default function ContactForm({ services }: ContactFormProps) {
  const [state, action, isPending] = useActionState(handleLeadAction, null);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    if (state?.success) {
      // Trigger luxury success celebration effects
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#84cc16", "#a3e635", "#ffffff", "#10b981"],
      });
      // Reset service select
      setSelectedService("");
    }
  }, [state]);

  return (
    <div className="w-full max-w-xl mx-auto glassmorphism p-8 rounded-2xl relative overflow-hidden border border-lime-500/10 shadow-2xl">
      {/* Decorative inner light flare */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <h3 className="text-2xl font-bold tracking-tight text-white mb-2 text-center">
        Записаться на детейлинг
      </h3>
      <p className="text-sm text-zinc-400 text-center mb-8">
        Заполните форму, и мы свяжемся с вами в течение 15 минут для подтверждения времени записи.
      </p>

      <form action={action} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Ваше имя *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Александр"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/60 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Номер телефона *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+7 (999) 000-00-00"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/60 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Тип услуги *
            </label>
            <select
              id="service"
              name="service"
              required
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/60 transition-colors"
            >
              <option value="" disabled className="text-zinc-600">Выберите услугу</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.name} className="bg-zinc-950 text-white">
                  {svc.name} — {svc.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Желаемая дата
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/60 transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Комментарий или пожелания
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Особые пожелания или марка авто"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/60 transition-colors resize-none"
          />
        </div>

        {state?.error && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 text-sm">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 rounded-lg bg-lime-950/40 border border-lime-500/20 text-lime-400 text-sm">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? "Отправка..." : "Отправить заявку"}
        </button>
      </form>
    </div>
  );
}
