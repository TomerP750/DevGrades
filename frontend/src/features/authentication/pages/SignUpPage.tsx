import { AtSign, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { AuthShell } from "../components/AuthShell";
import type { SignUpRequestDto } from "../models/SignUpRequestDto";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

type SignUpFormValues = SignUpRequestDto & {
    acceptTerms: boolean;
};

export default function SignUpPage() {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<SignUpFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    });

    const { signUp: authSignUp } = useAuth();
    const navigate = useNavigate();

    const { mutate: signUpUser, isPending } = useMutation({
        mutationFn: (data: SignUpRequestDto) => authSignUp(data),
        onSuccess: () => {
            toast.success("Signed up successfully.");
            navigate("/feed");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSignUp = (data: SignUpRequestDto) => {
        signUpUser(data);
    }

    return (
        <AuthShell
            eyebrow="Join the community"
            footer={
                <p>
                    Already have an account?{" "}
                    <Link
                        to="/sign-in"
                        className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            <form
                onSubmit={handleSubmit(handleSignUp)}
                className="space-y-5"
                noValidate
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                        label="First name"
                        autoComplete="given-name"
                        placeholder="First name"
                        leadingIcon={<UserRound className="size-[1.125rem]" />}
                        error={errors.firstName?.message}
                        {...register("firstName", {
                            required: "First name is required.",
                        })}
                        required
                    />
                    <Input
                        label="Last name"
                        autoComplete="family-name"
                        placeholder="Last name"
                        error={errors.lastName?.message}
                        {...register("lastName", {
                            required: "Last name is required.",
                        })}
                        required
                    />
                </div>

                <Input
                    label="Username"
                    autoComplete="username"
                    placeholder="Username"
                    hint="This is how other developers will see you."
                    leadingIcon={<AtSign className="size-[1.125rem]" />}
                    error={errors.username?.message}
                    {...register("username", {
                        required: "Username is required.",
                        minLength: {
                            value: 3,
                            message: "Username must be at least 3 characters.",
                        },
                    })}
                    required
                />

                <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
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

                <div className="grid gap-5">
                    <Input
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        leadingIcon={<LockKeyhole className="size-[1.125rem]" />}
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters.",
                            },
                        })}
                        required
                    />
                    <Input
                        label="Confirm password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                            required: "Please confirm your password.",
                            validate: (value) =>
                                value === getValues("password") || "Passwords do not match.",
                        })}
                        required
                    />
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <input
                        type="checkbox"
                        {...register("acceptTerms", {
                            required: "You must accept the terms to continue.",
                        })}
                        aria-invalid={Boolean(errors.acceptTerms)}
                        aria-describedby={
                            errors.acceptTerms ? "accept-terms-error" : undefined
                        }
                        className="mt-1 size-4 shrink-0 rounded border-input accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    />
                    <span>
                        I agree to the{" "}
                        <a
                            href="#terms"
                            className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
                        >
                            Terms
                        </a>{" "}
                        and{" "}
                        <a
                            href="#privacy"
                            className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
                        >
                            Privacy Policy
                        </a>
                        .
                    </span>
                </label>
                {errors.acceptTerms && (
                    <p
                        id="accept-terms-error"
                        role="alert"
                        className="-mt-3 text-xs font-medium text-danger"
                    >
                        {errors.acceptTerms.message}
                    </p>
                )}

                <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    isLoading={isPending}>
                    Create account
                </Button>
            </form>
        </AuthShell>
    );
}
