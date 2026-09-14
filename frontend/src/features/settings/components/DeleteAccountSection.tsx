import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Dialog } from "../../../shared/ui/Dialog";

export function DeleteAccountSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="grid bg-red-900/10  gap-8 p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                <div>
                    <h2 className="text-base font-semibold text-danger">
                        Delete account
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Permanently remove your account and all associated data.
                    </p>
                </div>

                <div className="flex max-w-2xl items-start justify-between gap-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                        This action cannot be undone. Your profile, projects, and
                        reviews will be permanently deleted.
                    </p>
                    <Button
                        type="button"
                        variant="danger"
                        className="shrink-0"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Delete account
                    </Button>
                </div>
            </div>

            <Dialog
                isOpen={isModalOpen}
                title="Delete account?"
                variant="danger"
                confirmLabel="Delete account"
                onCancel={() => setIsModalOpen(false)}
                onConfirm={() => setIsModalOpen(false)}
                description={
                    <>
                        Deleting your account is permanent. All of your profile
                        information, projects, and reviews will be removed.
                    </>
                }
            />
        </>
    );
}
