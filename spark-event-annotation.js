if (Meteor.isClient) {
  function logWithColor (msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight: bold;");
  }

  function printAnnotations (fn) {
    var r = new Spark._Renderer;
    var annotatedHtml = Spark._currentRenderer.withValue(r, fn);
    logWithColor("Annotated Html: ", "black");
    console.log(annotatedHtml);
  }

  function printGreetingButtonAnnotations () {
    printAnnotations(Template.greetingButton);
  }

  function renderGreetingButton () {
    Session.set("buttonText", "Click Me!");
    document.body.appendChild(Spark.render(Template.greetingButton));
  }

  function wrapWithLogger (msg, method, obj, color) {
    obj = obj || window;
    color = color || "blue";
    var fn = obj[method];

    obj[method] = function () {
      var strArgs = _.chain(arguments)
        .toArray(arguments)
        .map(function (arg) {
          if (_.isFunction(arg)) {
            var fnName = arg.name || "fn";
            return fnName + "() {...}";
          }
          else if (_.isObject(arg))
            return "{...}";
          else
            return JSON.stringify(arg);
        })
        .value()
        .join(", ");
      logWithColor(msg + "(" + strArgs + ")", color);
      return fn && fn.apply(this, arguments);
    };
    
    // copy over function properties
    _.extend(obj[method], fn);
  }

  function showLogger () {
    wrapWithLogger(
      "Spark.attachEvents",
      "attachEvents",
      Spark,
      "blue"
    );

    wrapWithLogger(
      "Spark.isolate",
      "isolate",
      Spark,
      "darkblue"
    );

    wrapWithLogger(
      "Template.greetingButton.rendered",
      "rendered",
      Template.greetingButton,
      "green"
    );

    wrapWithLogger(
      "UniversalEventListener.prototype.installHandler",
      "installHandler",
      UniversalEventListener.prototype,
      "orange"
    );

    wrapWithLogger(
      "UniversalEventListener.prototype.addType",
      "addType",
      UniversalEventListener.prototype,
      "gray"
    );

    wrapWithLogger(
      "Template.greetingButton",
      "greetingButton",
      Template,
      "black"
    );


    wrapWithLogger("Meteor.startup", "startup", Meteor, "purple");
  }

  Template.greetingButton.helpers({
    buttonText: function () {
      return Session.get("buttonText");
    }
  });

  Template.greetingButton.events({
    "click button": function (e, tmpl) {
      logWithColor("click button event " + e, "blue");
    }
  });

  showLogger();
  Meteor.startup(renderGreetingButton);
}
