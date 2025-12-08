// PM2 配置文件
module.exports = {
  apps: [
    {
      name: 'rogue-cultivator-backend',
      script: 'dist/server.js',
      cwd: '/var/www/rogueCultivator/backend',
      instances: 1,  // 单实例，SQLite 不支持多进程写入
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // 日志配置
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/rogue-cultivator-error.log',
      out_file: '/var/log/pm2/rogue-cultivator-out.log',
      merge_logs: true,
      // 自动重启
      watch: false,
      max_memory_restart: '500M',
      // 重启策略
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
