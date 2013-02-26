if (Meteor.isClient) {
  function logWithColor (msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight: bold;");
  }

  function printAnnotations (fn) {
    var r = new Spark._Renderer;
    var annotatedHtml = Spark._currentRenderer.withValue(r, fn);
    logWithColor("Annotated Html: ", "red");
    logWithColor(annotatedHtml, "green");
  }

  function htmlFunc () {
    return "<button>Click Me!</button>";
  }

  function template () {
    return Spark.attachEvents({
      "click button": function (e, tmpl) {
        logWithColor("click event: " + e, "blue");
      }
    }, htmlFunc());
  }

  function appendTemplateToBody () {
    document.body.appendChild(Spark.render(template));
  }

  function printTemplateAnnotations () {
    printAnnotations(template);
  }

  Meteor.startup(printTemplateAnnotations);
}
