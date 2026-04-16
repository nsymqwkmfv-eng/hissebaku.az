import Image from "next/image";

export function OrderRequestSection() {
  return (
    <section className="dashboard-reveal relative isolate overflow-hidden rounded-[28px] bg-[radial-gradient(110%_80%_at_0%_0%,#ffffff_0%,#f4f5f6_58%,#eff1f3_100%)] px-6 pb-3 pt-6 md:px-8 md:pb-4 md:pt-8 lg:px-8 lg:pb-3 lg:pt-8">
      <div className="pointer-events-none absolute -left-24 top-12 h-44 w-44 rounded-full bg-[#d51414]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-36 w-36 rounded-full bg-black/10 blur-3xl" />

      <div className="relative grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(350px,392px)] lg:items-start">
        <div className="order-content-enter">
          <h2 className="max-w-[14ch] text-[2.2rem] font-semibold leading-[1.05] text-zinc-900 md:text-5xl">
            Ehtiyat hissələri sifariş edin
            <span className="text-[#d51414]">.</span>
          </h2>

          <div className="mt-5 space-y-3 text-zinc-700 md:mt-6">
            <p className="order-content-enter flex gap-3 text-base leading-6 md:text-lg md:leading-7" style={{ animationDelay: "80ms" }}>
              <span className="mt-1 inline-flex size-4 items-center justify-center rounded-full bg-[#d51414]/10 text-[#d51414]">*</span>
              <span>
                <strong>Orijinal və keyfiyyətli ehtiyat hissələri</strong>
                <br />
                Avtomobiliniz üçün ən yaxşı detalları sifariş edin.
              </span>
            </p>
            <p className="order-content-enter flex gap-3 text-base leading-6 md:text-lg md:leading-7" style={{ animationDelay: "140ms" }}>
              <span className="mt-1 inline-flex size-4 items-center justify-center rounded-full bg-[#d51414]/10 text-[#d51414]">*</span>
              <span>
                <strong>Sürətli və etibarlı çatdırılma</strong>
                <br />
                Rahat və problemsiz alış təcrübəsi yaşayın.
              </span>
            </p>
          </div>

          <div className="order-content-enter relative mt-5 aspect-[16/9] w-full max-w-[700px]" style={{ animationDelay: "200ms" }}>
            <Image
              src="https://framerusercontent.com/images/gur7vrLpkSlK8TmOkQpxTqlyl0.png"
              alt="Sifariş bölməsi üçün avtomobil vizualı"
              fill
              className="order-car-float object-contain object-center md:object-left"
              sizes="(max-width: 1024px) 100vw, 700px"
            />
          </div>
        </div>

        <form className="order-form-glow order-content-enter w-full max-w-none rounded-3xl bg-[#050507] p-4 text-white shadow-[0_30px_70px_rgba(2,6,23,0.4)] md:max-w-[392px] md:p-6 lg:ml-auto" style={{ animationDelay: "120ms" }}>
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-400">Ad və Soyad</span>
              <input
                type="text"
                placeholder="Ad Soyad"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-base text-white placeholder:text-zinc-500 outline-none transition duration-300 hover:border-zinc-700 focus:border-[#d51414] focus:shadow-[0_0_0_3px_rgba(213,20,20,0.22)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-zinc-400">Əlaqə nömrəsi</span>
              <input
                type="tel"
                placeholder="+994 55 111 22 22"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-base text-white placeholder:text-zinc-500 outline-none transition duration-300 hover:border-zinc-700 focus:border-[#d51414] focus:shadow-[0_0_0_3px_rgba(213,20,20,0.22)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-zinc-400">Avtomobil markası</span>
              <input
                type="text"
                placeholder="Mercedes-Benz"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-base text-white placeholder:text-zinc-500 outline-none transition duration-300 hover:border-zinc-700 focus:border-[#d51414] focus:shadow-[0_0_0_3px_rgba(213,20,20,0.22)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-zinc-400">Ehtiyat hissəsinin adı</span>
              <input
                type="text"
                placeholder="Məsələn, Ön fara, Yağ filtri"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-base text-white placeholder:text-zinc-500 outline-none transition duration-300 hover:border-zinc-700 focus:border-[#d51414] focus:shadow-[0_0_0_3px_rgba(213,20,20,0.22)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-zinc-400">Ban nömrəsi (VIN kodu)</span>
              <input
                type="text"
                placeholder="VIN Kodu"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-base text-white placeholder:text-zinc-500 outline-none transition duration-300 hover:border-zinc-700 focus:border-[#d51414] focus:shadow-[0_0_0_3px_rgba(213,20,20,0.22)]"
              />
            </label>
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              defaultChecked
              className="size-4 rounded border-zinc-700 bg-zinc-900 accent-[#d51414]"
            />
            Məlumatlarımın doğruluğunu təsdiq edirəm
          </label>

          <a
            href="tel:+994503919290"
            className="group relative mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#e11212] px-4 py-3 text-base font-semibold leading-none text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#c40f0f] hover:shadow-[0_14px_26px_rgba(225,18,18,0.35)]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.24),transparent)] transition duration-700 group-hover:translate-x-full" />
            Sifarişi Göndər
          </a>
        </form>
      </div>
    </section>
  );
}
