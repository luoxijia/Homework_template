// ==============================
// 1. 获取网页元素
// ==============================

const memoInput = document.getElementById("memo-text");
const addButton = document.getElementById("add-card");
const suitButtons = document.querySelectorAll(".suit");
// 获取优先级按钮
const priorityButtons = document.querySelectorAll(".priority");
const cardDeck = document.getElementById("card-deck");

// ==============================
// 2. 保存卡牌数据
// ==============================

// 从浏览器读取之前保存的卡牌
let cards = JSON.parse(localStorage.getItem("myCards")) || [];

// 当前选择的花色
let selectedSuit = "♠";
// 默认优先级为 A
let selectedPriority = 1;
// 当前正在查看第几张卡牌
let currentIndex = 0;

// 防止连续点击造成动画混乱
let isDrawing = false;

// 为之后的双击出牌功能预留
let drawTimer = null;
// ==============================
// 3. 选择花色
// ==============================

suitButtons.forEach(button => {
    button.addEventListener("click", () => {

        // 取消其他按钮的选中状态
        suitButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // 选中当前按钮
        button.classList.add("selected");

        // 记录选择的花色
        selectedSuit = button.dataset.suit;

    });
});

// 默认选中黑桃
suitButtons[0].classList.add("selected");

// ==============================
// ==============================
// 3.5 选择优先级
// ==============================

priorityButtons.forEach(button => {

    button.addEventListener("click", () => {

        // 清除其他按钮的选中状态
        priorityButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // 选中当前按钮
        button.classList.add("selected");

        // 记录优先级
        selectedPriority = Number(button.dataset.priority);

    });

});
// 4. 创建新卡牌
// ==============================

function addCard() {

    // 获取输入框里的文字
    const text = memoInput.value.trim();

    // 如果没有输入内容
    if (text === "") {
       alert(getMemoText().inputRequired);
        return;
    }

    // 创建一张新卡牌的数据
    const newCard = {
    id: Date.now(),
    text: text,
    suit: selectedSuit,
    priority: selectedPriority,
    status: "active"
};

    // 添加到卡牌数组
    cards.push(newCard);
// 创建新卡牌后，显示最新添加的那一张
currentIndex = cards.filter(card => card.status === "active").length - 1;
    // 保存到浏览器
    saveCards();

    // 清空输入框
    memoInput.value = "";

   // 添加后自动返回 ACTIVE 牌堆
currentDeck = "active";

// 更新选中按钮
deckTabs.forEach(tab => {
    tab.classList.toggle(
        "active",
        tab.dataset.deck === "active"
    );
});

// 更新整个牌堆界面
renderDeck();
}

// ==============================
// 5. 保存数据
// ==============================

function saveCards() {
    localStorage.setItem("myCards", JSON.stringify(cards));

    // 每次保存时更新三个牌堆的数量
    updateCounts();
}

// ==============================
// 6. 显示最新卡牌
// ==============================

function showCard() {

    // 找到所有还没有完成的卡牌
    const activeCards = cards.filter(card => card.status === "active");

    // 如果还没有添加任何卡牌
    if (activeCards.length === 0) {

    cardDeck.innerHTML = `
        <div class="card">
            <span class="card-suit">♠</span>

            <div class="card-content">
                <h2>${getMemoText().emptyTitle}</h2>
<p>${getMemoText().emptyDescription}</p>
            </div>

            <span class="card-suit bottom">♠</span>
        </div>
    `;

    return;
}

    // 取出最新的一张卡牌
    // 根据当前的位置选择卡牌
currentIndex = currentIndex % activeCards.length;

const currentCard = activeCards[currentIndex];

    // 判断花色是不是红色
    const isRed = currentCard.suit === "♥" || currentCard.suit === "♦";

    // 根据花色设置颜色
    const suitColor = isRed ? "#bd3039" : "#191919";

    // 创建卡牌页面，使用 textContent 安全填入用户文字
    cardDeck.innerHTML = `
        <div class="card">
            <span class="card-suit"></span>

            <div class="card-content">
    <h2 class="memo-content"></h2>
</div>

            <span class="card-suit bottom"></span>
        </div>
    `;

   // 把数字 1 显示为扑克牌的 A
const priorityText =
    !currentCard.priority || currentCard.priority === 1
        ? "A"
        : currentCard.priority;

// 更新左上角和右下角
const suitElements = cardDeck.querySelectorAll(".card-suit");

suitElements.forEach(element => {

    element.textContent = priorityText + currentCard.suit;

    element.style.color = suitColor;

});

    cardDeck.querySelector(".memo-content").textContent = currentCard.text;
}

