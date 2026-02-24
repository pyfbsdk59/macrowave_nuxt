import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  
  // 取得最新一筆資料，對應原 Django DashboardData.objects.first()
  const { data, error } = await client
    .from('dashboard_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return { data: null }
  }

  return { data }
})