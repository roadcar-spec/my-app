export default function DashboardPage() {
  const data = {
    report_date: "2026-07-07",

    sr_visitors: 9,
    new_visitors: 0,
    negotiations: 8,
    test_drive: 2,
    quotation: 6,
    new_order: 3,
    used_order: 2,

    service_total: 48,

    gross_profit: 2842605,
    labor_sales: 1574863,

    insurance: 0,
    finance: 0,
    tradein: 0,
  };

  const Card = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: number | string;
  }) => (
    <div className="flex justify-between py-2 border-b">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 shadow">
        <h1 className="text-xl font-bold">ダッシュボード</h1>
        <p>{data.report_date}</p>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-4">

        <Card title="営業">
          <Row label="SR来場" value={data.sr_visitors} />
          <Row label="新規来場" value={data.new_visitors} />
          <Row label="商談" value={data.negotiations} />
          <Row label="試乗" value={data.test_drive} />
          <Row label="見積" value={data.quotation} />
          <Row label="新車受注" value={data.new_order} />
          <Row label="中古受注" value={data.used_order} />
        </Card>

        <Card title="サービス">
          <Row label="総入庫" value={data.service_total} />
        </Card>

        <Card title="売上">
          <Row
            label="総粗利"
            value={`¥${data.gross_profit.toLocaleString()}`}
          />
          <Row
            label="工賃売上"
            value={`¥${data.labor_sales.toLocaleString()}`}
          />
        </Card>

        <Card title="その他">
          <Row label="保険" value={data.insurance} />
          <Row label="ローン" value={data.finance} />
          <Row label="下取" value={data.tradein} />
        </Card>

      </div>
    </main>
  );
}