// "use strict";
console.log("hello")
document.querySelector("#newProfile").addEventListener("submit",e=>{
    e.preventDefault()
var imageUrl
    // e.preventDefault()
    console.log('submitted')
    const file = document.querySelector("[type=file]").files[0];
    console.log(file)
    const preset = "ebfru8vf"
    const url = "https://api.cloudinary.com/v1_1/team1project2/image/upload"
    const formData = new FormData()
    formData.append('file', file)
    formData.append("upload_preset", preset)
     console.log(formData)
    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            return res.json()
        })
        .then((data) => {
            imageUrl = data.secure_url //this will give you the url of the uploaded image
            console.log(imageUrl)


        })
    
})
