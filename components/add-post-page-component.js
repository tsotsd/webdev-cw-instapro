import { sanitizeHtml } from "../helpers.js";
import { getToken } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = '';
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div class="upload=image">
              <label class="file-upload-label secondary-button">
                  <input type="file" class="file-upload-input" style="display:none">
                  Выберите фото
              </label>  
            </div>
          </div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" id='textarea-input' rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>`;

    appEl.innerHTML = appHtml;
    
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    
    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById('textarea-input');
      if (description.value === "") {
        alert('Не заполнено описание фото');
      } else if (!imageUrl) {
        alert('Не добавлено фото');
      } else {
        onAddPostClick({
          token: getToken(),
          description: sanitizeHtml(description.value),
          imageUrl,
        });
      }
    });
  };
  render();
}