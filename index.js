javascript:(function(){
  var src = "function ready(){\n  var clicked = false;\n\n  alert('Click somewhere on the popup to remove it.\\n You may need to try a few different positions, be sure to click the bookmark before each attempt.\\n Good places to try include blank spaces or the area around the popup itself.');\n\n  document.addEventListener('click', function handler(e) {\n    if (clicked == false) {\n      e.preventDefault();\n      e.stopPropagation();\n\n      const el = e.target;\n      if (el.id != ''){\n        console.log('ID:', el.id);\n        document.getElementsByName(el.id)[0].setAttribute('style', 'visibility: hidden;');\n      } else {\n        console.log('Class:', el.className);\n        document.getElementsByClassName(el.className).setAttribute('style', 'visibility: hidden;');\n      }\n      document.getElementsByTagName('body')[0].removeAttribute('style');\n\n      clicked = true;\n    };\n  }, true);\n\n};\n\nready();";

  function runIn(doc){
    try{ (0, doc.defaultView.eval)(src); return true; }
    catch(e){
      try{
        var s = doc.createElement('script'); s.type='text/javascript'; s.text=src;
        (doc.head||doc.documentElement).appendChild(s); s.remove();
        return true;
      }catch(_){ return false; }
    }
  }

  // try to inject into same-origin iframes
  var injected = false;
  try{
    for(var i=0;i<window.frames.length;i++){
      try{ injected = runIn(window.frames[i].document) || injected; }catch(_){}
    }
  }catch(_){}

  // also try top document (in case the popup is not in a frame)
  try{ injected = runIn(document) || injected; }catch(_){}

  // Fallback: if nothing could be injected (likely cross-origin iframe),
  // use a one-time overlay that hides the topmost element at the click point.
  if(!injected){
    alert('Click the popup. If it is inside a cross-origin iframe, this will hide the iframe element itself.');
    var ov=document.createElement('div');
    ov.style.position='fixed'; ov.style.inset='0'; ov.style.zIndex='2147483647';
    ov.style.background='transparent'; ov.style.cursor='crosshair';
    document.documentElement.appendChild(ov);
    ov.addEventListener('click',function(ev){
      ev.preventDefault(); ev.stopPropagation();
      ov.style.pointerEvents='none';
      var el=document.elementFromPoint(ev.clientX,ev.clientY);
      ov.remove();
      if(el){
        try{ el.style.setProperty('visibility','hidden','important'); }catch(_){}
        if(document.body){ try{ document.body.removeAttribute('style'); }catch(_){ } }
      }
    },{once:true,capture:true});
  }
  undefined;
})();
