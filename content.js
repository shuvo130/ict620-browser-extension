
// Neurodivergent Learning Assistant
// Capture selected text from webpages.

(() => {
    let saveTimer = null;

    function captureSelectedText() {
        let selectedText = "";

        // Normal webpage text selection
        const selection = window.getSelection();

        if (selection) {
            selectedText = selection.toString().trim();
        }

        // Support text selected inside input or textarea fields
        if (!selectedText) {
            const activeElement = document.activeElement;

            if (
                activeElement &&
                (
                    activeElement.tagName === "TEXTAREA" ||
                    (
                        activeElement.tagName === "INPUT" &&
                        ["text", "search", "url", "email", "tel"]
                            .includes(activeElement.type)
                    )
                )
            ) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;

                if (
                    typeof start === "number" &&
                    typeof end === "number" &&
                    end > start
                ) {
                    selectedText = activeElement.value
                        .slice(start, end)
                        .trim();
                }
            }
        }

        // Only save actual selected text
        if (!selectedText) {
            return;
        }

        chrome.storage.local.set(
            { selectedText: selectedText },
            () => {
                if (chrome.runtime.lastError) {
                    console.warn(
                        "Unable to save selected text:",
                        chrome.runtime.lastError.message
                    );
                }
            }
        );
    }

    function scheduleCapture() {
        clearTimeout(saveTimer);

        saveTimer = setTimeout(() => {
            captureSelectedText();
        }, 150);
    }

    // Mouse selection
    document.addEventListener(
        "mouseup",
        scheduleCapture,
        true
    );

    // Keyboard selection (e.g. Shift + Arrow keys)
    document.addEventListener(
        "keyup",
        scheduleCapture,
        true
    );

    // Selection changes on dynamic React pages
    document.addEventListener(
        "selectionchange",
        scheduleCapture
    );

    // Touchscreen selection
    document.addEventListener(
        "touchend",
        scheduleCapture,
        true
    );

    console.log(
        "Neurodivergent Learning Assistant: selection capture ready."
    );
})();
