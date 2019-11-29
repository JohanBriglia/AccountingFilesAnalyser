
let req = new XMLHttpRequest();

export function submitCRUD(CRUDType, data, id = "") {                           
    req.open(CRUDType, "http://localhost:8081/api/sie/"+id, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
};

export function addHTMLElement(type, parent, options = {}) {
    let htmlElement = document.createElement(type);
    for (var key in options) {
        htmlElement[key] = options[key];
    };
    parent.appendChild(htmlElement);
    return htmlElement;
};

export function addDependencies(someDependencies) {
    someDependencies.map(each => (
		addHTMLElement("script", document.body,
		    {type:"text/javascript", src:each}
		)
    ));
};


