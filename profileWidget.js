var orderKey = function(obj, keyOrder) {
    var newObject = {};
    keyOrder.forEach(function(key) {
      newObject[key] = obj[key];
      delete obj[key];
    });
    var keys = Object.keys(obj);
    keys.forEach(function(key) {
      newObject[key] = obj[key];
    });
    return newObject;
  };
  
  var removeKeys = function(obj, hiddenclaims) {
    if (hiddenclaims) {
      hiddenclaims.forEach(function(key) {
        delete obj["key"];
      });
    }
  };
  
  var humanDisplayable = function(str) {
    return str
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace(/_/g, " ")
      .toLowerCase();
  };
  
  class ProfileForm {
    constructor(initObject) {
      this.oktaUrl = initObject["oktaurl"];
      this.endpoint = "/api/v1/users/me";
      this.labelclass = initObject["labelclass"];
      this.inputclass = initObject["inputclass"];
      this.formclass = initObject["formclass"];
      this.fieldclass = initObject["fieldclass"];
      this.buttonclass = initObject["buttonclass"];
      this.width = initObject["width"];
      this.height = initObject["height"];
      this.inputOrder = initObject["inputOrder"];
      this.hiddenAttributes = initObject["omittedClaims"];
      this.useMaterializeTheme = initObject["useDefaultTheme"];
      this.backgroundColor = initObject["backgroundColor"];
      this.scrollable = initObject["scrollable"];
      this.callback = initObject["callback"];
      (this.profileImage = initObject["profileImage"]),
        (this.profileImageCustomKey = initObject["profileImageCustomKey"]);
    }
    getUserData() {
      var formObject = this;
      $.ajax({
        type: "GET",
        url: formObject.oktaUrl + "/api/v1/users/me",
        data: {},
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true
      }).done(function(response) {
        return response;
      });
    }
  
    render(selector) {
      var formObject = this;
      $(document).ready(function() {
        var container = $(selector);
        var formBox = $("<div id='widgetFormContainer' class='card'></div>");
        var form = $("<form id='widgetForm'></form>");
        var profileImgContainer = $(
          "<div id='widgetFormProfileImageContainer'></div>"
        );
        var profileImg = $(
          '<img id="widgetFormProfileImage" src="" alt="Avatar">'
        );
        $.ajax({
          type: "GET",
          url: formObject.oktaUrl + "/api/v1/users/me",
          data: {},
          dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true
        }).done(function(response) {
          console.log(response.profile);
          removeKeys(response.profile, )
          var profile = orderKey(response.profile, formObject["inputOrder"]);
          var button = $(
            '<button class="btn waves-effect waves-light" type="submit">Submit</button>'
          );
          button.addClass(formObject.buttonclass);
          for (let [key, value] of Object.entries(profile)) {
            if (typeof value == "string") {
              var input = $('<input type="text"/>');
              var label = $('<label class="flow-text" for="fname"></label><br/>');
              var field = $("<div></div>");
              input.val(value);
              input.attr("name", key);
              input.attr("id", "profilewidget-" + key);
              label.attr("id", "profilewidget-label-" + key);
              field.attr("id", "profilewidget-field-" + key);
              input.addClass(formObject.inputclass);
              label.addClass(formObject.labelclass);
              field.addClass(formObject.fieldclass);
              form.append(field);
              label.append(humanDisplayable(key));
              field.append(label);
              field.append(input);
              if(key == "profileUrl") {
                profileImg.attr("src", value)
              }
            }
          }
          if (formObject) {
          }
          form.addClass(formObject.formclass);
          form.append(button);
          container.append(formBox);
          formBox.append(form);
        });
        form.on("submit", function(e) {
          e.preventDefault();
          var formdata = form.serializeArray();
          console.log(formdata);
          var data = {};
          $(formdata).each(function(index, obj) {
            if (obj.value && obj.value != "") {
              data[obj.name] = obj.value;
            }
          });
          console.log(data);
          var profile = {};
          profile["profile"] = data;
          console.log(profile);
          var myJSON = JSON.stringify(profile);
          $.ajax({
            type: "POST",
            url: formObject.oktaUrl + "/api/v1/users/me",
            data: myJSON,
            dataType: "json",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true
          }).done(function(response) {
            console.log(response);
            if (formObject["callback"]) {
              var callback = formObject["callback"];
              callback(response);
            }
          });
        });
        formBox.width(formObject.width);
        formBox.height(formObject.height);
        if (formObject["useMaterializeTheme"]) {
          var headID = document.getElementsByTagName("head")[0];
          $(headID).append(
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">'
          );
          $(headID).append(
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>'
          );
          formBox.css("padding-top", "5%");
          formBox.css("padding-bottom", "5%");
          formBox.css("padding-right", "10%");
          formBox.css("padding-left", "10%");
          formBox.css("background-color", formObject["backgroundColor"]);
        }
        if (formObject["scrollable"]) {
          formBox.css("overflow-y", "scroll");
        }
        profileImgContainer.append(profileImg);
        profileImgContainer.attr(
          "style",
          "width: 200px; height: 200px; border-radius: 50%; position: relative; overflow: hidden; margin-bottom: 10%"
        );
        profileImg.attr(
          "style",
          "min-width: 100%; min-height: 100%; width: auto; height: auto; position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);"
        );
        formBox.prepend(profileImgContainer);
        return form;
      });
    }
  }
  
  // mycar = new Car("Ford");
  // document.getElementById("demo").innerHTML = mycar.present("Hello");
  