// Get the text selected by the user from Chrome storage
document.addEventListener("DOMContentLoaded", () => {

    const selectedTextBox = document.getElementById("selected-text");
    const summariseButton = document.getElementById("summarise-btn");
    const breakdownButton = document.getElementById("breakdown-btn");
    const guidedNotesButton = document.getElementById("guided-notes-btn");
    const aiResult = document.getElementById("ai-result");

    // Load selected webpage text
    chrome.storage.local.get(["selectedText"], (result) => {

        if (result.selectedText) {
            selectedTextBox.textContent = result.selectedText;
        } else {
            selectedTextBox.textContent =
                "Select some text from the webpage.";
        }

    });

    // Summarise button
    summariseButton.addEventListener("click", async () => {

        const selectedText = selectedTextBox.textContent;

        if (
            !selectedText ||
            selectedText === "Select some text from the webpage."
        ) {
            aiResult.textContent =
                "Please select some text from the webpage first.";
            return;
        }

        aiResult.textContent = "Processing selected text...";

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/summarise",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        text: selectedText
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong."
                );
            }

            aiResult.textContent = data.summary;

        } catch (error) {

            console.error(error);

            aiResult.textContent =
                "Unable to connect to the AI backend.";

        }

    });
    // Break Down Task button
    breakdownButton.addEventListener("click", async () => {

        const selectedText = selectedTextBox.textContent;

        if (
            !selectedText ||
            selectedText === "Select some text from the webpage."
        ) {
            aiResult.textContent =
                "Please select a task from the webpage first.";
            return;
        }

        aiResult.textContent = "Breaking down your task...";

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/breakdown",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: selectedText
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            aiResult.textContent = data.breakdown;

        } catch (error) {
            console.error(error);
            aiResult.textContent =
                "Unable to process the task.";
        }
    });
    // Generate Guided Notes button
    guidedNotesButton.addEventListener("click", async () => {

        const selectedText = selectedTextBox.textContent;

        if (
            !selectedText ||
            selectedText === "Select some text from the webpage."
        ) {
            aiResult.textContent =
                "Please select some learning content first.";
            return;
        }

        aiResult.textContent = "Generating guided notes...";

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/guided-notes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: selectedText
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            aiResult.textContent = data.notes;

        } catch (error) {
            console.error(error);
            aiResult.textContent =
                "Unable to generate guided notes.";
        }
    });
});