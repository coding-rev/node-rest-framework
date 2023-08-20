// Viewsets

class ModelViewSet {
    model = null
    permission_classes = []
    queryset = [] 
    serializer_class = null 

    constructor(router) {
      this.router = router;
    }
  
    generateRoutes() {
      const routes = [
        { method: 'post', path: '/', handler: 'postController' },
        { method: 'get', path: '/', handler: 'getController' },
        { method: 'delete', path: '/:id', handler: 'deleteController' },
        { method: 'put', path: '/:id', handler: 'updateController' }
      ];
      if(this.permission_classes.length){
         //   Permissions
        routes.forEach(route => {
            this.router[route.method](route.path, this.permission_classes[0], this[route.handler]);
        });
      }else{
        //   No Permission
        routes.forEach(route => {
            this.router[route.method](route.path, this[route.handler]);
        });
      } 
    }
  
    postController(req, res) {
        return res.json({'message': 'POST ENDPOINT'})
    }
  
    getController(req, res) {
        return res.json({'message': 'GET ENDPOINT'})
    }
  
    deleteController(req, res) {
        return res.json({'message': 'DELETE ENDPOINT'})
    }
  
    updateController(req, res) {
        return res.json({'message': 'UPDATE ENDPOINT'})
    }
  }

module.exports = {
    ModelViewSet
}
