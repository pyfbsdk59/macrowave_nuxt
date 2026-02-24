import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. 檢查密鑰 (對應原 Django request.headers.get('X-Api-Key'))
  const apiKey = getHeader(event, 'x-api-key') || getHeader(event, 'api_key')
  const validKey = process.env.API_UPLOAD_KEY

  if (apiKey !== validKey) {
    throw createError({ statusCode: 403, statusMessage: '密鑰錯誤 (Invalid API Key)' })
  }

  // 2. 解析 JSON Body (對應原 GUI 遠端上傳 Direct)
  const body = await readBody(event)
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: '未找到有效數據' })
  }

  const payload = {
    content: body,
    source_type: 'GUI 遠端上傳 (Direct)'
  }

  // 3. 寫入 Supabase
  const client = serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('dashboard_data')
    .insert([payload])

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { status: 'success', message: '數據同步成功' }
})