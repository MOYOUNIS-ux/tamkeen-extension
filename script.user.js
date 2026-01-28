// ==UserScript==
// @name         Tamkeen Pro Ultra Max
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  تعبئة الملاحظات تلقائياً - نسخة مطورة جداً
// @author       MOYOUNIS
// @match        https://sye.tamkeenapp.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let selectedNote = "";

    function doMagic() {
        // 1. البحث عن قائمة الدفع
        const pSelect = document.querySelector('select[ng-model*="method"]');
        
        if (pSelect && !pSelect.dataset.done) {
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

            pSelect.innerHTML = '';
            options.forEach(opt => {
                let o = document.createElement('option');
                o.text = opt.label;
                o.value = opt.val;
                o.setAttribute('data-msg', opt.note);
                pSelect.add(o);
            });

            pSelect.addEventListener('change', () => {
                const sel = pSelect.options[pSelect.selectedIndex];
                selectedNote = sel.getAttribute('data-msg') || "";
                fillNow();
            });
            pSelect.dataset.done = "true";
        }
        fillNow();
    }

    function fillNow() {
        if (!selectedNote) return;

        // بنجرب كل الـ Selectors الممكنة لخانة الملاحظات
        const box = document.querySelector('textarea[ng-model*="note"]') || 
                    document.querySelector('textarea[name*="note"]') || 
                    document.querySelector('.form-control[ng-model*="transaction"]');

        if (box) {
            if (box.value !== selectedNote) {
                box.value = selectedNote;
                
                // أهم جزء: إجبار السيستم إنه يحس بالتغيير
                const events = ['input', 'change', 'blur'];
                events.forEach(e => {
                    box.dispatchEvent(new Event(e, { bubbles: true }));
                });

                // تحديث يدوي للـ Angular Scope لو أمكن
                if (window.angular) {
                    const element = window.angular.element(box);
                    const scope = element.scope();
                    if (scope) {
                        scope.$apply(() => {
                            scope.transaction.info.note = selectedNote;
                        });
                    }
                }
            }
        }
    }

    setInterval(doMagic, 300);
})();
