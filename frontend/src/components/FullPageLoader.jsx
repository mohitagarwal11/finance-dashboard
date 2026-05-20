function FullPageLoader({ label }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-(--bg) text-(--text)">
      <div className="flex items-center gap-3 rounded-(--r-lg) border border-(--border) bg-(--surface) px-5 py-3 shadow-sm">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-(--accent)" />
        <span className="text-sm font-semibold text-(--text-secondary)">
          {label}
        </span>
      </div>
    </div>
  );
}

export default FullPageLoader;
