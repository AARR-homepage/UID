// ==UserScript==
// @name         Discord UID Extractor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Extract UIDs from Discord avatars and display them
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @license      You can modify as long as you credit me
// ==/UserScript==
 
(function() {
    'use strict';
 
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
            el.style.height = (el.clientHeight + 20) + 'px';
        });
 
        shrinkButton.addEventListener('click', () => {
            el.style.width = initialWidth;
            el.style.height = initialHeight;
        });
    }
 
    const initialWidth = '150px';
    const initialHeight = '30px';
 
    const container = document.createElement('div');
    container.id = 'uidContainer';
    container.style.position = 'fixed';
    container.style.top = '5px';
    container.style.left = '5px';
    container.style.backgroundColor = '#2f3136';
    container.style.color = '#ffffff';
    container.style.padding = '5px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '1000';
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.overflowY = 'scroll';
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
    startButton.textContent = 'Start Extraction';
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
        startButton.style.backgroundColor = '#7289da';
        startButton.style.color = '#ffffff';
    };
    startButton.onmouseleave = () => {
        startButton.style.backgroundColor = '#575757';
        startButton.style.color = '#ffffff';
    };
    container.appendChild(startButton);
 
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
        copyButton.style.backgroundColor = '#7289da';
        copyButton.style.color = '#ffffff';
    };
    copyButton.onmouseleave = () => {
        copyButton.style.backgroundColor = '#575757';
        copyButton.style.color = '#ffffff';
    };
    container.appendChild(copyButton);
 
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
 
    startButton.addEventListener('click', () => {
        updateUIDList();
        const observer = new MutationObserver(() => {
            setTimeout(updateUIDList, 1000);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
 
    copyButton.addEventListener('click', copyUIDsToClipboard);
})();
