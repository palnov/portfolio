"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getCmsContent } from "@/lib/yandex";
import { 
  CarOutlineIcon, 
  CeramicShieldIcon, 
  PolisherIcon, 
  FilmWrapIcon, 
  SparkleIcon,
  PandaLogo,
  InstagramIcon,
  TelegramIcon,
  ArrowRightIcon,
  DryCleaningIcon,
  GlassIcon,
  ComplexIcon
} from "@/components/Icons";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ContactForm from "@/components/ContactForm";
import { ServiceCms, StudioInfoCms } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface ClientPageProps {
  studioInfo: StudioInfoCms;
  services: ServiceCms[];
}

export default function ClientPage({ studioInfo, services }: ClientPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Setup GSAP Animations
  useEffect(() => {
    // 1. Hero Entrance Animations
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline();
      heroTl.fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
      )
      .fromTo(
        ".hero-desc",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.6"
      )
      .fromTo(
        ".hero-car-glow",
        { opacity: 0, filter: "blur(40px)" },
        { opacity: 1, filter: "blur(20px)", duration: 1.5, ease: "power2.out" },
        "-=1.2"
      )
      .fromTo(
        ".hero-stats-badge",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      );

      // 2. Services Parallax Scroll Animations
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 3. Before/After section reveal
      gsap.fromTo(
        ".before-after-reveal",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ".before-after-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "polishing":
        return <PolisherIcon className="w-8 h-8 text-lime-400" />;
      case "ceramics":
        return <CeramicShieldIcon className="w-8 h-8 text-lime-400" />;
      case "ppf":
        return <FilmWrapIcon className="w-8 h-8 text-lime-400" />;
      case "dry-cleaning":
        return <DryCleaningIcon className="w-8 h-8 text-lime-400" />;
      case "glass":
        return <GlassIcon className="w-8 h-8 text-lime-400" />;
      case "complex":
        return <ComplexIcon className="w-8 h-8 text-lime-400" />;
      default:
        return <SparkleIcon className="w-8 h-8 text-lime-400" />;
    }
  };

  const scrollToContact = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#070809] overflow-hidden text-gray-100 font-sans">
      
      {/* Decorative neon blurs leaking from behind panels */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full bg-lime-500/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-lime-500/10 blur-[180px] pointer-events-none z-0" />

      {/* Split Hero Layout */}
      <section ref={heroRef} className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 border-b border-white/5 z-10">
        
        {/* Left Panel: Brand identity & Action */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between p-8 lg:p-12 xl:p-16 bg-[#0c0d0e]/95 relative border-r border-white/5 z-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-4 mb-12 lg:mb-0">
            <div className="w-12 h-12 rounded-full border border-lime-500/30 flex items-center justify-center bg-black/50 text-white">
              <PandaLogo className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="block font-bold tracking-[0.2em] uppercase text-sm leading-none text-white">{studioInfo.title.split(" ")[0]}</span>
              <span className="block text-[9px] uppercase tracking-[0.35em] text-zinc-500 font-bold mt-1">detailing studio</span>
            </div>
          </div>

          {/* Hero text content & Action button */}
          <div className="my-auto py-12 lg:py-0 max-w-lg">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400 mb-6 inline-block hero-title">
              студия авто детейлинга
            </span>
            <h1 className="hero-title text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white mb-6 uppercase leading-tight">
              {studioInfo.tagline}
            </h1>
            <p className="hero-desc text-sm md:text-base text-zinc-400 mb-10 leading-relaxed font-medium">
              {studioInfo.description}
            </p>
            
            {/* Booking Link / CTA with a pulsing glow dot similar to reference */}
            <div className="hero-cta flex items-center space-x-6">
              <button
                onClick={scrollToContact}
                className="relative group px-7 py-3.5 bg-transparent border border-white/10 hover:border-lime-500/30 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-full transition-all flex items-center space-x-3 cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                {/* Glowing neon green sphere indicator */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
                </span>
                <span className="group-hover:text-lime-400 transition-colors">Записаться</span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Bottom Statistics Badge Row */}
          <div className="grid grid-cols-4 gap-2 pt-8 border-t border-white/5 mt-12 lg:mt-0">
            <div className="hero-stats-badge flex flex-col">
              <span className="text-xl xl:text-2xl font-black text-white">{studioInfo.stats.years.split(" ")[0]}</span>
              <span className="text-[8px] xl:text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">года в деле</span>
            </div>
            <div className="hero-stats-badge flex flex-col border-l border-white/5 pl-3">
              <span className="text-xl xl:text-2xl font-black text-white">{studioInfo.stats.completed}</span>
              <span className="text-[8px] xl:text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">работ</span>
            </div>
            <div className="hero-stats-badge flex flex-col border-l border-white/5 pl-3">
              <span className="text-xl xl:text-2xl font-black text-white">{studioInfo.stats.cars}</span>
              <span className="text-[8px] xl:text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">премиум</span>
            </div>
            <div className="hero-stats-badge flex flex-col border-l border-white/5 pl-3">
              <span className="text-xl xl:text-2xl font-black text-lime-400">{studioInfo.stats.rating.split(" ")[0]}</span>
              <span className="text-[8px] xl:text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold font-semibold">гугл</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Stunning visual car presentation & top header menu */}
        <div className="col-span-1 lg:col-span-7 relative min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 xl:p-16 z-10 overflow-hidden">
          
          {/* Absolute Background image of professional car headlights */}
          <div className="absolute inset-0 z-0">
            <img
              src="/car_headlight.png"
              alt="Premium car headlights detailing close-up"
              className="w-full h-full object-cover"
            />
            {/* Dark vignette gradient overlays matching premium aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0e] via-[#070809]/40 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070809] via-transparent to-[#070809]/50" />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Glowing neon green light bar reflect */}
            <div className="absolute bottom-[10%] left-[10%] w-[120px] h-[120px] rounded-full bg-lime-500/15 blur-[50px] animate-pulse pointer-events-none" />
          </div>

          {/* Top Panel: Navigation menu & phone number callout */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center w-full gap-6">
            <nav className="flex space-x-6 xl:space-x-8 text-xs xl:text-sm uppercase tracking-[0.2em] font-extrabold text-zinc-300">
              <a href="#services" className="hover:text-lime-400 transition-colors">услуги</a>
              <a href="#before-after" className="hover:text-lime-400 transition-colors">результат</a>
              <a href="#about" className="hover:text-lime-400 transition-colors">о нас</a>
              <a href="#order-form" className="hover:text-lime-400 transition-colors">контакты</a>
            </nav>

            <a
              href={`tel:${studioInfo.phoneRaw}`}
              className="px-6 py-3 rounded-full bg-lime-500 hover:bg-lime-400 text-black text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(132,204,22,0.25)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {studioInfo.phone}
            </a>
          </div>

          {/* Social connections on bottom right */}
          <div className="relative z-10 flex justify-end space-x-4 mt-auto">
            {studioInfo.instagramUrl && (
              <a
                href={studioInfo.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-lime-500/30 flex items-center justify-center bg-black/40 text-zinc-400 hover:text-lime-400 transition-all"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
            {studioInfo.telegramUrl && (
              <a
                href={studioInfo.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-lime-500/30 flex items-center justify-center bg-black/40 text-zinc-400 hover:text-lime-400 transition-all"
                title="Telegram"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-24 px-6 lg:px-12 relative z-10 bg-zinc-950/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-500 mb-2 inline-block">
              наши услуги
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
              Профессиональный уход
            </h2>
          </div>

          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="service-card group glassmorphism p-8 rounded-2xl border border-white/5 hover:border-lime-500/20 transition-all flex flex-col justify-between cursor-pointer"
                onClick={scrollToContact}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center mb-6 bg-zinc-900 group-hover:border-lime-500/30 transition-colors">
                    {getServiceIcon(svc.id)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-lime-400 transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-medium">
                    {svc.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Срок</span>
                    <span className="text-xs text-zinc-300 font-bold">{svc.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-semibold">Стоимость</span>
                    <span className="text-sm text-lime-400 font-extrabold">{svc.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Interactive Section */}
      <section id="before-after" className="before-after-section py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-500 mb-2 inline-block">
              визуальный результат
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
              До и после детейлинга
            </h2>
            <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto font-medium">
              Перетаскивайте ползунок посередине, чтобы наглядно оценить результат полировки и нанесения защитного состава.
            </p>
          </div>

          <div className="before-after-reveal">
            <BeforeAfterSlider />
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="order-form" className="py-24 px-6 lg:px-12 relative z-10 bg-zinc-950/40 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <ContactForm services={services} />
        </div>
      </section>

      {/* About & Quality Features */}
      <section id="about" ref={featuresRef} className="py-24 px-6 lg:px-12 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-500 mb-2 inline-block">
                о нашей студии
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase mb-6 leading-tight">
                Премиальные стандарты детейлинга
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
                Наша студия создана для тех, кто относится к своему автомобилю с особенным трепетом. Мы используем только профессиональные зарубежные составы (из Германии, США, Японии) и строго соблюдаем весь технологический процесс детейлинга. Каждый автомобиль проходит через индивидуальный контроль качества.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-lime-400 rounded-full" />
                  </div>
                  <span className="text-sm text-zinc-300 font-medium">Чистые закрытые боксы с профессиональным рассеянным светом</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-lime-400 rounded-full" />
                  </div>
                  <span className="text-sm text-zinc-300 font-medium">Сертифицированные мастера с подтвержденным стажем более 5 лет</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-lime-400 rounded-full" />
                  </div>
                  <span className="text-sm text-zinc-300 font-medium">Полная видеофиксация и гарантия на все выполненные работы</span>
                </li>
              </ul>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/5 bg-black group shadow-2xl">
              <img
                src="/detailing_process.png"
                alt="Профессиональный детейлинг процесс PANDA"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              
              {/* Overlay with radial gradient to focus attention on center */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              {/* Content box */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-left">
                <span className="text-[10px] text-lime-400 font-extrabold uppercase tracking-[0.3em] mb-2">контроль качества</span>
                <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">100% Результат</h4>
                <p className="text-xs text-zinc-300 max-w-sm font-semibold uppercase tracking-wider leading-relaxed">
                  Ваша машина будет сиять ярче, чем в день покупки
                </p>
              </div>
              
              {/* Glowing decorative border overlay */}
              <div className="absolute inset-0 border border-lime-500/0 group-hover:border-lime-500/20 transition-all duration-500 rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 relative z-10 bg-black/80 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <SparkleIcon className="w-5 h-5 text-lime-400" />
            <span className="font-bold tracking-[0.2em] uppercase text-xs text-zinc-400">{studioInfo.title}</span>
          </div>

          <div className="text-xs text-zinc-500 font-semibold uppercase tracking-widest text-center md:text-right">
            © {new Date().getFullYear()} {studioInfo.title}. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
