// script.js

let steps = [];
let stepIndex = 0;

// Display the initial empty state for the problem step
document.getElementById("problem-step").innerText = "Please enter your problem above.";

// Function to submit the problem to the backend and get solution steps
async function submitProblem() {
    const problemText = document.getElementById("user-problem").value.trim();
    const feedbackElement = document.getElementById("feedback");

    // Validate input
    if (!problemText) {
        feedbackElement.innerText = "Please enter a problem.";
        feedbackElement.className = "incorrect";
        return;
    }

    // Clear previous feedback and indicate loading
    feedbackElement.innerText = "";
    document.getElementById("problem-step").innerText = "Loading solution...";

    try {
        // Send the problem to the backend
        const response = await fetch('/solve-problem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ problem: problemText })
        });

        if (!response.ok) throw new Error('Problem solving request failed');

        const data = await response.json();
        
        if (data.steps && data.steps.length > 0) {
            steps = data.steps; // Store the solution steps
            stepIndex = 0; // Reset to the first step
            updateStep(); // Display the first step
        } else {
            feedbackElement.innerText = "No solution steps found. Please try a different problem.";
            feedbackElement.className = "incorrect";
        }
    } catch (error) {
        feedbackElement.innerText = "Error solving the problem. Please try again.";
        feedbackElement.className = "incorrect";
        console.error("Error:", error);
    }
}

// Function to display the current step
function updateStep() {
    const feedbackElement = document.getElementById("feedback");

    // Check if stepIndex is valid
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    // Display the current step and feedback
    document.getElementById("problem-step").innerText = steps[stepIndex];
    feedbackElement.innerText = `Step ${stepIndex + 1} of ${steps.length}`;
    feedbackElement.className = ""; // Clear feedback color
}

// Show a hint for the current step
function showHint() {
    const feedbackElement = document.getElementById("feedback");
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    feedbackElement.innerText = `Hint: Try breaking down step ${stepIndex + 1} further.`;
    feedbackElement.className = ""; // Clear feedback color
}

// Go to the next step
function nextStep() {
    if (stepIndex < steps.length - 1) {
        stepIndex++;
        updateStep();
    }
}

// Go to the previous step
function previousStep() {
    if (stepIndex > 0) {
        stepIndex--;
        updateStep();
    }
}

// Show the full solution
function seeFullSolution() {
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.innerText = "Full Solution: " + steps.join(' ');
    feedbackElement.className = ""; // Clear feedback color
}
