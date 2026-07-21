"use client";

type ServiceInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ServiceInput({
  value,
  onChange,
}: ServiceInputProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">

      <h2 className="font-bold text-lg mb-3">
        サービス粗利
      </h2>

      <label className="block font-semibold mb-1">
        粗利（千円）
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border p-3 text-lg"
      />

    </div>
  );
}