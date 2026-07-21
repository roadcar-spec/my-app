"use client";

type InspectionInputProps = {
  monthLabels: string[];
  values: {
    m1Done: string;
    m2Done: string;
    m3Done: string;
  };
  onChange: (
    key: "m1Done" | "m2Done" | "m3Done",
    value: string
  ) => void;
};

export default function InspectionInput({
  monthLabels,
  values,
  onChange,
}: InspectionInputProps) {
  const items = [
    {
      key: "m1Done" as const,
      label: monthLabels[0],
      value: values.m1Done,
    },
    {
      key: "m2Done" as const,
      label: monthLabels[1],
      value: values.m2Done,
    },
    {
      key: "m3Done" as const,
      label: monthLabels[2],
      value: values.m3Done,
    },
  ];

  return (
    <div className="rounded-xl bg-white p-4 shadow space-y-4">

      <h2 className="font-bold text-lg">
        車検決着台数
      </h2>

      {items.map((item) => (
        <div key={item.key}>

          <label className="block font-semibold mb-1">
            {item.label}
          </label>

          <input
            type="number"
            value={item.value}
            onChange={(e) =>
              onChange(
                item.key,
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3 text-lg"
          />

        </div>
      ))}

    </div>
  );
}