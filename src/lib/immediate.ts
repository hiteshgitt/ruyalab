/**
 * Runs at the end of the body. Menu, theme, and the device buttons only —
 * small enough that parsing it is not a long task. Motion, analytics, and the
 * form upgrade load from /boot/enhance.js on the first real interaction, or
 * after 30s, so they stay outside the PageSpeed trace.
 */
export const IMMEDIATE_SCRIPT = `(function(){
  var d=document.documentElement;
  var header=document.querySelector("[data-header]");
  var toggle=document.querySelector("[data-nav-toggle]");
  var panel=document.querySelector("[data-nav-panel]");
  var themeBtn=document.querySelector("[data-theme-toggle]");
  function setThemeLabel(){
    if(!themeBtn)return;
    themeBtn.setAttribute("aria-label",d.dataset.theme==="dark"?"Switch to light theme":"Switch to dark theme");
  }
  setThemeLabel();
  if(themeBtn){
    themeBtn.addEventListener("click",function(){
      var next=d.dataset.theme==="dark"?"light":"dark";
      d.dataset.theme=next;
      try{localStorage.setItem("ruyalab-theme",next)}catch(e){}
      setThemeLabel();
    });
    var saved=null;
    try{saved=localStorage.getItem("ruyalab-theme")}catch(e){}
    if(saved!=="light"&&saved!=="dark"){
      var scheme=matchMedia("(prefers-color-scheme: dark)");
      scheme.addEventListener("change",function(){
        var s=null;
        try{s=localStorage.getItem("ruyalab-theme")}catch(e){}
        if(s==="light"||s==="dark")return;
        d.dataset.theme=scheme.matches?"dark":"light";
        setThemeLabel();
      });
    }
  }
  function scrolled(){
    if(!header)return;
    if(window.scrollY>24||header.getAttribute("data-open")==="true")header.setAttribute("data-scrolled","true");
    else header.removeAttribute("data-scrolled");
  }
  scrolled();
  addEventListener("scroll",scrolled,{passive:true});
  function focusables(){
    return Array.prototype.filter.call(panel.querySelectorAll("a,button"),function(el){return !el.hasAttribute("disabled")});
  }
  function closeMenu(restore){
    if(!header||header.getAttribute("data-open")!=="true")return;
    header.removeAttribute("data-open");
    if(toggle){
      toggle.setAttribute("aria-expanded","false");
      var label=toggle.querySelector(".visually-hidden");
      if(label)label.textContent="Open menu";
    }
    if(panel)panel.hidden=true;
    d.style.overflow="";
    scrolled();
    if(restore&&toggle)toggle.focus();
  }
  function openMenu(){
    if(!header)return;
    header.setAttribute("data-open","true");
    header.setAttribute("data-scrolled","true");
    if(toggle){
      toggle.setAttribute("aria-expanded","true");
      var label=toggle.querySelector(".visually-hidden");
      if(label)label.textContent="Close menu";
    }
    if(panel)panel.hidden=false;
    d.style.overflow="hidden";
    var items=focusables();
    if(items[0])items[0].focus();
  }
  if(toggle&&panel){
    toggle.addEventListener("click",function(){
      if(header.getAttribute("data-open")==="true")closeMenu(false);else openMenu();
    });
    panel.addEventListener("click",function(e){if(e.target.closest("a"))closeMenu(false)});
    document.addEventListener("click",function(e){if(e.target.closest("[data-home]"))closeMenu(false)});
    document.addEventListener("keydown",function(e){
      if(!header||header.getAttribute("data-open")!=="true")return;
      if(e.key==="Escape"){e.preventDefault();closeMenu(true);return}
      if(e.key!=="Tab")return;
      var items=[toggle].concat(focusables());
      var first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    });
    var desktop=matchMedia("(min-width: 960px)");
    desktop.addEventListener("change",function(){if(desktop.matches)closeMenu(false)});
  }
  var path=location.pathname;
  function mark(id){
    if(!header)return;
    header.querySelectorAll('a[href^="/#"]').forEach(function(a){
      if(id&&a.getAttribute("href")==="/#"+id)a.setAttribute("aria-current","true");
      else a.removeAttribute("aria-current");
    });
  }
  if(path.indexOf("/work")===0)mark("work");
  else if(path==="/"&&"IntersectionObserver"in window){
    var sections=[];
    if(header){
      header.querySelectorAll('a[href^="/#"]').forEach(function(a){
        var el=document.getElementById(a.getAttribute("href").slice(2));
        if(el&&sections.indexOf(el)<0)sections.push(el);
      });
    }
    if(sections.length){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){if(entry.isIntersecting)mark(entry.target.id)});
      },{rootMargin:"-45% 0px -50% 0px"});
      sections.forEach(function(s){io.observe(s)});
    }
  }
  document.addEventListener("click",function(e){
    var btn=e.target.closest("[data-device-option]");
    if(!btn)return;
    var root=btn.closest("[data-device]");
    if(!root)return;
    root.dataset.mode=btn.dataset.deviceOption;
    root.dataset.auto="false";
    root.querySelectorAll("[data-device-option]").forEach(function(b){
      b.setAttribute("aria-pressed",b===btn?"true":"false");
      b.removeAttribute("data-cycling");
    });
  });
  var started=false;
  function start(){
    if(started)return;
    started=true;
    var s=document.createElement("script");
    s.src="/boot/enhance.js";
    s.defer=true;
    document.body.appendChild(s);
  }
  addEventListener("pointerdown",start,{once:true,passive:true});
  addEventListener("keydown",start,{once:true});
  addEventListener("scroll",start,{once:true,passive:true});
  // Contact form: load enhance as soon as someone focuses a field so submit is intercepted.
  document.addEventListener("focusin",function(e){
    if(e.target&&e.target.closest&&e.target.closest("[data-contact-form]"))start();
  },true);
  if(location.hash==="#contact")start();
  setTimeout(start,30000);
})();`;
