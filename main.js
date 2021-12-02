// checks whether string has specified characters in it or not 
// we will use this function in sumbit and save buttons on click
function check_input(name) {
    var regex = /^[a-z A-Z]+$/;
    return regex.test(name);
}
// submit button for submiting form data and sending request to api
// we will extract gender and probability  
document.getElementById('submit').onclick = function(e) {
    var form = document.getElementById('form');
    var gender_status = document.querySelector('#gender-status');
    var gender_percentage = document.querySelector('#gender-percentage');
    var saved_gender = document.querySelector('#saved-gender');
    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    saved_gender.innerText = localStorage.getItem(items['name']);
    if (check_input(items['name'])) {
        var xmlHttp;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var respData = JSON.parse(xmlHttp.responseText) || {};
                if (respData['gender']) {
                    gender_status.innerText = respData['gender'];
                    gender_percentage.innerText = respData['probability'];
                } else {
                    print_alert("There is no guess for " + respData['name'])
                }
            }
        };
        xmlHttp.open(
            'GET',
            'https://api.genderize.io/?name=' +
            items['name'].split(' ').join('%20'),
            true
        );

        xmlHttp.send(null);
    } else {
        print_alert(items['name'] + ' is not a valid name!');
    }

    e.preventDefault();
};
/*
saving a record to the localstorage when a user selects any option between radio buttons it has preference over subsequent options
or when a user send a request and receive response and then press the save button without choosing any radio button option,
the response is saved in local storage otherwise an alert message is printed
*/
document.getElementById('save').onclick = function(e) {
    var form = document.getElementById('form');
    var saved_gender = document.querySelector('#saved-gender');
    var gender_status = document.querySelector('#gender-status');
    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    if (check_input(items['name'])) {
        if (items['gender']) {
            localStorage.setItem(items['name'], items['gender']);
            saved_gender.innerText = items['gender'];
        } else {
            var gender_requested = gender_status.innerText;
            saved_gender.innerText = gender_requested;
            localStorage.setItem(items['name'], gender_requested);
            if (gender_requested.length == 0) {
                print_alert(
                    'You did not choose a gender and you did not search any name!'
                );
            }
        }
    } else {
        print_alert(items['name'] + ' is not a valid name!');
    }

    e.preventDefault();
};
// clears a record if it is available otherwise prints an error 
document.getElementById('clear').onclick = function(e) {
    var name = document.getElementById('name').value;
    var saved_gender = document.querySelector('#saved-gender');

    if (name.length != 0) {
        var gender = localStorage.getItem(name);
        if (gender) {
            localStorage.removeItem(name);
            saved_gender.innerText = '';
            print_status('successfully deleted : ' + name);
        } else {
            print_alert(
                "The gender of this name is not saved in the storage!"
            );
        }
    } else {
        print_alert('no name is entered!');
    }
    e.preventDefault();
};
//  prints alerts when name is invalid or api couldn't make any guess about the name
function print_alert(message) {
    var alert_text = document.querySelector('#alert');
    alert_text.innerText = message;
}
// prints status for delete button.
function print_status(message) {
    var status_text = document.querySelector('#status');
    status_text.innerText = message;
}