// ==============================
// 7. 按钮点击事件
// ==============================

addButton.addEventListener("click", addCard);

// 按回车也可以创建卡牌
memoInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addCard();
    }
});

// ==============================
// 8. 打开页面时显示卡牌
// ==============================

showCard();
// ==============================
// 9. 抽牌功能 DRAW
// ==============================

function drawCard() {

    // 只查看还没有完成的卡牌
    const activeCards = cards.filter(card => card.status === "active");

    // 没有卡牌时不执行
    if (activeCards.length === 0) {
        return;
    }

    // 动画进行时，不能重复抽牌
    if (isDrawing) {
        return;
    }

    isDrawing = true;

    // 找到当前显示的卡牌
    const currentCardElement = cardDeck.querySelector(".card");

    // 让卡牌向右滑出
    currentCardElement.classList.add("drawing");

    // 等待动画结束
    setTimeout(() => {

        // 移动到下一张
        currentIndex++;

        // 如果已经是最后一张，就回到第一张
        if (currentIndex >= activeCards.length) {
            currentIndex = 0;
        }

        // 显示下一张卡牌
        showCard();

        // 动画结束，可以继续抽牌
        isDrawing = false;

    }, 350);
}


// ==============================
// 10. 点击卡牌进行抽牌
// ==============================

// ==============================
// 10. 区分单击 DRAW 和双击 PLAY
// ==============================

cardDeck.addEventListener("click", (event) => {
    // 没有待处理卡牌时，不执行抽牌或出牌
if (!cards.some(card => card.status === "active")) return;
    // 只有 ACTIVE 牌堆可以抽牌和出牌
if (currentDeck !== "active") return;
    if (suppressClick) {
    suppressClick = false;
    return;
}

    // 如果动画还在进行，不接受新操作
    if (isDrawing) return;

    // 取消之前等待中的单击操作
    clearTimeout(drawTimer);

    if (event.detail >= 2) {

        // 双击：出牌，完成任务
        playCard();

    } else {

        // 单击：等待一下，确认不是双击
        drawTimer = setTimeout(() => {
            drawCard();
        }, 300);

    }
});
// ==============================
// 11. 出牌功能 PLAY
// ==============================

function playCard() {

    // 找到所有未完成的卡牌
    const activeCards = cards.filter(card => card.status === "active");

    if (activeCards.length === 0 || isDrawing) {
        return;
    }

    // 找到当前卡牌
    const currentCard = activeCards[currentIndex % activeCards.length];

    // 找到卡牌元素
    const cardElement = cardDeck.querySelector(".card");

    // 阻止其他操作
    isDrawing = true;

    // 播放出牌动画
    cardElement.classList.add("playing");

    setTimeout(() => {

        // 将卡牌标记为已完成
        currentCard.status = "completed";

        // 保存到浏览器
        saveCards();

        // 重新计算未完成的卡牌
        const remainingCards = cards.filter(card => card.status === "active");

        // 如果已经没有剩余的卡牌
        if (remainingCards.length === 0) {
            currentIndex = 0;
        } else {
            currentIndex = currentIndex % remainingCards.length;
        }

        // 显示下一张卡牌
        showCard();

        // 恢复操作
        isDrawing = false;

    }, 450);
}
// ==============================
// 12. 向右滑动 HOLD
// ==============================

let startX = 0;
let startY = 0;
let isDragging = false;
let suppressClick = false;

