"use client";

type StoreInfoProps = {
  reportDate: string;
  storeName: string;
  todayStatus: "提出" | "未提出";
  latestDate: string;
  onDateChange: (value: string) => void;
  onCopyLatest: () => void;
};

export default function StoreInfo({
  reportDate,
  storeName,
  todayStatus,
  latestDate,
  onDateChange,
  onCopyLatest,
}: StoreInfoProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow space-y-4">

      <div>
        <label className="block font-semibold mb-1">
          日付
        </label>

        <input
          type="date"
          value={reportDate}
          onChange={(e) =>
            onDateChange(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />
      </div>


      <div>
        <label className="block font-semibold mb-1">
          拠点
        </label>

        <div className="rounded-lg border bg-gray-50 p-3">
          {storeName}
        </div>
      </div>


      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-lg border p-3">
          <div className="text-sm text-gray-500">
            当日状況
          </div>

          <div
            className={
              todayStatus === "提出"
                ? "font-bold text-green-600"
                : "font-bold text-red-600"
            }
          >
            {todayStatus}
          </div>
        </div>


        <div className="rounded-lg border p-3">
          <div className="text-sm text-gray-500">
            前回入力
          </div>

          <div className="font-bold">
            {latestDate || "なし"}
          </div>
        </div>

      </div>


      <button
        type="button"
        onClick={onCopyLatest}
        className="w-full rounded-lg bg-gray-700 py-3 font-bold text-white"
      >
        前回データをコピー
      </button>

    </div>
  );
}