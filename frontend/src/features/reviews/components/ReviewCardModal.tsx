import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { Modal } from "../../../shared/ui/Modal";
import { TextArea } from "../../../shared/ui/TextArea";
import type { CreateReviewDto } from "../models/CreateReviewDto";

interface ReviewCardModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
}

const defaultValues: CreateReviewDto = {
    overallScore: 0,
    codeQualityScore: 0,
    optimizationScore: 0,
    maintainabilityScore: 0,
    scalabilityScore: 0,
    uiuxScore: 0,
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

export function ReviewCardModal({ open, onClose, projectId }: ReviewCardModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateReviewDto>({ defaultValues });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreateReview = (review: CreateReviewDto) => {
        console.log(review);
        handleClose();
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
                        icon={<Send className="size-4" />}
                        isLoading={isSubmitting}
                    >
                        Submit review
                    </Button>
                </div>
            </form>
        </Modal>
    );
}