import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0a1929" }} className="mt-auto">

      {/* Main grid */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">🐟</span>
              <div>
                <div className="text-white font-extrabold text-base tracking-wide uppercase">
                  Salty&apos;s
                </div>
                <div
                  className="text-[10px] font-bold tracking-[0.18em] uppercase -mt-0.5"
                  style={{ color: "#f59e0b99" }}
                >
                  Seafood &amp; Takeaway
                </div>
              </div>
            </div>
            <p className="text-white/35 text-xs leading-relaxed max-w-[200px]">
              Fresh catches, served hot.<br />
              Pickup only — no delivery fees,<br />
              no hidden charges.
            </p>
          </div>

          {/* Order */}
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
              Order
            </p>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-white/50 hover:text-amber-400 text-sm transition">Home</Link></li>
              <li><Link href="/menu" className="text-white/50 hover:text-amber-400 text-sm transition">Menu</Link></li>
              <li><Link href="/cart" className="text-white/50 hover:text-amber-400 text-sm transition">Cart</Link></li>
              <li><Link href="/checkout" className="text-white/50 hover:text-amber-400 text-sm transition">Checkout</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
              Information
            </p>
            <ul className="space-y-2.5">
              <li><Link href="/terms" className="text-white/50 hover:text-amber-400 text-sm transition">Terms &amp; Conditions</Link></li>
              <li><Link href="/terms#privacy" className="text-white/50 hover:text-amber-400 text-sm transition">Privacy Policy</Link></li>
              <li><Link href="/terms#refunds" className="text-white/50 hover:text-amber-400 text-sm transition">Refund Policy</Link></li>
              <li><Link href="/terms#allergens" className="text-white/50 hover:text-amber-400 text-sm transition">Allergen Info</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="text-white/30 text-xs leading-relaxed">
                📍 107 Heeney St<br />
                Chinchilla QLD 4413<br />
                Australia
              </li>
              <li className="hover:text-amber-400 transition text-white/50">
                <a href="tel:+61404435971">+61 404 435 971</a>
              </li>
              <li className="hover:text-amber-400 transition text-white/50 break-all">
                <a href="mailto:saltyschinchillaqld@gmail.com">saltyschinchillaqld@gmail.com</a>
              </li>
              <li className="hover:text-amber-400 transition text-white/50 break-all">
                <a href="mailto:help@saltysseafood.com">help@saltysseafood.com</a>
              </li>
              <li className="text-white/30 text-xs mt-2 leading-relaxed">
                Mon – Sun<br />
                11:00 AM – 9:00 PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © {year} Salty&apos;s Seafood &amp; Takeaway · All rights reserved
          </p>
          <Link
            href="/admin"
            className="text-white/20 hover:text-amber-400 text-xs transition border border-white/10 hover:border-amber-400/30 rounded-lg px-3 py-1.5"
          >
            Staff Login →
          </Link>
        </div>
      </div>
    </footer>
  );
}
