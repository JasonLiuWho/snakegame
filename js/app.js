class Game {

    constructor() {
        //colors
        this.boardBorder = "dodgerblue";
        this.boardBg = "blue";
        this.snakeColor = "yellow";
        this.snakeBorder = "red";

        //snake
        this.snake = [
            {x: 200, y: 200},
            {x: 190, y: 200},
            {x: 180, y: 200},
            {x: 170, y: 200},
            {x: 160, y: 200}
        ];

        this.snakeBoard = document.getElementById("snakeBoard");
        this.snakeBoardCtx = this.snakeBoard.getContext("2d");

        //direction and velocity
        this.dx = 10;
        this.dy = 0;

        //speed
        this.speed = 100;

        this.changingDirection = false;

        // food 
        this.foodX = 0;
        this.foodY = 0;
        
        // score
        this.score = {
            currScore: 0,
            prevScore: 0,
            hiScore: 0,
        }
    };
    
    startGame() {
        this.snake = [
            {x: 200, y: 200},
            {x: 190, y: 200},
            {x: 180, y: 200},
            {x: 170, y: 200},
            {x: 160, y: 200}
        ];
        this.dx = 10;
        this.dy = 0;

        this.speed = 100;
        
        this.foodX = 0;
        this.foodY = 0;
        
        this.score = {
            currScore: 0,
            prevScore: this.score.prevScore,
            hiScore: this.score.hiScore
        }
        
        snake.init()

        snake.generateFood()
    }

    init() {

        if(this.hasGameEnded()) {
            this.setPrevScore()
            return
        }

        this.changingDirection = false
        //set timer
        setTimeout(() => {
            this.makeCanvas();
            this.drawSnake();
            this.drawFood();
            this.moveSnake();
            
            //call init(), recursion
            this.init()
        }, this.speed);
    };

    // 1 makeCanvas
    makeCanvas() {
        const snakeBoard = this.snakeBoard;
        const snakeBoardCtx = this.snakeBoardCtx;

        snakeBoardCtx.fillStyle = this.boardBg;
        snakeBoardCtx.strokeStyle = this.boardBorder;
        snakeBoardCtx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
        snakeBoardCtx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);

    };

    // 2 drawSnake
    drawSnake() {
        const snake = this.snake;
        const snakeBoardCtx = this.snakeBoardCtx;

        snake.forEach(snakePart => {
            snakeBoardCtx.fillStyle = this.snakeColor;
            snakeBoardCtx.strokeStyle = this.snakeBorder;
            snakeBoardCtx.fillRect(snakePart.x, snakePart.y, 10, 10);
            snakeBoardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10);
        })
    };

    // 3 moveSnake
    moveSnake() {
        const snake = this.snake;
        const head = {x: snake[0].x + this.dx, y: snake[0].y + this.dy};
        snake.unshift(head);

        // ? when snake eat food
        const hasEatenFood = snake[0].x === this.foodX && snake[0].y === this.foodY;

        if (hasEatenFood) {
            this.score.currScore+= 10;
            this.setScores()
            const displayScore = document.getElementById("score");
            displayScore.innerText = this.score.currScore;
            this.generateFood();
        } else {
            // move pop inside else
            snake.pop();   
        };
    };

    setScores() {
        const hiScoreDisplay = document.getElementById("hiScore");
        if (this.score.currScore > this.score.hiScore) {
            this.score.hiScore = this.score.currScore
        }
        
        hiScoreDisplay.innerText = this.score.hiScore
    }
    
    setPrevScore() {
        const prevScoreDisplay = document.getElementById("prevScore");
        if (this.hasGameEnded()) {
            this.score.prevScore = this.score.currScore 
        }

        prevScoreDisplay.innerText = this.score.prevScore
    }

    // 4 change direction
    changeDirection(e) {
        const LEFT = 37;
        const RIGHT = 39;
        const UP = 38;
        const DOWN = 40;

        if(this.changingDirection) return
        this.changingDirection = true;

        const keyPressed = e.keyCode;
        // console.log(keyPressed);

        const goingUP = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx ===-10;

        if (keyPressed === LEFT && !goingRight) {
            this.dx = -10;
            this.dy = 0;
        };

        if (keyPressed === UP && !goingDown) {
            this.dx = 0;
            this.dy = -10;
        };

        if (keyPressed === RIGHT && !goingLeft) {
            this.dx = 10;
            this.dy = 0;
        };

        if (keyPressed === DOWN && !goingUP) {
            this.dx = 0;
            this.dy = 10;
        };
    };

    // has game ended
    hasGameEnded() {
        const snake = this.snake;
        const snakeBoard = this.snakeBoard;

        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        };

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > this.snakeBoard.width - 10;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > snakeBoard.height - 10;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
    };

    // 5 drawFood
    drawFood() {
        this.snakeBoardCtx.fillStyle = "brown";
        this.snakeBoardCtx.strokeStyle = "lime";
        this.snakeBoardCtx.fillRect(this.foodX, this.foodY, 10, 10);
        this.snakeBoardCtx.strokeRect(this.foodX, this.foodY, 10, 10)
    };

    randomFood(min, max) {
        return Math.round((Math.random() * (max - min) +min) / 10) * 10
    };

    // generatefood
    generateFood() {
        this.foodX = this.randomFood(0, this.snakeBoard.width - 10);
        this.foodY = this.randomFood(0, this.snakeBoard.height - 10);

        this.snake.forEach(part => {
            const hasEaten = part.x === this.foodX && part.y === this.foodY;

            if (hasEaten) {
                this.generateFood()
            };
        });
    };
};

const snake = new Game()

const gameBtn = document.getElementById("gameBtn")

gameBtn.addEventListener("click", ()=> {
    snake.startGame()
})
snake.init()

document.addEventListener("keydown", ()=> {
    snake.changeDirection(event);
});

snake.generateFood();