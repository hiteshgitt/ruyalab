import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Message received",
  robots: { index: false, follow: false },
};

/** Inline so GA4 fires even before React hydrates (and if the client chunk is delayed). */
const CONTACT_SUBMIT_SCRIPT = `(function(){
  var id=${JSON.stringify(site.gaId)};
  if(!id)return;
  try{if(sessionStorage.getItem("ruyalab_contact_submit")==="1")return;sessionStorage.setItem("ruyalab_contact_submit","1")}catch(e){}
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments)}
  window.gtag=window.gtag||gtag;
  if(!document.documentElement.dataset.gaConfigured){
    document.documentElement.dataset.gaConfigured="1";
    gtag("js",new Date());
    gtag("config",id,{send_page_view:true});
  }
  if(!document.querySelector('script[src*="googletagmanager.com/gtag/js?id='+id+'"]')){
    var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+id;document.head.appendChild(s);
  }
  gtag("event","contact_submit",{method:"form",page_path:"/thanks"});
})();`;

export default function Thanks() {
  return (
    <section className="container" style={{ paddingBlock: "8rem 6rem", maxWidth: "40rem" }}>
      <script dangerouslySetInnerHTML={{ __html: CONTACT_SUBMIT_SCRIPT }} />
      <p className="label">
        <span className="paren">Contact</span>
      </p>
      <h1 className="display" style={{ fontSize: "var(--t-h1)", marginTop: "0.75rem" }}>
        Message received.
      </h1>
      <p style={{ marginTop: "1.25rem", maxWidth: "36rem", color: "var(--c-text-2)" }}>
        Thanks — your message is in. We&apos;ll be in touch soon.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <a href="/" className="label">
          Back home
        </a>
      </p>
    </section>
  );
}
