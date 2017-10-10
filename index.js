'use strict';

const electron = require('electron');
const { ipcRenderer } = electron;
const fs = require('fs');

// let eleButton = document.getElementById("buton");
// eleButton.addEventListener("click", () => {
//     console.log("Clicked"); 
// })

let objKeys = JSON.parse(fs.readFileSync(`${process.resourcesPath}/keys.json`, 'utf8'));
var input = document.querySelector('.screen');


ipcRenderer.on("clear", () => {
    console.log("Clicked clear");
    let input = document.querySelector('.screen');
    input.innerHTML = '';
    decimalAdded = false;   
});

document.onkeydown = function (event) {
    if (event.keyCode >= 96 && event.keyCode < 106) {
        console.log(event.keyCode - 96);
        input.innerHTML += event.keyCode - 96;
    }
    else {
        let arrKeys = Object.keys(objKeys);
        if(arrKeys.indexOf(event.keyCode.toString()) != -1)
        {
           console.log(objKeys[event.keyCode]);
           input.innerHTML += objKeys[event.keyCode];
        }
	}
}

// Get all the keys from document
var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', '*', '/'];
var decimalAdded = false;

// Add onclick event to all the keys and perform operations
for (var i = 0; i < keys.length; i++) {
    keys[i].onclick = function (e) {
        // Get the input and button values
        var inputVal = input.innerHTML;
        var btnVal = this.innerHTML;

        // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
        // If clear key is pressed, erase everything
        if (btnVal == 'C') {
            input.innerHTML = '';
            decimalAdded = false;
        }

        // If eval key is pressed, calculate and display the result
        else if (btnVal == '=') {
            var equation = inputVal;
            var lastChar = equation[equation.length - 1];

            // Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
            equation = equation.replace(/x/g, '*').replace(/÷/g, '/');

            // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
            if (operators.indexOf(lastChar) > -1 || lastChar == '.')
                equation = equation.replace(/.$/, '');

            if (equation)
                input.innerHTML = eval(equation);

            decimalAdded = false;
        }
        else if (operators.indexOf(btnVal) > -1) {
            // Operator is clicked
            // Get the last character from the equation
            var lastChar = inputVal[inputVal.length - 1];

            // Only add operator if input is not empty and there is no operator at the last
            if (inputVal != '' && operators.indexOf(lastChar) == -1)
                input.innerHTML += btnVal;

            // Allow minus if the string is empty
            else if (inputVal == '' && btnVal == '-')
                input.innerHTML += btnVal;

            // Replace the last operator (if exists) with the newly pressed operator
            if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
                // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
                input.innerHTML = inputVal.replace(/.$/, btnVal);
            }

            decimalAdded = false;
        }

        // Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
        else if (btnVal == '.') {
            if (!decimalAdded) {
                input.innerHTML += btnVal;
                decimalAdded = true;
            }
        }

        // if any other key is pressed, just append it
        else {
            input.innerHTML += btnVal;
        }

        // prevent page jumps
        e.preventDefault();
    }
}

