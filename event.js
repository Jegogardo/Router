// Create the event.
var event = document.createEvent('Event');

// Define that the event name is 'build'.
event.initEvent('ciao', true, true);

// Listen for the event.
var elem = document.querySelector("#event")
document.addEventListener('ciao', function (e) {
  // e.target matches elem
    console.log(1)
}, false);



// target can be any Element or other EventTarget.
function prova(){

document.dispatchEvent(event);
}

document.addEventListener('ciao', function (e) {
  // e.target matches elem
    console.log(2)
}, false);

/*let Person = (function () {
  let privateProps = new WeakMap();

  class Person {
    constructor(name) {
      this.name = name; // this is public
      privateProps.set(this, {age: 20}); // this is private
    }
    greet() {
      // Here we can access both name and age
      console.log(`name: ${this.name}, age: ${privateProps.get(this).age}`);
    }
  }

  return Person;
})();

let joe = new Person('Joe');
joe.greet();*/
