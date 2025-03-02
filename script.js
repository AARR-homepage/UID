// ==UserScript==
// @name         Discord UID Extractor
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Extract UIDs from Discord avatars and display them
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @license      You can modify as long as you credit me
// @downloadURL  https://update.greasyfork.org/scripts/518295/Discord%20UID%20Extractor.user.js
// @updateURL    https://update.greasyfork.org/scripts/518295/Discord%20UID%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    let isBoxVisible = false;

    function makeElementDraggable(el) {
        el.onmousedown = function(event) {
            event.preventDefault();

            let shiftX = event.clientX - el.getBoundingClientRect().left;
            let shiftY = event.clientY - el.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                el.style.left = Math.min(Math.max(0, pageX - shiftX), window.innerWidth - el.offsetWidth) + 'px';
                el.style.top = Math.min(Math.max(0, pageY - shiftY), window.innerHeight - el.offsetHeight) + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mouseup', onMouseUp);
        };

        el.ondragstart = function() {
            return false;
        };
    }

    function addResizeButtons(el, initialWidth, initialHeight) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '5px';
        buttonContainer.style.top = '5px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '5px';
        el.appendChild(buttonContainer);

        const enlargeButton = document.createElement('button');
        enlargeButton.textContent = '＋';
        enlargeButton.style.padding = '2px 5px';
        enlargeButton.style.fontSize = '10px';
        enlargeButton.style.backgroundColor = '#575757';
        enlargeButton.style.color = '#ffffff';
        enlargeButton.style.border = 'none';
        enlargeButton.style.borderRadius = '3px';
        enlargeButton.style.cursor = 'pointer';
        enlargeButton.style.transition = 'color 0.3s, background-color 0.3s';
        enlargeButton.onmouseenter = () => {
            enlargeButton.style.backgroundColor = '#4CAF50';
            enlargeButton.style.color = '#ffffff';
        };
        enlargeButton.onmouseleave = () => {
            enlargeButton.style.backgroundColor = '#575757';
            enlargeButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(enlargeButton);

        const shrinkButton = document.createElement('button');
        shrinkButton.textContent = '－';
        shrinkButton.style.padding = '2px 5px';
        shrinkButton.style.fontSize = '10px';
        shrinkButton.style.backgroundColor = '#575757';
        shrinkButton.style.color = '#ffffff';
        shrinkButton.style.border = 'none';
        shrinkButton.style.borderRadius = '3px';
        shrinkButton.style.cursor = 'pointer';
        shrinkButton.style.transition = 'color 0.3s, background-color 0.3s';
        shrinkButton.onmouseenter = () => {
            shrinkButton.style.backgroundColor = '#f44336';
            shrinkButton.style.color = '#ffffff';
        };
        shrinkButton.onmouseleave = () => {
            shrinkButton.style.backgroundColor = '#575757';
            shrinkButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(shrinkButton);

        enlargeButton.addEventListener('click', () => {
            el.style.height = (el.clientHeight + 150) + 'px';
        });

        shrinkButton.addEventListener('click', () => {
            el.style.width = initialWidth;
            el.style.height = initialHeight;
        });
    }

    const initialWidth = '150px';
    const initialHeight = '65px';

    const container = document.createElement('div');
    container.id = 'uidContainer';
    container.style.position = 'fixed';
    container.style.top = '120px';
    container.style.left = '80px';
    container.style.backgroundColor = '#2f3136';
    container.style.color = '#ffffff';
    container.style.padding = '5px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '1000';
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.overflowY = 'scroll';
    container.style.display = 'none';
    document.body.appendChild(container);

    makeElementDraggable(container);
    addResizeButtons(container, initialWidth, initialHeight);

    const title = document.createElement('h2');
    title.textContent = 'Extracted UIDs';
    title.style.margin = '0 0 5px 0';
    title.style.fontSize = '12px';
    container.appendChild(title);

    const uidList = document.createElement('ul');
    uidList.style.listStyleType = 'none';
    uidList.style.padding = '0';
    uidList.style.fontSize = '10px';
    container.appendChild(uidList);

    const startButton = document.createElement('button');
    startButton.textContent = ' Start ';
    startButton.style.marginTop = '5px';
    startButton.style.padding = '2px 5px';
    startButton.style.fontSize = '10px';
    startButton.style.backgroundColor = '#575757';
    startButton.style.color = '#ffffff';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '3px';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'color 0.3s, background-color 0.3s';
    startButton.onmouseenter = () => {
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = '#ffffff';
    };
    startButton.onmouseleave = () => {
        startButton.style.backgroundColor = '#575757';
        startButton.style.color = '#ffffff';
    };
    container.appendChild(startButton);

    const stopButton = document.createElement('button');
    stopButton.textContent = ' Stop ';
    stopButton.style.marginTop = '5px';
    stopButton.style.padding = '2px 5px';
    stopButton.style.fontSize = '10px';
    stopButton.style.backgroundColor = '#575757';
    stopButton.style.color = '#ffffff';
    stopButton.style.border = 'none';
    stopButton.style.borderRadius = '3px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.transition = 'color 0.3s, background-color 0.3s';
    stopButton.onmouseenter = () => {
        stopButton.style.backgroundColor = '#f44336';
        stopButton.style.color = '#ffffff';
    };
    stopButton.onmouseleave = () => {
        stopButton.style.backgroundColor = '#575757';
        stopButton.style.color = '#ffffff';
    };
    container.appendChild(stopButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.marginTop = '5px';
    resetButton.style.padding = '2px 5px';
    resetButton.style.fontSize = '10px';
    resetButton.style.backgroundColor = '#575757';
    resetButton.style.color = '#ffffff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.transition = 'color 0.3s, background-color 0.3s';
    resetButton.onmouseenter = () => {
        resetButton.style.backgroundColor = '#f44336';
        resetButton.style.color = '#ffffff';
    };
    resetButton.onmouseleave = () => {
        resetButton.style.backgroundColor = '#575757';
        resetButton.style.color = '#ffffff';
    };
    container.appendChild(resetButton);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy UIDs';
    copyButton.style.marginTop = '5px';
    copyButton.style.padding = '2px 5px';
    copyButton.style.fontSize = '10px';
    copyButton.style.backgroundColor = '#575757';
    copyButton.style.color = '#ffffff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '3px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.transition = 'color 0.3s, background-color 0.3s';
    copyButton.onmouseenter = () => {
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = '#ffffff';
    };
    copyButton.onmouseleave = () => {
        copyButton.style.backgroundColor = '#575757';
        copyButton.style.color = '#ffffff';
    };
    container.appendChild(copyButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save File';
    saveButton.style.marginTop = '5px';
    saveButton.style.padding = '2px 5px';
    saveButton.style.fontSize = '10px';
    saveButton.style.backgroundColor = '#575757';
    saveButton.style.color = '#ffffff';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '3px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.transition = 'color 0.3s, background-color 0.3s';
    saveButton.onmouseenter = () => {
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = '#ffffff';
    };
    saveButton.onmouseleave = () => {
        saveButton.style.backgroundColor = '#575757';
        saveButton.style.color = '#ffffff';
    };
    container.appendChild(saveButton);

    function extractUIDs() {
        const avatarElements = document.querySelectorAll('img[src*="cdn.discordapp.com/avatars/"]');
        const uids = new Set();
        avatarElements.forEach(img => {
            const url = img.src;
            const match = url.match(/avatars\/(\d+)\//);
            if (match) {
                uids.add(match[1]);
            }
        });
        return Array.from(uids);
    }

    function updateUIDList() {
        const uids = extractUIDs();
        uids.forEach(uid => {
            if (!Array.from(uidList.children).some(li => li.textContent === uid)) {
                const listItem = document.createElement('li');
                listItem.textContent = uid;
                listItem.style.color = 'green';
                uidList.appendChild(listItem);
            }
        });
    }

    function copyUIDsToClipboard() {
        const uids = Array.from(uidList.children).map(li => li.textContent).join('\n');
        navigator.clipboard.writeText(uids).then(() => {
        }).catch(err => {
            console.error('Failed to copy UIDs: ', err);
        });
    }

    function resetUIDList() {
        uidList.innerHTML = '';
        if (observer) {
            observer.disconnect();
        }
    }

    function saveUIDsToFile() {
        const uids = Array.from(uidList.children).map(li => li.textContent).join('\n');
        const blob = new Blob([uids], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uids.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    startButton.addEventListener('click', () => {
        if (observer) {
            observer.disconnect();
        }
        updateUIDList();
        observer = new MutationObserver(() => {
            setTimeout(updateUIDList, 1000);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    stopButton.addEventListener('click', () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    });

    copyButton.addEventListener('click', copyUIDsToClipboard);
    resetButton.addEventListener('click', resetUIDList);
    saveButton.addEventListener('click', saveUIDsToFile);


    const toggleImage = document.createElement('img');
    toggleImage.src = 'https://i.imgur.com/fS8jqh3.png';
    toggleImage.style.position = 'fixed';
    toggleImage.style.top = '770px';
    toggleImage.style.left = '75px';
    toggleImage.style.width = '30px';
    toggleImage.style.height = '30px';
    toggleImage.style.cursor = 'pointer';
    toggleImage.style.zIndex = '1001';
    document.body.appendChild(toggleImage);

    toggleImage.addEventListener('click', () => {
        isBoxVisible = !isBoxVisible;
        container.style.display = isBoxVisible ? 'block' : 'none';
    });
})();
