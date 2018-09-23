// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (let i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(`
        <div class="card p-3"> 
       <h5> <p id="article" data-id=${data[i]._id}>${data[i].title}</p></h5>
          <a href=${data[i].link}">Link</a>
        </div>
      `);



    // <p id="article" data-id=${data[i]._id}> ${data[i].title} <br /> ${data[i].link}</p>



    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    let thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);

        $("#notes").append(`
            <div class="card p-3">
                <h5 class="card-title">${data.title}</h5>
                <div id="article-notes" class="card"></div>
                <div class="card-header">Comments</div>
                <ul class="list-group list-group-flush" id="notes-results"></ul><br>
                <h6 class="card-subtitle mb-2 text-muted">Add a comment</h6>
                <textarea class="form-control" id='bodyinput'></textarea>
                <button type="button" class="btn btn-primary" data-id=${data._id} id='savenote'>Save Note</button>
            </div>
        `);



//         <div class="card" style="width: 18rem;">
//   <div class="card-header">
//     Featured
//   </div>
//   <ul class="list-group list-group-flush">
//     <li class="list-group-item">Cras justo odio</li>
//     <li class="list-group-item">Dapibus ac facilisis in</li>
//     <li class="list-group-item">Vestibulum at eros</li>
//   </ul>
// </div>

        console.log("DATA: " + data);

        data.notes.forEach(id => {
            $.ajax({
                method: "GET",
                url: "/notes/" + id
              }).then(function(res){

                $('#notes-results').append(


                    // `
                    // <div class="card">
                    //     <div class="row">
                    //             <div class="col">${res.body}</div>
                    //             <div class="col"><button>X</button></div>
                    //         </div>
                    //     </div>
                    //     `

                    `
                        <li class="list-group-item">
                            <div class="row" >
                                <div class="col" id="note-content ${res._id}">${res.body}</div>
                                <button class=float-right id="delete-note" data-id=${res._id}>X</button>
                                
                            </div>
                        </li>
                    `
                );

              })
        });

        // // If there's a note in the article
        // if (data.note) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);
        // }
      })
      
      //Get all the notes and put them on the page 
    //   .then(function(data){
        //   console.log("DATA: " + data);

        // data.notes.array.forEach(id => {
        //     $.ajax({
        //         method: "GET",
        //         url: "/notes/" + id
        //       }).then(function(res){

        //         $('#article-notes').append(
        //             `<div>
        //                 <div>${res.title}</div>
        //                 <div>${res.body}</div>
        //             </div>`
        //         );

        //       })
        // });
        


    //   });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");
  });


  $(document).on("click","#delete-note", function(){
      console.log("CLIECKED");


    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/notes/" + thisId
      }).then(function(data){
          console.log("here");

          $("#notes").empty();
    
      })

  } )
  