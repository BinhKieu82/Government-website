var app1 = new Vue({
  el: '#app',  
    data: {
        members:[],
        count: 0,
        filterMembers:[],
        states:[],
        checkboxSelectVal: [] 
  },
    
    methods: {
    
        getData(){
       fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
        method: "GET",
        headers: {
        'X-API-Key':"EZTBdImPanyhz8qEwY4mdFuxU9ADEGiCKduVJulQ"
        }
        }).then(function(response) {
        if (response.ok) {
        // add a new promise to the chain
            return response.json(); 
        }
        // signal a server error to the chain
        throw new Error(response.statusText);
        }).then(json => {
        // do something with the JSON
        // note that this does not add a new promise
            this.members = json.results[0].members;
            this.states = this.members.map(member => member.state);
            this.filterMembers = this.members;
            this.getOptions()
            //console.log("All senators", this.members);
        }).catch(error => {
        // called when an error occurs anywhere in the chain
            console.log("Request failed: " + error.message );
        });
        
    },
        
        getName(members){
        let fullName = " ";
        if(members.middle_name !== null){
             fullName = members.first_name + " " + members.middle_name + " " + members.last_name;
        }else{
             fullName = members.first_name + " " + members.last_name;
        }
        return fullName;
    },
        
        getOptions(){
            //console.log("Options executed", this.states)
            let filterStates = this.states
            .filter((value, k, selectedState) => selectedState.indexOf(value) === k);
            //console.log("Filtered states", filterStates)
            return filterStates;           
        },
        
        handleChange(members){   
            var checkedParty = document.querySelectorAll(".party:checked");//return number when checkbox checked as nodelist
            var selectedState = document.querySelectorAll(".selectState:checked");//return number when selects selected as nodelist
            var myState = Array.from(selectedState);//convert nodelist to array
            var myParty = Array.from(checkedParty);//convert nodelist to array
            var valuesState = myState.map(function(x) {return x.value});
            //return checkbox value
            var valuesParty = myParty.map(function(y) {return y.value});
            var values = valuesState.concat(valuesParty);
            
            var dataFilterState;
            dataFilterState = this.members.filter(m =>values.includes(m.state)); //filter out a sub-object with checked "party" from checkboxs
            var dataFilterParty;
            dataFilterParty = this.members.filter(n =>values.includes(n.party));
            var dataFilter = dataFilterState.concat(dataFilterParty);
            
            console.log("chackbox & select", values)
            if (dataFilter.length == 0){
                return this.filterMembers = this.members; //if no checkbox and select actived then show fulltabel
            }else{
                
                return this.filterMembers = dataFilter.filter((value, k, dataFilter) => dataFilter.indexOf(value) === k);//filter out duplicate pairs
            }
        }
},
               
    created(){
    this.getData(); //execute getData function when window loaded
    }
});

