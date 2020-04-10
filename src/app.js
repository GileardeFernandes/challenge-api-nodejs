const express = require("express");
const cors = require("cors");

 const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

//middlewares
function repositoryValidation(request, response, next){

      const {title, url, techs} = request.body;
      if (title == '' || url == '' || techs == ''){
         return response.status(400).json({error: 'Incomplete data for creating the repository.'})
      }

     return next();
}

 function uuidValidation(request, response, next){
       
      const id = request.params.id;
      const validation =  isUuid(id)
      if(!validation){
         return response.status(400).json({error: 'Invalid id'});
      }
      if (!repositories.find(obj => obj.id == id)){
        return response.status(400).json({error: 'This id does not exists.'});
      }
    return next();
}


const repositories = [];

app.get("/repositories", (request, response) => {
    response.json(repositories);
});

app.post("/repositories", repositoryValidation,  (request, response) => {
     
     const {title, url, techs } = request.body;
     const newId =  uuid();
     const repository = {id: newId, title, url,  techs, likes:0 }

     repositories.push(repository);
     response.json(repository);
});

app.put("/repositories/:id", uuidValidation, repositoryValidation,  (request, response) => {
      
  const {title, url, techs } = request.body;
  
  const repositoryIndex =  repositories.findIndex(obj => obj.id == request.params.id);
  if (repositoryIndex > -1){
    repositories[repositoryIndex].title = title;
    repositories[repositoryIndex].url = url;
    repositories[repositoryIndex].techs = techs;
  }
  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id",uuidValidation, (request, response) => {
     
  const repositoryIndex = repositories.findIndex(obj => obj.id == request.params.id);
  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", uuidValidation,(request, response) => {
  const repositoryIndex = repositories.findIndex(obj => obj.id == request.params.id);
  repositories[repositoryIndex].likes += 1;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
