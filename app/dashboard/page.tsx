import Link from "next/link";
import { getDashboardData } from "./getDashboardData";
import "./dashboard.css";


export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
  }>;
}) {

  const params = await searchParams;

  const data = await getDashboardData(
    params.date
  );


  return (

    <main className="dashboard">


      <header className="dashboard-header">

        <div className="dashboard-actions">

          <Link
            href="/dashboard/input"
            className="dashboard-input-button"
          >
            管理入力
          </Link>

        </div>        
        <form>

          <label>
            表示日
          </label>

          <input
            type="date"
            name="date"
            defaultValue={data.viewDate}
          />

          <button>
            表示
          </button>

        </form>

      </header>




      <section className="dashboard-section">

        <h2>
          提出状況
        </h2>


        <div className="average">
          平均提出率：
          {data.submit.average.toFixed(1)}%
        </div>


        <div className="grid grid-3 header">

          <span>店舗</span>
          <span>今日</span>
          <span>提出率</span>

        </div>


        {data.submit.stores.map(item => (

          <div
            className="grid grid-3 row"
            key={item.store.id}
          >

            <span>
              {item.store.name}
            </span>


            <span
              className={
                item.submitted
                ? ""
                : "warning"
              }
            >
              {item.submitted ? "提出" : "未提出"}
            </span>


            <span
              className={
                item.rate < data.submit.average
                ? "warning"
                : ""
              }
            >
              {item.rate.toFixed(1)}%
            </span>


          </div>

        ))}


      </section>






      <section className="dashboard-section">

        <h2>
          サービス粗利
        </h2>


        <div className="average">
          平均達成率：
          {data.gross.average.toFixed(1)}%
        </div>



        <div className="grid grid-3 header">

          <span>店舗</span>
          <span>実績</span>
          <span>達成率</span>

        </div>



        {data.gross.stores.map(item => (

          <div
            className="grid grid-3 row"
            key={item.store.id}
          >

            <span>
              {item.store.name}
            </span>


            <span>
              {item.amount.toLocaleString()}千円
            </span>


            <span
              className={
                item.rate < data.gross.average
                ? "warning"
                : ""
              }
            >

              {item.rate.toFixed(1)}%

            </span>


          </div>

        ))}


      </section>






      <section className="dashboard-section">

        <h2>
          車検進捗
        </h2>
        <div className="section-link">
          <Link href="/inspection">
            車検詳細を見る →
          </Link>
        </div>

        <div className="average">

          平均　
          7月：
          {data.inspection.month1Average.toFixed(1)}%

         　
          8月：
          {data.inspection.month2Average.toFixed(1)}%

         　
          9月：
          {data.inspection.month3Average.toFixed(1)}%

        </div>




        <div className="grid grid-4 header">

          <span>店舗</span>
          <span>7月</span>
          <span>8月</span>
          <span>9月</span>

        </div>




{data.inspection.stores.map(item => (

          <div
            className="grid grid-4 row"
            key={item.store.id}
          >

            <span>
              {item.store.name}
            </span>

            <span
              className={
                item.month1 < data.inspection.month1Average
                  ? "warning"
                  : ""
              }
            >
              {item.month1.toFixed(1)}%
            </span>

            <span
              className={
                item.month2 < data.inspection.month2Average
                  ? "warning"
                  : ""
              }
            >
              {item.month2.toFixed(1)}%
            </span>

            <span
              className={
                item.month3 < data.inspection.month3Average
                  ? "warning"
                  : ""
              }
            >
              {item.month3.toFixed(1)}%
            </span>

          </div>

        ))}


      </section>



    </main>

  );

}
