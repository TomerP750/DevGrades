import { LogOut } from "lucide-react";
import { Button } from "../../../shared/ui/Button";


export function SignOutSection() {
    return (
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
            <div>
                <div className="mb-3 grid size-10 place-items-center rounded-lg border border-border text-primary">
                    <LogOut aria-hidden="true" className="size-5" />
                </div>
                <h2 className="text-base font-semibold text-card-foreground">
                    Sign out from all devices
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    You will be signed out on this device and everywhere else
                    you are currently signed in.
                </p>
            </div>

            <div className="flex max-w-2xl items-end justify-end">
                <Button
                    type="button"
                    variant="danger"
                    className="h-fit w-fit shrink-0"
                    leftIcon={<LogOut className="size-4" />}
                >
                    Sign out all devices
                </Button>
            </div>
        </div>
    );
}