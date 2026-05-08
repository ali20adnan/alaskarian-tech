import { listProducts } from "./database/products.repository";
import { listRequests } from "./database/requests.repository";

console.log("Products count:", listProducts().length);
console.log("Requests count:", listRequests().length);
