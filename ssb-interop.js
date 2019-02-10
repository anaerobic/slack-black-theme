// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function() {

  // Then get its webviews
  let webviews = document.querySelectorAll(".TeamView webview");

  // Fetch our CSS in parallel ahead of time
  const cssPath = 'https://cdn.rawgit.com/widget-/slack-black-theme/master/custom.css';
  let cssPromise = fetch(cssPath).then(response => response.text());

  let customCustomCSS = `
  :root {
     /* Modify these to change your theme colors: */
     primary: #09F !important;
     text: #787878 !important;
     background: #080808 !important;
     background-elevated: #222 !important;
     background-hover: #282C34 !important;
     background-highlight: #616061 !important;
     background-light: #616061 !important;
  }
  
  .c-channel_name__text {
    color: var(--text) !important;
  }
  .c-menu {
    background-color: var(--background-hover) !important;
  }
  .c-menu_item__button {
    color: var(--text) !important;
  }
  .c-mrkdwn__broadcast--mention {
    background-color: var(--background-highlight) !important;
  }
  .c-message--hover {
    background-color: var(--background-hover) !important;
  }
  .c-message--light .c-message__sender .c-message__sender_link {
    color: var(--text) !important;
  }
  .c-message--highlight {
    background-color: var(--background-highlight) !important;
  }
  .c-message_attachment {
    color: var(--text) !important;
  }
  .c-message__body {
    color: var(--text) !important;
  }
  .c-message__editor__input--legacy {
    background-color: var(--background-hover) !important;
  }
  .c-message_kit__text {
    color: var(--text) !important;
  }
  .c-scrollbar__hider {
    background-color: var(--background) !important;
  }
  .c-team__display-name, .c-unified_member__display-name, .c-usergroup__handle {
    color: var(--text) !important;
  }
  .c-unified_member__display-name--large {
    color: var(--text) !important;
  }

  .p-flexpane_header {
    background-color: var(--background-highlight) !important;
  }
  .p-flexpane_header__children {
    color: var(--text) !important;
  }
  .p-message_pane__foreword__description {
    color: var(--text) !important;
  }

  .tab_complete_ui {
    background: #000 !important;
    color: var(--text) !important;
  }
  `

  // Insert a style tag into the wrapper view
  cssPromise.then(css => {
     let s = document.createElement('style');
     s.type = 'text/css';
     s.innerHTML = css + customCustomCSS;
     document.head.appendChild(s);
  });

  // Wait for each webview to load
  webviews.forEach(webview => {
     webview.addEventListener('ipc-message', message => {
        if (message.channel == 'didFinishLoading')
           // Finally add the CSS into the webview
           cssPromise.then(css => {
              let script = `
                    let s = document.createElement('style');
                    s.type = 'text/css';
                    s.id = 'slack-custom-css';
                    s.innerHTML = \`${css + customCustomCSS}\`;
                    document.head.appendChild(s);
                    `
              webview.executeJavaScript(script);
           })
     });
  });
});
