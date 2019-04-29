class Book {
  constructor(categories, title, author, isbn) {
    this.categories = categories;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBook(book) {
    const bookList = document.querySelector('.book-list');
    const tableRow = document.createElement('tr');

    tableRow.innerHTML = `
      <td>${book.categories}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
    `
    // to delete item later
    // <td><a href="#" class="delete-item"><i class="fas fa-trash"></i></a></td>

    bookList.appendChild(tableRow);
  }

  clearFields() {
    document.querySelector('#book-cat').value = '';
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  showAlert(msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    container.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000)
  }

  deleteRow(e){
    if(e.target.parentElement.classList.contains('delete-item')){
      e.target.parentElement.parentElement.parentElement.remove()
    }
  }

}

// Event listener when user adding a book
document.querySelector('#add-book').addEventListener('click', function(e) {
  e.preventDefault();

  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value
  const bookCat = document.querySelector('#book-cat').value

  const book = new Book(bookCat, title, author, isbn);
  const ui = new UI();

  if (bookCat === '' || title === '' || author === '' || isbn === '') {
    ui.showAlert('No Data To Add', 'error');
  } else {
    //ui.addBook(book);
    ui.clearFields();
    ui.showAlert(`Buku ${book.title} berhasil ditambahin`, 'success');
    const firebaseRef = firebase.database().ref('books/')
    firebaseRef.push().set(book)
  }

})

document.querySelector('.book-list').addEventListener('click', function(e){
  const ui = new UI();
  ui.deleteRow(e);
})

document.addEventListener('DOMContentLoaded', function(){
  var ref = firebase.database().ref('books/');

  ref.on("value", function(data) {
    let hasil = data.val()
    let keys = Object.keys(hasil)
    for(let i = 0; i < keys.length; i++){
      let k = keys[i]
      let categor = hasil[k].categories
      let title = hasil[k].title
      let author = hasil[k].author
      let isbn = hasil[k].isbn
      console.log(categor, title, author, isbn)

      //update ke ui
      const bookList = document.querySelector('.book-list');
      const tableRow = document.createElement('tr');
  
      tableRow.innerHTML = `
        <td>${categor}</td>
        <td>${title}</td>
        <td>${author}</td>
        <td>${isbn}</td>
      `
      // to delete item later
      // <td><a href="#" class="delete-item"><i class="fas fa-trash"></i></a></td>
  
      bookList.appendChild(tableRow);
    }
  }, function (error) {
    console.log("Error: " + error.code);
  });
})

