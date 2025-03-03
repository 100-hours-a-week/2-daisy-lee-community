const MAX_TITLE_LENGTH = 26; // 게시물 제목 최대 글자수

// 게시물 목록 출력
async function setList() {
    try {
        const postJson = await fetch("/prac/data/posts.json");
        const data = await postJson.json();

        const posts = data.posts;

        const postList = document.getElementById("posts-list");
        postList.innerHTML = ""; // 목록 초기화

        posts.forEach( post => {
            const postItem = document.createElement("div");
            postItem.classList.add("post-area");

            let shortTitle = post.title.length > MAX_TITLE_LENGTH 
                                ? post.title.slice(0, MAX_TITLE_LENGTH) + "..." 
                                : post.title;
            

            postItem.innerHTML = `
                    <div id="postItem" style="cursor: pointer;">
                        <div class="posts-title">${shortTitle}</div>
                        <div class="posts-info">
                            <span class="posts-recommend" style="margin-right: 7px;">좋아요 ${formatNumber(post.countLike)}</span>
                            <span id="posts-replyNum" style="margin-right: 7px;">댓글 ${formatNumber(post.comments.length)}</span>
                            <span id="posts-viewsNum">조회수 ${formatNumber(post.countView)}</span>
                            <span id="posts-dateNum" style="float: right">${post.createdAt}</span>
                        </div>
                        <div class="posts-profile">
                            <div class="posts-profileImage"></div>
                            <span class="posts-author">${post.authorId}</span>
                        </div>
                    </div>
                `;

            const detailPostDiv = postItem.querySelector("#postItem");
            detailPostDiv.addEventListener("click", () => detailPost(post.id));

            postList.appendChild(postItem);
        });
    } catch (error) {
        console.error("게시물 목록 오류 : ", error);
    }
}

// 게시물 목록 내 숫자 표시 format (좋아요, 댓글, 조회수)
function formatNumber(num) {
    if (num >= 100000) return Math.floor(num / 1000) + "k";
    if (num >= 10000) return Math.floor(num / 1000) + "k";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(".0", "") + "k";
    return num;
}

// 게시물 클릭 시 상세보기 페이지 이동
function detailPost(postId) {
    location.href = `/prac/html/posts/detail.html?id=${postId}`; 
    // alert(`게시물 ${postId} 상세보기 페이지로 이동!`);
}


// 게시물 작성 시 이미지 선택
function getPostThumbnailImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const previewThumbnail = document.querySelector('#post-thumbnail-upload-preview');
        previewThumbnail.style.backgroundImage = `url(${event.target.result})`;
    };

    reader.readAsDataURL(file);
}

const postThumbnailUpload = document.querySelector('#post-thumbnail-upload');
postThumbnailUpload.addEventListener('change', getPostThumbnailImage);


/* 게시물 상세보기 */
async function setDetail() {
    try {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("id");

        if(!postId) {
            alert("해당 게시물을 찾을 수 없습니다.");
            location.href("/prac/html/posts/list.html");
            return;
        }
        const postJson = await fetch("/prac/data/posts.json");
        const data = await postJson.json();
        const posts = data.posts;

        const post = posts.find(post => post.id == postId);
        if(!post) {
            alert("해당 게시물을 찾을 수 없습니다.");
            location.href("/prac/html/posts/list.html");
            return;
        }
        
        // 게시물 내용 바인딩
        document.querySelector(".posts-title").textContent = post.title;
        document.querySelector(".posts-author").textContent = post.authorId;
        document.querySelector(".posts-date").textContent = post.createdAt;
        document.querySelector(".posts-text").textContent = post.contents;
        document.querySelector(".posts-count:nth-child(1) p").textContent = formatNumber(post.countLike);
        document.querySelector(".posts-count:nth-child(2) p").textContent = formatNumber(post.countView);
        document.querySelector(".posts-count:nth-child(3) p").textContent = formatNumber(post.comments.length);

        // 댓글 목록 및 내용 바인딩
        const replyList = document.querySelector(".posts-reply-list");
        replyList.innerHTML = ""; // 기존 댓글 초기화

        post.comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("posts-reply-unit");
            commentDiv.innerHTML = `
                <div class="posts-profile" style="display: inline-flex; width: 70%;">
                    <div class="posts-profileImage"></div>
                    <span class="posts-author">작성자: ${comment.authorId}</span>
                    <span class="posts-date">${comment.createdAt}</span>
                </div>
                <div style="margin-left: auto; display: inline-block;">
                    <button class="posts-small-btn">수정</button>
                    <button class="posts-small-btn">삭제</button>
                </div>
                <div class="posts-reply-text">
                    ${comment.content}
                </div>
            `;
            replyList.appendChild(commentDiv);
        });
    } catch (error) {
        console.error("게시물 목록 오류 : ", error);
    }
}