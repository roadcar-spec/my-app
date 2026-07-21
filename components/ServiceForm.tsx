import NumberInput from "@/components/NumberInput";

type Props = {
  form: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ServiceForm({ form, onChange }: Props) {
  const volvoTotal =
    form.volvo_inspection +
    form.volvo_check +
    form.volvo_general +
    form.volvo_body;

  const otherTotal =
    form.other_inspection +
    form.other_check +
    form.other_general +
    form.other_body;

  return (
    <section className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-bold mb-4">サービス</h2>

      <h3 className="font-semibold mb-2">Volvo</h3>

      <NumberInput
        label="車検"
        name="volvo_inspection"
        value={form.volvo_inspection}
        onChange={onChange}
      />

      <NumberInput
        label="点検"
        name="volvo_check"
        value={form.volvo_check}
        onChange={onChange}
      />

      <NumberInput
        label="一般整備"
        name="volvo_general"
        value={form.volvo_general}
        onChange={onChange}
      />

      <NumberInput
        label="鈑金"
        name="volvo_body"
        value={form.volvo_body}
        onChange={onChange}
      />

      <NumberInput
        label="総入庫"
        name="volvo_total"
        value={volvoTotal}
        onChange={() => {}}
        readOnly
      />

      <hr className="my-4" />

      <h3 className="font-semibold mb-2">国産・その他</h3>

      <NumberInput
        label="車検"
        name="other_inspection"
        value={form.other_inspection}
        onChange={onChange}
      />

      <NumberInput
        label="点検"
        name="other_check"
        value={form.other_check}
        onChange={onChange}
      />

      <NumberInput
        label="一般整備"
        name="other_general"
        value={form.other_general}
        onChange={onChange}
      />

      <NumberInput
        label="鈑金"
        name="other_body"
        value={form.other_body}
        onChange={onChange}
      />

      <NumberInput
        label="総入庫"
        name="other_total"
        value={otherTotal}
        onChange={() => {}}
        readOnly
      />

      <NumberInput
        label="サービス総入庫"
        name="service_total"
        value={volvoTotal + otherTotal}
        onChange={() => {}}
        readOnly
      />
    </section>
  );
}