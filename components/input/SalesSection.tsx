import NumberInput from "./NumberInput";

type SalesSectionProps = {
  srVisitors: number;
  setSrVisitors: (value: number) => void;

  newVisitors: number;
  setNewVisitors: (value: number) => void;

  negotiations: number;
  setNegotiations: (value: number) => void;

  testDrive: number;
  setTestDrive: (value: number) => void;

  quotation: number;
  setQuotation: (value: number) => void;

  newOrder: number;
  setNewOrder: (value: number) => void;

  usedOrder: number;
  setUsedOrder: (value: number) => void;

  newRegistration: number;
  setNewRegistration: (value: number) => void;

  usedRegistration: number;
  setUsedRegistration: (value: number) => void;
};

export default function SalesSection(props: SalesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border bg-gray-50 p-6">

      <h2 className="text-2xl font-bold">
        営業
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <NumberInput
          label="SR来場"
          value={props.srVisitors}
          onChange={props.setSrVisitors}
        />

        <NumberInput
          label="新規来場"
          value={props.newVisitors}
          onChange={props.setNewVisitors}
        />

        <NumberInput
          label="商談"
          value={props.negotiations}
          onChange={props.setNegotiations}
        />

        <NumberInput
          label="試乗"
          value={props.testDrive}
          onChange={props.setTestDrive}
        />

        <NumberInput
          label="見積"
          value={props.quotation}
          onChange={props.setQuotation}
        />

        <NumberInput
          label="新車受注"
          value={props.newOrder}
          onChange={props.setNewOrder}
        />

        <NumberInput
          label="中古受注"
          value={props.usedOrder}
          onChange={props.setUsedOrder}
        />

        <NumberInput
          label="新車登録"
          value={props.newRegistration}
          onChange={props.setNewRegistration}
        />

        <NumberInput
          label="中古登録"
          value={props.usedRegistration}
          onChange={props.setUsedRegistration}
        />

      </div>

    </section>
  );
}