document.addEventListener('DOMContentLoaded', function() {
    // Test sections data
    const testSections = [
        {
            id: 'grammar',
            title: 'Grammar',
            questions: [
                {
                    question: "Choose the correct form of the verb:",
                    text: "If I _____ more time, I would learn another language.",
                    options: ["have", "had", "would have", "having"],
                    correct: 1
                },
                {
                    question: "Select the correct sentence:",
                    options: [
                        "She don't like coffee.",
                        "She doesn't likes coffee.",
                        "She doesn't like coffee.",
                        "She not like coffee."
                    ],
                    correct: 2
                },
                {
                    question: "Choose the correct preposition:",
                    text: "I'm really interested _____ learning new languages.",
                    options: ["for", "in", "on", "with"],
                    correct: 1
                }
            ]
        },
        {
            id: 'vocabulary',
            title: 'Vocabulary',
            questions: [
                {
                    question: "What is the meaning of 'ubiquitous'?",
                    options: ["Rare", "Present everywhere", "Unique", "Unnecessary"],
                    correct: 1
                },
                {
                    question: "Choose the synonym for 'meticulous':",
                    options: ["Careless", "Thorough", "Quick", "Lazy"],
                    correct: 1
                },
                {
                    question: "Complete the sentence with the best word:",
                    text: "The professor gave a _____ explanation that clarified everything.",
                    options: ["lucid", "boring", "complex", "brief"],
                    correct: 0
                }
            ]
        },
        {
            id: 'listening',
            title: 'Listening',
            content: `
                <p>Listen to the following audio story and answer the questions below:</p>
                <div class="audio-player-container">
                    <audio id="audio-player" controls>
                        <source src="audio/story-for-listening.mp3" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
                <div class="question">
                    <p>After listening to the audio, answer these questions:</p>
                    <div class="question">
                        <p>1. Where did Sarah love to visit?</p>
                        <div class="options" data-question="listening-1">
                            <div class="option" data-index="0">Her aunt's apartment</div>
                            <div class="option" data-index="1">Her grandmother's cottage</div>
                            <div class="option" data-index="2">Her friend's house</div>
                            <div class="option" data-index="3">A vacation resort</div>
                        </div>
                    </div>
                    <div class="question">
                        <p>2. What did Sarah's grandmother show her one day?</p>
                        <div class="options" data-question="listening-2">
                            <div class="option" data-index="0">A collection of old toys</div>
                            <div class="option" data-index="1">A secret garden</div>
                            <div class="option" data-index="2">An old photo album</div>
                            <div class="option" data-index="3">A treasure chest</div>
                        </div>
                    </div>
                    <div class="question">
                        <p>3. What did Sarah learn about her great-grandmother?</p>
                        <div class="options" data-question="listening-3">
                            <div class="option" data-index="0">She was a famous chef</div>
                            <div class="option" data-index="1">She was a pilot during the war</div>
                            <div class="option" data-index="2">She was a school teacher</div>
                            <div class="option" data-index="3">She was a world traveler</div>
                        </div>
                    </div>
                    <div class="question">
                        <p>4. What did Sarah do while listening to her grandmother's stories?</p>
                        <div class="options" data-question="listening-4">
                            <div class="option" data-index="0">Drew pictures</div>
                            <div class="option" data-index="1">Played with toys</div>
                            <div class="option" data-index="2">Sipped hot chocolate by the fireplace</div>
                            <div class="option" data-index="3">Helped with cooking</div>
                        </div>
                    </div>
                    <div class="question">
                        <p>5. What was the main lesson Sarah learned from this experience?</p>
                        <div class="options" data-question="listening-5">
                            <div class="option" data-index="0">The importance of keeping old photographs</div>
                            <div class="option" data-index="1">How to bake cookies like her grandmother</div>
                            <div class="option" data-index="2">That everyone has a unique and fascinating story</div>
                            <div class="option" data-index="3">That she wanted to become a pilot</div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            id: 'writing',
            title: 'Writing',
            content: `
                <p>Write a short paragraph (3-5 sentences) on the following topic:</p>
                <p><strong>How has technology changed the way we communicate?</strong></p>
                <textarea id="writing-answer" placeholder="Write your answer here..."></textarea>
            `
        },
        {
            id: 'speaking',
            title: 'Speaking',
            content: `
                <p>Read the following sentences aloud. Click on each sentence to start recording.</p>
                <div class="speaking-container">
                    <p class="recording-status" id="recording-status">Click on a sentence to start recording</p>
                    <div class="sentences-container">
                        <div class="sentence-to-read" data-index="0">The weather is beautiful today, isn't it?</div>
                        <div class="sentence-to-read" data-index="1">She couldn't believe her eyes when she saw the results.</div>
                        <div class="sentence-to-read" data-index="2">I would appreciate it if you could help me with this project.</div>
                        <div class="sentence-to-read" data-index="3">The restaurant on the corner serves delicious Italian food.</div>
                        <div class="sentence-to-read" data-index="4">They're planning to renovate their house next summer.</div>
                    </div>
                    <div id="speech-results"></div>
                </div>
            `
        }
    ];

    // DOM elements
    const startButton = document.getElementById('start-test');
    const welcomeScreen = document.getElementById('welcome-screen');
    const testContainer = document.getElementById('test-container');
    const resultsScreen = document.getElementById('results-screen');
    const timerElement = document.getElementById('timer');
    const resultsSummary = document.getElementById('results-summary');
    const levelIndicator = document.getElementById('level-indicator');

    // Test state
    let currentSection = 0;
    let timeLeft = 7 * 60; // 7 minutes in seconds
    let timer;
    let testResults = {
        grammar: 0,
        vocabulary: 0,
        listening: 0,
        writing: 0,
        speaking: 0
    };
    let speakingScores = [0, 0, 0, 0, 0];
    let recognition;

    // Start the test
    startButton.addEventListener('click', function() {
        welcomeScreen.classList.remove('active');
        welcomeScreen.classList.add('hidden');
        testContainer.classList.remove('hidden');

        loadSection(currentSection);
        startTimer();
    });

    // Load a test section
    function loadSection(index) {
        if (index >= testSections.length) {
            endTest();
            return;
        }

        const section = testSections[index];
        let sectionHTML = `
            <div class="section active" id="section-${section.id}">
                <h2>${section.title}</h2>
        `;

        if (section.questions) {
            section.questions.forEach((q, qIndex) => {
                sectionHTML += `<div class="question">`;

                if (q.question) {
                    sectionHTML += `<p>${q.question}</p>`;
                }

                if (q.text) {
                    sectionHTML += `<p>${q.text.replace('_____', '<span class="blank">_____</span>')}</p>`;
                }

                sectionHTML += `<div class="options" data-question="${section.id}-${qIndex}">`;

                q.options.forEach((option, oIndex) => {
                    sectionHTML += `<div class="option" data-index="${oIndex}">${option}</div>`;
                });

                sectionHTML += `</div></div>`;
            });
        } else if (section.content) {
            sectionHTML += section.content;
        }

        sectionHTML += `
            <div class="navigation-buttons">
                ${index > 0 ? '<button class="prev-btn">Previous</button>' : ''}
                <button class="next-btn">${index === testSections.length - 1 ? 'Finish Test' : 'Next'}</button>
            </div>
            </div>
        `;

        testContainer.innerHTML = sectionHTML;

        // Add event listeners for options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const questionGroup = this.parentElement;
                questionGroup.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        // Add event listeners for navigation buttons
        if (document.querySelector('.prev-btn')) {
            document.querySelector('.prev-btn').addEventListener('click', function() {
                saveAnswers(section.id);
                currentSection--;
                loadSection(currentSection);
            });
        }

        document.querySelector('.next-btn').addEventListener('click', function() {
            saveAnswers(section.id);
            currentSection++;
            loadSection(currentSection);
        });

        // No special setup needed for listening section anymore as audio is loaded directly

        // Set up speech recognition
        if (section.id === 'speaking') {
            setupSpeechRecognition();
        }
    }

    // Save answers for the current section
    function saveAnswers(sectionId) {
        switch (sectionId) {
            case 'grammar':
            case 'vocabulary':
                let correctCount = 0;
                const section = testSections.find(s => s.id === sectionId);

                section.questions.forEach((q, qIndex) => {
                    const questionGroup = document.querySelector(`[data-question="${sectionId}-${qIndex}"]`);
                    const selectedOption = questionGroup.querySelector('.selected');

                    if (selectedOption && parseInt(selectedOption.dataset.index) === q.correct) {
                        correctCount++;
                    }
                });

                testResults[sectionId] = (correctCount / section.questions.length) * 100;
                break;

            case 'listening':
                let listeningCorrect = 0;
                const listeningQuestions = 5; // We now have 5 listening questions

                // Define correct answers for each question
                const correctAnswers = {
                    1: 1, // Her grandmother's cottage
                    2: 2, // An old photo album
                    3: 1, // She was a pilot during the war
                    4: 2, // Sipped hot chocolate by the fireplace
                    5: 2  // That everyone has a unique and fascinating story
                };

                for (let i = 1; i <= listeningQuestions; i++) {
                    const questionGroup = document.querySelector(`[data-question="listening-${i}"]`);
                    const selectedOption = questionGroup.querySelector('.selected');

                    if (selectedOption && parseInt(selectedOption.dataset.index) === correctAnswers[i]) {
                        listeningCorrect++;
                    }
                }

                testResults.listening = (listeningCorrect / listeningQuestions) * 100;
                break;

            case 'writing':
                const writingAnswer = document.getElementById('writing-answer').value.trim();

                // Simple scoring based on length and complexity
                if (writingAnswer.length > 0) {
                    const words = writingAnswer.split(/\s+/).length;
                    const sentences = writingAnswer.split(/[.!?]+/).filter(Boolean).length;

                    if (words >= 30 && sentences >= 3) {
                        testResults.writing = 90;
                    } else if (words >= 20 && sentences >= 2) {
                        testResults.writing = 70;
                    } else {
                        testResults.writing = 50;
                    }
                } else {
                    testResults.writing = 0;
                }
                break;

            case 'speaking':
                // Calculate average of speaking scores
                testResults.speaking = speakingScores.reduce((sum, score) => sum + score, 0) / speakingScores.length;
                break;
        }
    }

    // Set up speech recognition
    function setupSpeechRecognition() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            const sentences = document.querySelectorAll('.sentence-to-read');
            const recordingStatus = document.getElementById('recording-status');
            const speechResults = document.getElementById('speech-results');

            let currentSentenceIndex = -1;

            sentences.forEach(sentence => {
                sentence.addEventListener('click', function() {
                    if (recognition) {
                        // Stop any ongoing recognition
                        recognition.abort();

                        // Reset styles
                        sentences.forEach(s => s.style.backgroundColor = '');

                        // Set current sentence
                        currentSentenceIndex = parseInt(this.dataset.index);
                        this.style.backgroundColor = '#ffdddd';

                        // Start recording
                        recordingStatus.textContent = 'Recording... Speak now!';
                        recordingStatus.style.color = '#d9534f';

                        recognition.start();
                    }
                });
            });

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript.toLowerCase();
                // We'll use confidence to display in the results
                const confidence = Math.round(event.results[0][0].confidence * 100);
                const originalSentence = sentences[currentSentenceIndex].textContent.toLowerCase();

                // Simple comparison - in a real app, you'd use more sophisticated comparison
                const similarity = compareSentences(transcript, originalSentence);

                // Score based on similarity (0-100)
                const score = Math.round(similarity * 100);
                speakingScores[currentSentenceIndex] = score;

                // Display result
                recordingStatus.textContent = 'Recording complete!';
                recordingStatus.style.color = '#5cb85c';

                // Add result to speech results
                const resultHTML = `
                    <div class="speech-result">
                        <p><strong>Original:</strong> ${sentences[currentSentenceIndex].textContent}</p>
                        <p><strong>Your speech:</strong> ${transcript}</p>
                        <p><strong>Accuracy:</strong> ${score}%</p>
                        <p><strong>Confidence:</strong> ${confidence}%</p>
                    </div>
                `;

                speechResults.innerHTML += resultHTML;
            };

            recognition.onerror = function(event) {
                recordingStatus.textContent = 'Error occurred in recognition: ' + event.error;
                recordingStatus.style.color = '#d9534f';
            };
        } else {
            alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
        }
    }

    // Compare two sentences and return similarity score (0-1)
    function compareSentences(sentence1, sentence2) {
        // Simple implementation - in a real app, you'd use more sophisticated algorithms
        const words1 = sentence1.split(/\s+/);
        const words2 = sentence2.split(/\s+/);

        let matchCount = 0;
        for (const word1 of words1) {
            if (words2.includes(word1)) {
                matchCount++;
            }
        }

        // Calculate similarity as a ratio of matching words to total words
        const similarity = (2 * matchCount) / (words1.length + words2.length);
        return similarity;
    }

    // Start the timer
    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;

            if (timeLeft <= 0) {
                clearInterval(timer);
                endTest();
            } else {
                updateTimerDisplay();
            }
        }, 1000);

        updateTimerDisplay();
    }

    // Update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 60) {
            timerElement.style.color = '#d9534f';
        }
    }

    // End the test and show results
    function endTest() {
        clearInterval(timer);

        // Save answers for the last section
        if (currentSection < testSections.length) {
            saveAnswers(testSections[currentSection].id);
        }

        // Hide test container and show results
        testContainer.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        resultsScreen.classList.add('active');

        // Calculate overall score
        const totalScore = (
            testResults.grammar +
            testResults.vocabulary +
            testResults.listening +
            testResults.writing +
            testResults.speaking
        ) / 5;

        // Display results
        let resultsHTML = '';

        for (const section in testResults) {
            resultsHTML += `
                <div class="result-item">
                    <span>${section.charAt(0).toUpperCase() + section.slice(1)}</span>
                    <span>${Math.round(testResults[section])}%</span>
                </div>
            `;
        }

        resultsHTML += `
            <div class="result-item total">
                <span>Overall Score</span>
                <span>${Math.round(totalScore)}%</span>
            </div>
        `;

        resultsSummary.innerHTML = resultsHTML;

        // Determine English level
        let level = '';
        if (totalScore >= 90) {
            level = 'C2 (Proficient)';
        } else if (totalScore >= 75) {
            level = 'C1 (Advanced)';
        } else if (totalScore >= 60) {
            level = 'B2 (Upper Intermediate)';
        } else if (totalScore >= 45) {
            level = 'B1 (Intermediate)';
        } else if (totalScore >= 30) {
            level = 'A2 (Elementary)';
        } else {
            level = 'A1 (Beginner)';
        }

        levelIndicator.textContent = level;
    }

    // Restart the test
    document.getElementById('restart-test').addEventListener('click', function() {
        // Reset test state
        currentSection = 0;
        timeLeft = 7 * 60;
        testResults = {
            grammar: 0,
            vocabulary: 0,
            listening: 0,
            writing: 0,
            speaking: 0
        };
        speakingScores = [0, 0, 0, 0, 0];

        // Hide results and show welcome screen
        resultsScreen.classList.remove('active');
        resultsScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('active');
    });
});