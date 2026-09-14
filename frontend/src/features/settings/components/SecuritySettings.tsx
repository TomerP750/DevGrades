import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import userService from "../api/userService";
import type { ChangePasswordDto } from "../models/ChangePasswordDto";
import { SignOutSection } from "./SignOutSection";

export function SecuritySettings() {

    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordDto>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const { mutate: changePassword } = useMutation({
        mutationFn: (dto: ChangePasswordDto) => userService.changePassword(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleChangePassword = (dto: ChangePasswordDto) => {
        changePassword(dto);
    };

    return (
        <section className="py-8">
            <div className="mb-8">
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Security settings
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Protect your account by keeping your password secure and up to date.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleChangePassword)}
                noValidate
            >
                <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                    <div>
                        <div className="mb-3 grid size-10 place-items-center rounded-lg border border-border text-primary">
                            <ShieldCheck aria-hidden="true" className="size-5" />
                        </div>
                        <h2 className="text-base font-semibold text-card-foreground">
                            Change password
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Choose a unique password that you do not use for another
                            account.
                        </p>
                    </div>

                    <div className="grid max-w-2xl gap-5">
                        <Input
                            label="Current password"
                            type="password"
                            placeholder="Enter your current password"
                            autoComplete="current-password"
                            leadingIcon={<KeyRound className="size-[1.125rem]" />}
                            error={errors.currentPassword?.message}
                            {...register("currentPassword", {
                                required: "Current password is required.",
                            })}
                            required
                        />

                        <div>
                            <Input
                                label="New password"
                                type="password"
                                placeholder="Enter a new password"
                                autoComplete="new-password"
                                leadingIcon={<LockKeyhole className="size-[1.125rem]" />}
                                error={errors.newPassword?.message}
                                {...register("newPassword", {
                                    required: "New password is required.",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters.",
                                    },
                                    validate: (value) =>
                                        value !== getValues("currentPassword") ||
                                        "New password must be different from your current password.",
                                })}
                                required
                            />
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                Use at least 8 characters and avoid common words or personal
                                information.
                            </p>
                        </div>

                        <Input
                            label="Confirm new password"
                            type="password"
                            placeholder="Repeat your new password"
                            autoComplete="new-password"
                            error={errors.confirmNewPassword?.message}
                            {...register("confirmNewPassword", {
                                required: "Please confirm your new password.",
                                validate: (value) =>
                                    value === getValues("newPassword") ||
                                    "Passwords do not match.",
                            })}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-8 px-5 py-5 sm:px-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                    <div aria-hidden="true" />
                    <div className="flex max-w-2xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button type="button" variant="ghost" onClick={() => reset()}>
                            Cancel
                        </Button>
                        <Button type="submit">Update password</Button>
                    </div>
                </div>
            </form>

            <hr className="my-4 h-px border-0 bg-border" />

            <SignOutSection />
        </section>
    );
}