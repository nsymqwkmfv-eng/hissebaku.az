import { ShieldCheck, PhoneCall, Truck } from "lucide-react";

export function ServiceHighlights() {
  return (
    <section className="dashboard-reveal mt-0 mb-0">
      <div className="w-full rounded-[24px] border border-zinc-200 bg-[#fafbfc] shadow-[0_16px_34px_rgba(15,23,42,0.06)] grid grid-cols-1 gap-3 py-4 md:grid-cols-3 md:divide-x md:divide-zinc-200">
        <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
          <ShieldCheck className="mb-1 size-6 text-[#d51414]" />
          <h3 className="text-base font-semibold text-zinc-900">100% Təhlükəsizlik</h3>
          <p className="mt-0.5 text-xs text-zinc-500">Yalnız Təhlükəsiz Ödənişlər</p>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
          <PhoneCall className="mb-1 size-6 text-[#d51414]" />
          <h3 className="text-base font-semibold text-zinc-900">24/7 Dəstək</h3>
          <p className="mt-0.5 text-xs text-zinc-500">İstənilən Vaxt Bizə Zəng Edin</p>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
          <Truck className="mb-1 size-6 text-[#d51414]" />
          <h3 className="text-base font-semibold text-zinc-900">Pulsuz Çatdırılma</h3>
          <p className="mt-0.5 text-xs text-zinc-500">150 AZN-dən Başlayan Sifarişlər Üçün</p>
        </div>
      </div>
    </section>
  );
}
