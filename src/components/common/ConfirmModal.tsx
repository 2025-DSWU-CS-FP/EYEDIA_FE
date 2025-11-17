interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 left-1/2 z-30 flex w-full max-w-[43rem] -translate-x-1/2 items-center justify-center bg-black/40 px-[3.5rem]">
      <div className="flex flex-col items-center gap-[3rem] rounded-[1.6rem] bg-white px-[2rem] py-[3rem]">
        <p className="text-center text-black t3">{message}</p>
        <div className="flex w-[27.5rem] gap-[0.8rem]">
          <button
            type="button"
            onClick={onCancel}
            className="h-[4.8rem] flex-1 rounded-[0.8rem] border border-gray-30 bg-white font-medium text-gray-80 bd2 hover:bg-gray-40/5"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[4.8rem] flex-1 rounded-[0.8rem] bg-brand-blue font-medium text-white bd2 hover:bg-brand-blue/90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
