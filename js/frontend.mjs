import {addImage, deleteImage, addComment,returnIndex, setIndex, deleteComment, commentsSize, ImageSize, getImages, getComments} from "./api.mjs";

let image_index = parseInt(returnIndex());
let commentIndex = 0;
let commentSize = 0;
let commentPreviousMove = 0;


// taken from chat gpt is this here link below
document.getElementById("popdown_start").addEventListener("click", function(){
    const form = document.getElementById("popdown_form");
    if (form.classList.contains("show")){
        form.classList.remove("show");
    }
    else{
        form.classList.add("show");
    }
});


/* Unable to upload the conversion since I have uploaded images to the prompt
I get there error ""Unable to share conversation
Sharing conversations with user uploaded images is not yet supported"" 
Here was my prompt: the problem is when I shrink the size of the screen then the topdown menu is all over the place 
here is the response:

Yes, you can make the form drop down smoothly while keeping the click functionality using CSS animations. We'll modify the previous solution to include a "drop-down" effect along with the click event.

Here’s how you can do it:

Updated JavaScript:
  <script>
    // JavaScript to toggle the form when the "Add Image" paragraph is clicked
    document.getElementById("add-image-paragraph").addEventListener("click", function() {
      const form = document.getElementById("popdown-form");
      // Toggle the form's visibility
      if (form.classList.contains("show")) {
        form.classList.remove("show");
      } else {
        form.classList.add("show");
      }
    });
  </script>
  How it Works:
When the user clicks the "Add Image" paragraph, the form will become visible and drop down with a smooth animation. Clicking again will hide the form, and it will slide up and fade out.
This setup gives you a clean drop-down form animation that can expand outside the grid while only showing on click.
*/





/*this part here was also taken by chatgpt 

the prompt i used was :
however I want to be able to click on some of the element in this 
like the icons and the forms but not the anything else 

chat answers:
To achieve the functionality where you can click on certain elements (like icons and forms) but prevent text selection when clicking on other parts of the background, you can use a combination of event listeners and CSS.

JavaScript Implementation
You can modify your JavaScript to prevent default selection behavior only when clicking on the background area, while allowing clicks on interactive elements like forms and icons.

Here’s how you can do it:

Add Event Listeners to Prevent Selection on the Background:
javascript
Copy code
// Prevent text selection when clicking on the background
document.getElementById("entire_feed").addEventListener('mousedown', function(event) {
    // Check if the click is on the main container
    if (event.target === this) {
        event.preventDefault(); // Prevent selection if clicking on the background
    }
});
*/

document.getElementById("entire_feed").addEventListener('mousedown', function(event) {
  // Check if the click is on the main container
  if (event.target === this) {
      event.preventDefault(); // Prevent selection if clicking on the background
  }
});

function remove_comment_add(){
  const addCommentsSection = document.querySelector(".addComment");
  addCommentsSection.style.display = "none";
}

function add_comment_add(){
  const addCommentsSection = document.querySelector(".addComment");
  addCommentsSection.style.display = "flex";
}

function show_arrows(){
  document.querySelectorAll(".ButtonImageDirc").forEach(function(arrows){
    arrows.style.display ="block";
  });
}

function hide_arrows(){
  document.querySelectorAll(".ButtonImageDirc").forEach(function(arrows){
    arrows.style.display ="none";
  });
}
function show_next_comment_button(){
  const comment_buttons = document.querySelector(".comments_switch");
  comment_buttons.style.visibility = "visible";
}

function hide_next_comment_button(){
  const comment_buttons = document.querySelector(".comments_switch");
  comment_buttons.style.visibility = "hidden";
}



//to change image left or right
function change_image_index(direction){
  const size = ImageSize();
  if (direction === "right"){
    // 2cases we have are not at end of list, we are at end of list
    if ((size - 1) >= (image_index + 1)){
      image_index += 1;
      setIndex(image_index);
      return;
    }
    // need to retrun to the start again 
    image_index = 0;
    setIndex(image_index);
  }
  //direction left
  else{
    //go to the end of the list
    if ((image_index - 1) < 0){
      image_index = size - 1;
      setIndex(image_index);
      return;
    }
    //continue left 
    image_index -= 1;
    setIndex(image_index);
  }
  return;
}


//update image
function update_image(way){
  const image = getImages(image_index); //will only recieve one image
  document.querySelector("#photocontainer").innerHTML = "";
  if (!image){
    console.log("You have no images :(");
    hide_arrows();
    remove_comment_add();
    hide_next_comment_button();
    return;
  }
  commentIndex = 0;
  commentPreviousMove = 0;
  console.log(`currently viewing image ${image.url}`);
  let elmt = document.createElement("div");
  elmt.className = "photohelpercontainer";
  elmt.innerHTML = `
                    <div class="photourl_box" data-imageId = "${image.imageId}" data-Imagedate = "${image.date}">
                        <img src= "${image.url}" id="photo">
                    </div>
                    <div class="photo_author">${image.author}</div>
                    <div class="image_title">${image.title}</div>
  `;
  document.getElementById("photocontainer").prepend(elmt);
  if (ImageSize() !== 0) {
    add_comment_add();
    show_arrows();
    show_next_comment_button();
    update_comment();
  }

  setTimeout(function(){
    if (way === "right"){
      enter_right();
    }
    else if (way === "left"){
      enter_left();
    }
    else{
      enter();
    }
  },100);
  
}
update_image();


  //adding new image 
  document.getElementById("AddImageForm").addEventListener("submit", function(e){
    e.preventDefault();
    let title = document.getElementById("image_title").value;
    let author = document.getElementById("image_author").value;
    let url = document.getElementById("image_actual").value;
    console.log(`Adding ${title}, ${author}, ${url}`);
    addImage(title, author, url);
    image_index = ImageSize() - 1;
    setIndex(image_index);
    update_image();
    document.getElementById("AddImageForm").reset();
    
  });


