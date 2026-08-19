import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    showCancel = true,
}) => {
    const titleId = useId();
    const messageId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const onCancelRef = useRef(onCancel);

    useEffect(() => {
        onCancelRef.current = onCancel;
    }, [onCancel]);

    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusTarget = showCancel ? cancelButtonRef.current : confirmButtonRef.current;
        focusTarget?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancelRef.current();
                return;
            }

            if (event.key !== 'Tab' || !dialogRef.current) return;

            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [isOpen, showCancel]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => onCancelRef.current()}
            role="presentation"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
                className="bg-[#1b1429] border border-violet-700 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id={titleId} className="text-2xl font-bold text-white mb-3">
                    {title}
                </h2>
                <p id={messageId} className="text-lg text-gray-300 mb-8">
                    {message}
                </p>
                <div className="gap-4 flex flex-col sm:flex-row justify-end">
                    {showCancel && (
                        <button
                            ref={cancelButtonRef}
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 rounded-xl border border-violet-700 text-white font-semibold hover:bg-violet-800/30 transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
