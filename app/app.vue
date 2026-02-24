<template>
  <div>
    <div class="header-section text-center">
        <h1 class="fw-bold">📊 MacroWave 總經戰情室</h1>
        <p class="opacity-90 mb-0">全方位總體經濟與資產配置監控中心</p>
    </div>

    <div class="container" v-if="dashboardData">
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row align-items-center text-center">
                    <div class="col-md-4 mb-3 mb-md-0">
                        <h6 class="text-uppercase text-muted fw-bold" style="font-size: 0.8rem;">目前數據來源</h6>
                        <span class="badge bg-primary fs-6 text-wrap">{{ dataSourceDisplay }}</span>
                        <div v-if="dashboardData.content.date" class="mt-2 text-muted" style="font-size: 0.85rem;">
                            資料基準日: <strong>{{ dashboardData.content.date }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 mb-4">
                <div class="card text-center p-4 bg-white">
                    <h5 class="text-muted mb-3 text-uppercase ls-1">Mark 17 總經風險評分</h5>
                    <div class="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                        <div class="d-flex align-items-baseline">
                            <span class="display-3 fw-bold text-dark">{{ dashboardData.content.total_score }}</span>
                            <span class="text-muted fs-4 ms-2">/ 15</span>
                        </div>
                        <div :class="['advice-badge', 'advice-' + dashboardData.content.advice]">
                            策略建議: {{ dashboardData.content.advice }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-12">
                <div class="card h-100">
                    <div class="card-header bg-warning text-dark fw-bold d-flex justify-content-between align-items-center">
                        <span>🥇 貴金屬重挫偵測</span>
                        <small>跌幅 > 50%</small>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-striped mb-0 align-middle text-center" style="font-size: 0.9rem;">
                                <thead class="table-light">
                                    <tr><th>商品</th><th>現價</th><th>跌幅</th><th>狀態</th></tr>
                                </thead>
                                <tbody>
                                    <tr v-for="metal in dashboardData.content.metals" :key="metal.name">
                                        <td class="fw-bold">{{ metal.name }}</td>
                                        <td>{{ Math.round(metal.current) }}</td>
                                        <td class="text-muted">{{ metal.drop.toFixed(1) }}%</td>
                                        <td :class="'status-' + metal.status">{{ metal.status === 'Danger' ? '⚠️' : 'OK' }}</td>
                                    </tr>
                                    <tr v-if="!dashboardData.content.metals?.length">
                                        <td colspan="4" class="text-muted py-3">暫無數據</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </div>
    <div v-else class="text-center mt-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">載入數據中...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 呼叫我們自製的 API 取得 Supabase 資料
const { data: response } = await useFetch('/api/latest')
const dashboardData = computed(() => response.value?.data || null)

const dataSourceDisplay = computed(() => {
  if (!dashboardData.value) return '無數據'
  const content = dashboardData.value.content
  const source = dashboardData.value.source_type || '未知來源'
  const timeStr = content.update_time || new Date(dashboardData.value.created_at).toLocaleString('zh-TW')
  return `${source} (時間: ${timeStr})`
})
</script>

<style>
/* 將 home.html <style> 中的所有 CSS 直接貼到這裡 */
body { background-color: #f4f6f9; font-family: "Segoe UI", Roboto, sans-serif; }
.header-section { background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%); color: white; padding: 40px 0; margin-bottom: 30px; }
.advice-badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 1.2rem; }
.advice-Safe { background-color: #d1e7dd; color: #0f5132; }
.advice-Caution { background-color: #fff3cd; color: #664d03; }
.advice-Reduce { background-color: #ffecb5; color: #664d03; border: 2px solid #ffc107; }
/* ... (保留其餘 CSS) ... */
</style>