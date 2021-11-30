"use strict";
/*
 * An interactive game of Gomoku
 * made by Tobias Filler
 * s1910238016
 */

const DIMENSION = 9;
const STORAGE_KEY = "mtd280.GomokuGame.Filler.2021";
const CURRENT_VERSION = "0.3";

Vue.createApp({
    data: function() {
        return {
            fancy: true,
            gameOver: false,
            stoneColor: 0,
            board: [[]], //an array that stores our board.
            // 0 = no Stone, 1 = Black Stone and 2 = White Stone

        }
    },
    methods:{
        drawBoard: function () {
            //background
            this.ctx.fillStyle = 'rgb(166,111,65)'; //background color
            this.ctx.strokeStyle = 'rgb(133,88,71)'; //stroke color
            this.ctx.lineWidth = 10;
            this.ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            this.ctx.strokeRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

            let offsetX, offsetY;


            offsetX = this.colSize / 2;
            offsetY = this.rowSize / 2;

            this.ctx.fillStyle = 'rgb(0, 0, 0)';
            this.ctx.strokeStyle = 'rgb(0,0,0)';
            this.ctx.lineWidth = 1;

            for (let i = 0; i < DIMENSION; i++){

                //vertical lines
                this.ctx.moveTo(offsetX + i * this.colSize,offsetY);
                this.ctx.lineTo(offsetX + i * this.colSize, this.$refs.canvas.height - offsetY);

                //horizontal lines
                this.ctx.moveTo(offsetX , offsetY + i * this.rowSize);
                this.ctx.lineTo(this.$refs.canvas.width - offsetX , offsetY + i * this.rowSize);

            }

            this.ctx.stroke();
            this.ctx.closePath();

            //drawing the stones
            for (let i = 0; i < DIMENSION; i++){
                for (let y = 0; y < DIMENSION; y++){
                    if (this.board[i][y] !== 0){
                        if (this.fancy){
                            this.drawStoneImg(i*this.colSize+offsetX,y*this.rowSize+offsetY,this.board[i][y],offsetX,offsetY);
                        } else {
                            this.drawStone(i*this.colSize+offsetX,y*this.rowSize+offsetY,this.board[i][y]);
                        }

                    }
                }
            }
        },

        clickHandler: function (e) {
            let x,y;
            x = e.clientX - this.$refs.canvas.getBoundingClientRect().left;
            y = e.clientY - this.$refs.canvas.getBoundingClientRect().top;
            x = Math.floor(x / this.colSize);
            y = Math.floor(y / this.rowSize);

            if (!this.gameOver) {
                if (this.board[x][y] === 0) {
                    this.board[x][y] = 1 + this.stoneColor;
                    this.stoneColor = this.stoneColor === 0 ? 1 : 0;
                }
                this.drawBoard();
                this.gameOver = this.victoryConditionCheck();
            }

            //console.log(x + "," + y);

        },

        drawStone(x,y,StoneColor){
            this.ctx.beginPath();
            this.ctx.fillStyle = StoneColor === 1? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';

            this.ctx.arc(x, y, this.colSize*(2/3)/2,0,Math.PI*2,true);

            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        },

        drawStoneImg(x,y,StoneColor,offsetX,offsetY){
            if (StoneColor === 1){
                this.ctx.drawImage(this.stoneBlack, x-offsetX*(3/4), y-offsetY*(3/4),this.colSize*(3/4),this.rowSize*(3/4));
            } else {
                this.ctx.drawImage(this.stoneWhite, x-offsetX*(3/4), y-offsetY*(3/4),this.colSize*(3/4),this.rowSize*(3/4));
            }

        },

        victoryConditionCheck: function(){
            let numWin = 5;

            let timesInX = 0, playerX = 1;
            let timesInY = 0, playerY = 1;

            for (let i = 0; i < DIMENSION; i++){
                for (let y = 0; y < DIMENSION; y++){

                    let boardPos = this.board[i][y];
                    //Condition check in x
                    if (boardPos === playerX){
                        timesInX++
                    } else if (boardPos === 0){
                        timesInX = 0;
                    } else {
                        playerX = boardPos;
                        timesInX = 1;
                    }
                    if (timesInX === numWin){
                        return true;
                    }

                    boardPos = this.board[y][i];
                    //Condition check in y
                    if (boardPos === playerY){
                        timesInY++
                    } else if (boardPos === 0){
                        timesInY = 0;
                    } else {
                        playerY = boardPos;
                        timesInY = 1;
                    }
                    if (timesInY === numWin){
                        return true;
                    }
                }
            }

            for (let i = 0; i < DIMENSION - (numWin-1); i++){
                for (let y = 0; y < DIMENSION - i; y++) {
                    let boardPos = this.board[i+y][y];

                    //Condition check in + diagonal x
                    if (boardPos === playerX){
                        timesInX++
                    } else if (boardPos === 0){
                        timesInX = 0;
                    } else {
                        playerX = boardPos;
                        timesInX = 1;
                    }
                    if (timesInX === numWin){
                        return true;
                    }

                    boardPos = this.board[i][y + i];
                    //Condition check in + diagonal y
                    if (boardPos === playerY){
                        timesInY++
                    } else if (boardPos === 0){
                        timesInY = 0;
                    } else {
                        playerY = boardPos;
                        timesInY = 1;
                    }
                    if (timesInY === numWin){
                        return true;
                    }

                }
            }

            for (let i = DIMENSION-1; i >= (numWin-1); i--){
                for (let y = 0; y < i; y++) {
                    let boardPos = this.board[i-y][y];

                    //Condition check in - diagonal x
                    if (boardPos === playerX){
                        timesInX++
                    } else if (boardPos === 0){
                        timesInX = 0;
                    } else {
                        playerX = boardPos;
                        timesInX = 1;
                    }
                    if (timesInX === numWin){
                        return true;
                    }

                }
            }

            for (let i = 0; i < DIMENSION - (numWin-1); i++) {
                for (let y = 0; y < DIMENSION - i; y++) {
                    let boardPos = this.board[i + y][y];

                    boardPos = this.board[(DIMENSION - 1) - y][y + i];
                    //Condition check in - diagonal y
                    if (boardPos === playerY) {
                        timesInY++
                    } else if (boardPos === 0) {
                        timesInY = 0;
                    } else {
                        playerY = boardPos;
                        timesInY = 1;
                    }
                    if (timesInY === numWin) {
                        return true;
                    }
                }
            }

            return false;
        },

        restartGame: function () {
            this.gameOver = false;
            this.stoneColor = 0;

            this.blankFillBoard();

            this.drawBoard();

            console.log("Game has been restarted")
        },

        blankFillBoard(){
            for (let i = 0; i < DIMENSION; i++){
                this.board[i] = [];
                for (let y = 0; y < DIMENSION; y++){
                    this.board[i][y] = 0;
                }
            }
        },

        saveData: function () {
            let save;
            save = {
                fancy: this.fancy,
                gameOver: this.gameOver,
                stoneColor: this.stoneColor,
                board: this.board,
                version: CURRENT_VERSION

            };

           localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
        },

        clearData: function () {
            localStorage.removeItem(STORAGE_KEY);
        },

        loadData: function () {
            let data = localStorage.getItem(STORAGE_KEY);

            if (data) {
                let save = JSON.parse(data);

                if (CURRENT_VERSION !== save.version){
                    console.log("This save is from an older version of the game. " +
                        "This may case some bugs!" + "Version of the Save: " + save.version)
                }

                this.fancy = save.fancy;
                this.gameOver = save.gameOver;
                this.stoneColor = save.stoneColor;
                this.board = save.board;
            }

            this.drawBoard();
        },

    },
    mounted: function () {
        this.blankFillBoard();

        this.ctx = this.$refs.canvas.getContext('2d');
        this.colSize = this.$refs.canvas.width / DIMENSION;
        this.rowSize = this.$refs.canvas.height / DIMENSION;
        this.stoneBlack = new Image();
        this.stoneBlack.src = 'res/stoneBlack128x.png';
        this.stoneWhite = new Image();
        this.stoneWhite.src = 'res/stoneWhite128x.png';

        this.drawBoard();
    },
}).mount('#app');