// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false, // 因為我們是純資料展示，不需要強制登入驗證
  },
  app: {
    head: {
      title: 'MacroWave 總經儀表板',
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', tagPosition: 'bodyClose' }
      ]
    }
  }
})