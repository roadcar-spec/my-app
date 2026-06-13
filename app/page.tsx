import { createClient } from '@/app/utils/supabase/server'

export default async function Home() {
  // Supabaseクライアントを呼び出す
  const supabase = await createClient()

  // 「customers」テーブルからデータを全件取得する
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')

  return (
    <div style={{ padding: '20px' }}>
      <h1>顧客管理システム！！</h1>
      
      <h2>顧客一覧</h2>
      {error && <p style={{ color: 'red' }}>エラーが発生しました: {error.message}</p>}
      
      <ul>
        {customers?.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  )
}