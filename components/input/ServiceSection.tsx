import NumberInput from "./NumberInput";

type ServiceSectionProps = {
  serviceTotal: number;
  setServiceTotal: (value: number) => void;

  volvoTotal: number;
  setVolvoTotal: (value: number) => void;

  volvoInspection: number;
  setVolvoInspection: (value: number) => void;

  volvoCheck: number;
  setVolvoCheck: (value: number) => void;

  volvoGeneral: number;
  setVolvoGeneral: (value: number) => void;

  volvoBody: number;
  setVolvoBody: (value: number) => void;

  otherTotal: number;
  setOtherTotal: (value: number) => void;

  otherInspection: number;
  setOtherInspection: (value: number) => void;

  otherCheck: number;
  setOtherCheck: (value: number) => void;

  otherGeneral: number;
  setOtherGeneral: (value: number) => void;

  otherBody: number;
  setOtherBody: (value: number) => void;
};

export default function ServiceSection(props: ServiceSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border bg-gray-50 p-6">

      <h2 className="text-2xl font-bold">
        サービス
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <NumberInput
          label="総入庫"
          value={props.serviceTotal}
          onChange={props.setServiceTotal}
        />

        <NumberInput
          label="Volvo総入庫"
          value={props.volvoTotal}
          onChange={props.setVolvoTotal}
        />

        <NumberInput
          label="Volvo車検"
          value={props.volvoInspection}
          onChange={props.setVolvoInspection}
        />

        <NumberInput
          label="Volvo点検"
          value={props.volvoCheck}
          onChange={props.setVolvoCheck}
        />

        <NumberInput
          label="Volvo一般整備"
          value={props.volvoGeneral}
          onChange={props.setVolvoGeneral}
        />

        <NumberInput
          label="Volvo板金"
          value={props.volvoBody}
          onChange={props.setVolvoBody}
        />

        <NumberInput
          label="他銘柄総入庫"
          value={props.otherTotal}
          onChange={props.setOtherTotal}
        />

        <NumberInput
          label="他銘柄車検"
          value={props.otherInspection}
          onChange={props.setOtherInspection}
        />

        <NumberInput
          label="他銘柄点検"
          value={props.otherCheck}
          onChange={props.setOtherCheck}
        />

        <NumberInput
          label="他銘柄一般整備"
          value={props.otherGeneral}
          onChange={props.setOtherGeneral}
        />

        <NumberInput
          label="他銘柄板金"
          value={props.otherBody}
          onChange={props.setOtherBody}
        />

      </div>

    </section>
  );
}