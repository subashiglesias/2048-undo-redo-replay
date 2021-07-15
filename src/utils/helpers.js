export const getNewBoard = () => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const hasValue = (board, value) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === value) {
                return true;
            }
        }
    }
    return false;
};

export const isFull = (board) => {
    return !hasValue(board, 0);
};

const getRandomPosition = () => {
    const rowPosition = Math.floor(Math.random() * 4);
    const colPosition = Math.floor(Math.random() * 4);
    return [rowPosition, colPosition];
};

export const generateRandom = (board) => {
    if (isFull(board)) {
        return board;
    }

    let [row, col] = getRandomPosition();
    while (board[row][col] !== 0) {
        [row, col] = getRandomPosition();
    }

    board[row][col] = 2;
    return board;
};

const compress = (board) => {
    const newBoard = getNewBoard();
    for (let i = 0; i < board.length; i++) {
        let colIndex = 0;
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== 0) {
                newBoard[i][colIndex] = board[i][j];
                colIndex++;
            }
        }
    }
    return newBoard;
};

const merge = (board, scoreUpdater) => {
    let score = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length - 1; j++) {
            if (board[i][j] !== 0 && board[i][j] === board[i][j + 1]) {
                board[i][j] = board[i][j] * 2;
                scoreUpdater && scoreUpdater(prevProps => {
                    score = prevProps + board[i][j]
                    return score;
                });
                board[i][j + 1] = 0;
            }
        }
    }
    return {board, score};
};

export const move = (board, direction, scoreUpdater, lastScore, setHistory, updateBoard) => {
    let newBoard1, newBoard2, final
    let score = 0
    if (direction === 'Left') {
        newBoard1 = compress(board);
        let out = merge(newBoard1, scoreUpdater);
        newBoard2 = out.board;
        score = out.score;
        final = compress(newBoard2)
    }
    if (direction === 'Right') {
        newBoard1 = reverse(board);
        let out = move(newBoard1, 'Left', scoreUpdater, lastScore);
        newBoard2 = out.final;
        score = out.score;
        final = reverse(newBoard2);
    }
    if (direction === 'Up') {
        newBoard1 = rotateLeft(board);
        let out = move(newBoard1, 'Left', scoreUpdater, lastScore);
        newBoard2 = out.final;
        score = out.score;
        final = rotateRight( newBoard2);
    }
    if (direction === 'Down') {
        newBoard1 = rotateRight(board);
        let out = move(newBoard1, 'Left', scoreUpdater, lastScore);
        newBoard2 = out.final;
        score = out.score;
        final =  rotateLeft(newBoard2);
    }
    if(updateBoard) {
        updateBoard(generateRandom(final));
        setHistory(prevState => {
            return {
                ...prevState,
                board: [...prevState.board, final],
                score: [...prevState.score, score || lastScore]
            }
        })
    }
    return {final, score}
};

export const reverse = (board) => {
    const reverseBoard = getNewBoard();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            reverseBoard[i][j] = board[i][board[i].length - 1 - j];
        }
    }
    return reverseBoard;
};

export const rotateLeft = (board) => {
    const rotateBoard = getNewBoard();

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            rotateBoard[i][j] = board[j][board[i].length - 1 - i];
        }
    }

    return rotateBoard;
};

export const rotateRight = (board) => {
    const rotateBoard = getNewBoard();

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            rotateBoard[i][j] = board[board[i].length - 1 - j][i];
        }
    }

    return rotateBoard;
};

export const checkWin = (board) => {
    return hasValue(board, 2048);
};

const hasDiff = (board, updatedBoard) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== updatedBoard.final[i][j]) {
                return true;
            }
        }
    }
    return false;
};

export const isOver = (board) => {
    if (hasDiff(board, move(board, 'Left'))) {
        return false;
    }
    if (hasDiff(board, move(board, 'Right'))) {
        return false;
    }
    if (hasDiff(board, move(board, 'Up'))) {
        return false;
    }
    return !hasDiff(board, move(board, 'Down'));
};


