const SquareTypes = {
    X: 'x',
    O: 'o',
    NOTHING: 'nothing'
}



class Board {
    constructor(rootElement=null, resetboardElement=null) {
        this.rootElement = rootElement;
        this.resetElement = resetboardElement;
        this.#generateSquares();
        // add event listeners 
        this.#addResetListener();
        // add game mechanic variables.
        this.turn = SquareTypes.X;
        this.winner = null;
        // add info to show who's turn it is
        // add info to show who wins
        this.turnElement = document.querySelector('.turn .square');
        this.turnHeader = document.querySelector('.turn h1');

        this.turnElement.classList.add(SquareTypes.X);
        console.assert(this.rootElement !== null, "No root element present");
    }
    getTurn() {
        console.assert(this.rootElement !== null, "No root element present");
        return this.turn;
    }
    setTurn(turn) {
        console.assert(this.rootElement !== null, "No root element present");
        this.turn = turn;
        if(this.turnElement.classList.contains('x')) {
            this.turnElement.classList.remove('x');
            this.turnElement.classList.add('o');
        } else {
            this.turnElement.classList.remove('o');
            this.turnElement.classList.add('x');
        }
    }
    #generateSquares() {
        this.rawSquares = [];
        this.squares = [];
        // iterate through each of the board element's children as columns.
        [...this.rootElement.children].forEach((column, columnIndex) => {
            // iterate through each of the column's elements as rows.
            [...column.children].forEach((cell, rowIndex) => {
                this.squares.push(new Square(cell, rowIndex, columnIndex));
            })

        })
    }
    #addResetListener() {
        this.resetElement?.addEventListener('click', () => {
            this.reset();
        })
    }
    callout() {
        console.log("Hello");
        console.log("I am a board.");
        console.log("My root element is:");
        console.log(this.rootElement);
        console.log("My processed squares are: ");
        console.log(this.squares);
    }

    calloutSquares() {
        this.rawSquares.foreach((square) => {
            square.callout();
        } )
    }
    checkwincondition() {
        console.assert(this.squares.length === 9, "Board does not have exactly 9 squares.")

        // tic-tac-toe board looks like this:
        // 1 2 3
        // 4 5 6
        // 7 8 9
        //
        // squares[] is packed like this:
        // [1, 4, 7, 2, 5, 8, 3, 6, 9]

        // easier to read:
        // 1 4 7
        // 2 5 8
        // 3 6 9
        // [1,2,3,4,5,6,7,8,9]

        let column1 = [this.squares[0], this.squares[1], this.squares[2]];
        let column2 = [this.squares[3], this.squares[4], this.squares[5]];
        let column3 = [this.squares[6], this.squares[7], this.squares[8]];
        let row1 = [this.squares[0], this.squares[3], this.squares[6]];
        
        // did not write this code. 
        // source;
        // https://www.tutorialspoint.com/javascript-checking-if-all-the-elements-are-same-in-an-array
        const checkIfSame = (arr = []) => {
            const {length: l} = arr;
            if(l <= 1) return true;
            arr.sort();
            return arr[0] === arr[l-1];
        }

        // to check the win conditions:
        // first columns, then rows, then diagonals.

        // check the rows.
        for(let i = 0; i < 9; i += 3) {
            let column = [this.squares[i], this.squares[i+1], this.squares[i+2]];
            let columnTypes = column.map((el) => el.type);
            if(checkIfSame(columnTypes) && columnTypes[0] !== SquareTypes.NOTHING) {
                this.winnerdeclaration(this.getTurn(), 'column');
            }

        }
        for (let j = 0; j < 3; j+=1){
            let row = [this.squares[j], this.squares[j+3], this.squares[j + 6]];
            let rowTypes = row.map(el => el.type);
            if(checkIfSame(rowTypes) && rowTypes[0] !== SquareTypes.NOTHING) {
                this.winnerdeclaration(this.getTurn(), 'row');
            }

        }
        // diagonals. 
        let diag1 = [this.squares[0], this.squares[4], this.squares[8]]
        let diag2 = [this.squares[2], this.squares[4], this.squares[6]]
        if(checkIfSame(diag1.map(el => el.type)) && diag1[0].type !== SquareTypes.NOTHING) {
            this.winnerdeclaration(this.getTurn(), 'diagonal');
        }
        if(checkIfSame(diag2.map(el => el.type)) && diag2[0].type !== SquareTypes.NOTHING) {
            this.winnerdeclaration(this.getTurn(), 'diagonal');
        }
        let drawCondition = true;
        for(let i = 0; i < 9; i += 3) {
            let column = [this.squares[i], this.squares[i+1], this.squares[i+2]];
            let columnTypes = column.map((el) => el.type);
            if(columnTypes.includes(SquareTypes.NOTHING)) {
                drawCondition = false;
            }
        }
        if(drawCondition) {
            alert("draw");
        }
    }
    reset() {
        // Reset the board. 
        console.log("board reset");

        // Reset each square to nothing.
        [...this.squares].forEach((square) => {
            square.reset();
        });
        // New game has no winner
        this.winner = null;

        // New game starts with X. X always goes first. 
        this.turn = SquareTypes.X;
        this.turnElement.classList.remove('o');
        this.turnElement.classList.add('x');
        this.turnHeader.innerText = 'Turn: ';

        console.assert(this.rootElement !== null, "No root element present");
    }
    winnerdeclaration(winner=null, method='diagonal') {
        console.log(winner);
        alert(`${winner.toUpperCase()} won by ${method}!`)
        this.winner = winner;

        console.log(this.turnElement);
        this.turnHeader.innerText = 'Winner: ';
        let winnerElement = this.turnElement;
        if(winnerElement.classList.contains('x')) {
            winnerElement.classList.remove('x');
            winnerElement.classList.add('o');

        } else {
            winnerElement.classList.remove('o');
            winnerElement.classList.add('x');

        }
    }
}












