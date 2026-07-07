type Props = {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

export default function NumberInput({
  label,
  name,
  value,
  onChange,
  readOnly = false,
}: Props) {
  return (
    <div className="grid grid-cols-2 items-center gap-3 py-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`border rounded-lg p-2 text-right ${
          readOnly ? "bg-gray-100" : "bg-white"
        }`}
      />
    </div>
  );
}