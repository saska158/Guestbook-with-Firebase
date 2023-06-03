import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push,  onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://guestbook-proba-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesBase = ref(database, "messages")

const guestbookForm = document.getElementById('guestbook-form')
const messageInput = document.getElementById('message-input')
const nameInput = document.getElementById('name-input')
const guestbookBtn = document.getElementById('guestbook-btn')
const guestbookContent = document.getElementById('guestbook-content')


guestbookForm.addEventListener('submit', event => {
    event.preventDefault()

    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        fetch(geoApiUrl)
        .then(res => res.json())
        .then(data => {
            const obj = {
                message: messageInput.value,
                name: nameInput.value,
                city: data.city
            }
            push(messagesBase, obj)
            messageInput.value = ''
            nameInput.value = ''
        })
    })

})


navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    fetch(geoApiUrl)
    .then(res => res.json())
    .then(data => {
        messageInput.placeholder = `What's up in ${data.city}?`
        
        onValue(messagesBase, function(snapshot) {
        const messages = Object.values(snapshot.val())
        guestbookContent.innerHTML = messages.map(message => (
             `<div class="message">
             ${message.message.includes('https') ?
              `<a href="${message.message}" target="_blank">${message.message}</a>` : 
              `<p>${message.message}</p>`}
               <p class="visitor-info">${message.name} from ${message.city}</p>
              </div>`)).join('')
        })
    })
})

