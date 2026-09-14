import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { Modal } from "../../../shared/ui/Modal";
import { TextArea } from "../../../shared/ui/TextArea";
import type { CreateReviewDto } from "../models/CreateReviewDto";
import reviewService from "../api/reviewService";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReviewCardModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
}

const defaultValues: CreateReviewDto = {
    overallScore: 1,
    codeQualityScore: 1,
    optimizationScore: 1,
    maintainabilityScore: 1,
    scalabilityScore: 1,
    uiuxScore: 1,
    comment: "",
};

const scoreFields: Array<{
    name: keyof Omit<CreateReviewDto, "comment">;
    label: string;
}> = [
        { name: "overallScore", label: "Overall score" },
        { name: "codeQualityScore", label: "Code quality" },
        { name: "optimizationScore", label: "Optimization" },
        { name: "maintainabilityScore", label: "Maintainability" },
        { name: "scalabilityScore", label: "Scalability" },
        { name: "uiuxScore", label: "UI/UX" },
    ];

export function CreateReviewModal({ open, onClose, projectId }: ReviewCardModalProps) {
    
    const queryClient = useQueryClient();
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateReviewDto>({ defaultValues });

    const { mutate: createReview, isPending } = useMutation({
        mutationFn: (review: CreateReviewDto) => reviewService.createReview(review),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", projectId] });
            toast.success("Review created successfully");
            handleClose();
        },
        onError: () => {
            toast.error("Failed to create review");
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreateReview = (review: CreateReviewDto) => {
        createReview(review);
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Write a review"
            className="max-w-2xl rounded-xl"
        >
            <p className="mb-6 text-sm leading-6 text-muted-foreground">
                Rate each area from 1 to 5 and share constructive feedback.
            </p>

            <form
                onSubmit={handleSubmit(handleCreateReview)}
                className="space-y-5"
                noValidate
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    {scoreFields.map(({ name, label }, index) => (
                        <Input
                            key={name}
                            label={label}
                            type="number"
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={1}
                            autoFocus={index === 0}
                            error={errors[name]?.message}
                            {...register(name, {
                                valueAsNumber: true,
                                required: `${label} is required.`,
                                min: {
                                    value: 1,
                                    message: "Score must be at least 1.",
                                },
                                max: {
                                    value: 5,
                                    message: "Score cannot exceed 5.",
                                },
                            })}
                            required
                        />
                    ))}
                </div>

                <TextArea
                    label="Comment"
                    rows={5}
                    placeholder="What was done well, and what could be improved?"
                    error={errors.comment?.message}
                    {...register("comment", {
                        required: "A comment is required.",
                        minLength: {
                            value: 10,
                            message: "Comment must be at least 10 characters.",
                        },
                        maxLength: {
                            value: 1000,
                            message: "Comment cannot exceed 1000 characters.",
                        },
                    })}
                    required
                />

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        rightIcon={<Send className="size-4" />}
                        isLoading={isPending}
                    >
                        Submit review
                    </Button>
                </div>
            </form>
        </Modal>
    );
}