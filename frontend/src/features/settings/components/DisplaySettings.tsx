import { Languages, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { Button } from "../../../shared/ui/Button";

export function DisplaySettings() {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState<"en" | "he">("en");

    return (
        <section className="py-8">
            <div className="mb-8">
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Display settings
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Personalize how DevGrades looks and which language it uses.
                </p>
            </div>

            <div className="border-y border-border">
                <fieldset className="grid gap-8 border-b border-border p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                    <div>
                        <legend className="text-base font-semibold text-card-foreground">
                            Theme
                        </legend>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Choose the appearance that is most comfortable for you.
                        </p>
                    </div>

                    <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
                        <Button
                            type="button"
                            variant="unstyled"
                            aria-pressed={theme === "light"}
                            onClick={() => setTheme("light")}
                            icon={
                                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-white text-zinc-700">
                                    <Sun className="size-5" />
                                </span>
                            }
                            className={`group flex min-h-24 items-center gap-4 border px-5 py-4 text-left transition after:ml-auto after:size-3 after:shrink-0 after:rounded-full after:border hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                                theme === "light"
                                    ? "border-primary ring-1 ring-primary after:border-primary after:bg-primary"
                                    : "border-border after:border-input"
                            }`}
                        >
                                <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                        Light
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                        Bright and clear
                                    </span>
                                </span>
                        </Button>

                        <Button
                            type="button"
                            variant="unstyled"
                            aria-pressed={theme === "dark"}
                            onClick={() => setTheme("dark")}
                            icon={
                                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-100">
                                    <Moon className="size-5" />
                                </span>
                            }
                            className={`group flex min-h-24 items-center gap-4 border px-5 py-4 text-left transition after:ml-auto after:size-3 after:shrink-0 after:rounded-full after:border hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                                theme === "dark"
                                    ? "border-primary ring-1 ring-primary after:border-primary after:bg-primary"
                                    : "border-border after:border-input"
                            }`}
                        >
                                <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                        Dark
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                        Easy on the eyes
                                    </span>
                                </span>
                        </Button>
                    </div>
                </fieldset>

                <fieldset className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                    <div>
                        <legend className="text-base font-semibold text-card-foreground">
                            Language
                        </legend>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Select the language used for navigation, labels, and messages.
                        </p>
                    </div>

                    <div className="max-w-2xl divide-y divide-border border-y border-border">
                        <Button
                            type="button"
                            variant="unstyled"
                            aria-pressed={language === "en"}
                            onClick={() => setLanguage("en")}
                            className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            icon={
                                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground">
                                    <Languages className="size-5" />
                                </span>
                            }
                        >
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-foreground">
                                    English
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                    English
                                </span>
                            </span>
                            <span
                                aria-hidden="true"
                                className={`size-4 rounded-full border ${
                                    language === "en"
                                        ? "border-4 border-primary"
                                        : "border-input"
                                }`}
                            />
                        </Button>

                        <Button
                            type="button"
                            variant="unstyled"
                            aria-pressed={language === "he"}
                            onClick={() => setLanguage("he")}
                            className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            icon={
                                <span
                                    lang="he"
                                    dir="rtl"
                                    className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-sm font-bold text-muted-foreground"
                                >
                                    עב
                                </span>
                            }
                        >
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-foreground">
                                    Hebrew
                                </span>
                                <span
                                    lang="he"
                                    dir="rtl"
                                    className="mt-0.5 block w-fit text-xs text-muted-foreground"
                                >
                                    עברית
                                </span>
                            </span>
                            <span
                                aria-hidden="true"
                                className={`size-4 rounded-full border ${
                                    language === "he"
                                        ? "border-4 border-primary"
                                        : "border-input"
                                }`}
                            />
                        </Button>
                    </div>
                </fieldset>
            </div>
        </section>
    );
}