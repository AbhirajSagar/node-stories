export function GetStandaloneHtml(title) 
{
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: #000; color: white; overflow: hidden; height: 100vh; width: 100vw; }
        #app { width: 100%; height: 100%; display: flex; justify-content: center; items-center; }
        .slide-container { width: 100%; max-width: 56.25vh; height: 100%; position: relative; display: flex; flex-col; justify-content: center; align-items: center; box-shadow: 0 0 50px rgba(0,0,0,0.5); overflow: hidden; }
        .bg-layer { position: absolute; inset: 0; background-size: cover; background-position: center; filter: blur(20px); opacity: 0.5; z-index: 0; }
        .media-layer { width: 100%; height: 100%; object-fit: cover; z-index: 1; position: relative; }
        .content-layer { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; z-index: 10; display: flex; flex-direction: column; gap: 1rem; align-items: center; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding-top: 6rem; }
        .text-box { font-size: 1.5rem; font-weight: 300; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin-bottom: 1rem; }
        .choice-btn { width: 100%; max-width: 400px; padding: 12px; border-radius: 8px; border: none; font-family: inherit; font-weight: 500; cursor: pointer; transition: transform 0.1s; margin-bottom: 8px; }
        .choice-btn:active { transform: scale(0.98); }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div id="app">Loading Story...</div>
    <script>
        (async function() {
            const app = document.getElementById('app');
            let story = null;
            
            try {
                const res = await fetch('./story.json');
                story = await res.json();
            } catch(e) {
                app.innerHTML = "Error loading story.json";
                return;
            }

            const slides = story.slides;
            const appearance = story.appearance;
            
            // Gradients
            const bgGrad = \`linear-gradient(135deg, \${appearance.bg_from}, \${appearance.bg_to})\`;
            const btnGrad = \`linear-gradient(135deg, \${appearance.option_from}, \${appearance.option_to})\`;
            const btnHover = \`linear-gradient(135deg, \${appearance.hovered_option_from}, \${appearance.hovered_option_to})\`;

            document.body.style.background = bgGrad;

            function renderSlide(slideId) {
                const slide = slides.find(s => s.id === slideId);
                if(!slide) { app.innerHTML = "<h1>End</h1>"; return; }

                let mediaHtml = '';
                let bgStyle = '';
                
                if(slide.type === 'image') {
                    mediaHtml = \`<img src="\${slide.data.key}" class="media-layer" />\`;
                    bgStyle = \`background-image: url('\${slide.data.key}')\`;
                } else if(slide.type === 'video') {
                    mediaHtml = \`<video src="\${slide.data.key}" class="media-layer" autoplay muted loop playsinline></video>\`;
                } else if(slide.type === 'audio') {
                     mediaHtml = \`<audio src="\${slide.data.key}" autoplay loop></audio><div style="z-index:2; font-size:3rem; opacity:0.5">♫</div>\`;
                }

                // Choices
                let choicesHtml = slide.data.choices.map((c, i) => 
                    \`<button class="choice-btn" id="btn-\${i}">\${c.content}</button>\`
                ).join('');

                app.innerHTML = \`
                    <div class="slide-container" style="background: black">
                        <div class="bg-layer" style="\${bgStyle}"></div>
                        \${mediaHtml}
                        <div class="content-layer">
                            \${slide.data.text ? \`<div class="text-box">\${slide.data.text}</div>\` : ''}
                            <div id="choices-area" class="hidden" style="width:100%; display:flex; flex-direction:column; align-items:center;">
                                \${choicesHtml}
                            </div>
                        </div>
                    </div>
                \`;

                // Add Listeners
                slide.data.choices.forEach((c, i) => {
                    const btn = document.getElementById(\`btn-\${i}\`);
                    btn.style.background = btnGrad;
                    btn.onmouseenter = () => btn.style.background = btnHover;
                    btn.onmouseleave = () => btn.style.background = btnGrad;
                    btn.onclick = () => renderSlide(c.connection);
                });

                // Delay
                setTimeout(() => {
                    const area = document.getElementById('choices-area');
                    if(area) {
                        area.classList.remove('hidden');
                        area.style.display = 'flex';
                    }
                }, (story.timing.delay || 0) * 1000);
            }

            renderSlide(slides[0].id);
        })();
    </script>
</body>
</html>`;
}