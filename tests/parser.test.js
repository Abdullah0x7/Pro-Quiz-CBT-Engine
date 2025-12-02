import { parseFileContent } from '../src/js/parser.js';

describe('Parser', () => {
    test('should parse a valid file correctly', () => {
        const text = `
1. What is 2 + 2?
A. 3
B. 4
Answer: B

2. What is the capital of France?
A. London
B. Paris
C. Berlin
Correct: B
        `;
        const { questions } = parseFileContent(text, 'test.txt');

        expect(questions).toHaveLength(2);

        expect(questions[0].text).toBe('What is 2 + 2?');
        expect(questions[0].options).toHaveLength(2);
        expect(questions[0].correct).toBe('B');

        expect(questions[1].text).toBe('What is the capital of France?');
        expect(questions[1].correct).toBe('B');
    });

    test('should handle file with no valid questions', () => {
        const text = `
        This is just some random text.
        It doesn't follow the format.
        `;
        const { questions } = parseFileContent(text, 'test.txt');
        expect(questions).toHaveLength(0);
    });

    test('should ignore malformed questions', () => {
        const text = `
1. Good Question?
A. Yes
B. No
Answer: A

2. Bad Question (no answer)
A. Option 1
B. Option 2

3. Another Good Question
A. 1
B. 2
Ans: B
        `;
        const { questions } = parseFileContent(text, 'test.txt');
        expect(questions).toHaveLength(2);
        expect(questions[0].text).toBe('Good Question?');
        expect(questions[1].text).toBe('Another Good Question');
    });
});
