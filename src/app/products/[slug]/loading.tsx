export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen">
      <main className="site-shell py-6 md:py-10">
        <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(24,24,27,0.08)] md:rounded-[28px] md:p-8">
          <div className="h-8 w-28 rounded-full bg-zinc-100" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-100 md:rounded-3xl" />
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="aspect-[4/3] rounded-2xl bg-zinc-100" />
                <div className="aspect-[4/3] rounded-2xl bg-zinc-100" />
                <div className="aspect-[4/3] rounded-2xl bg-zinc-100" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-7 w-3/4 rounded bg-zinc-100" />
                <div className="h-7 w-1/2 rounded bg-zinc-100" />
              </div>
              <div className="h-24 rounded-2xl bg-zinc-100" />
              <div className="h-36 rounded-3xl bg-zinc-100" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
