// ==UserScript==
// @name         Tamkeen Pro Ultra Max
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  إصلاح شامل واختيارات دفع جديدة
// @author       MOYOUNIS
// @match        https://sye.tamkeenapp.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const options = [
        { label: "Cash", val: "string:cache", note: "Cash Payment" },
        { label: "Credit card", val: "string:credit-card", note: "Credit card Payment" },
        { label: "InstaPay", val: "string:bank", note: "Method: InstaPay" },
        { label: "VC-01001883884", val: "string:cheque", note: "Wallet: 01001883884" },
        { label: "VC-01022850171", val: "string:cheque", note: "Wallet: 01022850171" },
        { label: "VC-01064223325", val: "string:cheque", note: "Wallet: 01064223325" },
        { label: "VC-01068416733", val: "string:cheque", note: "Wallet: 01068416733" },
        { label: "EC-01111327387", val: "string:cheque", note: "Wallet: 01111327387" },
        { label: "Client Balance", val: "string:balance", note: "Method: Client Balance" },
        { label: "Client to Client Transfer", val: "string:balance", note: "Method: Client to Client Transfer" }
    ];

    function inject() {
        const select = document.querySelector('select[ng-model*="method"]');
        const noteBox = document.querySelector('textarea[ng-model*="note"]');

        if (select && !select.dataset.loaded) {
            select.innerHTML = options.map(opt => `<option value="${opt.val}" data-note="${opt.note}">${opt.label}</option>`).join('');
            select.addEventListener('change', () => {
                const note = select.options[select.selectedIndex].getAttribute('data-note');
                if (noteBox) {
                    noteBox.value = note;
                    noteBox.dispatchEvent(new Event('input', { bubbles: true }));
                    noteBox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            select.dataset.loaded = "true";
        }
    }

    // تكرار الفحص لضمان الظهور حتى لو الصفحة بطيئة
    setInterval(inject, 500);
})();
