const cardImage = document.getElementById("card-image")
const cardTitle = document.getElementById("card-title")
const likeCount = document.getElementById("like-count")
const commentsList = document.getElementById("comments-list")
const likeButton = document.getElementById("like-button")
const commentForm = document.getElementById("comment-form")
commentsList.innerHTML = ""
let myImage
let newestComment

likeButton.addEventListener("click", increaseLikes)
commentForm.addEventListener("submit", addComment)
cardTitle.addEventListener("click", toggleDisplay)
cardImage.addEventListener("click", randomizeDog)

fetch("http://localhost:3000/images/1")
.then(response => response.json())
.then(data => {
    displayImage(data)
})

fetch("http://localhost:3000/comments")
.then(response => response.json())
.then(data => {
    data.forEach(displayComment)
})

function displayImage(image){
    myImage = image
    cardImage.src = image.image
    cardTitle.textContent = image.title
    displayLikes()
}

function displayComment(comment){
    newestComment = comment
    const newComment = document.createElement("li")
    newComment.textContent = comment.content
    newComment.id = comment.id
    commentsList.append(newComment)
    newComment.addEventListener("click", deleteComment)
}

function increaseLikes(){
    myImage.likes++
    displayLikes()

    fetch("http://localhost:3000/images/1" , {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            likes: myImage.likes
        })
    })
}

function displayLikes(){
    if (myImage.likes === 1)
        likeCount.textContent = myImage.likes + " like"
    else
        likeCount.textContent = myImage.likes + " likes"
}

function addComment(event){
    event.preventDefault()
    let newId
    if (!newestComment)
        newId = 1
    else
        newId = newestComment.id + 1
    const myComment = {
        id: newId,
        imageId: myImage.id,
        content: event.target.children[0].value
    }
    displayComment(myComment)
    event.target.reset()

    fetch("http://localhost:3000/comments" , {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(myComment)
    })
}

function deleteComment(event){
    event.target.remove()

    fetch(`http://localhost:3000/comments/${event.target.id}` , {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    })
}

function toggleDisplay(){
    if (cardImage.style.display == "block" ||
        cardImage.style.display == "")
        cardImage.style.display = "none"
    else
        cardImage.style.display = "block"
}

function randomizeDog(){
    fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => response.json())
    .then(data => {
        cardImage.src = data.message
        return data.message
    })
    .then(patchDog)
}

function patchDog(newURL){
    fetch("http://localhost:3000/images/1" , {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            image: newURL
        })   
    })
}