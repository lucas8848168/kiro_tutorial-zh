// 自动测试所有模块页面的导航链接
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 读取所有module-*.html文件
const files = fs.readdirSync('.')
    .filter(file => file.startsWith('module-') && file.endsWith('.html'));

console.log('=== KIRO IDE教程导航链接测试报告 ===');
console.log(`共发现 ${files.length} 个模块页面`);
console.log('\n' + '='.repeat(50) + '\n');

// 测试每个文件
files.forEach(file => {
    console.log(`测试文件: ${file}`);
    const content = fs.readFileSync(file, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // 检查导航菜单中的链接
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        // 只检查锚点链接
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            
            // 检查当前页面是否存在目标锚点
            const targetElement = document.getElementById(targetId);
            
            // 检查是否是模块页面的导航链接
            if (file.startsWith('module-')) {
                // 模块页面中的这些锚点应该跳转到index.html
                if (['introduction', 'beginner', 'intermediate', 'advanced'].includes(targetId)) {
                    console.log(`  ✅ ${text} (${href}) - 模块页面特殊处理链接`);
                } else {
                    // 其他锚点应该在当前页面存在
                    if (targetElement) {
                        console.log(`  ✅ ${text} (${href}) - 当前页面存在目标锚点`);
                    } else {
                        console.log(`  ❌ ${text} (${href}) - 当前页面不存在目标锚点`);
                    }
                }
            } else {
                // 非模块页面应该存在目标锚点
                if (targetElement) {
                    console.log(`  ✅ ${text} (${href}) - 当前页面存在目标锚点`);
                } else {
                    console.log(`  ❌ ${text} (${href}) - 当前页面不存在目标锚点`);
                }
            }
        } else {
            // 外部链接或页面间链接
            console.log(`  📎 ${text} (${href}) - 页面间链接或外部链接`);
        }
    });
    
    console.log('\n');
});

// 检查script.js是否存在且包含修复代码
console.log('='.repeat(50));
console.log('检查script.js修复代码:');

const scriptContent = fs.readFileSync('script.js', 'utf8');
if (scriptContent.includes('currentPath.includes(\'module-\')')) {
    console.log('✅ 已找到模块页面锚点跳转修复代码');
} else {
    console.log('❌ 未找到模块页面锚点跳转修复代码');
}

// 检查所有模块页面是否包含script.js
console.log('\n检查所有模块页面是否包含script.js:');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('<script src="script.js"></script>')) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file}`);
    }
});

console.log('\n' + '='.repeat(50));
console.log('测试完成');