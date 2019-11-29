import {addDependencies} from "./lib/htmlSetup.js";
import {SieDomConstruction} from "../classes/SieDomConstruction.js"
let indexPageDom = new SieDomConstruction();

addDependencies(
    ["https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
     "lib/highcharts.src.js"]
);

indexPageDom.domConstruction();

