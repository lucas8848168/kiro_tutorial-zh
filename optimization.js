/**
 * KIRO IDE 教程性能优化脚本
 * 包含代码压缩、懒加载、缓存策略等功能
 */

// 性能监控类
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // 监听页面加载性能
        window.addEventListener('load', () => {
            this.collectPerformanceMetrics();
        });

        // 监听资源加载
        this.observeResourceLoading();
    }

    collectPerformanceMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');

            this.metrics = {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
                firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
            };

            console.log('📊 性能指标:', this.metrics);
        }
    }

    observeResourceLoading() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 1000) {
                        console.warn(`⚠️ 资源加载缓慢: ${entry.name} (${Math.round(entry.duration)}ms)`);
                    }
                }
            });

            observer.observe({ entryTypes: ['resource'] });
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// 图片懒加载类
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // 降级处理：直接加载所有图片
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
}

// 缓存管理类
class CacheManager {
    constructor() {
        this.cacheName = 'kiro-tutorial-cache-v1';
        this.init();
    }

    init() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // 本地存储缓存策略
        this.setupLocalStorageCache();
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('📦 Service Worker 注册成功:', registration.scope);
        } catch (error) {
            console.log('📦 Service Worker 注册失败:', error);
        }
    }

    setupLocalStorageCache() {
        // 缓存静态资源
        this.cacheStaticResources();

        // 缓存用户进度
        this.cacheUserProgress();
    }

    cacheStaticResources() {
        const resources = [
            { key: 'css-styles', url: 'styles.css', type: 'text/css' },
            { key: 'js-script', url: 'script.js', type: 'text/javascript' }
        ];

        resources.forEach(resource => {
            if (!localStorage.getItem(resource.key)) {
                this.fetchAndCacheResource(resource);
            }
        });
    }

    async fetchAndCacheResource(resource) {
        try {
            const response = await fetch(resource.url);
            const content = await response.text();

            localStorage.setItem(resource.key, JSON.stringify({
                content,
                timestamp: Date.now(),
                type: resource.type
            }));

            console.log(`📦 已缓存资源: ${resource.url}`);
        } catch (error) {
            console.warn(`⚠️ 缓存资源失败: ${resource.url}`, error);
        }
    }

    cacheUserProgress() {
        // 监听进度变化并缓存
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (key.includes('kiro-tutorial')) {
                console.log(`📊 缓存用户数据: ${key}`);
            }
            originalSetItem.apply(this, arguments);
        };
    }

    getCachedResource(key) {
        const cached = localStorage.getItem(key);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                // 检查缓存是否过期（24小时）
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    return data.content;
                } else {
                    localStorage.removeItem(key);
                }
            } catch (error) {
                console.warn('⚠️ 读取缓存失败:', error);
            }
        }
        return null;
    }
}

// 代码压缩工具
class CodeMinifier {
    static minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/\s+/g, ' ') // 合并空白字符
            .replace(/;\s*}/g, '}') // 移除最后一个分号
            .replace(/\s*{\s*/g, '{') // 清理大括号
            .replace(/;\s*/g, ';') // 清理分号
            .trim();
    }

    static minifyJS(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
            .replace(/\/\/.*$/gm, '') // 移除单行注释
            .replace(/\s+/g, ' ') // 合并空白字符
            .replace(/;\s*}/g, '}') // 移除最后一个分号
            .replace(/\s*{\s*/g, '{') // 清理大括号
            .replace(/;\s*/g, ';') // 清理分号
            .trim();
    }

    static minifyHTML(html) {
        return html
            .replace(/<!--[\s\S]*?-->/g, '') // 移除注释
            .replace(/\s+/g, ' ') // 合并空白字符
            .replace(/>\s+</g, '><') // 移除标签间的空白
            .trim();
    }
}

// 资源预加载类
class ResourcePreloader {
    constructor() {
        this.resources = [];
    }

    addResource(url, type = 'script') {
        this.resources.push({ url, type });
    }

    preload() {
        this.resources.forEach(resource => {
            if (resource.type === 'script') {
                this.preloadScript(resource.url);
            } else if (resource.type === 'style') {
                this.preloadStyle(resource.url);
            }
        });
    }

    preloadScript(url) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        document.head.appendChild(link);
    }

    preloadStyle(url) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    }
}

// 性能优化主类
class PerformanceOptimizer {
    constructor() {
        this.monitor = new PerformanceMonitor();
        this.lazyLoader = new LazyImageLoader();
        this.cacheManager = new CacheManager();
        this.preloader = new ResourcePreloader();
        this.init();
    }

    init() {
        console.log('🚀 性能优化器初始化...');

        // 预加载关键资源
        this.preloadCriticalResources();

        // 延迟加载非关键资源
        this.delayLoadNonCriticalResources();

        // 优化事件监听器
        this.optimizeEventListeners();

        // 监控长任务
        this.monitorLongTasks();
    }

    preloadCriticalResources() {
        // 预加载关键CSS和JavaScript
        this.preloader.addResource('styles.css', 'style');
        this.preloader.addResource('script.js', 'script');
        this.preloader.preload();
    }

    delayLoadNonCriticalResources() {
        // 延迟加载非关键资源
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadNonCriticalResources();
            }, 1000);
        });
    }

    loadNonCriticalResources() {
        // 延迟加载第三方库、分析脚本等
        console.log('📦 加载非关键资源...');
    }

    optimizeEventListeners() {
        // 使用事件委托减少事件监听器数量
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('demo-run-button')) {
                // 处理代码演示运行
                console.log('运行代码演示');
            }
        });
    }

    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`⚠️ 长任务检测到: ${entry.duration}ms`);
                    }
                }
            });

            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    getPerformanceReport() {
        const metrics = this.monitor.getMetrics();
        return {
            loadTime: metrics.loadTime,
            firstContentfulPaint: metrics.firstContentfulPaint,
            cachedResources: Object.keys(localStorage).filter(key =>
                key.includes('cache') || key.includes('kiro-tutorial')
            ).length,
            timestamp: Date.now()
        };
    }
}

// 初始化性能优化器
document.addEventListener('DOMContentLoaded', () => {
    window.kiroOptimizer = new PerformanceOptimizer();

    // 暴露性能报告接口
    window.getPerformanceReport = () => {
        return window.kiroOptimizer.getPerformanceReport();
    };
});

// 导出优化工具
window.CodeMinifier = CodeMinifier;
window.PerformanceMonitor = PerformanceMonitor;