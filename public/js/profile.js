
const newProfileEl = document.querySelector("#newProfile");

if (newProfileEl) {
    newProfileEl.addEventListener("submit", e => {
        e.preventDefault();
        const file = document.querySelector("[type=file]").files[0];
        const preset = "ebfru8vf";
        const url = "https://api.cloudinary.com/v1_1/team1project2/image/upload";
        const formData = new FormData();
        const user_name = document.querySelector("#user_name").value;
        formData.append('file', file);
        formData.append("upload_preset", preset);
        if (!file) {
            if (user_name) {
                return fetch(`/api/users/${e.target.getAttribute("data-userID")}`, { method: "PUT", body: JSON.stringify({ "user_name": user_name }), headers: { "Content-Type": "application/json" } })
                    .then(res => {
                        if (res.ok) location.reload();
                    })
                    .catch(err => {
                        console.log("Err: ", err);
                    })
            }
            else {
                return;
            }
        } else {
            return fetch(url, { method: 'POST', body: formData })
                .then(res => res.json())
                .then((data) => {
                    const updatedUserObj = !user_name ? { "image_url": data.secure_url } : { "image_url": data.secure_url, user_name };
                    return fetch(`/api/users/${e.target.getAttribute("data-userID")}`, { method: "PUT", body: JSON.stringify(updatedUserObj), headers: { "Content-Type": "application/json" } })
                })
                .then(res => {
                    if (res.ok) location.reload();
                })
                .catch(err => {
                    console.log("Err: ", err);
                })
        }
    });
}