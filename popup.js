// Get the text selected by the user from Chrome storage
async function getDemoToken() {
    const result = await chrome.storage.local.get("demoAccessToken");
    return result.demoAccessToken || "";
}
document.addEventListener("DOMContentLoaded", () => {

    const selectedTextBox = document.getElementById("selected-text");
    const summariseButton = document.getElementById("summarise-btn");
    const breakdownButton = document.getElementById("breakdown-btn");
    const guidedNotesButton = document.getElementById("guided-notes-btn");
    const aiResult = document.getElementById("ai-result");
    const aiResultSection = document.getElementById("ai-result-section");
    const clearTextButton = document.getElementById("clear-text-btn");

    clearTextButton.addEventListener("click", async () => {
        try {
            // Remove selected text from Chrome storage
            await chrome.storage.local.remove("selectedText");

            // Clear the selected text displayed in the interface
            selectedTextBox.textContent =
                "Select some text from the webpage.";
            displayAIResult(
                "Your AI-generated result will appear here."
            );
            if (window.parent !== window) {
                window.parent.postMessage(
                    { type: "CLEAR_RESULT" },
                    window.location.origin
                );
            }

        } catch (error) {
            console.error("Unable to clear selected text:", error);
        }
    });


    function displayAIResult(text) {
        aiResult.textContent = text;
        // Show the AI Result panel in the extension popup
        aiResultSection.classList.add("visible");
        // Send the result to the parent workspace when available.
        if (window.parent !== window) {
            window.parent.postMessage({
                type: "AI_RESULT",
                text: text
            }, window.location.origin);
        }
    }


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
            displayAIResult(
                "Please select some text from the webpage first."
            );
            return;
        }

        displayAIResult("Generating your text summary...\n\nPlease wait.");

        try {
            const demoToken = await getDemoToken();

            const response = await fetch(
                "https://ict620-browser-extension.onrender.com/summarise",
                {
                    method: "POST",


                    headers: {
                        "Content-Type": "application/json",
                        "X-Demo-Token": demoToken
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


            displayAIResult("Text Summary:\n\n" + data.summary);


        } catch (error) {

            console.error(error);

            displayAIResult(
                "Unable to generate the summary.\n\n" + error.message
            );

        }

    });
    // Break Down Task button
    breakdownButton.addEventListener("click", async () => {

        const selectedText = selectedTextBox.textContent;

        if (
            !selectedText ||
            selectedText === "Select some text from the webpage."
        ) {
            displayAIResult(
                "Please select a task from the webpage first."
            );
            return;
        }


        displayAIResult("Breaking down your task...\n\nPlease wait.");


        try {
            const demoToken = await getDemoToken();
            const response = await fetch(
                "https://ict620-browser-extension.onrender.com/breakdown",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Demo-Token": demoToken
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



            displayAIResult("Task Breakdown:\n\n" + data.breakdown);



        } catch (error) {
            console.error(error);
            displayAIResult(
                "Unable to process the task.\n\n" + error.message
            );
        }
    });
    // Generate Guided Notes button
    guidedNotesButton.addEventListener("click", async () => {

        const selectedText = selectedTextBox.textContent;

        if (
            !selectedText ||
            selectedText === "Select some text from the webpage."
        ) {
            displayAIResult(
                "Please select some learning content first."
            );
            return;
        }

        displayAIResult("Generating your guided notes...\n\nPlease wait.");

        try {
            const demoToken = await getDemoToken();
            const response = await fetch(
                "https://ict620-browser-extension.onrender.com/guided-notes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Demo-Token": demoToken
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



            displayAIResult("Guided Notes:\n\n" + data.notes);



        } catch (error) {
            console.error(error);
            displayAIResult(
                "Unable to generate guided notes.\n\n" + error.message
            );
        }
    });
});