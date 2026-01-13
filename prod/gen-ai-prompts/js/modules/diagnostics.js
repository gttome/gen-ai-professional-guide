// diagnostics.js (Phase 3)
// Lightweight asset audit utilities for static hosting (GitHub Pages) and local testing.
// Uses HEAD requests where possible to avoid downloading large media files.

import { safeUrl } from './dom.js';

async function headOk(path){
  if (!path) return { ok: false, status: 'not_configured' };

  const url = safeUrl(path);
  try{
    // Prefer HEAD to avoid downloading content. Falls back to GET if server disallows HEAD.
    let res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (res.ok) return { ok: true, status: 'ok' };

    // Some minimal servers may not support HEAD correctly. Try a tiny ranged GET.
    res = await fetch(url, { method: 'GET', headers: { 'Range': 'bytes=0-0' }, cache: 'no-store' });
    return { ok: res.ok, status: res.ok ? 'ok' : 'missing', http: res.status };
  }catch{
    return { ok: false, status: 'unknown' };
  }
}

export function expectedAssetsForPrompt(prompt){
  const info = prompt?.infographics || {};
  return [
    { key: 'infographic_concise', label: 'Infographic (concise)', path: info.concise || null },
    { key: 'infographic_standard', label: 'Infographic (standard)', path: info.standard || null },
    { key: 'infographic_detailed', label: 'Infographic (detailed)', path: info.detailed || null },
    { key: 'video', label: 'Video', path: prompt?.video || null },
    { key: 'audio', label: 'Audio', path: prompt?.audio || null },
    { key: 'template', label: 'Template', path: prompt?.template || null },
  ];
}

export async function auditPromptAssets(prompt){
  const items = expectedAssetsForPrompt(prompt);
  const results = [];
  for (const it of items){
    const chk = await headOk(it.path);
    results.push({
      ...it,
      status: chk.status, // ok | missing | not_configured | unknown
      http: chk.http || null,
    });
  }
  const okCount = results.filter(r => r.status === 'ok').length;
  const expectedCount = results.length;
  return { okCount, expectedCount, results };
}

export function statusLabel(status){
  switch(status){
    case 'ok': return 'OK';
    case 'missing': return 'Missing';
    case 'not_configured': return 'Not configured';
    default: return 'Unknown';
  }
}

export function formatDiagnosticsText(prompt, audit){
  const lines = [];
  lines.push(`Diagnostics Report`);
  lines.push(`Prompt: ${prompt?.title || 'Unknown'}`);
  lines.push(`Timestamp: ${new Date().toISOString()}`);
  lines.push(`Status: ${audit.okCount}/${audit.expectedCount} assets available`);
  lines.push('');
  for (const r of audit.results){
    const p = r.path ? r.path : '(none)';
    const http = r.http ? ` (HTTP ${r.http})` : '';
    lines.push(`- ${r.label}: ${statusLabel(r.status)}${http} — ${p}`);
  }
  lines.push('');
  lines.push('Notes: Missing assets are expected during development. Add files under /assets and update data/prompts.json.');
  return lines.join('\n') + '\n';
}

export function renderDiagnostics(prompt, audit, summaryEl, contentEl){
  if (summaryEl){
    summaryEl.textContent = `Assets available: ${audit.okCount}/${audit.expectedCount}`;
  }
  if (!contentEl) return;

  contentEl.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'diag-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `<tr><th scope="col">Asset</th><th scope="col">Status</th><th scope="col">Path</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const r of audit.results){
    const tr = document.createElement('tr');
    const status = statusLabel(r.status);
    const path = r.path ? r.path : '—';
    tr.innerHTML = `
      <td>${r.label}</td>
      <td><span class="diag-pill diag-${r.status}">${status}</span></td>
      <td class="diag-path">${path}</td>
    `;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  contentEl.appendChild(table);
}
