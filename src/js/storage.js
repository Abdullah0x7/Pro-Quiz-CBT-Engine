// storage.js

const STORAGE_KEY = 'cbt_records';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getHistory() {
    cleanupRecords();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveRecord(record) {
    const records = getHistory();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function cleanupRecords() {
    const now = Date.now();
    let records;
    try {
        records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
        records = [];
    }
    const validRecords = records.filter(r => (now - r.timestamp) < EXPIRY_MS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validRecords));
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
}
