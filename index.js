const start = document.getElementById('start');
const core = new Core();
core.initRender();

window.addEventListener('keydown', (e) => {
    const key = e.code;

    if(key === 'Enter') {
        if(start.style.visibility === 'hidden') { return }
        
        start.style.visibility = 'hidden';
        core.initialGame();
        return;

    }
});

