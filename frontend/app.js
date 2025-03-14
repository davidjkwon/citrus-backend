
const socket = io('ws://localhost:8080');

socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});
socket.on('location', (data) => {
    document.getElementById('response').innerText = data.message;
});

function sendLocation() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (latitude && longitude) {
        socket.emit('location', { latitude, longitude });
    } else {
        alert('Please enter both latitude and longitude');
    }
}
document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
    
}
