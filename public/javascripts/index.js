
function ToDo(pTitle, pDetail, pPriority) {
    this.title= pTitle;
    this.detail = pDetail;
    this.priority = pPriority;
    this.completed = false;
  }
  var ClientNotes = [];  // our local copy of the cloud data


document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tTitle = document.getElementById("title").value;
        var tDetail = document.getElementById("detail").value;
        var tPriority = document.getElementById("priority").value;
        var oneToDo = new ToDo(tTitle, tDetail, tPriority);

        $.ajax({
            url: '/NewToDo' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneToDo),
            success: function (result) {
                console.log("added new note")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        
        var ul = document.getElementById('listUl');
        ul.innerHTML = "";  // clears existing list so we don't duplicate old ones
        
        //var ul = document.createElement('ul')

        $.get("/ToDos", function(data, status){  // AJAX get
            ClientNotes = data;  // put the returned server json data into our local array

            // sort array by one property
            ClientNotes.sort(compare);  // see compare method below
            console.log(data);
            //listDiv.appendChild(ul);
            ClientNotes.forEach(ProcessOneToDo); // build one li for each item in array
            function ProcessOneToDo(item, index) {
                var li = document.createElement('li');
                ul.appendChild(li);
    
                li.innerHTML=li.innerHTML + index + ": " + " Priority: " + item.priority + "  " + item.title + ":  " + item.detail + " Done? "+ item.completed;
            }
        });

        function compare(a,b) {
            if (a.completed == false && b.completed== true) {
                return -1;
            }
            if (a.completed == false && b.completed== true) {
                return 1;
            }
            return 0;
        }
    });
  


    document.getElementById("delete").addEventListener("click", function () {
        
        var whichToDo = document.getElementById('deleteTitle').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === whichToDo) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteToDo/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
        }
        else {
            console.log("no matching Subject");
        } 
    });

    // document.getElementById("completed").addEventListener("click", function () {
        
    //     var whichToDo = document.getElementById('completedTitle').value;
    //     var idToChange = "";
    //     for(i=0; i< ClientNotes.length; i++){
    //         if(ClientNotes[i].title === whichToDo) {
    //             idToChange = ClientNotes[i]._id
    //        }
    //     }
        
    //     if(idToChange != "")
    //     {
    //         $.ajax({
    //             url: 'CompleteToDo/',
    //             type: 'PUT',
    //             contentType: 'application/json',
    //             data: JSON.stringify({id: idToChange}),
    //                 success: function (response) {  
    //                     console.log(response);  
    //                 },  
    //                 error: function () {  
    //                     console.log('Error in Operation');  
    //                 }  
    //             });  
            
    //     }
    //     else {
    //         console.log("no matching Subject");
    //     } 
    // });
    

    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var tTitle = document.getElementById("modTitle").value;
        var idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === tTitle) {
                idToFind = ClientNotes[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindToDo/"+ idToFind, function(data, status){ 
            console.log(data[0].title);
            document.getElementById("mtitle").value = data[0].title;
            document.getElementById("mdetail").value= data[0].detail;
            document.getElementById("mpriority").value = data[0].priority;
           

        });
    });


   
});

