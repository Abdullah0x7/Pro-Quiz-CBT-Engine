// parser.js

export function parseFileContent(text, fileName) {
    const examTitle = fileName.replace('.txt', '');

    // Parser Logic
    const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);
    const questions = [];

    blocks.forEach((block, idx) => {
        const lines = block.trim().split('\n');
        if (lines.length < 3) return;

        let qText = "";
        let opts = [];
        let correct = "";
        let isQ = true;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.match(/^(Answer|Ans|Correct):/i)) {
                const parts = trimmed.split(':');
                if(parts.length > 1) {
                    correct = parts[1].trim().toUpperCase().charAt(0);
                    isQ = false;
                }
            } else if (trimmed.match(/^([A-E])[\.\)]\s/i)) {
                const match = trimmed.match(/^([A-E])[\.\)]\s(.*)/i);
                if(match) {
                    opts.push({ id: match[1].toUpperCase(), text: match[2] });
                    isQ = false;
                }
            } else if (isQ) {
                qText += (qText ? "\n" : "") + trimmed;
            }
        });

        qText = qText.replace(/^\d+[\.\)]\s*/, ''); // Remove question numbers

        if (qText && opts.length && correct) {
            questions.push({ id: idx, text: qText, options: opts, correct });
        }
    });

    return {
        questions,
        examTitle
    };
}
