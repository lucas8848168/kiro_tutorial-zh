// 测试core.js中的类是否能被正确访问
console.log('Testing core.js classes...');

// 检查CodeDemoManager是否存在
if (typeof CodeDemoManager !== 'undefined') {
    console.log('✅ CodeDemoManager存在');
    const demoManager = new CodeDemoManager();
    console.log('✅ 可以实例化CodeDemoManager');
} else {
    console.log('❌ CodeDemoManager不存在');
}

// 检查LearningProgressManager是否存在
if (typeof LearningProgressManager !== 'undefined') {
    console.log('✅ LearningProgressManager存在');
    const progressManager = new LearningProgressManager();
    console.log('✅ 可以实例化LearningProgressManager');
} else {
    console.log('❌ LearningProgressManager不存在');
}

// 检查BookmarkManager是否存在
if (typeof BookmarkManager !== 'undefined') {
    console.log('✅ BookmarkManager存在');
    const bookmarkManager = new BookmarkManager();
    console.log('✅ 可以实例化BookmarkManager');
} else {
    console.log('❌ BookmarkManager不存在');
}

console.log('测试完成！');