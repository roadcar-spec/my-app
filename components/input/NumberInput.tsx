type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export default function NumberInput({
  label,
  value,
  onChange,
}: NumberInputProps) {
  function minus() {
    if (value > 0) {
      onChange(value - 1);
    }
  }

  function plus() {
    onChange(value + 1);
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-3 font-semibold text-gray-800">
        {label}
      </div>

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={minus}
          className="
            h-12
            w-12
            rounded-lg
            bg-red-500
            text-2xl
            font-bold
            text-white
            hover:bg-red-600
            active:scale-95
          "
        >
          −
        </button>

        <div className="text-3xl font-bold text-gray-900">
          {value}
        </div>

        <button
          type="button"
          onClick={plus}
          className="
            h-12
            w-12
            rounded-lg
            bg-blue-600
            text-2xl
            font-bold
            text-white
            hover:bg-blue-700
            active:scale-95
          "
        >
          ＋
        </button>

      </div>
    </div>
  );
}