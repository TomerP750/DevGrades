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
        <Input
            {...props}
            type="search"
            leadingIcon={<Icon size={16} />}
            className={`appearance-none ${className}`.trim()}
            placeholder={placeholder}
            onChange={handleChange}
        />
    );
}
