/ ==UserScript==
// @name         Tamkeen Pro Online
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  تعبئة الملاحظات تلقائياً في نظام تمكين
// @author       MOYOUNIS
// @match        https://sye.tamkeenapp.com/*
// @match        http://sye.tamkeenapp.com/*
// @match        https://*.tamkeenapp.com/*
// @match        http://*.tamkeenapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tamkeenapp.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

// باقي الكود يبدأ من هنا...

(function() {
    'use strict';

    let selectedPaymentNote = "";

    function autoFillTamkeen() {
        // 1. البحث عن قائمة طرق الدفع
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

            // إعادة بناء القائمة
            paymentSelect.innerHTML = '';
            options.forEach(opt => {
                let o = document.createElement('option');
                o.text = opt.label;
                o.value = opt.val;
                o.setAttribute('data-note', opt.note);
                paymentSelect.add(o);
            });

            // مراقبة التغيير في القائمة
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

        if (notesBox && selectedPaymentNote !== "") {
            if (notesBox.value !== selectedPaymentNote) {
                notesBox.value = selectedPaymentNote;
                
                // تنبيه AngularJS
                notesBox.dispatchEvent(new Event('input', { bubbles: true }));
                notesBox.dispatchEvent(new Event('change', { bubbles: true }));
                notesBox.dispatchEvent(new Event('blur', { bubbles: true }));
                
                console.log("Success: Note Injected -> " + selectedPaymentNote);
            }
        }
    }

    // الفحص الدوري
    setInterval(autoFillTamkeen, 300);
})();