cardDeck.addEventListener("pointerdown", (event) => {

    if (isDrawing) return;

    const card = event.target.closest(".card");
    if (!card) return;
    // 没有待处理卡牌时，禁止拖动空卡牌
if (!cards.some(card => card.status === "active")) return;

    startX = event.clientX;
    startY = event.clientY;

   isDragging = true;

// 持续接收拖动事件
cardDeck.setPointerCapture(event.pointerId);

card.style.transition = "none";
});

cardDeck.addEventListener("pointermove", (event) => {

    if (!isDragging || isDrawing) return;

    const card = cardDeck.querySelector(".card");
    if (!card) return;

    const moveX = event.clientX - startX;
    const moveY = event.clientY - startY;

    // 跟随鼠标或手指移动
    card.style.transform =
        `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.05}deg)`;
});

cardDeck.addEventListener("pointerup", (event) => {

    if (!isDragging || isDrawing) return;

    isDragging = false;

    const card = cardDeck.querySelector(".card");
    if (!card) return;

   const moveX = event.clientX - startX;
const moveY = event.clientY - startY;

// 只要明显发生拖动，就不触发单击抽牌
if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10) {
    suppressClick = true;
}

    card.style.transition = "transform 0.3s ease";

    // 向上滑动超过 100px：弃牌
if (moveY < -100 && Math.abs(moveY) > Math.abs(moveX)) {

    discardCard(card);

// 向右滑动超过 100px：留牌
} else if (moveX > 100) {

    holdCard(card);

// 拖动距离不够：弹回原位
} else {

    card.style.transform = "";

}
});


// ==============================
// 13. 留牌功能 HOLD
// ==============================

function holdCard(cardElement) {

    const activeCards = cards.filter(card => card.status === "active");

    if (activeCards.length === 0 || isDrawing) return;

    const currentCard = activeCards[currentIndex % activeCards.length];

    isDrawing = true;

    // 向右飞出
    cardElement.style.transition = "transform 0.4s ease, opacity 0.4s ease";
    cardElement.style.transform = "translateX(500px) rotate(30deg)";
    cardElement.style.opacity = "0";

    setTimeout(() => {

        currentCard.status = "held";

        saveCards();

        const remainingCards = cards.filter(card => card.status === "active");

        if (remainingCards.length === 0) {
            currentIndex = 0;
        } else {
            currentIndex = currentIndex % remainingCards.length;
        }

        showCard();

        isDrawing = false;

    }, 400);
}
// ==============================
// 14. 弃牌功能 DISCARD
// ==============================

function discardCard(cardElement) {

    const activeCards = cards.filter(
        card => card.status === "active"
    );

    if (activeCards.length === 0 || isDrawing) {
        return;
    }

    const currentCard = activeCards[currentIndex % activeCards.length];

    // 防止动画过程中重复操作
    isDrawing = true;

    // 向上甩飞动画
    cardElement.style.transition =
        "transform 0.45s ease-in, opacity 0.45s ease-in";

    cardElement.style.transform =
        "translateY(-600px) rotate(20deg)";

    cardElement.style.opacity = "0";

    setTimeout(() => {

        // 从卡牌数组中删除
        cards = cards.filter(card => card.id !== currentCard.id);

        // 保存删除后的数据
        saveCards();

        // 重新计算剩余卡牌
        const remainingCards = cards.filter(
            card => card.status === "active"
        );

        if (remainingCards.length === 0) {
            currentIndex = 0;
        } else {
            currentIndex = currentIndex % remainingCards.length;
        }

        // 显示下一张
        showCard();

        isDrawing = false;

    }, 450);
}

// ==============================
// 15. 三个牌堆的切换功能
// ==============================

// 获取三个牌堆按钮
const deckTabs = document.querySelectorAll(".deck-tab");

// 获取显示暂存和已完成卡牌的区域
const savedCardsContainer = document.getElementById("saved-cards");

// 当前正在查看哪个牌堆
let currentDeck = "active";

// 点击牌堆按钮
deckTabs.forEach(button => {

    button.addEventListener("click", () => {

        // 防止动画过程中切换
        if (isDrawing) return;

        // 记录选择的牌堆
        currentDeck = button.dataset.deck;

        // 更新按钮外观
        deckTabs.forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        // 显示对应牌堆
        renderDeck();

    });

});


