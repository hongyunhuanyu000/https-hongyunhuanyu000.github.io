document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');

    // 游戏变量
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let gameRunning = false;
    let gameLoop;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    
    // 初始化高分
    highScoreElement.textContent = highScore;
    
    // 初始化游戏
    function initGame() {
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        generateFood();
        
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = score;
        
        // 禁用开始按钮，启用重新开始按钮
        startBtn.disabled = true;
        restartBtn.disabled = false;
    }
    
    // 生成食物
    function generateFood() {
        // 随机生成食物位置
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // 确保食物不会生成在蛇身上
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                return generateFood();
            }
        }
    }
    
    // 绘制游戏
    function drawGame() {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制蛇
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#2E8B57' : '#3CB371'; // 蛇头和蛇身颜色不同
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            
            // 绘制边框
            ctx.strokeStyle = '#1E5631';
            ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
        
        // 绘制食物
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        const centerX = food.x * gridSize + gridSize / 2;
        const centerY = food.y * gridSize + gridSize / 2;
        const radius = gridSize / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // 更新游戏状态
    function updateGame() {
        // 更新方向
        direction = nextDirection;
        
        // 获取蛇头位置
        const head = {x: snake[0].x, y: snake[0].y};
        
        // 根据方向移动蛇头
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            gameOver();
            return;
        }
        
        // 检查是否撞到自己
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }
        
        // 在蛇数组前面添加新的头部
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            // 增加分数
            score += 10;
            scoreElement.textContent = score;
            
            // 更新最高分
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // 生成新的食物
            generateFood();
        } else {
            // 如果没有吃到食物，移除蛇尾
            snake.pop();
        }
    }
    
    // 游戏结束
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        startBtn.disabled = false;
        
        // 显示游戏结束信息
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 15);
        
        ctx.font = '20px Arial';
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // 开始游戏
    function startGame() {
        if (!gameRunning) {
            initGame();
            gameRunning = true;
            gameLoop = setInterval(() => {
                updateGame();
                drawGame();
            }, 150); // 控制游戏速度
        }
    }
    
    // 重新开始游戏
    function restartGame() {
        if (gameRunning) {
            clearInterval(gameLoop);
        }
        startGame();
    }
    
    // 按钮事件监听
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    
    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // 初始绘制游戏
    drawGame();
});