export default class NotesUI {

  constructor(notesData, root) {

    this.notesData = notesData;
    this.activeNoteId = localStorage.getItem("activeNoteId");
    this.activeNote = {};
    this.root = root;

    this.notesPreview = this.root.querySelector("#notes-preview");
    this.addNoteBtn = this.root.querySelector("#add-note");
    this.deleteBtn = this.root.querySelector("#btn-danger");
    this.noteTitle = this.root.querySelector("#note-title");
    this.noteContent = this.root.querySelector("#note-content");
    this.searchInput = this.root.querySelector("#search-input");


    this.noteTitle.addEventListener("paste", function(event){
      event.preventDefault();
      var clipboardData = event.clipboardData;
      var pasteData = clipboardData.getData('text/plain');
      var plainText = pasteData.replace("/<\/?[^>]+(>|$)/g", "");
      document.execCommand("insertText", false, plainText);
    });

    this.noteContent.addEventListener("paste", function(event){
      event.preventDefault();
      var clipboardData = event.clipboardData;
      var pasteData = clipboardData.getData('text/plain');
      var plainText = pasteData.replace("/<\/?[^>]+(>|$)/g", "");
      document.execCommand("insertText", false, plainText);
    });
    

    this.addNoteBtn.addEventListener("click", () => {
      this.createNote();
    });

    this.deleteBtn.addEventListener("click", () => {
     this.deleteNote();
    });

    this.noteTitle.addEventListener("input", (e) => {
      this.updateNote();
      if (e.inputType == "insertParagraph") {
        e.preventDefault();
        this.noteContent.focus();
      }
    });

    this.noteContent.addEventListener("input", () => {
      this.updateNote();
    });

    this.searchInput.addEventListener("input", () => {
      this.initUI();
    });

    this.initUI();

  }

  initUI() {
    this.renderListNotes();
    this.renderNote();
  }

  initListNotesItem(id, title, body, updated) {
    let active = "";
    if (id == this.activeNoteId) {
      active = "note-preview_active";
    }

    const note =
      `<div class="note-preview ${active}" data-note-id=${id}>
        <h3 class="note-preview__title">${title}</h3>
        <p class="note-preview__text">${body}</p>
        <p class="note-preview__date">${updated}</p>
      </div>`;

    return note;
  }

  initListNotes() {
    let notesList = ``;
    const searchStr = this.searchInput.value;
    let notes = this.notesData.getNotes(searchStr);

    if (notes.length == 0 && searchStr == "") {
      this.notesData.createNote();
      notes = this.notesData.getNotes();
    }

    notes.forEach(note => {
      notesList += this.initListNotesItem(note.id, note.title, note.body, note.updated);
      if (note.id == this.activeNoteId) {
        this.activeNote = note;
      }
    });

    return notesList;
  }

  renderListNotes() {
    this.notesPreview.innerHTML = this.initListNotes();

    const notesList = this.root.querySelectorAll(".note-preview");
    notesList.forEach(noteBtn => {
      noteBtn.addEventListener("click", (event) => {
        event.preventDefault();
        this.noteBtnClick(noteBtn);
      });
    });
  }

  noteBtnClick(button) {
    this.activeNoteId = button.dataset.noteId;
    localStorage.setItem("activeNoteId", this.activeNoteId);
    this.renderListNotes();
    this.renderNote();
  }

  renderNote() {
    this.noteTitle.innerHTML = this.activeNote.title;
    this.noteContent.innerHTML = this.activeNote.body;
  }

  createNote() {
    const createdNoteId = this.notesData.createNote();
    this.activeNoteId = createdNoteId;
    this.renderListNotes();
    this.renderNote();
  }

  deleteNote(){
    this.notesData.deleteNote(this.activeNoteId);
    const nextNote = JSON.parse(localStorage.getItem("notesapp-notes")) || 0;
    const nextNoteId = nextNote[0].id;
    this.activeNoteId = nextNoteId;
   
    this.initUI();
  }

  updateNote() {
    const newNote = {
    id: this.activeNoteId,
    title: this.noteTitle.innerHTML,
    body: this.noteContent.innerHTML,
    updated: new Date()
    }
    this.notesData.updateNote(newNote);
    this.renderListNotes();
  }
}