// ==============================
// 16. 更新三个牌堆的数量
// ==============================

function updateCounts() {

    const activeCount = cards.filter(
        card => card.status === "active"
    ).length;

    const heldCount = cards.filter(
        card => card.status === "held"
    ).length;

    const completedCount = cards.filter(
        card => card.status === "completed"
    ).length;

    document.getElementById("active-count").textContent = activeCount;

    document.getElementById("held-count").textContent = heldCount;

    document.getElementById("completed-count").textContent = completedCount;
}


// ==============================
// 17. 显示当前选择的牌堆
// ==============================

function renderDeck() {

    // 更新数量
    updateCounts();

    // 获取主要扑克牌区域
    const deckArea = document.getElementById("card-deck");

    // 获取抽牌提示文字
    const deckHint = document.querySelector(".deck-hint");

    // 如果正在查看 ACTIVE
    if (currentDeck === "active") {

        deckArea.style.display = "block";

        deckHint.style.display = "block";

        savedCardsContainer.style.display = "none";

        showCard();

        return;
    }

    // 如果正在查看 HELD 或 COMPLETED
    deckArea.style.display = "none";

    deckHint.style.display = "none";

    savedCardsContainer.style.display = "flex";

    showSavedCards();
}


// ==============================
// 18. 显示暂存或已完成的 Memo
// ==============================

function showSavedCards() {

    // 清空之前的内容
    savedCardsContainer.innerHTML = "";

    // 找到当前牌堆中的卡牌
    const filteredCards = cards.filter(
        card => card.status === currentDeck
    );

    // 如果这个牌堆没有卡牌
    if (filteredCards.length === 0) {

        savedCardsContainer.innerHTML = `
            <p class="empty-deck">${getMemoText().emptyList}</p>
        `;

        return;
    }

    // 遍历当前牌堆中的每一张卡牌
    filteredCards.forEach(card => {

        const cardItem = document.createElement("div");
        cardItem.className = "saved-card";

        const cardInfo = document.createElement("div");
        cardInfo.className = "saved-card-info";

        // 卡牌花色
        const suitElement = document.createElement("span");
        suitElement.className = "saved-card-suit";
        suitElement.textContent = card.suit;

        // 红桃和方块显示红色
        if (card.suit === "♥" || card.suit === "♦") {
            suitElement.style.color = "#bd3039";
        }

        // Memo 内容
        const textElement = document.createElement("span");
        textElement.className = "saved-card-text";
        textElement.textContent = card.text;

        cardInfo.appendChild(suitElement);
        cardInfo.appendChild(textElement);

        cardItem.appendChild(cardInfo);

        // 只有 HELD 牌堆有 RETURN 按钮
        if (currentDeck === "held") {

            const returnButton = document.createElement("button");
            returnButton.textContent = getMemoText().returnButton;

            returnButton.addEventListener("click", () => {

                // 将卡牌放回 ACTIVE
                card.status = "active";

                // 保存数据
                saveCards();

                // 更新显示
                renderDeck();

            });

            cardItem.appendChild(returnButton);
        }

        // 已完成的卡牌显示删除按钮
if (currentDeck === "completed") {
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = getCompletedDeleteText().button;

    deleteButton.addEventListener("click", () => {
        const confirmed = window.confirm(
            getCompletedDeleteText().confirm
        );

        if (!confirmed) return;

        // 删除当前这张已完成卡牌
        cards = cards.filter(item =>
            !(item.id === card.id && item.status === "completed")
        );

        // 保存数据、更新数量和列表
        saveCards();
        renderDeck();
    });

    cardItem.appendChild(deleteButton);
}
        savedCardsContainer.appendChild(cardItem);

    });
}


// ==============================
// 19. 页面初始化
// ==============================

renderDeck();
// ==============================
// 21. 洗牌功能 SHUFFLE
// ==============================

const shuffleButton = document.getElementById("shuffle-button");

