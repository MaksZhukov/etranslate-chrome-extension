const setDisabledValue = (options, value) => {
    Array.from(options).forEach((item) => {
        if (item.value === value) {
            item.setAttribute('disabled', 'true');
        } else {
            item.removeAttribute('disabled');
        }
    });
};

chrome.storage.sync.get(['etranslateExtensionKey'], function ({
    etranslateExtensionKey,
}) {
    let selectTextlang = document.getElementById('language-select-text-lang');
    let selectTranslateLang = document.getElementById(
        'language-select-translate-lang'
    );
    let activeTranslateCheckbox = document.getElementById(
        'active-translate-checkbox'
    );

    let reverseLanguageBtn = document.querySelector('#reverse-language-btn');
    reverseLanguageBtn.addEventListener('click', () => {
        let selectTextlangValue = selectTextlang.value;
        let selectTranslateLangValue = selectTranslateLang.value;
        selectTextlang.value = selectTranslateLangValue;
        selectTranslateLang.value = selectTextlangValue;
        chrome.storage.sync.set({ ['translateLang']: selectTextlangValue });
        chrome.storage.sync.set({ ['textLang']: selectTranslateLangValue });
        setDisabledValue(selectTextlang.options, selectTextlangValue);
        setDisabledValue(selectTranslateLang.options, selectTranslateLangValue);
    });

    chrome.storage.sync.get(
        ['textLang', 'translateLang', 'activeTranslate'],
        function ({ textLang, translateLang, activeTranslate }) {
            if (textLang) {
                selectTextlang.value = textLang;
                setDisabledValue(selectTextlang.options, translateLang);
            } else {
                chrome.storage.sync.set({ ['textLang']: selectTextlang.value });
            }
            if (translateLang) {
                selectTranslateLang.value = translateLang;
                setDisabledValue(selectTranslateLang.options, textLang);
            } else {
                chrome.storage.sync.set({
                    ['translateLang']: selectTranslateLang.value,
                });
            }
            if (activeTranslate) {
                activeTranslateCheckbox.checked = activeTranslate;
            } else {
                chrome.storage.sync.set({
                    ['activeTranslate']: activeTranslateCheckbox.checked,
                });
            }
        }
    );

    selectTextlang.addEventListener('change', ({ target }) => {
        chrome.storage.sync.set({ ['textLang']: target.value });
        setDisabledValue(selectTranslateLang.options, target.value);
    });
    selectTranslateLang.addEventListener('change', ({ target }) => {
        chrome.storage.sync.set({ ['translateLang']: target.value });
        setDisabledValue(selectTextlang.options, target.value);
    });

    activeTranslateCheckbox.addEventListener('change', ({ target }) => {
        chrome.storage.sync.set({ ['activeTranslate']: target.checked });
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
