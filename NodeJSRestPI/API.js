var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 3000;
var router = express.Router();
const exec = require('child_process').exec;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

app.use('/api/employee', router);
app.listen(port);

var employees= [
    {
        Id: 1,
        FirstName: "Jalpesh",
        LastName: "Vadgama",
        Designation: "Technical Architect"
    }
];

// Get all employees
router.get("/",function (req,res){
    res.json(employees);
});

//get specific employee based on Id
router.get("/:Id",function(req,res){
    var employeeId = parseInt(req.params.Id);
    var currentEmployee = employees.filter(e=>e.Id==employeeId)[0];

    if(currentEmployee){
        res.json(currentEmployee);
    }else{
        res.sendStatus(404);
    }
});

var cmdArrays = [{cmdKeys:["create", "project"], htmlFile:"create"},
{cmdKeys:["page"], htmlFile:"addNewPage.html"},
{cmdKeys:["user", "name", "username"], htmlFile:"addUserName.html"},
{cmdKeys:["password"], htmlFile:"addPassword.html"},
{cmdKeys:["login"], htmlFile:"addLogin.html"},
{cmdKeys:["reset"], htmlFile:"addReset.html"},
{cmdKeys:["email"], htmlFile:"changeEmail.html"},
{cmdKeys:["middle"], htmlFile:"moveToMiddle.html"},
{cmdKeys:["revert"], htmlFile:"changeEmail.html"},
{cmdKeys:["1", "one"], htmlFile:"changeThemeOne.html"},
{cmdKeys:["2", "two"], htmlFile:"changeThemeTwo.html"},
{cmdKeys:["3", "three"], htmlFile:"changeThemeThree.html"},
{cmdKeys:["4", "four"], htmlFile:"changeThemeFour.html"},
{cmdKeys:["commit"], htmlFile:"commitChanges.html"}
];

var htmlFile = "";
/// Add employee
router.post("/", function (req,res) {
    var command = req.body.cmd;
    console.log(command);
    //var isValid =isValidEmployee(employee);
    if(true){
        
        for(var j=0; j<cmdArrays.length; j++){
            cmdKeyArray = cmdArrays[j].cmdKeys;
            htmlFile = "";
            for(var i=0; i<cmdKeyArray.length; i++){
                if(!command.includes(cmdKeyArray[i])){
                    //i=cmdKeyArray.length;
                    htmlFile ? htmlFile : htmlFile = "";
                }else{
                    htmlFile = cmdArrays[j].htmlFile;
                }
            }
            if(htmlFile!==""){
                j=cmdArrays.length;
                var yourscript = exec('sh ./scripts/updateHtml.sh' + " " + htmlFile,
                (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            }
        }
 
        if(htmlFile===""){
            command = "command not found";
        }

        res.send(command);
    } else{
        res.sendStatus(500);
    }
});

//Update employee
router.put("/:Id",function (req,res) {  
    var employeeId = parseInt(req.params.Id);
    var currentEmployee = employees.filter(e=>e.Id==employeeId)[0];
    if(currentEmployee){
        let employee = req.body;
        var isValid = isValidEmployee(employee);
        if(isValid){
            currentEmployee.FirstName = employee.FirstName;
            currentEmployee.LastName = employee.FirstName;
            currentEmployee.Designation = employee.Designation;
            res.sendStatus(204);
        }else{
            res.sendStatus(500);
        }
    }else{
        res.sendStatus(404);
    }
});

//delete employee
router.delete("/:Id", function(req,res){
    var employeeId = parseInt(req.params.Id);
    var currentEmployee = employees.filter(e=>e.Id==employeeId)[0];
    if(currentEmployee){
        employees = employees.filter(e=>e.Id!=employeeId);
        res.sendStatus(204);
    }else{
        res.sendStatus(404);
    }
});

//validation for employee
function isValidEmployee(employee){
    if(!employee.Id){
        return false;
    }
    if(!employee.FirstName){
        return false;
    }
    if(!employee.LastName){
        return false;
    }
    if(!employee.Designation){
        return false;
    }
    return true;
}