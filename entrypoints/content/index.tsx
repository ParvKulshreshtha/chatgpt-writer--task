import App from "./App";
import ReactDOM from "react-dom/client";
import "./style.css"

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        const styleElements = (elements:HTMLElement[] | NodeListOf<HTMLElement>):void => {

          elements.forEach((item) => {

              

              

              const icon = document.createElement("div");
          
              item.style.position = "relative";
              item.appendChild(icon);

              const insertMsg = (chat:string):void => {
                console.log(chat)
                item.innerHTML = `<p>${chat}</p>`
              }

              const root = ReactDOM.createRoot(icon);
              root.render(<App insertMsg={insertMsg}/>);}
          );
        };

        // Style initial elements
        const divElements = document.querySelectorAll<HTMLElement>(".msg-form__contenteditable");
        styleElements(divElements);

        // MutationObserver to watch for added elements
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement && node.classList.contains("msg-form__contenteditable")
                ) {
                  styleElements([node]);
                }
              });
            }
          });
        });

        // Start observing the body for child elements being added
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      },
      onRemove: (elements) => {
        console.log("Elements removed", elements);
      },
    });

    ui.mount();
  },
});
