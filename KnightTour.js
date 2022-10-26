import CellState from "./CellState.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

export default class KnightTour {
    constructor(w, h) {
        this.rows = w;
        this.cols = h;
        this.board = Array(w).fill().map(() => Array(h).fill(CellState.EMPTY));
        this.route = [];    
    }
    move(endCell) {
        if (!endCell)
            throw new Error("The cell is not defined.");
        if (!this.onBoard(endCell))
            throw new Error("The cell is not on the board.");
        let beginCell = this.getPlayerCell();
        if (!this.onBoard(beginCell)) {
            this.setCellState(endCell, CellState.KNIGHT);
            return Winner.NONE;
        }
        let moves = this.getPossibleMoves();
        if (!moves.some(c => c.equals(endCell))) {
            throw new Error("This move is invalid.");
        }
        this.setCellState(endCell, CellState.KNIGHT);
        this.setCellState(beginCell, CellState.BLOCKED);
        this.route.push(beginCell);
        return this.endOfGame();
    }
    undo() {
        let currentCell = this.getPlayerCell();
        this.setCellState(currentCell, CellState.EMPTY);
        let lastCell = this.route.pop();
        if (lastCell) {
            this.setCellState(lastCell, CellState.KNIGHT);
            return lastCell;
        }
    }
    getCount() {
        return this.route.length;
    }
    getBoard() {
        return this.board;
    }
    getPossibleMoves(matrix = this.board) {
        let { x, y } = this.getPlayerCell(matrix);
        let positions = [new Cell(x - 2, y - 1), new Cell(x - 2, y + 1), new Cell(x + 2, y - 1), new Cell(x + 2, y + 1), new Cell(x - 1, y - 2), new Cell(x - 1, y + 2), new Cell(x + 1, y - 2), new Cell(x + 1, y + 2)];
        return positions.filter(cell => this.onBoard(cell) && matrix[cell.x][cell.y] === CellState.EMPTY);
    }
    tour() {
        let path = (tempBoard, cells) => {
            let moves = this.getPossibleMoves(tempBoard);
            if (moves.length === 0) {
                return !tempBoard.flat().some(c => c === CellState.EMPTY);
            } else {
                let pCell = this.getPlayerCell(tempBoard);
                this.setCellState(pCell, CellState.BLOCKED, tempBoard);
                for (let m of moves) {
                    cells.push(m);
                    this.setCellState(m, CellState.KNIGHT, tempBoard);
                    let ret = path(tempBoard, cells);
                    if (ret) {
                        return true;
                    } else {
                        this.setCellState(m, CellState.EMPTY, tempBoard);
                    }
                    cells.pop();
                }
                this.setCellState(pCell, CellState.KNIGHT, tempBoard);
                return false;
            }
        };
        let tempBoard = this.board.map(arr => arr.slice());
        let cells = [];
        path(tempBoard, cells);
        return cells;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.rows) && inLimit(y, this.cols));
    }
    getPlayerCell(matrix = this.board) {
        let index = matrix.flat().findIndex(v => v === CellState.KNIGHT);
        return new Cell(Math.floor(index / this.rows), index % this.cols);
    }
    endOfGame() {
        if (this.route.length === this.rows * this.cols - 1) {
            return Winner.WIN;
        } else if (this.getPossibleMoves().length === 0) {
            return Winner.LOSE;
        }
        return Winner.NONE;
    }
    setCellState(cell, value, matrix = this.board) {
        matrix[cell.x][cell.y] = value;
    }
}
//onload = () => {
//    let kt = new KnightTour(5, 5);
//    let mr;
//    mr = kt.move(new Cell(4, 0));
//    mr = kt.move(new Cell(3, 2));
//    mr = kt.move(new Cell(4, 4));
//    mr = kt.move(new Cell(2, 3));
//    mr = kt.move(new Cell(0, 4));
//    mr = kt.move(new Cell(1, 2));
//    mr = kt.move(new Cell(0, 0));
//    mr = kt.move(new Cell(2, 1));
//    mr = kt.move(new Cell(4, 2));
//    mr = kt.move(new Cell(3, 4));
//    mr = kt.move(new Cell(1, 3));
//    mr = kt.move(new Cell(0, 1));
//    mr = kt.move(new Cell(2, 0));
//    mr = kt.move(new Cell(4, 1));
//    mr = kt.move(new Cell(3, 3));
//    mr = kt.move(new Cell(1, 4));
//    mr = kt.move(new Cell(0, 2));
//    mr = kt.move(new Cell(1, 0));
//    mr = kt.move(new Cell(3, 1));
//    mr = kt.move(new Cell(4, 3));
//    mr = kt.move(new Cell(2, 4));
//    mr = kt.move(new Cell(0, 3));
//    mr = kt.move(new Cell(1, 1));
//    mr = kt.move(new Cell(3, 0));
//    mr = kt.move(new Cell(2, 2));
//    let b = kt.getBoard();
//    console.table(b);
//    console.table(kt.tour());
//};