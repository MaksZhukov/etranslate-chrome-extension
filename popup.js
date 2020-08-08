chrome.storage.sync.get(['etranslateExtensionKey'], function ({
    etranslateExtensionKey,
}) {
    let selectTextlang = document.getElementById('language-select-text-lang');
    let selectTranslateLang = document.getElementById(
        'language-select-translate-lang'
    );

    chrome.storage.sync.get(['textLang', 'translateLang'], function ({
        textLang,
        translateLang,
    }) {
        if (textLang) {
            selectTextlang.value = textLang;
        } else {
            chrome.storage.sync.set({ ['textLang']: selectTextlang.value });
        }
        if (translateLang) {
            selectTranslateLang.value = translateLang;
        } else {
            chrome.storage.sync.set({
                ['translateLang']: selectTranslateLang.value,
            });
        }
    });

    selectTextlang.addEventListener('change', ({ target }) => {
        chrome.storage.sync.set({ ['textLang']: target.value });
    });
    selectTranslateLang.addEventListener('change', ({ target }) => {
        chrome.storage.sync.set({ ['translateLang']: target.value });
    });

    if (etranslateExtensionKey) {
        document.getElementById('unauthorized').style.display = 'none';
    } else {
        document.getElementById('authorized').style.display = 'none';
        let input = document.getElementById('email');

        input.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                fetch(`${window.APP_URL}/get-extension-key`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: input.value }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        chrome.storage.sync.set({
                            ['etranslateExtensionKey']: data.id,
                        });
                        document.getElementById('authorized').style.display =
                            'block';
                        document.getElementById('unauthorized').style.display =
                            'none';
                    });
            }
        });
    }
});
