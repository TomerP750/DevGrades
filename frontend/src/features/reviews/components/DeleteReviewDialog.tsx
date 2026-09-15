import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "../../../shared/ui/Dialog";
import reviewService from "../api/reviewService";
import type { ReviewDto } from "../models/ReviewDto";
import { toast } from "react-toastify";

interface DeleteReviewDialogProps {
    open: boolean;
    onClose: () => void;
    review: ReviewDto;
}

export function DeleteReviewDialog({
    open,
    onClose,
    review,
}: DeleteReviewDialogProps) {
    const queryClient = useQueryClient();

    const { mutate: deleteReview, isPending } = useMutation({
        mutationFn: () => reviewService.deleteReview(review.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            onClose();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <Dialog
            isOpen={open}
            title="Delete this review?"
            description="This permanently deletes the review and its scores. This action cannot be undone."
            variant="danger"
            confirmLabel="Delete review"
            onCancel={onClose}
            onConfirm={() => deleteReview()}
            isConfirming={isPending}
        />
    );
}
