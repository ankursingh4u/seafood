import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSlider from "@/components/HeroSlider";

// Category cards shown on home page
const BROWSE_CATS = [
  { key: "pick",    label: "Seafood Pick n Go", icon: "🦐", color: "#e05c2a", img: "/images/babs-gorniak-rdVrvLOO9Ag-unsplash.jpg"     },
  { key: "fish",    label: "Fish Selection",     icon: "🐟", color: "#0369a1", img: "/images/solo-seafood-quC9dMtGVic-unsplash.jpg"      },
  { key: "burgers", label: "Burgers & Wraps",   icon: "🍔", color: "#d97706", img: "/images/gastro-editorial-PkByBrVtQco-unsplash.jpg"  },
  { key: "basket",  label: "Seafood Basket",     icon: "🧺", color: "#0d9488", img: "/images/caroline-attwood-k6FamTj0k_0-unsplash.jpg" },
  { key: "daily",   label: "Daily Specials",     icon: "⭐", color: "#dc2626", img: "/images/daniel-hooper-0jGbplYqx5w-unsplash.jpg"    },
  { key: "chips",   label: "Chips n Sauces",     icon: "🍟", color: "#16a34a", img: "/images/the-now-time-i1rjJ1FAxRU-unsplash.jpg"     },
];

const FEATURES = [
  {
    n: "01", icon: "🌊", tag: "Sourced fresh",
    title: "Daily Catch",
    desc: "Every item sourced from local fisheries each morning. Nothing frozen, nothing compromised.",
    accent: "#0e7490",
  },
  {
    n: "02", icon: "🔥", tag: "Made to order",
    title: "Hot Off the Grill",
    desc: "Your order goes straight to the kitchen the moment it's placed. Cooked fresh every time.",
    accent: "#e05c2a",
  },
  {
    n: "03", icon: "⚡", tag: "No fuss pickup",
    title: "Quick & Easy",
    desc: "Order online, arrive, pick up. No queues, no delays — great seafood waiting for you.",
    accent: "#d97706",
  },
];

// Marquee items — repeated x2 for seamless loop
const TICKER = [
  "🦐 Fresh Daily Catch",
  "🔥 Made to Order",
  "🕐 Open Mon–Sun  11AM – 9PM",
  "📍 Pickup Only — No Delivery Fees",
  "🐟 Fish · Prawns · Calamari · Scallops",
  "🦑 Battered · Crumbed · Grilled",
  "🧺 Family Packs Available",
];

