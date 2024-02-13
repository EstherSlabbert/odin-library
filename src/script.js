const newBookDialog = document.querySelector("dialog.new-book-dialog");
const showButton = document.querySelector("#add-new-book");
const submitFormBtn = document.getElementById('submit-btn');
const closeButton = document.querySelector(".close-btn");
const editBookDialog = document.querySelector('dialog.edit-form-dialog');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const myLibrary = [];

showButton.addEventListener("click", () => {
    openNewBookDialogBox();
    setRequiredFormFieldsStyle();
});

closeButton.addEventListener("click", closeNewBookDialogBox);

// Add new book via dialog form
submitFormBtn.addEventListener('click', addBookFromUserInput);

addBookToLibrary('The Lord of the Rings', 'J.R.R. Tolkien', 1008);
addBookToLibrary('Warbreaker', 'Brandon Sanderson', 592);
addBookToLibrary('Pride & Prejudice', 'Jane Austen', 376);
displayBooksInLibrary();

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages || NaN; // set default value for pages
  this.read = false; // set default value for read status
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
}

function removeBook(bookIndex) {
    myLibrary.splice(bookIndex, 1);
}

function addBookToLibrary(title, author, pages = NaN) {
  const book = new Book(title, author, pages);
  myLibrary.push(book);
}

function setRequiredFormFieldsStyle() {
    const requiredFormFields = document.getElementsByClassName('required');

    for (let requiredFormField of requiredFormFields) {
        console.log(requiredFormField);
        requiredFormField.addEventListener('input', () => {
            if (requiredFormField.value) {
                requiredFormField.classList.add('filled');
                requiredFormField.classList.remove('unfilled');
            } else {
                requiredFormField.classList.remove('filled');
                requiredFormField.classList.add('unfilled');
            };
        });
    }
}

function addBookFromUserInput() {
    const form = document.getElementById("form");
    // validate required fields are filled in
    const requiredFormFields = document.getElementsByClassName('required');
    for (let requiredFormField of requiredFormFields) {
        if (!requiredFormField.classList.contains('filled')) return; // exit function if any field is empty
    }
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    addBookToLibrary(obj.title, obj.author, parseInt(obj.pages) || 0);
    resetForm();
    closeNewBookDialogBox();
    displayBooksInLibrary();
}

function openNewBookDialogBox() {
    newBookDialog.showModal();
}

function closeNewBookDialogBox() {
    newBookDialog.close();
}

function resetForm() {
    for (let field of document.getElementsByClassName('input-field')) {
        field.value = '';
        if (field.classList.contains('filled')) {
            field.classList.add('unfilled');
            field.classList.remove('filled');
        }
    }
}

function showEditFormAndHandleIt(book) {
    editBookDialog.showModal();
    let titleField = document.getElementById('edit-title');
    let authorField = document.getElementById('edit-author');
    let pagesField = document.getElementById('edit-pages');
    cancelBtn.addEventListener('click', () => {
        closeEditBookDialogBox();
        return;
    });
    saveBtn.addEventListener('click', () => {
        if (titleField.value !== '') {
            book.title = titleField.value;
        }
        if (authorField.value !== '') {
            book.author = authorField.value;
        }
        // checks  that the number of pages is a positive integer or empty string
        if ((/^[0-9]+$/.test(pagesField.value)) || (pagesField.value === '')) {
            book.pages = parseInt(pagesField.value);
        }
        displayBooksInLibrary();
        closeEditBookDialogBox();
    });

    titleField.value = book.title;
    authorField.value = book.author;
    pagesField.value = book.pages;
}

function closeEditBookDialogBox() {
    editBookDialog.close();
}

function displayBooksInLibrary() {
    const container = document.getElementById('books-container');

    // Remove all existing book cards
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    myLibrary.forEach((book) => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.setAttribute('data-id', `${myLibrary.indexOf(book)}`);
        //console.log(bookCard.getAttribute('data-id'));

        const mainElement = document.createElement('div');
        mainElement.classList.add('main');
        bookCard.appendChild(mainElement);

        const img = document.createElement('img');
        img.className = 'tokenImage';
        img.src = '../images/mikolaj-DCzpr09cTXY-unsplash.jpg';
        img.alt = 'book';
        mainElement.appendChild(img);

        const titleElement = document.createElement('h2');
        titleElement.className = 'title';
        titleElement.textContent = book.title;
        mainElement.appendChild(titleElement);

        const authorElement = document.createElement('p');
        authorElement.className = 'author';
        authorElement.textContent = `by ${book.author}`;
        mainElement.appendChild(authorElement);

        const detailsElement = document.createElement('p');
        detailsElement.className = 'details';
        mainElement.appendChild(detailsElement);

        const readElement = document.createElement('span');
        readElement.classList.add('read');
        book.read ? readElement.title = 'read' : readElement.title = 'unread';
        readElement.id = `read-${myLibrary.indexOf(book)}`;
        readElement.textContent = `${book.read ? '📖' : '📕'}`;
        detailsElement.appendChild(readElement);

        const pagesElement = document.createElement('span');
        pagesElement.classList.add('pages');
        pagesElement.textContent = `Pages: ${book.pages}`;
        detailsElement.appendChild(pagesElement);

        const editButton = document.createElement('button');
        editButton.classList.add('edit-book');
        editButton.textContent = '✎ edit';
        editButton.id = `edit-book:${myLibrary.indexOf(book)}`;
        detailsElement.appendChild(editButton);

        const endCardElement = document.createElement('div');
        endCardElement.classList.add('end-card');
        mainElement.appendChild(endCardElement);

        endCardElement.appendChild(document.createElement('hr'));

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons');
        endCardElement.appendChild(buttonsContainer);

        const toggleReadButton = document.createElement('button');
        toggleReadButton.classList.add('toggle-read');
        toggleReadButton.id = `toggle-read:${myLibrary.indexOf(book)}`;
        toggleReadButton.textContent = book.read ? 'Mark as Unread' : 'Mark as Read';
        buttonsContainer.appendChild(toggleReadButton);

        const removeBookButton = document.createElement('button');
        removeBookButton.classList.add('remove-book');
        removeBookButton.id = `remove-book:${myLibrary.indexOf(book)}`;
        removeBookButton.textContent='Remove';
        buttonsContainer.appendChild(removeBookButton);

        container.appendChild(bookCard);
    });

    document.querySelectorAll(`.edit-book`).forEach((btn) => {
        btn.addEventListener('click', (event) => {
            let id = event.target.id.split(':')[1];
            let book = myLibrary[id];
            showEditFormAndHandleIt(book);
        })
    });

    document.querySelectorAll(`.remove-book`).forEach((button) => {
        button.addEventListener('click', (event) => {
            const bookIndex = parseInt(event.target.id.split(':')[1]);
            removeBook(bookIndex);
            displayBooksInLibrary();
        });
    });

    document.querySelectorAll('.toggle-read').forEach((button) => {
        button.addEventListener('click', (event) => {
        const bookIndex = parseInt(event.target.id.split(':')[1]);
        myLibrary[bookIndex].toggleRead();
        displayBooksInLibrary();
        });
    });
}
