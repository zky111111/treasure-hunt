const map = document.getElementById('map');
const character = document.getElementById('character');
const cluePoint = document.getElementById('clue-point');
const eventText = document.getElementById('event-text');
const startButton = document.getElementById('startButton');
const clueAnimation = document.getElementById('clue-animation');
const chestAnimation = document.getElementById('chest-animation');
const castle = document.getElementById('castle');
const guard = document.getElementById('guard');
const gameOverScreen = document.getElementById('gameOver');
const congratulationsScreen = document.getElementById('congratulations');
const restartButtonGameOver = document.getElementById('restartButtonGameOver');
const restartButtonCongratulations = document.getElementById('restartButtonCongratulations');

let clueFound = false;
let treasureFound = false;
let castleVisible = false;
let guardMoving = null;

// 设置发光点的随机位置
function placeClue() {
  let clueX = Math.random() * (map.offsetWidth - 50);
  let clueY = Math.random() * (map.offsetHeight - 50);
  cluePoint.style.left = clueX + 'px';
  cluePoint.style.top = clueY + 'px';
  cluePoint.style.opacity = 1;
}

// 检查角色是否接触到线索
function checkForClue(x, y) {
  let clueX = parseFloat(cluePoint.style.left);
  let clueY = parseFloat(cluePoint.style.top);
  if (Math.abs(x - clueX) < 20 && Math.abs(y - clueY) < 20 && !clueFound) {
    clueFound = true;
    clueAnimation.style.left = clueX + 'px';
    clueAnimation.style.top = clueY + 'px';
    clueAnimation.style.display = 'block';
    clueAnimation.style.opacity = 1;
    eventText.textContent = "在古老的图书馆里找到了一个线索...";
    setTimeout(() => {
      const isClueUseful = Math.random() < 0.5;
      if (isClueUseful) {
        eventText.textContent = "解码成功!宝藏在一座古老的神庙中...";
        map.className = 'temple-background'; // 切换背景
        cluePoint.style.opacity = 0; // 隐藏发光点
        showCastle(); // 显示城堡
      } else {
        eventText.textContent = "此线索无用";
        clueFound = false;
        clueAnimation.style.opacity = 0;
        setTimeout(() => clueAnimation.style.display = 'none', 1000);
        placeClue(); // 重新放置线索
      }
    }, 2000);
  }
}

// 显示城堡
function showCastle() {
  castle.style.display = 'block';
  castleVisible = true;
  showGuard(); // 显示守卫
}

// 显示守卫
function showGuard() {
  guard.style.display = 'block';
  moveGuardRandomly(); // 启动守卫移动
}

// 随机移动守卫
function moveGuardRandomly() {
  if (!castleVisible) return;
  let newX = Math.random() * (map.offsetWidth - guard.offsetWidth);
  let newY = Math.random() * (map.offsetHeight - guard.offsetHeight);

  guard.style.left = newX + 'px';
  guard.style.top = newY + 'px';

  // 输出守卫新位置
  console.log('Guard new position:', newX, newY);

  guardMoving = setTimeout(moveGuardRandomly, 2000); // 改成使用 setTimeout 而不是 setInterval
}


// 检查是否碰到守卫
function checkForGuard(x, y) {
  let guardX = parseFloat(guard.style.left);
  let guardY = parseFloat(guard.style.top);

  // 输出调试信息
  console.log('Player Position:', x, y);  // 输出角色位置
  console.log('Guard Position:', guardX, guardY);  // 输出守卫位置

  // 确保角色和守卫接触时触发结束
  if (Math.abs(x - guardX) < 20 && Math.abs(y - guardY) < 20) {
    console.log('Guard encountered!');  // 输出碰到守卫的消息
    endGame("遇到守卫！游戏结束！");
  }
}

