// Stores the text selected by the user on a webpage

document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText) {
        chrome.storage.local.set({
            selectedText: selectedText
        });


    }
});