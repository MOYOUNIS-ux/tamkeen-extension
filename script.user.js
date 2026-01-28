// ==UserScript==
// @name         Tamkeen Payment Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto fill notes in Tamkeen
// @author       You
// @match        https://*.tamkeenapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let selectedPaymentNote = "";

    function autoFillTamkeen() {
        const paymentSelect = document.querySelector('select[ng-model="transaction.info.method"]');
        if (paymentSelect && !paymentSelect.dataset.modified) {
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

            paymentSelect.innerHTML = '';
            options.forEach(opt => {
                let o = document.createElement('option');
                o.text = opt.label;
                o.value = opt.val;
                o.setAttribute('data-note', opt.note);
                paymentSelect.add(o);
            });

            paymentSelect.addEventListener('change', function() {
                const selected = paymentSelect.options[paymentSelect.selectedIndex];
                selectedPaymentNote = selected.getAttribute('data-note') || "";
                injectNow();
            });
            paymentSelect.dataset.modified = "true";
        }
        injectNow();
    }

    function injectNow() {
        const notesBox = document.querySelector('textarea[ng-model="transaction.info.note"]');
        if (notesBox && selectedPaymentNote !== "" && notesBox.value !== selectedPaymentNote) {
            notesBox.value = selectedPaymentNote;
            notesBox.dispatchEvent(new Event('input', { bubbles: true }));
            notesBox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    setInterval(autoFillTamkeen, 300);
})();
