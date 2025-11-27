# ProQuiz CBT Engine (Offline)

A lightweight, single-file Computer Based Test (CBT) engine that runs entirely in the browser without any internet access. It’s built for teachers, tutors, and students who want to create and take exams instantly using simple text files.

---

## Features

- **Fully Offline:** Works without internet. Runs in any modern browser.  
- **Single HTML File:** Everything is packaged in one `.html` file. Easy to share through USB or email.  
- **Dynamic Question Loading:** Upload questions from a `.txt` file.  
- **Exam Timer:** Automatic countdown that submits once time ends.  
- **Instant Grading:** Scores are calculated immediately.  
- **Detailed Review:** Shows correct and wrong answers with corrections.   
- **Printable Results:** Clean print layout for physical copies.

---

## How to Run

1. Download **MyCBTPlayer.html**.  
2. Open it by double-clicking (Chrome, Edge, Firefox, etc.).  

No installation or server setup required.

---

## Creating an Exam File

The engine reads questions from a plain text `.txt` file created with Notepad or any editor.

### Format Rules

- **Question Block:** Separate each question with a blank line.  
- **Options:** Start each option with a capital letter and a dot or bracket (`A.` or `A)`).  
- **Answer Key:** Last line must contain the correct answer starting with `Answer:` or `Ans:`.

### Example

```

1. What is the capital of France?
   A. Berlin
   B. Madrid
   C. Paris
   D. Rome
   Answer: C

2. Which planet is known as the Red Planet?
   A. Earth
   B. Mars
   C. Jupiter
   D. Venus
   Answer: B

```

---

## Usage Guide

- **Upload:** On the home screen, click the upload box and choose your `.txt` file.  
- **Register:** Enter the candidate’s name and set the exam duration.  
- **Take Exam:**  
  - Select answers by clicking the options.  
  - Navigate with Next/Previous or the Question Navigator.  
  - Timer shows time remaining.  
- **Submit:** Submit manually or let the timer expire.  
- **Review:** View score, percentage, and corrections.  

---

## Technologies Used

- HTML5  
- CSS3 (custom styling, no external frameworks)  
- Vanilla JavaScript (no dependencies)

---

## Author

**Abdullah Bello © 2025 — ProQuiz CBT Engine.**  
For educational use only.
