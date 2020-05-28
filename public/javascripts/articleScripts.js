function editArticleAjax() {
    const url = window.location.href.split("/");
    const id = url[url.length - 1]

    const title_input = document.getElementById("edit-title-input").value
    const intro_input = document.getElementById("edit-intro-input").value
    console.log(title_input)
    console.log(intro_input)

    console.log(id);
    $.ajax({
        url: `/article/get/${id}/edit`,
        method: "PUT",
        data: JSON.stringify({
            articleTitle: title_input,
            articleIntro: intro_input
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            console.log(response);
            const title = document.getElementById("title");
            const intro = document.getElementById("intro");

            title.innerHTML = response.article.title + `<span class="edit-icon" uk-icon="icon: file-edit; ratio: 2.0"
            onclick="initializeEditArticle()"></span>`;
            intro.innerText = response.article.intro;

            $(title).css('display', 'block');
            $(intro).css('display', 'block');

            $("#title-edit-container").remove()
            $("#intro-edit-container").remove()
            $("#button-edit-container").remove()
        },
        fail: function (error) {
            console.log(error)
            /* TODO: ERROR */
        }
    });
}

function editContentAjax() {
    const articleId = document.getElementById("article").getAttribute('data-article-id')
    const contentId = this.getAttribute('data-content-id');

    const newSubtitle = document.getElementById(contentId + "_edit-subtitle-input").value
    const newParagraph = document.getElementById(contentId + "_edit-paragraph-input").value

    $.ajax({
        url: `/article/get/${articleId}/content/${contentId}/edit`,
        method: "PUT",
        data: JSON.stringify({
            subtitle: newSubtitle,
            paragraph: newParagraph
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            location.reload()
            // const subtitle = document.getElementById(contentId + "_subtitle");
            // const paragraph = document.getElementById(contentId + "_paragraph");
            // const editButtonsContainer = document.getElementById(contentId + "_edit-buttons")
            //
            // subtitle.innerHTML = response.content.subtitle;
            // paragraph.innerHTML = response.content.paragraph;
            //
            // $(subtitle).css('display', 'block');
            // $(paragraph).css('display', 'block');
            // $(editButtonsContainer).css('display', 'block');
            //
            // $(`#${contentId} .edit-input-container`).remove()
        },
        fail: function (error) {
            console.log(error)
            /* TODO: ERROR */
        }
    });
}

function initializeEditArticle() {
    /* create inputs for editing */
    const TitleInput = document.createElement('input');
    const IntroInput = document.createElement('textarea');
    const Button = document.createElement('button')

    /* css classes */
    $(TitleInput).addClass("uk-input");
    $(IntroInput).addClass("uk-textarea");
    $(Button).addClass("uk-button uk-button-default");

    /* create the containers */
    const containerTitle = document.createElement('div');
    const containerIntro = document.createElement('div');
    const containerButton = document.createElement('div');
    $(containerTitle).addClass("uk-margin");
    $(containerIntro).addClass("uk-margin");
    $(containerButton).addClass("uk-margin");
    containerTitle.id = "title-edit-container"
    containerIntro.id = "intro-edit-container"
    containerButton.id = "button-edit-container"
    containerTitle.appendChild(TitleInput);
    containerIntro.appendChild(IntroInput);
    containerButton.appendChild(Button);

    /* create button */
    Button.innerText = "Finish editing";
    Button.addEventListener("click", editArticleAjax);

    /* get title an intro current values */
    const title = document.getElementById("title");
    const intro = document.getElementById("intro");

    TitleInput.id = "edit-title-input"
    IntroInput.id = "edit-intro-input"

    /* set current values to inputs*/
    TitleInput.value = title.innerText;
    IntroInput.value = intro.innerText;

    /* append input, make paragraphs display none */
    $(containerTitle).insertAfter(title);
    $(title).css('display', 'none');

    $(containerIntro).insertAfter(intro);
    $(intro).css('display', 'none');

    $(containerButton).insertAfter(containerIntro);
}

function deleteArticle(element) {
    const id = element.getAttribute('data-article-id');
    const flag = confirm("Do you really want to delete this article?");
    if (flag) {
        $.ajax({
            url: `/article/get/${id}/remove`,
            method: 'DELETE',
            success: function (result) {
                $(`#${id}`).remove();
            }
        })
    }
}

function initializeEditContent(element) {
    const idContent = element.getAttribute('data-content-id');
    const containerComponent = document.getElementById(idContent);
    
    /* get already existent values */
    const subtitle = document.getElementById(idContent + "_subtitle");
    const paragraph = document.getElementById(idContent + "_paragraph");
    const editButtonsContainer = document.getElementById(idContent + "_edit-buttons");

    /* create inputs for editing */
    const subtitleInput = document.createElement("input")
    const paragraphInput = document.createElement("textarea");
    const saveButton = document.createElement('button');

    subtitleInput.id = idContent + "_edit-subtitle-input";
    paragraphInput.id = idContent + "_edit-paragraph-input";
    subtitleInput.value = subtitle ? subtitle.innerText : "";
    paragraphInput.innerText = paragraph ? paragraph.innerText : "";

    /* setting button */
    saveButton.innerText = "Save content";
    saveButton.setAttribute('data-content-id', idContent);
    saveButton.addEventListener("click", editContentAjax);

    /* css classes */
    $(subtitleInput).addClass("uk-input");
    $(paragraphInput).addClass("uk-textarea");
    $(saveButton).addClass("uk-button uk-button-default");

    /* create the containers */
    const containerSubtitle = document.createElement('div');
    const containerParagraph = document.createElement('div');
    const containerSaveButton = document.createElement('div');
    $(containerSubtitle).addClass("uk-margin edit-input-container");
    $(containerParagraph).addClass("uk-margin edit-input-container");
    $(containerSaveButton).addClass("uk-margin edit-input-container");
    containerSubtitle.appendChild(subtitleInput);
    containerParagraph.appendChild(paragraphInput);
    containerSaveButton.appendChild(saveButton);

    /* append input, make paragraphs display none */
    containerComponent.appendChild(containerSubtitle);
    containerComponent.appendChild(containerParagraph);
    containerComponent.appendChild(containerSaveButton);

    $(subtitle).css('display', 'none');
    $(paragraph).css('display', 'none');
    $(editButtonsContainer).css('display', 'none');
}

function deleteContent(element, articleId) {
    const id = element.getAttribute('data-content-id');
    const flag = confirm("Do you really want to delete this article?");
    console.log("articleId: ", articleId);
    console.log("id: ", id);
    if (flag) {
        $.ajax({
            url: `/article/get/${articleId}/content/${id}/remove`,
            method: 'DELETE',
            success: function (result) {
                $(`#${id}`).remove();
            }
        })
    }
}

function openFileUpload(element) {
    let idContent = element.getAttribute('data-content-id');
    let idArticle = document.getElementById("article").getAttribute("data-article-id")
    let inputSelector = $(`#upload-photo-${idContent}`);
    inputSelector.change(function () {
        console.log("image: ", $(this).val());
        postPhotoToContent(this, idArticle, idContent)
    })
    inputSelector.click();
}

function postPhotoToContent(element, articleId, contentId) {
    let link = `/article/get/${articleId}/content/${contentId}/photo/new`;
    let formData = new FormData()
    console.log(element);
    formData.append("files", element.files[0], "test.jpg")

    $.ajax({
        url: link,
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            location.reload();
        },
        error: function (err) {
            console.log(err);
            alert(`couldn't upload the photo: ${err.responseJSON.error.msg}`);
        },
        cache: false,
        contentType: false,
        processData: false
    });

}

function deletePhotoFromContent(element) {
    let idContent = element.getAttribute('data-content-id');
    let idArticle = document.getElementById("article").getAttribute("data-article-id");
    let idImage = element.getAttribute('data-image-id');
    console.log("idContent: ", idContent);
    console.log("idArticle: ", idArticle);
    console.log("idImage: ", idImage);
    let call = `/article/get/${idArticle}/content/${idContent}/photo/remove`;
    $.ajax({
        url: call,
        method: 'DELETE',
        data: {photoId: idImage},
        success: function (result) {
            location.reload();
        }
    })
}
