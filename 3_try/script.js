/**
 * Created by netwo on 28/02/2017.
 */


/*let hub = new Hub("q.php");
hub.onsuccess = ( result ) =>{
    console.log( result );
};
hub.connect();*/

/*let p = new Page("q.php","q");
document.body.appendChild(p.el);*/

let r = new Router();
r.addPage("q.php","q");
r.addPage("q2.php","q2");