javascript:(async function(){
  try{
    const RAW='RAW_URL_HERE';
    const res = await fetch(RAW,{cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const txt = await res.text();

    // Build a list of same-origin documents: top + iframes we can access
    const docs = [{ label: 'top: ' + location.href, doc: document }];
    for (let i=0;i<window.frames.length;i++){
      try{
        const w = window.frames[i];
        // Access will throw on cross-origin frames; we skip those
        void w.document; void w.location.href;
        docs.push({ label: 'frame['+i+']: ' + (w.location.href || 'about:blank'), doc: w.document });
      }catch(_) {}
    }

    // Let you pick the exact context (like switching context in DevTools)
    let idx = 0;
    if(docs.length > 1){
      const menu = docs.map((d,i)=> i+': '+d.label).join('\n');
      const input = prompt(
        'Pick frame to run the code in (like DevTools context):\n' + menu + '\n\nDefault 0 = top page',
        '0'
      );
      const n = parseInt(input,10);
      if (!isNaN(n) && n>=0 && n<docs.length) idx = n;
    }

    // Execute your code exactly as-is in the chosen document
    (0, docs[idx].doc.defaultView.eval)(txt);
  }catch(e){
    alert('Bookmarklet error: ' + (e && e.message ? e.message : e));
  }
})();void 0;
