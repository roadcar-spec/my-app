export default function DailyPage() {
  const data = [
    { day: 1, visit: 1, negotiation: 1, order: 1, service: 10, gross: 284352 },
    { day: 2, visit: 0, negotiation: 0, order: 0, service: 12, gross: 983287 },
    { day: 3, visit: 2, negotiation: 2, order: 0, service: 7, gross: 785043 },
    { day: 4, visit: 5, negotiation: 4, order: 4, service: 11, gross: 568826 },
    { day: 5, visit: 1, negotiation: 1, order: 0, service: 8, gross: 221097 },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4">
        <h1 className="text-xl font-bold">日別推移</h1>
        <p>2026年7月</p>
      </header>

      <div className="overflow-x-auto p-4">

        <table className="w-full bg-white rounded-xl shadow">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-3 text-left">日</th>
              <th className="p-3 text-right">来場</th>
              <th className="p-3 text-right">商談</th>
              <th className="p-3 text-right">受注</th>
              <th className="p-3 text-right">入庫</th>
              <th className="p-3 text-right">粗利</th>
            </tr>

          </thead>

          <tbody>

            {data.map((row) => (
              <tr key={row.day} className="border-b">

                <td className="p-3">{row.day}</td>

                <td className="p-3 text-right">
                  {row.visit}
                </td>

                <td className="p-3 text-right">
                  {row.negotiation}
                </td>

                <td className="p-3 text-right">
                  {row.order}
                </td>

                <td className="p-3 text-right">
                  {row.service}
                </td>

                <td className="p-3 text-right font-semibold">
                  ¥{row.gross.toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </main>
  );
}