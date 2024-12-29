const ip_room = document.getElementById('room');
const btn_join = document.getElementById('btn_join');
const ip_name = document.getElementById('ip_name');
const ip_message = document.getElementById('message');
const btn_send = document.getElementById('btn_send');
const ul_message = document.getElementById('ul_message');

                
                
                
const emotions =[
    {
        id: 1,
        emotion: '<i class="fa-solid fa-heart" style="color: red;"></i>'
    },
    {
        id: 2,
        emotion: '<i class="fa-regular fa-face-laugh-squint" style="color: black;background-color: yellow"></i>'
    },
    {
        id: 3,
        emotion: '<i class="fa-regular fa-face-angry" style="color: black;background-color: yellow"></i>'
    },
    {
        id: 4,
        emotion: '<i class="fa-regular fa-face-sad-tear" style="color: black;background-color: yellow"></i>'
    },

]

var socket = io.connect()


socket.on("connect",(data)=>{
    //lấy room để connect
    console.log(data);
});

btn_join.addEventListener("click",()=>{
    const room = ip_room.value
    
    socket.emit("join",room)
    alert(`Đã vòa phòng ${room} thành công!`)
})
const sendMessage = ()=>{
    const message = ip_message.value
    let id = ''
    for(let i=0; i < 8;i++){
        id += Math.floor(Math.random() * 10)
    }

    if(ip_image.files[0]){
        const formData = new FormData()
        formData.append("img", ip_image.files[0])
        fetch('/api/uploads',{
            method: "POST",
            body: formData,
        })
            .then(res=> res.json())
            .then(json => {
                const obj = {
                    id: +id,
                    name: my_name,
                    message: json.url
                }
                socket.emit("message", JSON.stringify(obj))
                img_message.style.display = "none";
                ip_image.value = "";
                return;
            })
            .catch((error)=>{
                console.log("call api loi");
                
            })
        
    }else{
        const obj = {
            id: +id,
            name: my_name,
            message: message
        }
        socket.emit("message", JSON.stringify(obj))
        ip_message.value = ""
        ip_message.focus();
    }
    if(!message){
        return;
    }   
}
btn_send.addEventListener("click",sendMessage)
let my_name= localStorage.getItem('username');
ip_message.addEventListener('keydown', (event)=>{
    if(event.key == "Enter"){
        sendMessage();
    }
})
socket.on("thread",(data)=>{
    const obj = JSON.parse(data)
    const li = document.createElement("li")
    li.innerHTML =`
    <span id="${obj.id}">
        <p>${obj.message.startsWith("https")? '<img width="200" src="' + obj.message +'">' : obj.message}</p>
    </span>
    <i onclick="show(event,${obj.id})" class="choose_emotion fa-regular fa-face-smile"></i>` ;

    if(obj.name === my_name){
        li.classList.add("right")
    }
    ul_message.appendChild(li)

    ul_message.scrollTop = ul_message.scrollHeight
})
function show(e, id){
    if(e.target.classList.contains("choose_emotion")){
        if(e.target.innerHTML.toString().trim().length===0){
            e.target.innerHTML = `
            <div class="emotions">
                <i onclick="choose(event,${id},1)" class="fa-solid fa-heart" style="color: red;"></i>
                <i onclick="choose(event,${id},2)" class="fa-regular fa-face-laugh-squint" style="color: yellow;"></i>
                <i onclick="choose(event,${id},3)" class="fa-regular fa-face-angry" style="color: yellow;"></i>
                <i onclick="choose(event,${id},4)" class="fa-regular fa-face-sad-tear" style="color: yellow;"></i>
            </div>`
        }
        else{
            e.target.innerHTML = ''
        }
    }
}
function choose(e,id,id_emotion){
    const span_message = document.getElementById(id+'')
    
    const emotion = e.target;
    emotion.style.position = 'absolute'
    emotion.style.top ='23px'
    emotion.style.left = '5px'
    emotion.style.borderRadius = '50%'

    span_message.appendChild(emotion)

    const obj = {
        id: id,
        emotion: id_emotion
    }
    socket.emit('emotion',JSON.stringify(obj))
}

socket.on('emotion',(data) => {
    const obj = JSON.parse(data)
    const span_message = document.getElementById(obj.id+'')
    
    let emotion = emotions[obj.emotion-1].emotion
    const div = document.createElement("div")
    div.innerHTML = emotion
    emotion = div.firstChild

    emotion.style.position = 'absolute'
    emotion.style.top ='23px'
    emotion.style.left = '5px'
    emotion.style.borderRadius = '50%'

    span_message.appendChild(emotion)
})

const ip_image = document.getElementById('ip_image')
const img_message = document.getElementById('img_message')

ip_image.addEventListener('change',()=>{
    img_message.src = URL.createObjectURL(ip_image.files[0])
    img_message.style.display = 'block'
})