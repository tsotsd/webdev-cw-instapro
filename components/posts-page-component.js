import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, token } from "../index.js";
import { dislike, like } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({singleUserMode}) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  const appElement = document.getElementById('app');
  const appEl = posts.map((post) => {
    if(singleUserMode){
      console.log(post);
    }
    
    return `
    <li class="post" id='post'>
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-liked="${post.isLiked}" class="like-button" data-index='${post.user.id}'>
          <img src="./assets/images/${post.isLiked ? "like-active" : "like-not-active"}.svg">
        </button>
        <p class="post-likes-text">Нравится: <strong>${post.likes.length}</strong></p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">${formatDistanceToNow(new Date(post.createdAt), {locale: ru})} назад</p>
    </li>`
  }).join("")
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">${appEl}</ul>
              </div>`;

  appElement.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
initLikeListener(singleUserMode);
}

function initLikeListener(singleUserMode) {
  const likeButtonElement = document.querySelectorAll(".like-button");
  for (const likeElement of likeButtonElement) {
    likeElement.addEventListener("click", () => {
      const userId = likeElement.dataset.index;
      console.log(userId);
      if (!token) {
        alert("Пожалуйста, зарегистрируйтесь или войдите в аккаунт");
        return;
      }
      if (likeElement.dataset.liked === "true") {
        dislike({
          id: likeElement.dataset.postId, token: getToken()
        })
        .then(() => {
          if (singleUserMode) {
            goToPage(USER_POSTS_PAGE, { userId })
          }
          else {
            goToPage(POSTS_PAGE, { noLoading: true })
          }
        })
      }
      else {
        like({
          id: likeElement.dataset.postId, token: getToken()
        })
        .then(() => {
          if (singleUserMode) {
            goToPage(USER_POSTS_PAGE, { userId })
          }
          else {
            goToPage(POSTS_PAGE, { noLoading: true })
          }
        });
      }
    })
  }
}