module.exports = {
    "BrowserStack home page": function(browser) {
        browser
            .url("http://localhost:8091")
            .waitForElementVisible("body", 1000)
            .assert.containsText("body", "Up and running")
            .end();
    },
};