export default function Home() {
  const tickerStr = TICKER.join("   ·   ");

  return (
    <div className="flex flex-col" style={{ background: "#fdf9f4" }}>
      {/* Header is fixed on "/" — it overlays the hero */}
      <SiteHeader />

      {/* ── Full-viewport hero ──────────────────────────────────────── */}
      <HeroSlider />

      {/* ── Marquee info ticker ─────────────────────────────────────── */}
      <div style={{ background: "#0a161f", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          className="flex py-3 gap-0"
          style={{ animation: "marquee 28s linear infinite", whiteSpace: "nowrap" }}
        >
          {/* Two identical strips for seamless loop */}
          {[0, 1].map((i) => (
            <span
              key={i}
              className="shrink-0 pr-16 text-[11px] font-bold tracking-widest uppercase"
              style={{ color: "rgba(245,158,11,0.75)" }}
            >
              {tickerStr}
            </span>
          ))}
        </div>
      </div>

      {/* ── Feature cards — dark section ────────────────────────────── */}
      <section style={{ background: "#0d1f2d" }}>
        <div className="max-w-5xl mx-auto px-5 py-16">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(245,158,11,0.6)" }}>
              Why Salty&apos;s
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The seafood you deserve
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.n}
                className="relative rounded-2xl p-6 flex flex-col gap-5 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Ghost number */}
                <span
                  className="absolute top-3 right-4 font-extrabold leading-none select-none pointer-events-none"
                  style={{ fontSize: 72, color: "rgba(255,255,255,0.035)" }}
                >
                  {f.n}
                </span>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: f.accent + "22" }}
                >
                  {f.icon}
                </div>
                <div style={{ borderLeft: `3px solid ${f.accent}`, paddingLeft: 14 }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: f.accent }}>
                    {f.tag}
                  </p>
                  <h3 className="font-extrabold text-white text-base mb-2">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 py-16">
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: "#e05c2a" }}>
            What are you craving?
          </p>
          <div className="flex items-end gap-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Browse the Menu
            </h2>
            <div className="flex-1 h-px mb-1.5" style={{ background: "#f0e8dc" }} />
            <Link href="/menu" className="text-sm font-bold shrink-0 mb-1" style={{ color: "#e05c2a" }}>
              View all →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BROWSE_CATS.map((cat) => (
            <Link
              key={cat.key}
              href="/menu"
              className="relative group rounded-2xl overflow-hidden block"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover hover-zoom"
              />
              {/* Colour gradient overlay — stronger at bottom */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to top, ${cat.color}f0 0%, ${cat.color}60 40%, ${cat.color}18 100%)`,
                }}
              />
              {/* Hover brighten */}
              <div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-2xl mb-1 drop-shadow">{cat.icon}</div>
                <p className="text-white font-extrabold text-sm leading-snug drop-shadow-sm">
                  {cat.label}
                </p>
              </div>
              {/* Arrow on hover */}
              <div
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
              >
                →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── From our kitchen — asymmetric gallery ───────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="flex items-end gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">From Our Kitchen</h2>
          <div className="flex-1 h-px mb-1.5" style={{ background: "#f0e8dc" }} />
          <Link href="/menu" className="text-sm font-bold shrink-0 mb-1" style={{ color: "#e05c2a" }}>
            Full menu →
          </Link>
        </div>

        {/* Mosaic: 7+5 columns */}
        <div className="grid grid-cols-12 gap-3" style={{ height: 380 }}>
          {/* Large image — left */}
          <Link href="/menu" className="col-span-7 relative rounded-2xl overflow-hidden group">
            <img
              src="/images/babs-gorniak-rdVrvLOO9Ag-unsplash.jpg"
              alt="Prawn selection"
              className="w-full h-full object-cover hover-zoom"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,12,20,0.75) 0%, transparent 55%)" }} />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Pick n Go</p>
              <p className="text-white font-extrabold text-lg">Prawn Selection</p>
            </div>
          </Link>

          {/* Right column — 2 stacked */}
          <div className="col-span-5 flex flex-col gap-3">
            <Link href="/menu" className="relative flex-1 rounded-2xl overflow-hidden group">
              <img
                src="/images/solo-seafood-quC9dMtGVic-unsplash.jpg"
                alt="Fish"
                className="w-full h-full object-cover hover-zoom"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,12,20,0.7) 0%, transparent 60%)" }} />
              <div className="absolute bottom-3 left-4">
                <p className="text-white font-bold text-sm">Fish Selection</p>
              </div>
            </Link>
            <Link href="/menu" className="relative flex-1 rounded-2xl overflow-hidden group">
              <img
                src="/images/durenne-loris-aEHCeaGSgKA-unsplash.jpg"
                alt="Daily specials"
                className="w-full h-full object-cover hover-zoom"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,12,20,0.7) 0%, transparent 60%)" }} />
              <div className="absolute bottom-3 left-4">
                <p className="text-white font-bold text-sm">Daily Specials</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Hours + location strip ───────────────────────────────────── */}
      <section style={{ background: "#0d1f2d" }}>
        <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {[
            { icon: "🕐", label: "Hours",    value: "Mon – Sun · 11:00 AM – 9:00 PM"  },
            { icon: "📍", label: "Service",  value: "Pickup Only — No Delivery"        },
            { icon: "📞", label: "Call Us",  value: "+61 404 435 971"                 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(245,158,11,0.1)" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">{item.label}</p>
                <p className="text-white font-semibold text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner with food image ───────────────────────────────── */}
      <section className="px-5 py-16">
        <div
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
          style={{ minHeight: 280 }}
        >
          {/* Background food image */}
          <img
            src="/images/mia-de-jesus-Oge2GRp4etE-unsplash.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(105deg, rgba(5,12,20,0.94) 35%, rgba(5,12,20,0.65) 70%, rgba(5,12,20,0.35) 100%)" }}
          />
          {/* Coral glow */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "#e05c2a", filter: "blur(80px)", opacity: 0.18 }}
          />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 p-8 sm:p-12">
            <div>
              <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                Ready when you are
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
                Hungry?<br />Let&apos;s go.
              </h2>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Browse the full menu and place your order in under a minute.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <Link
                href="/menu"
                className="font-bold text-white px-10 py-4 rounded-2xl text-sm transition hover:opacity-90"
                style={{
                  background: "#e05c2a",
                  boxShadow: "0 6px 28px rgba(224,92,42,0.5)",
                }}
              >
                Order Now →
              </Link>
              <p className="text-white/25 text-xs">Mon–Sun · 11AM–9PM · Pickup only</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
