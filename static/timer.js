function updateTimer() {
    const expirationTime = parseInt(localStorage.getItem('userKeyExpiration'), 10);
    if (isNaN(expirationTime)) {
        document.getElementById('timer').innerText = 'No expiration time found';
        return;
    }

    const now = Date.now();
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) {
        document.getElementById('timer').innerText = 'Key expired';
        window.location.href = `/error.html?user=${userKey}`;
        return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('timer').innerText = `${hours}h ${minutes}m ${seconds}s left`;
}





const timerDiv = document.getElementById('timer');
let isDragging = false;
let lastTouchTime = Date.now();

timerDiv.addEventListener('mousedown', function(e) {
    isDragging = true;
    let startX = e.clientX - timerDiv.offsetLeft;
    let startY = e.clientY - timerDiv.offsetTop;

    function move(e) {
        let newX = e.clientX - startX;
        let newY = e.clientY - startY;


        newX = Math.max(0, Math.min(newX, window.innerWidth - timerDiv.clientWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - timerDiv.clientHeight));

        timerDiv.style.left = newX + 'px';
        timerDiv.style.top = newY + 'px';
    }

    function stop() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
        isDragging = false;
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
});


timerDiv.addEventListener('touchstart', function(e) {
    isDragging = true;
    let startX = e.touches[0].clientX - timerDiv.offsetLeft;
    let startY = e.touches[0].clientY - timerDiv.offsetTop;

    function move(e) {
        let newX = e.touches[0].clientX - startX;
        let newY = e.touches[0].clientY - startY;

        // Ensure the new position is within the window boundaries
        newX = Math.max(0, Math.min(newX, window.innerWidth - timerDiv.clientWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - timerDiv.clientHeight));

        timerDiv.style.left = newX + 'px';
        timerDiv.style.top = newY + 'px';
    }

    function stop() {
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', stop);
        isDragging = false;
    }

    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', stop);
});


function checkOpacity() {
    if (!isDragging && (Date.now() - lastTouchTime) > 10000) {
        timerDiv.classList.add('transparent');
    } else {
        timerDiv.classList.remove('transparent');
    }
}

setInterval(checkOpacity, 1000);

timerDiv.addEventListener('mousedown', () => lastTouchTime = Date.now());
timerDiv.addEventListener('mousemove', () => lastTouchTime = Date.now());
timerDiv.addEventListener('touchstart', () => lastTouchTime = Date.now());
timerDiv.addEventListener('touchmove', () => lastTouchTime = Date.now());


timerDiv.addEventListener('click', () => {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    setTimeout(() => messageDiv.style.display = 'none', 3000);
});