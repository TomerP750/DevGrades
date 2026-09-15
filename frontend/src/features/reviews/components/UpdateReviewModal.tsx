import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { Modal } from "../../../shared/ui/Modal";
import { TextArea } from "../../../shared/ui/TextArea";
import type { UpdateReviewDto } from "../models/UpdateReviewDto";
import type { ReviewDto } from "../models/ReviewDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../api/reviewService";
import { toast } from "react-toastify";

interface UpdateReviewModalProps {
    open: boolean;
    onClose: () => void;
    review: ReviewDto;
}

const scoreFields: Array<{
    name: keyof Omit<UpdateReviewDto, "comment">;
    label: string;
}> = [
        { name: "overallScore", label: "Overall score" },
        { name: "codeQualityScore", label: "Code quality" },
        { name: "optimizationScore", label: "Optimization" },
        { name: "maintainabilityScore", label: "Maintainability" },
        { name: "scalabilityScore", label: "Scalability" },
        { name: "uiuxScore", label: "UI/UX" },
    ];

export function UpdateReviewModal({ open, onClose, review, }: UpdateReviewModalProps) {
    
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateReviewDto>({
        defaultValues: {
            overallScore: review.overallScore,
            codeQualityScore: review.codeQualityScore,
            optimizationScore: review.optimizationScore,
            maintainabilityScore: review.maintainabilityScore,
            scalabilityScore: review.scalabilityScore,
            uiuxScore: review.uiuxScore,
            comment: review.comment,
        },
    });

    const { mutate: updateReview } = useMutation({
        mutationFn: (data: UpdateReviewDto) =>
            reviewService.updateReview(review.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            handleClose();
            toast.success("Review updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleUpdateReview = (data: UpdateReviewDto) => {
        updateReview(data);
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Update review"
            className="max-w-2xl rounded-xl"
        >
            <p className="mb-6 text-sm leading-6 text-muted-foreground">
                Update your scores and feedback for this project.
            </p>

            <form
                onSubmit={handleSubmit(handleUpdateReview)}
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
                        rightIcon={<Save className="size-4" />}
                        isLoading={isSubmitting}
                    >
                        Save changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
