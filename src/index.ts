import { initServer } from "./app";
import { prismaClient } from "./clients/db";

async function init() {
  
    const app = await initServer(); 
    app.listen(8000, () => console.log(`Server is running on port 8000`));
}

init();