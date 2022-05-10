"use strict";
myconsole.log("hello")
document.querySelector("#newBlog").addEventListener("submit",e=>{
    e.preventDefault()
    const blogObj = {
        user_name:document.querySelector("#user_name").value,
        image_url:document.querySelector("#image_url").value,
    }
    fetch("/api/user",{
        method:"POST",
        body:JSON.stringify(userObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok){
           location.reload()
        } else {
            alert("trumpet sound")
        }
    })
})

// upload img
window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
      
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
    });
});

// // save edit
// function saveEdits() {

//     //get the editable element
//     var editElem = document.getElementById("edit");
    
//     //get the edited element content
//     var userVersion = editElem.innerHTML;
    
//     //save the content to local storage
//     localStorage.userEdits = userVersion;
    
//     //write a confirmation to the user
//     document.getElementById("update").innerHTML="Edits saved!";
    
//     }


// console.log("edit info")
// document.querySelector("#edit").addEventListener("submit",e=>{
//     e.preventDefault()
//     const blogObj = {
//         editname:document.querySelector("#editName").value,
//         editAvatar:document.querySelector("#editAvatar").value,
//     }
//     fetch("/api/blogs",{
//         method:"POST",
//         body:JSON.stringify(blogObj),
//         headers:{
//             "Content-Type":"application/json"
//         }
//     }).then(res=>{
//         if(res.ok){
//            location.href = "/profile"
//         } else {
//             alert("trumpet sound")
//         }
//     })
// })

