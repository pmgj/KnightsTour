import KnightTour from "./KnightTour.js";
import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.game = null;
    }
    registerEvents() {
        let form = document.forms[0];
        form.rows.onchange = this.resetBoard.bind(this);
        form.cols.onchange = this.resetBoard.bind(this);
        form.reset.onclick = this.resetBoard.bind(this);
        form.solve.onclick = this.solveProblem.bind(this);
        this.resetBoard();
    }
    solveProblem() {
        let tour = this.game.tour();
        if (tour.length === 0) {
            this.setMessage("No solutions were found!");
        } else {
            this.resetStyles();
            this.unregisterEvents();
            let form = document.forms[0];
            let cols = parseInt(form.cols.value);
            let rows = parseInt(form.rows.value);
            let i = 1, lCell = document.querySelector("td img").parentNode, count = cols * rows - tour.length;
            const delay = 1000;
            for (let c of tour) {
                let cCell = this.getTableData(c);
                setTimeout(this.printKnight, delay * i++, cCell, lCell, count++);
                lCell = cCell;
            }
            setTimeout(this.printKnight, delay * i, null, lCell, count);
        }
    }
    unregisterEvents() {
        let tds = document.querySelectorAll("td");
        tds.forEach(td => {
            td.onclick = undefined;
            td.oncontextmenu = undefined;
        });
    }
    printKnight(currentCell, lastCell, count) {
        if (lastCell) {
            lastCell.innerHTML = count;
            lastCell.className = "path";
        }
        if (currentCell) {
            var img = document.createElement("img");
            img.src = "Black-Knight.svg";
            currentCell.innerHTML = "";
            currentCell.appendChild(img);
            currentCell.className = "unselected";
        }
    }
    addKnight(ev) {
        let cell = ev.currentTarget;
        try {
            let mr = this.game.move(this.coordinates(cell));
            this.resetStyles();
            this.movePiece(cell);
            this.showPossibleMoves(this.game.getPossibleMoves());
            this.changeMessage(mr);
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
    movePiece(cell) {
        let knight = document.querySelector("td img");
        if (knight) {
            let knightCell = knight.parentNode;
            knightCell.innerHTML = this.game.getCount();
            knightCell.className = "path";
        }
        cell.innerHTML = '<img src="Black-Knight.svg" alt="">';
        // cell.appendChild(knight);
    }
    removeKnight(ev) {
        ev.preventDefault();
        let knight = document.querySelector("td img");
        if (knight) {
            this.resetStyles();
            let knightCell = knight.parentNode;
            knightCell.innerHTML = "";
        }
        let cell = this.game.undo();
        if (cell) {
            let td = this.getTableData(cell);
            td.innerHTML = '<img src="Black-Knight.svg" alt="">';
            td.className = "unselected";
            this.showPossibleMoves(this.game.getPossibleMoves());
            this.changeMessage();
        }
    }
    changeMessage(m) {
        let objs = { WIN: "You win!", LOSE: "You lose!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
        } else {
            this.setMessage("");
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    getTableData(cell) {
        let table = document.querySelector("table");
        let { x, y } = cell;
        return table.rows[x].cells[y];
    }
    showPossibleMoves(moves) {
        for (let m of moves) {
            let td = this.getTableData(m);
            td.className = "selected";
        }
    }
    resetStyles() {
        let cells = document.querySelectorAll("td");
        Array.from(cells).filter(td => td.className !== "path").forEach(td => td.className = "");
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    resetBoard() {
        let form = document.forms[0];
        let cols = parseInt(form.cols.value);
        let rows = parseInt(form.rows.value);
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < rows; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
                let td = document.createElement("td");
                td.onclick = this.addKnight.bind(this);
                td.oncontextmenu = this.removeKnight.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.game = new KnightTour(rows, cols);
        this.changeMessage();
    }
}
let gui = new GUI();
gui.registerEvents();