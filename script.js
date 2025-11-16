// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击导航链接后关闭移动端菜单
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// 平滑滚动到锚点 - 增强版，处理各种链接格式
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        console.log('Anchor link clicked:', href);

        // 如果是空链接或外部链接，不处理
        if (href === '#' || href.startsWith('http')) {
            console.log('Empty or external link, ignoring');
            return;
        }

        // 解析链接，处理 index.html#anchor 格式
        const urlParts = href.split('#');
        const pagePath = urlParts[0];
        const targetId = urlParts[1] ? '#' + urlParts[1] : href;

        console.log('Parsed - Page:', pagePath, 'Target ID:', targetId);

        // 检查目标元素是否存在于当前页面
        const targetElement = document.querySelector(targetId);
        console.log('Target element found:', !!targetElement);

        if (targetElement) {
            // 目标在当前页面，平滑滚动
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 70, // 考虑固定导航栏的高度
                behavior: 'smooth'
            });
            console.log('Smooth scrolling to', targetId);
        } else {
            // 目标元素不存在于当前页面
            const currentPath = window.location.pathname;
            console.log('Current path:', currentPath);

            if (currentPath.includes('module-')) {
                // 在模块页面中，需要跳转到其他页面
                e.preventDefault();
                let newUrl;

                if (pagePath && pagePath !== '') {
                    // 有指定页面路径，如 index.html#beginner
                    newUrl = pagePath + targetId;
                } else {
                    // 纯锚点，如 #beginner，跳转到index.html
                    newUrl = '/index.html' + targetId;
                }

                console.log('Redirecting to', newUrl);
                window.location.href = newUrl;
            } else {
                console.log('Not a module page, letting default behavior happen');
            }
        }
    });
});

// 模块卡片点击效果
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是链接，则不触发卡片整体的跳转
            if (e.target.tagName === 'A') return;

            const link = this.querySelector('.module-link');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    });
});

// 滚动时添加阴影效果到导航栏
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
});

// 检测当前页面位置并高亮导航菜单项
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.tutorial-section, .tutorial-component, .module-container');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const homeLink = document.querySelector('.nav-home');
    const currentLink = document.querySelector('.nav-current');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');

        // 如果是首页链接且在页面顶部，则高亮
        if (link.classList.contains('nav-home') && window.scrollY < 100) {
            link.classList.add('active');
        }
        // 如果是当前页面链接，则高亮
        else if (link.classList.contains('nav-current')) {
            link.classList.add('active');
        }
        // 如果是锚点链接且匹配当前部分，则高亮
        else if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
        // 如果是模块页面且链接包含当前页面文件名，则高亮
        else if (window.location.pathname.includes('module-') &&
                 link.getAttribute('href') === window.location.pathname.split('/').pop()) {
            link.classList.add('active');
        }
    });
});

// 模拟进度条功能（如果需要显示学习进度）
function updateProgress() {
    // 这里可以添加实际的进度更新逻辑
    // 例如：根据用户完成的模块数量更新进度条
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        // 示例：设置进度为50%
        // 实际使用时应根据用户的学习进度动态设置
        // bar.style.width = '50%';
    });
}

// 初始化进度
document.addEventListener('DOMContentLoaded', updateProgress);

// 添加一些动画效果
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.module-card, .resource-card, .tutorial-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// 代码复制功能
function checkAnswer(questionId, correctAnswer) {
    const feedbackDiv = document.getElementById(`${questionId}-feedback`);
    
    // Ensure feedback div exists
    if (!feedbackDiv) return;
    
    // Show the correct answer
    feedbackDiv.innerHTML = `<span class="correct-answer">正确答案：${correctAnswer.toUpperCase()}</span>`;
    
    // Fade in effect
    feedbackDiv.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', function() {
    // 为所有代码块添加复制功能
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        const container = block.parentElement;
        if (!container.classList.contains('code-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-container';
            container.insertBefore(wrapper, block);
            wrapper.appendChild(block);

            // 添加代码头部
            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `
                <span>代码示例</span>
                <button class="code-copy" onclick="copyCode(this)">复制</button>
            `;
            wrapper.insertBefore(header, block);
        }
    });
});

// 复制代码功能
function copyCode(button) {
    const codeBlock = button.closest('.code-container').querySelector('.code-block');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        button.textContent = '已复制!';
        button.style.backgroundColor = '#10b981';

        setTimeout(() => {
            button.textContent = '复制';
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        button.textContent = '复制失败';
        setTimeout(() => {
            button.textContent = '复制';
        }, 2000);
    });
}

// 折叠内容功能
document.addEventListener('DOMContentLoaded', function() {
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});

// 侧边栏导航高亮
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.tutorial-component, [id]');

    function highlightSidebarLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightSidebarLink);
    highlightSidebarLink(); // 初始化
});

// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();

            if (query.length === 0) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }

            // 这里可以添加实际的搜索逻辑
            // 搜索教程内容、标题等
            const results = performSearch(query);
            displaySearchResults(results, searchResults);
        });
    }
});

// 搜索函数（示例）
function performSearch(query) {
    const results = [];
    const contentElements = document.querySelectorAll('.tutorial-content h3, .tutorial-content p');

    contentElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query)) {
            results.push({
                element: element,
                text: element.textContent.substring(0, 100) + '...',
                title: element.closest('.tutorial-content').querySelector('h3')?.textContent || '未命名章节'
            });
        }
    });

    return results;
}

// 显示搜索结果
function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">未找到相关内容</div>';
    } else {
        container.innerHTML = results.map(result => `
            <div class="search-result-item">
                <h4>${result.title}</h4>
                <p>${result.text}</p>
            </div>
        `).join('');
    }

    container.style.display = 'block';
}

// 进度跟踪功能
function updateLearningProgress(moduleId, completed) {
    let progress = JSON.parse(localStorage.getItem('kiro-tutorial-progress') || '{}');
    progress[moduleId] = completed;
    localStorage.setItem('kiro-tutorial-progress', JSON.stringify(progress));

    updateProgressDisplay();
}

function updateProgressDisplay() {
    const progress = JSON.parse(localStorage.getItem('kiro-tutorial-progress') || '{}');
    const totalModules = 8; // 总模块数
    const completedModules = Object.values(progress).filter(Boolean).length;
    const percentage = (completedModules / totalModules) * 100;

    // 更新进度条
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = percentage + '%';
    });

    // 更新进度文本
    const progressTexts = document.querySelectorAll('.progress-text');
    progressTexts.forEach(text => {
        text.textContent = `${completedModules}/${totalModules} 模块已完成`;
    });
}

// 页面加载时更新进度
document.addEventListener('DOMContentLoaded', updateProgressDisplay);

// 工具提示功能
document.addEventListener('DOMContentLoaded', function() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

            setTimeout(() => tooltip.classList.add('show'), 10);
        });

        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            }
        });
    });
});

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // ESC 关闭搜索
    if (e.key === 'Escape') {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
});

// ===== 新增高级交互功能 =====



// 学习进度管理器增强




// 初始化所有增强功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化代码演示管理器
    const codeDemoManager = typeof CodeDemoManager !== 'undefined' ? new CodeDemoManager() : null;
    if (codeDemoManager) {
        codeDemoManager.init();
    }
    
    // 初始化学习进度管理器
    const progressManager = typeof LearningProgressManager !== 'undefined' ? new LearningProgressManager() : null;
    
    // 初始化书签管理器
    const bookmarkManager = typeof BookmarkManager !== 'undefined' ? new BookmarkManager() : null;

    // 添加全局访问接口
    window.kiroTutorial = {
        codeDemo: codeDemoManager,
        progress: progressManager,
        bookmarks: bookmarkManager,
        getOverallStats: () => progressManager ? progressManager.getOverallStats() : null
    };

    // 全局函数：运行代码
    window.runCode = function(button) {
        const demoElement = button.closest('.code-demo');
        if (demoElement && codeDemoManager) {
            codeDemoManager.runDemo(demoElement);
        }
    };

    // 全局函数：显示答案
    window.showAnswer = function(button) {
        const exerciseElement = button.closest('.exercise-box');
        if (exerciseElement) {
            const answerElement = exerciseElement.querySelector('.answer-content');
            const showAnswerButton = exerciseElement.querySelector('.show-answer-btn');
            const hideAnswerButton = exerciseElement.querySelector('.hide-answer-btn');
            if (answerElement) {
                answerElement.style.display = 'block';
            }
            if (showAnswerButton) {
                showAnswerButton.style.display = 'none';
            }
            if (hideAnswerButton) {
                hideAnswerButton.style.display = 'inline-block';
            }
        }
    };

    // 全局函数：隐藏答案
    window.hideAnswer = function(button) {
        const exerciseElement = button.closest('.exercise-box');
        if (exerciseElement) {
            const answerElement = exerciseElement.querySelector('.answer-content');
            const showAnswerButton = exerciseElement.querySelector('.show-answer-btn');
            const hideAnswerButton = exerciseElement.querySelector('.hide-answer-btn');
            if (answerElement) {
                answerElement.style.display = 'none';
            }
            if (showAnswerButton) {
                showAnswerButton.style.display = 'inline-block';
            }
            if (hideAnswerButton) {
                hideAnswerButton.style.display = 'none';
            }
        }
    };

    console.log('🚀 KIRO 教程增强功能已加载完成！');
});