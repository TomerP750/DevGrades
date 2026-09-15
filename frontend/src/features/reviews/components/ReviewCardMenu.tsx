import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Menu } from "../../../shared/ui/Menu";
import type { ReviewDto } from "../models/ReviewDto";
import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { UpdateReviewModal } from "./UpdateReviewModal";
import { DeleteReviewDialog } from "./DeleteReviewDialog";

interface ReviewCardMenuProps {
    review: ReviewDto;
    isOwner: boolean;
}

export function ReviewCardMenu({ review, isOwner }: ReviewCardMenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    if (!isOwner) {
        return null;
    }

    return (
        <div className="relative flex justify-end">
            <Button
                type="button"
                variant="unstyled"
                onClick={() => setIsOpen((prev) => !prev)}
                title="Review actions"
                className="cursor-pointer transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                leftIcon={<EllipsisVerticalIcon className="size-5" />}
            />
            <Menu isOpen={isOpen} className="right-0 w-44 p-2 rounded-lg shadow-lg">
                <div className="grid gap-1">
                    <Button
                        type="button"
                        variant="unstyled"
                        onClick={() => {
                            setIsOpen(false);
                            setIsUpdateModalOpen(true);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        leftIcon={<PencilIcon className="size-4 text-muted-foreground" />}
                    >
                        Update review
                    </Button>
                    <Button
                        type="button"
                        variant="unstyled"
                        onClick={() => {
                            setIsOpen(false);
                            setIsDeleteModalOpen(true);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        leftIcon={<Trash2Icon className="size-4" />}
                    >
                        Delete review
                    </Button>
                </div>
            </Menu>

            <UpdateReviewModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                review={review}
            />
            <DeleteReviewDialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                review={review}
            />
        </div>
    );
}
