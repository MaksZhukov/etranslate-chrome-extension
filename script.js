let toolTipRef = document.createElement("div");
let x, y;
let tt;
let selectionStr;

let textLang, translateLang, etranslateExtensionKey;

chrome.storage.sync.get(
    ["textLang", "translateLang", "etranslateExtensionKey"],
    function (result) {
        textLang = result.textLang;
        translateLang = result.translateLang;
        etranslateExtensionKey = result.etranslateExtensionKey;
    }
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    textLang = changes.textLang ? changes.textLang.newValue : textLang;
    translateLang = changes.translateLang
        ? changes.translateLang.newValue
        : translateLang;
});

toolTipRef.setAttribute("id", "etranslate-tooltip");
document.body.append(toolTipRef);

document.addEventListener("mouseup", function (e) {
    setTimeout(() => {
        if (selectionStr) {
            x = e.clientX + window.scrollX;
            y = e.clientY + window.scrollY - 25;
            toolTipRef.setAttribute("style", `left: ${x}px; top: ${y}px`);
            let arrStr = selectionStr.split(" ");
            if (arrStr.length < 11 && arrStr[0] !== "") {
                if (tt && !tt.popperInstance.popper.contains(e.target)) {
                    tt.dispose();
                    tt = null;
                }
                if (!tt) {
                    fetch(
                        `${window.APP_URL}/extension-translate?key=${etranslateExtensionKey}&textLang=${textLang}&translateLang=${translateLang}&text=${selectionStr}`
                    )
                        .then((res) => res.json())
                        .then((text) => {
                            tt = new Tooltip(toolTipRef, {
                                placement: "top",
                                title: text,
                            }).show();
                        });
                }
            }
        } else if (tt || (tt && tt.popperInstance.popper.contains(e.target))) {
            tt.dispose();
            tt = null;
        }
    }, 0);
});

document.addEventListener("selectionchange", () => {
    selectionStr = window.getSelection().toString();
});
