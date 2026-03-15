(function(){
  try {
    var script = document.currentScript || document.querySelector('script[src*="widget.js"]') || document.querySelector('script[data-id]') || document.querySelector(document.scripts.length - 1);
    if(!script) return;

    var widgetId = script.getAttribute("data-id");
    if(!widgetId){
      console.error("[OneMinuteSupport] Missing data-id");
      return; 
    }

    fetch("http://localhost:3000/api/widget/session", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      credentials: "omit",
      body: JSON.stringify({
        widget_id: widgetId,
      }),
    }).then(function(res){
      if(!res.ok) throw new Error("Session request failed");

      return res.json();
    }).then(function(data){
      if(!data || !data.token){
        throw new Error("Invalid session response");
      }

      var iframe = document.createElement("iframe");
      iframe.src = "http://localhost:3000/embed?token="+encodeURIComponent(data.token);

      iframe.setAttribute("title", "Support Chat");
      iframe.style.position = "fixed";
      iframe.style.bottom = "20px";
      iframe.style.right = "20px";
      iframe.style.width = "60px";
      iframe.style.height = "60px";
      iframe.style.border = "none";
      iframe.style.zIndex = "999999";
      iframe.style.borderRadius = "30px";
      iframe.style.background = "transparent";
      iframe.style.transition = "all 0.3s ease";

      document.body.appendChild(iframe);

      window.addEventListener("message", function(event){
        if(event.data && event.data.type === "resize"){
          iframe.style.width = event.data.width;
          iframe.style.height = event.data.height;
          iframe.style.borderRadius = event.data.borderRadius || "12px";
        }
      });
    }).catch(function(err){
        console.error("[OneMinuteSupport] Failed to load widget: ", err);
    })
  } catch (error) {
    console.error("[OneMinuteSupport] widget error: ", error);
  }
})();