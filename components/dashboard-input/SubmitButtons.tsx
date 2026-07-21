"use client";

type SubmitButtonsProps = {
  onSubmit: () => void;
  onUnsubmit: () => void;
};

export default function SubmitButtons({
  onSubmit,
  onUnsubmit,
}: SubmitButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">

      <button
        type="button"
        onClick={onSubmit}
        className="rounded-xl bg-blue-600 py-4 text-lg font-bold text-white"
      >
        提出
      </button>


      <button
        type="button"
        onClick={onUnsubmit}
        className="rounded-xl bg-gray-500 py-4 text-lg font-bold text-white"
      >
        未提出入力
      </button>

    </div>
  );
}