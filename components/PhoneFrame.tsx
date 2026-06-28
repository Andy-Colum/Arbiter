export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[600px] w-[300px] rounded-[40px] border-[8px] border-[#1b1b20] bg-black shadow-2xl shadow-black/60">
      {/* notch */}
      <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#1b1b20]" />
      {/* screen */}
      <div className="absolute inset-0 overflow-hidden rounded-[32px] bg-[#0c0c10]">
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