// 检查是否找到了宝藏
function checkForTreasure(x, y) {
  let centerX = map.offsetWidth / 2;
  let centerY = map.offsetHeight / 2;
  if (Math.abs(x - centerX) < 20 && Math.abs(y - centerY) < 20 && !treasureFound) {
    chestAnimation.style.left = centerX + 'px';
    chestAnimation.style.top = centerY + 'px';
    chestAnimation.style.display = 'block';
    chestAnimation.style.opacity = 1;
    eventText.textContent = "恭喜!你找到了传说中的宝藏!";
    treasureFound = true;
    endGame("恭喜！你找到了宝藏！");
  }
}

// 角色移动
function moveCharacter(event) {
  const speed = 10; // 移动速度
  let x = parseFloat(character.style.left) || 0;
  let y = parseFloat(character.style.top) || 0;

  // 根据键盘按键更新角色位置
  switch (event.key) {
    case 'ArrowUp': y -= speed; break;
    case 'ArrowDown': y += speed; break;
    case 'ArrowLeft': x -= speed; break;
    case 'ArrowRight': x += speed; break;
  }

  // 更新角色位置
  character.style.left = x + 'px';
  character.style.top = y + 'px';

  // 检查其他游戏逻辑
  if (!treasureFound) {
    checkForClue(x, y);
    if (castleVisible) {
      checkForGuard(x, y);
    }
    checkForTreasure(x, y);
  }
}


// 游戏启动逻辑
startButton.addEventListener('click', () => {
  // 显示提示信息
  eventText.textContent = "请用键盘移动小人，开始寻宝";

  // 隐藏提示信息：等待玩家开始移动
  const removeHint = () => {
    eventText.textContent = "";
    document.removeEventListener('keydown', removeHint); // 移除事件监听
  };

  // 等待玩家按下任何键来开始移动角色
  document.addEventListener('keydown', removeHint);

  placeClue();
  document.addEventListener('keydown', moveCharacter);
  moveGuardRandomly(); // 启动守卫的随机移动
});


// 游戏结束时显示恭喜页面或游戏结束页面
function endGame(message = "") {
  clearTimeout(guardMoving); // 停止守卫移动
  guardMoving = null;
  eventText.textContent = message;
  document.removeEventListener('keydown', moveCharacter);

  // 显示游戏结束画面
  if (message.includes("守卫")) {
    gameOverScreen.style.display = 'flex'; // 显示游戏结束画面
    setTimeout(() => {
      gameOverScreen.style.opacity = 1; // 触发动画
    }, 100);
  } else if (message.includes("宝藏")) {
    // 显示恭喜画面并添加动画
    congratulationsScreen.style.display = 'flex'; // 显示恭喜页面
    setTimeout(() => {
      congratulationsScreen.style.opacity = 1; // 触发动画
    }, 100);
  }
}
// 重新开始游戏的处理
function restartGame() {
  clueFound = false;
  treasureFound = false;
  castleVisible = false;
  character.style.left = '50%';
  character.style.top = '50%';
  cluePoint.style.opacity = 0;
  clueAnimation.style.opacity = 0;
  chestAnimation.style.opacity = 0;
  castle.style.display = 'none';
  guard.style.display = 'none';
  eventText.textContent = '';
  map.className = 'library-background'; // 重置背景为图书馆

  // 隐藏游戏结束和恭喜消息
  gameOverScreen.style.display = 'none';
  gameOverScreen.style.opacity = 0; // 隐藏动画
  congratulationsScreen.style.display = 'none';
  congratulationsScreen.style.opacity = 0; // 隐藏动画

  placeClue(); // 重新放置线索
  document.addEventListener('keydown', moveCharacter); // 重新绑定角色移动事件
  moveGuardRandomly(); // 重新启动守卫随机移动
}

// 确保页面加载后绑定事件监听器
document.addEventListener('DOMContentLoaded', () => {
  // 按钮事件：点击游戏结束画面或恭喜画面重新开始
  if (restartButtonGameOver) {
    restartButtonGameOver.addEventListener('click', restartGame);
  }

  if (restartButtonCongratulations) {
    restartButtonCongratulations.addEventListener('click', restartGame);
  }
});