shuffleButton.addEventListener("click", () => {

    // 动画过程中不能洗牌
    if (isDrawing) return;

    // 只洗 ACTIVE 牌堆
    const activeCards = cards.filter(
        card => card.status === "active"
    );

    // Fisher-Yates 洗牌算法
    for (let i = activeCards.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        // 交换两张卡牌的位置
        [activeCards[i], activeCards[j]] =
            [activeCards[j], activeCards[i]];

    }

    // HELD 和 COMPLETED 不参与洗牌
    const otherCards = cards.filter(
        card => card.status !== "active"
    );

    // 更新整个卡牌数组
    cards = [...activeCards, ...otherCards];

    // 从洗牌后的第一张开始查看
    currentIndex = 0;

    // 保存新顺序
    saveCards();

    // 更新页面
    renderDeck();

});

// ==============================
// 20. 按优先级排序 SORT
// ==============================

const sortButton = document.getElementById("sort-button");

sortButton.addEventListener("click", () => {

    // 动画过程中不允许排序
    if (isDrawing) return;

    // 找到所有 ACTIVE 卡牌
    const activeCards = cards.filter(
        card => card.status === "active"
    );

    // 按照优先级排序：A → 2 → 3 → 4 → 5
    activeCards.sort((a, b) => {
        return (a.priority || 1) - (b.priority || 1);
    });

    // 保留 HELD 和 COMPLETED 卡牌
    const otherCards = cards.filter(
        card => card.status !== "active"
    );

    // 更新整个卡牌数组
    cards = [...activeCards, ...otherCards];

    // 从第一张开始显示
    currentIndex = 0;

    // 保存排序结果
    saveCards();

    // 更新页面
    renderDeck();

});

// ==============================
// 22. HOW TO PLAY 操作指南
// ==============================

// 获取操作指南相关元素
const helpButton = document.getElementById("help-button");
const helpOverlay = document.getElementById("help-overlay");
const closeHelpButton = document.getElementById("close-help");

// 打开操作指南
function openHelp() {
    helpOverlay.style.display = "flex";
}

// 关闭操作指南
function closeHelp() {
    helpOverlay.style.display = "none";

    // 记录用户已经看过操作指南
    localStorage.setItem("hasSeenHelp", "true");
}

// 点击右上角的 ? 按钮
helpButton.addEventListener("click", openHelp);

// 点击 LET'S PLAY 关闭说明
closeHelpButton.addEventListener("click", closeHelp);

// 点击弹窗外面的黑色背景也可以关闭
helpOverlay.addEventListener("click", (event) => {
    if (event.target === helpOverlay) {
        closeHelp();
    }
});

// 按 ESC 键关闭弹窗
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeHelp();
    }
});

// ==============================
// 23. 第一次访问时自动显示指南
// ==============================

// 检查用户是否已经看过操作指南
const hasSeenHelp = localStorage.getItem("hasSeenHelp");

// 如果没有看过，就自动打开
if (hasSeenHelp !== "true") {
    openHelp();
}
// ==============================
// 24. 主界面三语言切换
// ==============================

const languageSelect = document.getElementById("language-select");

const interfaceText = {
    en: {
        newCard: "NEW CARD",
        placeholder: "Write your thought...",
        priority: "PRIORITY",
        add: "ADD TO DECK +",
        draw: "DRAW A CARD",
        sort: "SORT BY PRIORITY ↕",
        shuffle: "SHUFFLE ↻",
        active: "ACTIVE",
        held: "HELD",
        completed: "COMPLETED",
        language: "Choose language",
        help: "How to play"
    },

    ko: {
        newCard: "새 카드",
        placeholder: "생각을 적어 보세요...",
        priority: "우선순위",
        add: "카드 추가 +",
        draw: "카드 뽑기",
        sort: "우선순위 정렬 ↕",
        shuffle: "카드 섞기 ↻",
        active: "진행 전",
        held: "보류",
        completed: "완료",
        language: "언어 선택",
        help: "사용 방법"
    },

    zh: {
        newCard: "新建卡牌",
        placeholder: "写下你的想法...",
        priority: "优先级",
        add: "加入牌堆 +",
        draw: "抽取卡牌",
        sort: "按优先级排序 ↕",
        shuffle: "洗牌 ↻",
        active: "待处理",
        held: "暂存",
        completed: "已完成",
        language: "选择语言",
        help: "使用方法"
    }
};

