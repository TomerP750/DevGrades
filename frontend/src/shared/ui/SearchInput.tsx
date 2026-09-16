import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Input, type InputProps } from "./Input";
import { debounce } from "lodash";

export type SearchInputProps = Omit<InputProps, "type"> & {
    onAfterSearch?: (searchValue: string) => void;
    icon?: LucideIcon;
};

export function SearchInput({
    onAfterSearch,
    icon: Icon = Search,
    className = "",
    placeholder = "Search...",
    onChange,
    ...props
}: SearchInputProps) {
    
    const onAfterSearchRef = useRef(onAfterSearch);

    useEffect(() => {
        onAfterSearchRef.current = onAfterSearch;
    }, [onAfterSearch]);

    const debouncedAfterSearch = useMemo(
        () => debounce((searchValue: string) => onAfterSearchRef.current?.(searchValue), 1000),
        [],
    );

    useEffect(() => {
        return () => debouncedAfterSearch.cancel();
    }, [debouncedAfterSearch]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        debouncedAfterSearch(event.target.value);
    };

    return (
        <div className="relative w-full">
            <Icon
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
            <Input
                type="search"
                className={`pl-9 appearance-none ${className}`.trim()}
                placeholder={placeholder}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
}
