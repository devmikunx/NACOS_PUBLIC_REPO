export function EventsHero() {
  return (
    <section className="relative w-full min-h-[45vh] flex items-end overflow-hidden bg-[#082F02] pt-24 md:pt-32">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#082F02] via-[#082F02]/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mb-12 md:mb-16 flex gap-8">
        {/* Vertical Accent */}
        <div className="hidden md:flex flex-col items-center gap-4">
          <span className="text-[10px] font-black text-[#168706] uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr]">
            Community
          </span>
          <div className="w-[1px] bg-gradient-to-b from-[#168706] to-transparent flex-1" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#168706] font-mono text-[10px] tracking-widest uppercase">
            <span className="opacity-50">Calendar</span>
            <span className="opacity-30">/</span>
            <span className="font-bold">All_Events</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight">
            Community <br />
            <span className="text-[#168706]">Events.</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-lg font-medium leading-relaxed">
            Every workshop, hackathon, and meetup happening in the NACOS
            FUNAAB community, all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}
