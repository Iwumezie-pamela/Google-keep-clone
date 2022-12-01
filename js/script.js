class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    //any note stored in the browser would be put into the this.notes and also if there is note in the browser ,display the truthy one else display nothing
    this.title = "";
    this.text = "";
    this.id = "";

    //$ sign is used to indicate an element tag
    this.$notes = document.querySelector("#notes");
    this.$placeholder = document.querySelector("#placeholder");
    this.$form = document.querySelector("#form");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$formButton = document.querySelector("#form-buttons");
    this.$closeButton = document.querySelector("#form-close-button");
    this.$modal = document.querySelector(".modal");
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton = document.querySelector(".modal-close-button");
    this.$colorTooltip = document.querySelector("#color-tooltip");

    this.saveNote();
    //this two displays our initial note available on the note property
    this.displayNote();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    //to make tooltip visible when cursor is placed on it
    document.body.addEventListener("mouseover", (event) => {
      this.openTooltip(event);
    });
    //make tooltip visible to none when cursor is placed on it
    document.body.addEventListener("mouseout", (event) => {
      this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    this.$colorTooltip.addEventListener("click", (event) => {
      //change the edit note color
      const color = event.target.dataset.color;

      if (color) {
        // display the color selected in the edit note
        this.editNoteColor(color);
      }
    });

    this.$form.addEventListener("submit", (event) => {
      //submit button
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      //   how do we check if a user doesn't type in anything
      const hasNote = title || text;
      if (hasNote) {
        //add note
        this.addNote({ title, text });
      } else {
        //display nothing
      }
    });

    this.$closeButton.addEventListener("click", (event) => {
      //the close button
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener("click", (event) => {
      //the modal close button
      this.closeModal(event);
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    //   add note if the user clicks anywhere
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      // open form
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      // close form
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add("form-open");
    this.$noteTitle.style.display = "block";
    this.$formButton.style.display = "block";
  }

  closeForm() {
    this.$form.classList.remove("form-open");
    this.$noteTitle.style.display = "none";
    this.$formButton.style.display = "none";
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

  openModal(event) {
    // this makes the modal hidden once our note has been deleted
    if (event.target.matches(".toolbar-delete")) return;
    //open modal div
    if (event.target.closest(".note")) {
      //open and display modal
      this.$modal.classList.toggle("open-modal");
      //display the title and text note in the modal title and text
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
    //edit note
    this.editNote();
    // close Modal
    this.$modal.classList.toggle("open-modal");
  }

  //open tooltip that has the colors needed to change the note color
  openTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return; //if we are not hovering over the tool tip
    this.id = event.target.dataset.id; //to get the element next the to toolbar that is the note div
    const noteCoords = event.target.getBoundingClientRect(); //in order to make sure that the tooltip is right avove the palette,the getBoundingClientRect() gives specific information of where they are hovering over
    //inorder to know where to put the tooltip horizontally and vertically and also to know how much a user has scrolled we do this:
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = window.scrollY - 20;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeTooltip(event) {
    // close tooltip
    if (!event.target.matches(".toolbar-color")) return;
    this.$colorTooltip.style.display = "none";
  }

  //it can be destructured
  // addNote({title,text}) {
  // const newNote = {
  // title,
  // text,
  addNote(note) {
    const newNote = {
      title: note.title,
      text: note.text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.saveNote();
    this.displayNote();
    this.closeForm();
  }

  // edit note in the modal
  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;

    this.notes = this.notes.map(
      (note) => (note.id === Number(this.id) ? { ...note, title, text } : note) //convert the string id to number in order to compare them
    );
    this.saveNote();
    this.displayNote();
  }

  editNoteColor(color) {
    this.notes = this.notes.map(
      (note) => (note.id === Number(this.id) ? { ...note, color } : note) //convert the string id to number in order to compare them
    );
    this.saveNote();
    this.displayNote();
  }

  //this enables the note written in our note to be displayed in our modal
  selectNote(event) {
    const $selectedNote = event.target.closest(".note");
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }

  deleteNote(event) {
    //to delete note when the trashcan icon is clicked
    event.stopPropagation();
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter((note) => note.id !== Number(id)); //the note id is not equal to the id above meaning we would get everyother note from the id apart from the id above
    this.saveNote();
    this.displayNote();
  }

  // render() {  //this can be used to reference our save and display note instead of inputing them one after the other
  //   this.saveNote();
  //   this.displayNote();
  // }

  saveNote() {
    //store note so that even when the browser is refreshed,it doesn't disappear
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  displayNote() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? "none" : "flex";
    // OR
    // if (hasNotes) {
    //    this.$placeholder.style.display='none'
    // } else {
    //     this.$placeholder.style.display = "flex";
    // }

    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id=${
                note.id
              } src='https://cdn-icons-png.flaticon.com/512/565/565789.png'>
              <img class="toolbar-delete" data-id=${
                note.id
              } src='https://cdn-icons-png.flaticon.com/512/542/542724.png'>
            </div>
          </div>
        </div>
     `
      )
      .join(""); //the #notes div and the join is used to remove the apostrophe sign
  }
}

new App();
