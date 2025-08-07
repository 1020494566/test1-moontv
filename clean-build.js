const fs = require('fs');
const path = require('path');

// 清理构建前的大文件和缓存
function cleanBuildFiles() {
  console.log('🧹 清理构建文件...');

  const dirsToClean = [
    '.next',
    'out',
    'cache',
    'node_modules/.cache',
    '.cache'
  ];

  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`删除目录: ${dir}`);
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (error) {
        console.warn(`无法删除 ${dir}:`, error.message);
      }
    }
  });

  console.log('✅ 构建文件清理完成');
}

cleanBuildFiles();
