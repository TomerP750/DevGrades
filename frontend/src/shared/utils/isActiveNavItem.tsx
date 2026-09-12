

export const getActiveNavItemClasses = ({ isActive }: { isActive: boolean }) => [
    "focus:outline-none! focus:ring-0! relative inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:text-white",
    isActive
        ? "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary after:content-[''] dark:text-white"
        : "text-zinc-500 dark:text-zinc-400",
].filter(Boolean).join(" ");
