const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // outputDir: "../src/main/resources/static",  // 빌드 타겟 디렉토리
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8030',
        changeOrigin: true, // cross origin 허용
      }
    }
  }
});
