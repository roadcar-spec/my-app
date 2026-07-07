import NumberInput from "@/components/NumberInput";

type Props = {
  form: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export default function SalesForm({ form, onChange }: Props) {
  return (
    <section className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-bold mb-4">営業</h2>

      <NumberInput
        label="SR来場"
        name="sr_visitors"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="新規来場"
        name="new_visitors"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="商談"
        name="negotiations"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="試乗"
        name="test_drive"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="見積"
        name="quotation"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="新車受注"
        name="new_order"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="中古車受注"
        name="used_order"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="新車登録"
        name="new_registration"
        form={form}
        onChange={onChange}
      />

      <NumberInput
        label="中古車登録"
        name="used_registration"
        form={form}
        onChange={onChange}
      />
    </section>
  );
}