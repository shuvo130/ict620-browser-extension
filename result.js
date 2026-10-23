
document.addEventListener("DOMContentLoaded", () => {

    const copyButton = document.getElementById("copy-result-btn");
    const resultBox = document.getElementById("ai-result");

    copyButton.addEventListener("click", async () => {

        const resultText = resultBox.textContent.trim();

        if (
            !resultText ||
            resultText === "Your AI-generated result will appear here."
        ) {
            copyButton.textContent = "Nothing to copy";
            return;
        }

        try {
            await navigator.clipboard.writeText(resultText);

            copyButton.textContent = "✓ Copied!";

        } catch (error) {
            console.error("Copy failed:", error);
            copyButton.textContent = "Copy failed";
        }

    });

});
