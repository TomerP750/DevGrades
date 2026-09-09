import { LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { AuthShell } from "../components/AuthShell";
import type { SignInDto } from "../models/SignInRequestDto";



export default function SignInPage() {

    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<SignInDto>({
        defaultValues: { email: "", password: "" },
    });

    const handleSignIn = (data: SignInDto) => {
        console.log(data);
    }

    return (
        <AuthShell
            eyebrow="Welcome back"
            footer={
                <p>
                    New to DevGrades?{" "}
                    <Link
                        to="/sign-up"
                        className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                        Create an account
                    </Link>
                </p>
            }
        >
            <form
                onSubmit={handleSubmit(handleSignIn)}
                className="space-y-5"
                noValidate
            >
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

                <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    leadingIcon={<LockKeyhole className="size-[1.125rem]" />}
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Password is required.",
                    })}
                    required
                />

                <div className="flex items-center justify-between gap-4">
                    <a
                        href="#forgot-password"
                        className="rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                        Forgot password?
                    </a>
                </div>

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    Sign in
                </Button>
            </form>
        </AuthShell>
    );
}
