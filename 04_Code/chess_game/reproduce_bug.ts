import { Chess } from 'chess.js';

const chess1 = new Chess();
// 1. Make a move and get the full object
try {
    const moveResult = chess1.move('e4');
    console.log('Original Move Result:', moveResult);

    // 2. Try to replay it on a fresh instance
    const chess2 = new Chess();
    console.log('Attempting to replay move object...');

    // This is valid according to types but let's see if it works at runtime
    const replayResult = chess2.move(moveResult);

    console.log('Replay Successful:', replayResult);
} catch (e) {
    console.error('Replay FAILED:', e);
}
