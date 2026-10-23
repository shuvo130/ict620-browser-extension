
document.addEventListener("DOMContentLoaded", () => {

    // Get the AI Result panel
    const resultPanel = document.getElementById("result-panel");

    // Get the two iframe elements
    const frames = document.querySelectorAll(".panel iframe");

    const resultFrame = frames[0];
    const mainFrame = frames[1];

    // Wait until the main interface loads
    mainFrame.addEventListener("load", () => {

        const mainDocument = mainFrame.contentDocument;

        // Get the three AI buttons
        const breakdownButton =
            mainDocument.getElementById("breakdown-btn");

        const summariseButton =
            mainDocument.getElementById("summarise-btn");

        const guidedNotesButton =
            mainDocument.getElementById("guided-notes-btn");

        // Show the AI Result panel
        function showResultPanel() {
            resultPanel.hidden = false;
        }

        breakdownButton.addEventListener("click", showResultPanel);
        summariseButton.addEventListener("click", showResultPanel);
        guidedNotesButton.addEventListener("click", showResultPanel);
    });

    // Close the AI Result panel
    resultFrame.addEventListener("load", () => {

        const resultDocument = resultFrame.contentDocument;

        const closeButton =
            resultDocument.getElementById("close-result-btn");

        closeButton.addEventListener("click", () => {
            resultPanel.hidden = true;
        });
    });


    // Receive AI results from the main extension
    window.addEventListener("message", (event) => {

        // Accept messages only from this extension
        if (event.origin !== window.location.origin) {
            return;
        }

        // Accept messages only from the main interface
        if (event.source !== mainFrame.contentWindow) {
            return;
        }

        if (event.data?.type === "CLEAR_RESULT") {
            const resultDocument = resultFrame.contentDocument;
            const resultBox = resultDocument.getElementById("ai-result");

            if (resultBox) {
                resultBox.textContent =
                    "Your AI-generated result will appear here.";
            }

            resultPanel.hidden = true;
            return;
        }

        if (event.data?.type === "AI_RESULT") {

            const resultDocument = resultFrame.contentDocument;
            const resultBox =
                resultDocument.getElementById("ai-result");

            if (resultBox) {
                resultBox.textContent = event.data.text;
            }

            const copyButton =
                resultDocument.getElementById("copy-result-btn");

            if (copyButton) {
                copyButton.textContent = "📋 Copy Result";
            }

            // Show the left panel
            resultPanel.hidden = false;
        }
    });

});
