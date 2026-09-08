import debounce from "lodash/debounce";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface SearchInputProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    delay?: number;
    label?: string;
    className?: string;
}

export function SearchInput({
    onSearch,
    placeholder = "Search",
    delay = 300,
    label = "Search",
    className = "",
}: SearchInputProps) {
    const [value, setValue] = useState("");
    const debouncedSearch = useMemo(
        () => debounce(onSearch, delay),
        [delay, onSearch],
    );

    useEffect(
        () => () => {
            debouncedSearch.cancel();
        },
        [debouncedSearch],
    );

    return (
        <label className={`relative block min-w-0 ${className}`}>
            <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <span className="sr-only">{label}</span>
            <input
                type="search"
                value={value}
                onChange={(event) => {
                    const nextValue = event.target.value;
                    setValue(nextValue);
                    debouncedSearch(nextValue);
                }}
                placeholder={placeholder}
                className="h-10 w-full border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
        </label>
    );
}
