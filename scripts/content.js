
// Mutation observer for player or body if can't find player
var target = document.querySelector('#dv-web-player')
if (!target) {
    document.querySelector('body')
}
// Listen for changes and call skip
var execSkipChecks = true;
var observer = new MutationObserver(function (mutations) {
    if (execSkipChecks) {
        skip();
    }
});
var config = { attributes: false, childList: true, subtree: true, characterData: false };
observer.observe(target, config);

function skip() {
    const adSkipTerms = [
        // AMZ Prime
        {
            target: "//div[text()='Skip']",
            conditionalAbsent: ["//div[text()='Next Episode']"],
            conditionalPresent: ["//div[text()='Watchlist']"]
        }
    ]

    adTermsLoop:
    for (const adSkip of adSkipTerms) {
        var skipElement = document.evaluate(adSkip.target, target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!skipElement) {
            console.log("No skip element found")
            continue;
        }
        // Confirm absent elements
        for (const absent of adSkip.conditionalAbsent) {
            var element = document.evaluate(absent, target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                console.log("Expected missing element found " + element);
                continue adTermsLoop;
            }
        }
        for (const present of adSkip.conditionalPresent) {
            var element = document.evaluate(present, target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!element) {
                console.log("Expected present element not found " + present);
                continue adTermsLoop;
            }
        }
        
        var title = target.querySelector('.atvwebplayersdk-title-text')?.textContent || 'unknown'
        var subtitle = target.querySelector('.atvwebplayersdk-subtitle-text')?.textContent || ''
        subtitle = subtitle.length >0 ? " (" + subtitle + ")" : '';
        console.log("Skipping by clicking " + skipElement.textContent + " on " + title + subtitle);
        execSkipChecks = false;
        skipElement.click();
        setTimeout(() => { execSkipChecks = true }, 1000);
    }
}
