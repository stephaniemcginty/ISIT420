//pet object
function Pet(pId, pName, pAge, pBreed, pGender, pStatus) {
    this.id = pId;
    this.name = pName;
    this.age = pAge;
    this.breed = pBreed;
    this.gender = pGender;
    this.status = pStatus;
}

//our local copy of the cloud data
var PetNotes = [];

document.addEventListener("DOMContentLoaded", function (event) {

    //add a pet to database
    document.getElementById("submit").addEventListener("click", function () {
        var tTitle = document.getElementById("title").value;
        var tDetail = document.getElementById("detail").value;
        var tPriority = document.getElementById("priority").value;
        var onePet = new Pet(tTitle, tDetail, tPriority);

        $.ajax({
            url: '/NewPet' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(onePet),
            success: function (result) {
                console.log("added new note")
            }
        });
    });

    //get pet from database
    document.getElementById("get").addEventListener("click", function () {
        
        var ul = document.getElementById('listUl');
        ul.innerHTML = "";  // clears existing list so we don't duplicate old ones
        
        //var ul = document.createElement('ul')

        $.get("/Pets", function(data, status){  // AJAX get
            PetNotes = data;  // put the returned server json data into our local array

            // sort array by one property
            PetNotes.sort(compare);  // see compare method below
            console.log(data);
            //listDiv.appendChild(ul);
            PetNotes.forEach(ProcessOnePet); // build one li for each item in array
            function ProcessOnePet(item, index) {
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
  

    //delete pet from database
    document.getElementById("delete").addEventListener("click", function () {
        
        var whichPet = document.getElementById('deleteID').value;
        var idToDelete = "";
        for(i=0; i< PetNotes.length; i++){
            if(PetNotes[i].id === whichPet) {
                idToDelete = PetNotes[i].id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({
                    url: 'DeletePet/'+ idToDelete,
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
            console.log("No match found");
        }
    });

    // document.getElementById("completed").addEventListener("click", function () {
        
    //     var whichPet = document.getElementById('completedTitle').value;
    //     var idToChange = "";
    //     for(i=0; i< PetNotes.length; i++){
    //         if(PetNotes[i].title === whichPet) {
    //             idToChange = PetNotes[i]._id
    //        }
    //     }
        
    //     if(idToChange != "")
    //     {
    //         $.ajax({
    //             url: 'CompletePet/',
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
    

    //modify pet in the database
    document.getElementById("find").addEventListener("click", function () {
        var pId = document.getElementById("modID").value;
        var idToFind = "";
        for(i=0; i< PetNotes.length; i++){
            if(PetNotes[i].id === pId) {
                idToFind = PetNotes[i].id;
           }
        }
        console.log(idToFind);

        $.get("/FindPet/"+ idToFind, function(data, status){
            console.log(data[0].id + " " + data[0].name);
            document.getElementById("modName").value = data[0].name;
            document.getElementById("modAge").value= data[0].age;
            document.getElementById("modBreed").value = data[0].breed;
            document.getElementById("modGender").value = data[0].gender;
            document.getElementById("modAdopted").value = data[0].status;
        });
    });
});