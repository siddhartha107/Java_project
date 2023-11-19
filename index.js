let loginDiv=document.getElementById("loginDiv");

let tokken="";

// login function 

function logIn(){
    email=document.getElementById("logEmail").value;
     password=document.getElementById("logPassword").value;
     let bodyBluePrint={
        login_id:email,
        password:password
     }
     console.log(bodyBluePrint,JSON.stringify(bodyBluePrint))
    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp`,{method:"POST",body:JSON.stringify(bodyBluePrint)}).then((res)=>res.json()).then((data)=>{
    tokken=data.access_token
    
    loginDiv.style.display="none";
    renderDashboard();
}).catch((err)=>console.log(err))
   
}

// dashboard Screen functions 

function renderDashboard(){
    let dashboardDiv =document.createElement("div");
    dashboardDiv.id="dash-board-div"
    dashboardDiv.innerHTML=`<div>
    <button onclick="renderAddCustomer()">Add Customer</button>
    <h1 onclick="renderAddCustomer()">Customer List</h1>
</div>
<div>
    <table>
          <tr>
           <th>First Name</th>
           <th>Last Name</th>
           <th>Street</th>
           <th>Address</th>
           <th>City</th>
           <th>State</th>
           <th>Email</th>
           <th>Phone</th>
           <th>Action</th>
          </tr>
          
    </table>`
    document.body.append(dashboardDiv);
    let table=document.getElementsByTagName("table")[0];
    console.log(table)
    let listOfCustomer=null
    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list`,{method:"GET",headers:{"Authorization":`Bearer ${tokken}`}}).then((res)=>res.json().then((data)=>{
        console.log(data)
        data.forEach((e)=>renderCustomer(e,table));
    })).catch((err)=>console.log(err))
}

function renderCustomer(e,table){
    console.log(table)
    let row=document.createElement("tr");
    row.innerHTML=`<td style="display: none;">${e.uuid}</td><td>${e.first_name}</td><td>${e.last_name}</td><td>${e.street}</td><td>${e.address}</td><td>${e.city}</td><td>${e.state}</td><td>${e.email}</td><td>${e.phone}</td><td><p>delete</p><p>/edit</p></td>`
    table.appendChild(row)
    row.children[9].children[0].addEventListener("click",deleteFunction);
    row.children[9].children[1].addEventListener("click",editFunction);

}

// add Customer Screen functions

function renderAddCustomer(){
    console.log("aya00")
    let addCoustomerDiv=document.createElement("div")
    addCoustomerDiv.className="addCustomerDiv"
    addCoustomerDiv.innerHTML=`<h1>Add Customer</h1>
   
    <div class="inputDiv">
        <input required id="fname" type="text" placeholder="First Name">
        <input required id="lname" type="text" placeholder="LastName">
    </div>
    <div class="inputDiv">
        <input id="streetV" type="text" placeholder="Street">
        <input id="addressV" type="text" placeholder="Address">
    </div > 
    <div class="inputDiv">
        <input id="cityV" type="text" placeholder="City">
        <input id="stateV" type="text" placeholder="State">
    </div> 
    <div class="inputDiv">
        <input id="emailV" type="text" placeholder="Email">
        <input id="phoneV" type="text" placeholder="Phone">
    </div>
    <button onclick="sumbitCustomer()">Sumbit</button>`
    document.getElementById("dash-board-div").remove();
    document.body.append(addCoustomerDiv);
}

// sumbit customer function

function sumbitCustomer(){

      let temp={
        first_name: document.getElementById("fname").value,
        last_name: document.getElementById("lname").value,
        street: document.getElementById("streetV").value,
        address: document.getElementById("addressV").value,
        city: document.getElementById("cityV").value,
        state: document.getElementById("stateV").value,
        email: document.getElementById("emailV").value,
        phone: document.getElementById("phoneV").value
      }
      if(temp.first_name==""||temp.last_name==""){
        return;
      }
      fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create`,{method:"POST",headers:{"Authorization":`Bearer ${tokken}`},body:JSON.stringify(temp)}).then((res)=>{
        console.log(res);
        if(res.ok){
        document.getElementsByClassName("addCustomerDiv")[0].remove()
        renderDashboard()}
        else{
            alert("some Error occured try again")
        }
    }).catch((err)=>console.log(err))
}

// delete function

function deleteFunction(e){
    console.log(e)
let uuid=e.target.parentNode.parentNode.children[0].innerText;
console.log(uuid);
fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`,{method:"POST",headers:{"Authorization":`Bearer ${tokken}`}}).then((res)=>{
    console.log(res);
    document.getElementById("dash-board-div").remove();
    renderDashboard()
}).catch((err)=>console.log(err))
}

// edit function

function editFunction(e){
    console.log(e)
    let previousData={
        uuid:e.target.parentNode.parentNode.children[0].innerText,
        first_name:e.target.parentNode.parentNode.children[1].innerText,
        last_name:e.target.parentNode.parentNode.children[2].innerText,
        street:e.target.parentNode.parentNode.children[3].innerText,
        address:e.target.parentNode.parentNode.children[4].innerText,
        city:e.target.parentNode.parentNode.children[5].innerText,
        state:e.target.parentNode.parentNode.children[6].innerText,
        email:e.target.parentNode.parentNode.children[7].innerText,
        phone:e.target.parentNode.parentNode.children[8].innerText
    }
    renderUpdateCustomer(previousData);
}

// for editing screen 

function renderUpdateCustomer(previousData){
    let addCoustomerDiv=document.createElement("div")
    addCoustomerDiv.className="addCustomerDiv"
    addCoustomerDiv.innerHTML=`<h1>Add Customer</h1>
   <p>${previousData.uuid}</p>
    <div class="inputDiv">
        <input required id="fname" type="text" value=${previousData.first_name} placeholder=${previousData.first_name}>
        <input required id="lname" type="text" value=${previousData.last_name} placeholder=${previousData.last_name}>
    </div>
    <div class="inputDiv">
        <input id="streetV" type="text" value=${previousData.street} placeholder=${previousData.street}>
        <input id="addressV" type="text" value=${previousData.address} placeholder=${previousData.address}>
    </div > 
    <div class="inputDiv">
        <input id="cityV" type="text" value=${previousData.city} placeholder=${previousData.city}>
        <input id="stateV" type="text" value=${previousData.state} placeholder=${previousData.state}>
    </div> 
    <div class="inputDiv">
        <input id="emailV" type="text" value=${previousData.email} placeholder=${previousData.email}>
        <input id="phoneV" type="text" value=${previousData.phone} placeholder=${previousData.phone}>
    </div>
    <button onclick="updateCustomer()">Sumbit</button>`
    document.getElementById("dash-board-div").remove();
    document.body.append(addCoustomerDiv);
}

// update customer function

function updateCustomer(){
    let uuid=document.getElementsByClassName("addCustomerDiv")[0].children[1].innerText
    let temp={
        first_name: document.getElementById("fname").value,
        last_name: document.getElementById("lname").value,
        street: document.getElementById("streetV").value,
        address: document.getElementById("addressV").value,
        city: document.getElementById("cityV").value,
        state: document.getElementById("stateV").value,
        email: document.getElementById("emailV").value,
        phone: document.getElementById("phoneV").value
      }
      if(temp.first_name==""||temp.last_name==""){
        return;
      }
      fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`,{method:"POST",headers:{"Authorization":`Bearer ${tokken}`},body:JSON.stringify(temp)}).then((res)=>{
    console.log(res);
    document.getElementsByClassName("addCustomerDiv")[0].remove()
    renderDashboard()
}).catch((err)=>console.log(err))
}