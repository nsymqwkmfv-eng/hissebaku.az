export function SiteFooter() {
  return (
    <footer className="dashboard-reveal mt-0 w-full rounded-3xl border border-zinc-200 bg-white px-5 py-6 shadow-[0_16px_34px_rgba(15,23,42,0.06)] md:px-8 lg:px-12">
      <div className="grid gap-6 text-center md:grid-cols-[1.2fr_1fr_1fr] md:gap-x-4 md:gap-y-6 md:text-left items-start">
        <section className="flex flex-col justify-center items-center md:items-start">
          <p className="text-sm font-medium text-zinc-500 mb-1">Hissə Baku</p>
          <h2 className="max-w-[18ch] text-[1.6rem] font-semibold leading-tight text-zinc-900 md:text-[2.1rem]">
            Orijinal hissələr, sürətli çatdırılma, zəmanət
          </h2>
          <p className="mt-3 max-w-[34ch] text-sm leading-6 text-zinc-600">
            Hissə Baku-da etibarlı brendlər, peşəkar məsləhət və sürətli sifariş
            ilə avtomobiliniz üçün doğru hissəni tapın.
          </p>
          <a
            href="mailto:info@hissebaku.az"
            className="mt-3 text-sm font-medium text-zinc-700 transition hover:text-zinc-900"
          >
            info@hissebaku.az
          </a>
        </section>

        <section className="flex flex-col items-center md:items-end md:text-right md:justify-self-end">
          <h3 className="text-sm font-medium text-zinc-500 mb-1.5">Kataloq</h3>
          <ul className="flex flex-col gap-1.5 text-sm text-zinc-700 md:items-end">
            <li>
              <a href="/kataloq/yaglar" className="footer-link">Yağlar</a>
            </li>
            <li>
              <a href="/kataloq/eylec-sistemi" className="footer-link">Əyləc sistemi</a>
            </li>
            <li>
              <a href="/kataloq/filterler" className="footer-link">Filtrlər</a>
            </li>
            <li>
              <a href="/kataloq/motor-hisseleri" className="footer-link">Motor hissələri</a>
            </li>
          </ul>
        </section>

        <section className="flex flex-col items-center md:items-end md:text-right md:justify-self-end">
          <h3 className="text-sm font-medium text-zinc-500 mb-1.5">Brend xidməti</h3>
          <ul className="flex flex-col gap-1.5 text-sm text-zinc-700 md:items-end">
            <li>
              <a href="/xidmetler/chat-operator" className="footer-link">Çat və operator</a>
            </li>
            <li>
              <a href="/xidmetler/catdirilma-sertleri" className="footer-link">Çatdırılma şərtləri</a>
            </li>
            <li>
              <a href="/xidmetler/qaytarilma-siyaseti" className="footer-link">Qaytarılma siyasəti</a>
            </li>
            <li>
              <a href="/xidmetler/korporativ-satis" className="footer-link">Korporativ satış</a>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-zinc-200 pt-4 text-center md:flex-row md:items-center md:justify-between md:gap-0 md:text-left text-xs text-zinc-500">
        <p>© 2026 Hissə Baku. Bütün hüquqlar qorunur.</p>
        <p className="text-center md:text-right">
          Bakhishov Brands tərəfindən hazırlanıb.{' '}
          <a
            href="https://wa.me/bakhishov"
            target="_blank"
            rel="noreferrer"
            className="footer-link font-medium"
          >
            wa.me/bakhishov
          </a>
        </p>
      </div>
    </footer>
  );
}
