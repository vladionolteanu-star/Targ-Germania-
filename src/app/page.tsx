import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 lg:px-12 flex flex-col justify-between bg-background">
      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center">
        <h1 className="font-display text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tighter uppercase text-white/90">
          EuroShop <br />
          <span className="text-accent ml-[8vw]">2026.</span>
        </h1>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-5 md:col-start-2">
            <p className="font-sans text-lg lg:text-xl text-white/70 text-balance leading-relaxed">
              Organizează și categorizează pozele din târgul EuroShop.
              Trage imaginile din Google Drive în categorii personalizate,
              colaborează cu echipa în timp real.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex gap-4 flex-wrap">
            <Link
              href="/categories"
              className="group inline-flex items-center gap-4 bg-accent text-background px-8 py-5 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors duration-300"
            >
              Categorii & Poze
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/observations"
              className="group inline-flex items-center gap-4 bg-surface border border-white/10 text-white/80 px-8 py-5 uppercase tracking-widest text-sm font-bold hover:border-accent hover:text-accent transition-colors duration-300"
            >
              Observații
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/50 font-sans text-sm">
        <div className="border-l border-accent pl-6">
          <h3 className="text-white/80 uppercase tracking-widest text-xs mb-2 font-bold">Drag & Drop</h3>
          <p>Trage poze direct din Google Drive în categorii personalizate</p>
        </div>
        <div className="border-l border-white/20 pl-6">
          <h3 className="text-white/80 uppercase tracking-widest text-xs mb-2 font-bold">Colaborare Live</h3>
          <p>Modificările se sincronizează instant pentru toată echipa</p>
        </div>
        <div className="border-l border-white/20 pl-6">
          <h3 className="text-white/80 uppercase tracking-widest text-xs mb-2 font-bold">Use Cases Mobexpert</h3>
          <p>Documentează observații și posibile aplicații pentru Mobexpert</p>
        </div>
      </section>
    </main>
  );
}
