import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-blue-700 text-white p-5 shadow">
        <h1 className="text-2xl font-bold">Yasaka Management</h1>
        <p className="text-sm opacity-90">
          経営管理システム
        </p>
      </header>

      {/* メニュー */}
      <div className="max-w-md mx-auto p-5 space-y-4">

        <Link href="/input">
          <div className="bg-white rounded-xl shadow p-6 hover:bg-blue-50 cursor-pointer transition">
            <h2 className="text-xl font-semibold">📝 入力</h2>
            <p className="text-gray-500 mt-2">
              日次データの入力
            </p>
          </div>
        </Link>

        <Link href="/dashboard">
          <div className="bg-white rounded-xl shadow p-6 hover:bg-blue-50 cursor-pointer transition">
            <h2 className="text-xl font-semibold">📊 ダッシュボード</h2>
            <p className="text-gray-500 mt-2">
              入力データの確認
            </p>
          </div>
        </Link>
        <Link href="/daily">
          <div className="bg-white rounded-xl shadow p-6 hover:bg-blue-50 cursor-pointer">
            <h2 className="text-xl font-semibold">
              📅 日別推移
            </h2>

            <p className="text-gray-500 mt-2">
              毎日の動きを確認
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
