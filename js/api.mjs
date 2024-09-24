if (!localStorage.getItem("comments")){
    localStorage.setItem("comments", JSON.stringify({items:[]}));
}
if (!localStorage.getItem("images")){
    localStorage.setItem("images", JSON.stringify({items: []}));
}
if (!localStorage.getItem("imageIndex")){
    localStorage.setItem("imageIndex", "0");
}
/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date


    just a storage of the current index
    
****************************** */
//get the stuff for the images
export function returnIndex(){
    return localStorage.getItem("imageIndex");
}

export function setIndex(index){
    localStorage.setItem("imageIndex", String(index));
}

export function ImageSize(){
    const images = JSON.parse(localStorage.getItem("images")) || {items: []};
    return images.items.length;
}

export function getImages(index){
    const images = JSON.parse(localStorage.getItem("images")) || {items:[]};
    // wait we need to logic to only send one image.. and which image to send 
    return images.items[index];
}

//get Comments 
export function getComments(imageId, commentID){
    const images = JSON.parse(localStorage.getItem("images"));
    const comments = JSON.parse(localStorage.getItem("comments"));
    if(!comments.items.length){
        return [];
    }
    let sendingcomments = [];
    if (comments){
        for (let i = 0; i < comments.items.length; i++){
            if (comments.items[i].imageId === imageId){
                sendingcomments.push(comments.items[i]);
            }
        }
    }
    sendingcomments = sendingcomments.reverse().slice(commentID,commentID + 10);
    return sendingcomments.reverse();

}
export function commentsSize(imageId){
    const images = JSON.parse(localStorage.getItem("images"));
    const comments = JSON.parse(localStorage.getItem("comments"));
    if (!comments.items.length) return 0;
    let size = 0;
    if (comments){
        for (let i = 0; i < comments.items.length; i++){
            if (comments.items[i].imageId === imageId){
                size+=1;
            }
        }
    }
    //you might need to sort by date lowkey
    return size;
}
// add an image to the gallery
export function addImage(title, author, url) {
    const images = JSON.parse(localStorage.getItem("images")) || {items:[]};
    const date = Date.now();
    const randomInt = Math.floor(Math.random() * 1000000) + 1;
    const imageId = `${randomInt}_${author}`;
    const image = {
        imageId: imageId,
        title: title,
        author: author,
        url: url,
        date: date
    };
    images.items.push(image);
    localStorage.setItem("images", JSON.stringify(images));
    return true;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    const images = JSON.parse(localStorage.getItem("images"));
    const comments = JSON.parse(localStorage.getItem("comments"));
    if (!images){return false;}
    //deleting comments
    if (comments){
        let removingcomment = [];
        for (let i = 0; i < comments.items.length; i++){
            if (comments.items[i].imageId === imageId){
                removingcomment.push(comments.items[i].commentId);
            }
        }
        for (let i = 0; i < removingcomment.length; i++){
            deleteComment(removingcomment[i]);
        }
    }
    //deleting image code 
    const image_index = images.items.findIndex(function(item){
        return item.imageId === imageId;
    });
    if (image_index === -1){return false;}
    images.items.splice(image_index,1);
    localStorage.setItem("images", JSON.stringify(images));
    return true;

}

// add a comment to an image
export function addComment(imageId, author, content) {
    const comments = JSON.parse(localStorage.getItem("comments")) || {items:[]};
    const date = Date.now()
    const randomInt = Math.floor(Math.random() * 1000000) + 1;
    const commentid = `${randomInt}_${author}`;
    const comment = {
        commentId: commentid,
        imageId: imageId,
        author: author,
        content: content,
        date: date
    };
    comments.items.push(comment);
    localStorage.setItem("comments",JSON.stringify(comments));
}

// delete a comment to an image
export function deleteComment(commentId) {
    const comments = JSON.parse(localStorage.getItem("comments"));
    if (!comments) {return false;}
    const index = comments.items.findIndex(function(item){
        console.log(item.commentId);
        return item.commentId === commentId;
    });
    console.log(`awdoinawda ${commentId}`);
    if (index === -1){return false;}
    comments.items.splice(index, 1);
    console.log("happy");
    localStorage.setItem("comments", JSON.stringify(comments));
    return true;
}   
    
