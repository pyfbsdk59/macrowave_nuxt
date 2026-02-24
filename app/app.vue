<template>
  <div>
    <div class="header-section text-center">
        <h1 class="fw-bold">📊 MacroWave 總經戰情室</h1>
        <p class="opacity-90 mb-0">全方位總體經濟與資產配置監控中心</p>
    </div>

    <div class="container mb-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="row align-items-center text-center">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <h6 class="text-uppercase text-muted fw-bold" style="font-size: 0.8rem;">目前數據來源</h6>
                        <span class="badge bg-primary fs-6 text-wrap" style="line-height: 1.5;">{{ dataSourceDisplay }}</span>
                        <div v-if="dashboardData?.content?.date" class="mt-2 text-muted" style="font-size: 0.85rem;">
                            資料基準日: <strong>{{ dashboardData.content.date }}</strong>
                        </div>
                    </div>
                    <div class="col-md-6 border-start">
                        <button class="btn btn-outline-success w-100 fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#uploadBox">
                            📤 手動預覽本地 JSON
                        </button>
                        <small class="text-muted d-block mt-1" style="font-size: 0.75rem;">不寫入資料庫，僅供即時查看</small>
                    </div>
                </div>
                <div class="collapse mt-3" id="uploadBox">
                    <div class="card card-body bg-light border-0">
                        <input type="file" @change="handleFileUpload" class="form-control" accept=".json">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container" v-if="dashboardData">
        <div class="row">
           </div>
    
    <div v-else class="text-center mt-5">
      <div class="spinner-border text-primary" role="status" v-if="isLoading"></div>
      <p class="mt-2 text-muted fw-bold" v-if="isLoading">載入最新戰情數據中...</p>
      <div v-else>
          <p class="text-muted fw-bold">目前資料庫尚無數據 📭</p>
          <p class="text-small">請等待 Python 爬蟲將最新數據推播至 API，或點擊上方按鈕預覽本地 JSON。</p>
      </div>
    </div>

    <footer class="text-center py-4 mt-5 text-muted border-top bg-white">
        <small>&copy; 2026 MacroWave System | Powered by Nuxt & Vercel</small>
    </footer>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const rawResponseData = ref(null)
const isLoading = ref(true) // 新增載入狀態

// 取得最新資料
const { data: response, error } = await useFetch('/api/latest')

if (response.value && response.value.data) {
  rawResponseData.value = response.value.data
}
isLoading.value = false // 載入結束

const dashboardData = computed(() => rawResponseData.value)

const dataSourceDisplay = computed(() => {
  if (!dashboardData.value) return '無數據'
  const content = dashboardData.value.content
  const source = dashboardData.value.source_type || '未知來源'
  const timeStr = content.update_time || new Date(dashboardData.value.created_at).toLocaleString('zh-TW')
  return `${source} (時間: ${timeStr})`
})

// 本機預覽功能
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsedData = JSON.parse(e.target.result)
      rawResponseData.value = {
        content: parsedData,
        source_type: '本機端直接預覽',
        created_at: new Date().toISOString()
      }
      alert('本機 JSON 載入成功！')
    } catch (err) {
      alert('檔案解析失敗，請確認是否為有效的 JSON。')
    }
  }
  reader.readAsText(file)
}
</script>

<style>
/* 完全繼承原本的 CSS 樣式 */
body { background-color: #f4f6f9; font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; }
.header-section { background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%); color: white; padding: 40px 0; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.card { border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 24px; transition: transform 0.2s; overflow: hidden; }
.card:hover { transform: translateY(-3px); }
.card-header { font-weight: bold; padding: 15px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); }
.status-Safe { color: #198754; font-weight: bold; }
.status-Warning { color: #fd7e14; font-weight: bold; }
.status-Danger { color: #dc3545; font-weight: bold; }
.advice-badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 1.2rem; }
.advice-Safe { background-color: #d1e7dd; color: #0f5132; }
.advice-Caution { background-color: #fff3cd; color: #664d03; }
.advice-Reduce { background-color: #ffecb5; color: #664d03; border: 2px solid #ffc107; }
.advice-Flee { background-color: #f8d7da; color: #842029; }
.metric-item { padding: 12px; border-radius: 8px; background-color: #f8f9fa; border: 1px solid #e9ecef; height: 100%; }
.metric-label { font-size: 0.85rem; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.metric-value { font-size: 1.1rem; font-weight: 700; color: #212529; word-break: break-word; }
.metric-sub { font-size: 0.75rem; color: #adb5bd; margin-top: 2px; }
.section-bar-tw { border-left: 5px solid #0d6efd; }
.section-bar-us { border-left: 5px solid #dc3545; }
.section-bar-cycle { border-left: 5px solid #198754; }
.section-bar-sentiment { border-left: 5px solid #ffc107; }
.text-small { font-size: 0.85rem; }
.text-diff-pos { color: #dc3545; font-weight: bold; }
.text-diff-neg { color: #198754; font-weight: bold; }
</style>