// 切换主界面文字
function applyInterfaceLanguage(language) {
    const selectedLanguage = interfaceText[language] ? language : "en";
    const text = interfaceText[selectedLanguage];

    document.documentElement.lang = selectedLanguage;
    languageSelect.value = selectedLanguage;

    // 普通文字与按钮
    const labels = {
        ".memo-input h2": text.newCard,
        ".priority-label": text.priority,
        "#add-card": text.add,
        ".deck-hint": text.draw,
        "#sort-button": text.sort,
        "#shuffle-button": text.shuffle
    };

    Object.entries(labels).forEach(([selector, label]) => {
        const element = document.querySelector(selector);

        if (element) {
            element.textContent = label;
        }
    });

    memoInput.placeholder = text.placeholder;

    languageSelect.setAttribute("aria-label", text.language);
    helpButton.setAttribute("aria-label", text.help);

    // 只修改牌堆名称，保留显示数量的 span
    deckTabs.forEach(tab => {
        const label = text[tab.dataset.deck];
        if (!label) return;

        let nameNode = Array.from(tab.childNodes).find(node =>
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim() !== ""
        );

        if (!nameNode) {
            nameNode = document.createTextNode("");
            tab.prepend(nameNode);
        }

        nameNode.textContent = label + " ";
    });
}

// 用户选择语言时，立即更新并保存
languageSelect.addEventListener("change", () => {
    const language = languageSelect.value;

        applyInterfaceLanguage(language);
    applyHelpLanguage(language);
    applySuitLanguage(language);
   // 同步当前卡牌、空列表及返回和删除按钮的语言
// 动画进行中不重建卡牌，动画结束后会使用最新语言
if (!isDrawing) {
    renderDeck();
}
    try {
        localStorage.setItem("deckLanguage", language);
    } catch {
        // 无法保存时，本次页面仍然可以切换语言
    }
});

// 打开页面时，恢复上次选择的语言
let savedLanguage = "en";

try {
    savedLanguage = localStorage.getItem("deckLanguage") || "en";
} catch {
    // 无法读取时，默认使用英语
}

applyInterfaceLanguage(savedLanguage);
// ==============================
// 25. 操作指南三语言文字
// ==============================

const helpTranslations = {
    en: {
        title: "HOW TO PLAY",
        subtitle: "EVERY THOUGHT IS A CARD.",
        rules: [
            ["TAP", "DRAW — View the next card"],
            ["DOUBLE TAP", "PLAY — Complete a memo"],
            ["SWIPE RIGHT →", "HOLD — Save for later"],
            ["SWIPE UP ↑", "DISCARD — Delete a memo"],
            ["SORT", "Arrange cards by priority"],
            ["SHUFFLE", "Randomize the deck"]
        ],
        note: "A IS THE HIGHEST PRIORITY.",
        start: "LET'S PLAY →"
    },

    ko: {
        title: "사용 방법",
        subtitle: "모든 생각이 한 장의 카드가 됩니다.",
        rules: [
            ["한 번 탭", "뽑기 — 다음 카드를 확인합니다"],
            ["두 번 탭", "완료 — 현재 메모를 완료합니다"],
            ["오른쪽으로 밀기 →", "보류 — 나중을 위해 보관합니다"],
            ["위로 밀기 ↑", "삭제 — 현재 메모를 삭제합니다"],
            ["정렬", "우선순위에 따라 카드를 정렬합니다"],
            ["섞기", "카드 순서를 무작위로 섞습니다"]
        ],
        note: "A가 가장 높은 우선순위입니다.",
        start: "시작하기 →"
    },

    zh: {
        title: "使用方法",
        subtitle: "每一个想法，都是一张卡牌。",
        rules: [
            ["单击", "抽牌 — 查看下一张卡牌"],
            ["双击", "完成 — 将当前备忘录标记为已完成"],
            ["向右滑动 →", "暂存 — 留到以后处理"],
            ["向上滑动 ↑", "删除 — 删除当前备忘录"],
            ["排序", "按照优先级排列卡牌"],
            ["洗牌", "随机打乱卡牌顺序"]
        ],
        note: "A 代表最高优先级。",
        start: "开始使用 →"
    }
};