class Square {
    constructor(element=null,row=0,column=0) {
        // where is the element on the DOM (and what are its properties?)
        this.element = element
        this.type = SquareTypes.NOTHING;
        // location of the board
        this.row = row;
        this.column = column;
        // event listeners
        this.#generateEventListener();
    }
    #generateEventListener() {
        // on click, every square performs the check. 
        // checks which turn the board says it is. 
        this.element.addEventListener('click', () => {
            if(board.winner !== null) {
                alert('winner has already been declared');
                return;
            }
            if(this.type !== SquareTypes.NOTHING) {
                alert('this square is taken');
                return;
            }
            this.updateSquareType(board.getTurn());
            this.updateSquareClass(board.getTurn());
            if(board.getTurn() === SquareTypes.O) {
                board.setTurn(SquareTypes.X);
            } else {
                board.setTurn(SquareTypes.O);
            }

        });
    }
    callout() {
        console.log("hello");
        console.log("I am a square.")
        console.log("My element is: ");
        console.log(this.element);
        console.log("My type is: ", this.type);
        console.log("My row is: ", this.row);
        console.log("My column is: ", this.column);
    }
    
    calloutClassName() {
        console.log(this.element.classList);
        if(this.element.classList.contains('o')) {
            alert('O detected');
        }
    }

    updateSquareType(type) {
        this.type = type;
    }
    updateSquareClass(className) {
        switch (className) {
            case SquareTypes.X:
                if (this.element.classList.contains(SquareTypes.O)) {
                    alert('Pick another space');}
                    
                this.element.classList.toggle(className);
                break;
            case SquareTypes.O:
                if (this.element.classList.contains(SquareTypes.X)) {
                    alert('Pick another space');
                }
                this.element.classList.toggle(className);
                break;
            default:
                alert('unrecognized choice. pick another.')
        }
        board.checkwincondition();
    }

    // reset the square.
    reset() {
        this.element.classList.remove('o');
        this.element.classList.remove('x');
        this.type = SquareTypes.NOTHING;
    }

}

let board = new Board(document.querySelector('.board'), document.querySelector('#reset'));

