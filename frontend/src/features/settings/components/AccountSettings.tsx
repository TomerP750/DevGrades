import { AtSign, Camera, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import type { UpdateUserDto } from "../models/UpdateUserDto";
import userService from "../api/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AccountSettings() {

    const queryClient = useQueryClient();
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserDto>({
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            avatarUrl: "",
            theme: "",
        },
    });

    const { mutate: updateUser } = useMutation({
        mutationFn: (dto: UpdateUserDto) => userService.updateUser(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleUpdateUser = (dto: UpdateUserDto) => {
        updateUser(dto);
    };

    return (
        <section className="py-8">
            <div className="mb-8">
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Account settings
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Manage the personal details shown on your DevGrades profile.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleUpdateUser)}
                className="border-y border-border"
                noValidate
            >
                <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                    <div>
                        <h2 className="text-base font-semibold text-card-foreground">
                            Profile photo
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            This image appears next to your projects and activity.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="relative grid size-24 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground">
                            <UserRound aria-hidden="true" className="size-10" />
                            <span className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm">
                                <Camera aria-hidden="true" className="size-4" />
                            </span>
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-3">
                                <Button type="button" variant="outline">
                                    Upload new photo
                                </Button>
                                <Button type="button" variant="ghost">
                                    Remove
                                </Button>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                JPG, PNG or WebP. Maximum file size 2 MB.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                    <div>
                        <h2 className="text-base font-semibold text-card-foreground">
                            Personal information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Keep your public identity and contact details up to date.
                        </p>
                    </div>

                    <div className="grid max-w-2xl gap-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Input
                                label="First name"
                                placeholder="Enter your first name"
                                autoComplete="given-name"
                                leadingIcon={<UserRound className="size-[1.125rem]" />}
                                error={errors.firstName?.message}
                                {...register("firstName", {
                                    required: "First name is required.",
                                })}
                                required
                            />
                            <Input
                                label="Last name"
                                placeholder="Enter your last name"
                                autoComplete="family-name"
                                error={errors.lastName?.message}
                                {...register("lastName", {
                                    required: "Last name is required.",
                                })}
                                required
                            />
                        </div>

                        <Input
                            label="Username"
                            placeholder="your-username"
                            autoComplete="username"
                            leadingIcon={<AtSign className="size-[1.125rem]" />}
                            error={errors.username?.message}
                            {...register("username", {
                                required: "Username is required.",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters.",
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9_-]+$/,
                                    message: "Use only letters, numbers, hyphens, and underscores.",
                                },
                            })}
                            required
                        />

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            leadingIcon={<Mail className="size-[1.125rem]" />}
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email address is required.",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address.",
                                },
                            })}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-7">
                    <Button type="button" variant="ghost" onClick={() => reset()}>
                        Cancel
                    </Button>
                    <Button type="submit">Save changes</Button>
                </div>
            </form>
        </section>
    );
}