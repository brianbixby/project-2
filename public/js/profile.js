
const newProfileEl = document.querySelector("#newProfile");

if (newProfileEl) {
    newProfileEl.addEventListener("submit", e => {
        e.preventDefault();
        const file = document.querySelector("[type=file]").files[0];
        const preset = "ebfru8vf";
        const url = "https://api.cloudinary.com/v1_1/team1project2/image/upload";
        const formData = new FormData();
        formData.append('file', file);
        formData.append("upload_preset", preset);
        fetch(url, { method: 'POST', body: formData })
            .then(res => res.json())
            .then((data) => {
                const updatedUserObj = { "image_url": data.secure_url, "user_name": document.querySelector("#user_name").value };
                console.log("updatedUserObj: ", updatedUserObj);
                console.log("user id: ", e.target.getAttribute("data-userID"));
                return fetch(`/api/users/${e.target.getAttribute("data-userID")}`, { method: "PUT", body: JSON.stringify(updatedUserObj), headers: { "Content-Type": "application/json" } })
            })
            .then(res => {
                if (res.status === 200) {
                    console.log("success");
                    // to do alert user of success, maybe take them to another
                } else {
                    console.log("error did not update user: ", res);
                }
            }).catch(err => {
                console.log("Err: ", err);
            })
    });
}