export function EmptyEvents({
  message = "System Idle: No upcoming events scheduled",
}: {
  message?: string;
} = {}) {
  return (
    <div className="flex items-center gap-4 p-6 border border-dashed border-[#168706]/30 rounded-tr-2xl rounded-bl-2xl bg-[#168706]/5">
      <div className="w-2 h-2 rounded-full bg-[#168706] animate-pulse" />
      <p className="text-xs font-mono text-[#082F02]/60 uppercase tracking-widest">
         {message}
      </p>
    </div>
  );
}