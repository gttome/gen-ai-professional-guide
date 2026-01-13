// dom.js
export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('aria-')) node.setAttribute(k, v);
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children){
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export function safeUrl(path){
  // Handles spaces and special chars in file names.
  return path ? encodeURI(path) : '';
}
