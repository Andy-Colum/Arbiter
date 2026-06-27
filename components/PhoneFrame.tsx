export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[640px] w-[320px] rounded-[44px] border-[8px] border-[#1b2236] bg-black shadow-2xl shadow-black/50">
      {/* notch */}
      <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#1b2236]" />
      {/* screen */}
      <div className="absolute inset-0 overflow-hidden rounded-[36px] bg-[#0c1322]">
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