function applyHelpLanguage(language) {
    const text = helpTranslations[language] || helpTranslations.en;

    document.querySelector(".help-heading h2").textContent = text.title;
    document.querySelector(".help-heading p").textContent = text.subtitle;
    document.querySelector(".help-note").textContent = text.note;
    document.getElementById("close-help").textContent = text.start;

    document.querySelectorAll(".help-rule").forEach((rule, index) => {
        const translation = text.rules[index];
        if (!translation) return;

        rule.querySelector("span").textContent = translation[0];
        rule.querySelector("p").textContent = translation[1];
    });
}

// 首次加载时，同步已经选择的语言
applyHelpLanguage(languageSelect.value);
// ==============================
// 26. 花色介绍三语言文字
// ==============================

const suitTranslations = {
    en: {
        title: "THE FOUR SUITS",
        items: [
            ["WORK & STUDY", "Tasks, projects & learning"],
            ["PEOPLE", "Friends, family & connections"],
            ["IDEAS", "Thoughts, inspiration & possibilities"],
            ["LIFE", "Everyday plans & personal errands"]
        ]
    },

    ko: {
        title: "네 가지 카드 무늬",
        items: [
            ["일과 공부", "과제, 프로젝트와 학습"],
            ["사람과 관계", "친구, 가족과 소중한 인연"],
            ["아이디어", "생각, 영감과 새로운 가능성"],
            ["일상생활", "일상 계획과 개인적인 용무"]
        ]
    },

    zh: {
        title: "四种花色",
        items: [
            ["工作与学习", "作业、项目与学习任务"],
            ["人际与关系", "朋友、家人与人际联系"],
            ["灵感与创意", "想法、灵感与新的可能"],
            ["日常生活", "日常计划与个人事务"]
        ]
    }
};

function applySuitLanguage(language) {
    const text = suitTranslations[language] || suitTranslations.en;

    document.getElementById("suit-guide-title").textContent = text.title;

    document.querySelectorAll(".suit-guide-item").forEach((item, index) => {
        const translation = text.items[index];
        if (!translation) return;

        item.querySelector("h3").textContent = translation[0];
        item.querySelector("p").textContent = translation[1];
    });
}

// 打开页面时，恢复对应语言
applySuitLanguage(languageSelect.value);
// ==============================
// 27. 已完成卡牌的删除提示
// ==============================

function getCompletedDeleteText() {
    const translations = {
        en: {
            button: "DELETE",
            confirm: "Delete this completed memo? This cannot be undone."
        },
        ko: {
            button: "삭제",
            confirm: "완료한 메모를 삭제할까요? 삭제 후에는 복구할 수 없습니다."
        },
        zh: {
            button: "删除",
            confirm: "确定删除这条已完成的备忘录吗？删除后无法恢复。"
        }
    };

    return translations[languageSelect.value] || translations.en;
}
// ==============================
// 28. 空牌堆、返回按钮与输入提醒的翻译
// ==============================

function getMemoText() {
    const translations = {
        en: {
            emptyTitle: "EMPTY DECK",
            emptyDescription: "Add a new card to start playing.",
            emptyList: "NO CARDS HERE YET",
            returnButton: "RETURN",
            inputRequired: "Please write your thought first!"
        },
        ko: {
            emptyTitle: "빈 카드 덱",
            emptyDescription: "새 카드를 추가해 시작해 보세요.",
            emptyList: "아직 카드가 없어요",
            returnButton: "되돌리기",
            inputRequired: "먼저 생각을 적어 주세요!"
        },
        zh: {
            emptyTitle: "空牌堆",
            emptyDescription: "添加一张新卡牌，开始记录想法。",
            emptyList: "这里还没有卡牌",
            returnButton: "放回",
            inputRequired: "请先写下你的想法！"
        }
    };

    return translations[document.documentElement.lang]
        || translations.en;
}

// 页面加载后，按已选语言刷新卡牌和列表
renderDeck();