//deleting image
document.getElementById("deleteimage_icon").addEventListener("click", function(e){
  const imageElement = document.querySelector('.photourl_box');
  if (!imageElement){
    console.log("Error getting Image");
    return;
  }
  const imageId = imageElement.getAttribute("data-imageId");
  if (deleteImage(imageId)){
    console.log(`Successfully removed image with imageId ${imageId}`);
    change_image_index("right");
    update_image();
    // add a check that checks if we even have comments dumbass bitch hoe kys update_comment();
    document.querySelector("#comments").innerHTML = "";
    if (ImageSize() === 0){
      remove_comment_add();
      hide_arrows();
    }

  }
  else{
    console.log(`Error when removing image with imageId ${imageId}`)
  }
});


//update comment
function update_comment(){
    const holder = document.querySelector('.photoholder');
    const imageId = holder.querySelector('.photourl_box').getAttribute("data-imageId");
    const comments = getComments(imageId, commentIndex);
    commentIndex += comments.length;
    commentPreviousMove = comments.length;
    commentSize = commentsSize(imageId);
    document.querySelector("#comments").innerHTML = "";
    comments.forEach(function(comment){
      let elmt = document.createElement("div");
      elmt.className = "comment";
      elmt.setAttribute("data-commentId", comment.commentId);

      elmt.innerHTML = `
        <div class="comment_author">${comment.author}</div>
                            <div class="comment_content_container">
                                <div class="comment_content">${comment.content}</div>
                            </div>
                            <div class="comment_date">${new Date(comment.date).toISOString()}</div>
  
                            <div id = "delete" class="delete" icon data-commentId=${comment.commentId}></div>    `;
      document.getElementById("comments").prepend(elmt);
    });
  }



//code for the comments 
if (document.getElementById("addcommentform")){
  document.getElementById("addcommentform").addEventListener("submit", function(e){
    e.preventDefault();
    let author = document.getElementById("comment_author").value;
    let content = document.getElementById("comment_content").value;
    const photobox = this.closest(".photoholder").querySelector('.photourl_box');
    let imageId = photobox.getAttribute("data-imageId");
    addComment(imageId, author, content);
    document.getElementById("addcommentform").reset();
    commentIndex -= commentPreviousMove;
    update_comment();
  });
}

  //deleting comment
  if (document.getElementById("comments")){
    document.getElementById("comments").addEventListener("click", function(e){
      const commentId = e.target.getAttribute("data-commentId");
      if (e.target.classList.contains("delete")){
        if (!commentId){
          console.log("Error getting comment");
          return;
        }
        console.log("bruh");
        if (deleteComment(commentId)){
          console.log(`Successfully deleted comment with ${commentId}`);
          commentIndex -= (commentPreviousMove);
          update_comment();
          
        }
        else{
          console.log(`Error comment with commentId ${commentId} not found`);
        }
      }
      });
  }




//to change image_index becuase of buttons 
//change these to IDs

document.querySelectorAll(".ButtonImageDirc").forEach(function(element){
  element.addEventListener("click", function(e){
    if (e.target.classList.contains("goleft")){
      //need function to activate image change TODO
      slipeLeft();
    }
    else if (e.target.classList.contains("goright")){
      //need function to activate image change TODO
      //this button is not working 
      slipeRight();
    }
  });
});



//change button 
document.querySelector(".comments_switch").addEventListener("click", function(e){
    if (e.target.classList.contains("next_10")){
      //what I need TO check if comments + or - 10 is close to over getComments 
      //if we have less the 10 comment remaining display those, 
      const check = commentSize - commentIndex;
      if (check > 0){
        update_comment();
      }
    }
    else if (e.target.classList.contains("past_10")){
      const check = commentIndex  - commentPreviousMove- 10 ;
      if (check >= 0){
        commentIndex = commentIndex  - commentPreviousMove - 10;
        update_comment();
      }
    }
  });


function slipeRight(){
  const image = document.getElementById("photo");
  image.classList.add("slipe_right");
  setTimeout(function(){
    console.log("changing Image");
    change_image_index("right");
    resetEnter();
    setTimeout(function(){
      update_image("left");
    },50)
  },500);
}

function slipeLeft(){
  const image = document.getElementById("photo");
  image.classList.add("slipe_left");
  setTimeout(function(){
    console.log("changing Image");
    change_image_index("left");
    resetEnter();
    setTimeout(function(){
      update_image("right");
    },50)
  },500);
}

function resetEnter(){
  const photocontainer = document.getElementById("photocontainer");
  photocontainer.classList.remove("enter_right");
  photocontainer.classList.remove("enter_left");
  photocontainer.classList.remove("enter");
}
function enter(){
  const image = document.getElementById("photocontainer");
  image.classList.add("enter");
}
function enter_left(){
  const image = document.getElementById("photocontainer");
  image.classList.add("enter_left");
}
function enter_right(){
  const image = document.getElementById("photocontainer");
  image.classList.add("enter_right");
}
