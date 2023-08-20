// ModelSerializer

class ModelSerializer{
    // @ Serializer DEFINITION in SERIALIZERS
    model = null
    fields = null // '__all__' or []

    data = {}
    many = false

    is_valid_check = false
    res = null

    // @ Serializer USAGE in VIEWS::: RESPONSE || REQUEST
    constructor(data={}, many=false){
        this.data = data
        this.many = many
    }

    getAllAttributesOfClassAndCompareToData(allFields=false) {
        const modelAttributes = {};
        let modelSchemaObj = this.model().schema.obj
        // fields = "__all__"
        if(allFields){
            for (const key in modelSchemaObj) {

                if(key in this.data && modelSchemaObj.hasOwnProperty(key)){
                    let modelKeydataType = typeof modelSchemaObj[key]
                    if(Array.isArray(modelSchemaObj[key])){
                        modelKeydataType = "array"
                    }
                    else if(typeof modelSchemaObj[key].type === 'function' && modelSchemaObj[key].type === Boolean){
                        modelKeydataType = "boolean"
                    }
                    else if(typeof modelSchemaObj[key].type === 'function' && modelSchemaObj[key].type === String){
                        modelKeydataType = "string"
                    }
                    else if(modelKeydataType === "object"){
                        modelKeydataType = "string"
                    }


                    let dataKeydataType = typeof this.data[key]
                    if(Array.isArray(this.data[key])){
                        dataKeydataType = "array"
                    }
                    // Type Checkers
                    if(dataKeydataType === "object"){
                        return `'${dataKeydataType}' is an object, expected other valid types`
                    }
                    else if(dataKeydataType != modelKeydataType){
                        return `'${dataKeydataType}' not valid, expected '${modelKeydataType}'`;
                    }
                    
                    // adding attrs
                    modelAttributes[key] = {
                        value: modelSchemaObj[key],
                        dataType: modelKeydataType
                    };
                }else{
                    return `'${key}' not found`;
                }

            }
        }
        // fields = []
        else{
            
            this.fields.forEach((key)=>{
                
                if(key in this.data && modelSchemaObj.hasOwnProperty(key)){
                        
                        let modelKeydataType = typeof modelSchemaObj[key]
                        if(Array.isArray(modelSchemaObj[key])){
                            modelKeydataType = "array"
                        }
                        else if(typeof modelSchemaObj[key].type === 'function' && modelSchemaObj[key].type === Boolean){
                            modelKeydataType = "boolean"
                        }
                        else if(typeof modelSchemaObj[key].type === 'function' && modelSchemaObj[key].type === String){
                            modelKeydataType = "string"
                        }
                        else if(modelKeydataType === "object"){
                            modelKeydataType = "string"
                        }
                        

                        let dataKeydataType = typeof this.data[key]
                        if(Array.isArray(this.data[key])){
                            dataKeydataType = "array"
                        }
                        
                        // Type Checkers
                        if(dataKeydataType === "object"){
                            return `'${dataKeydataType}' is an object, expected other valid types`
                        }
                        else if(dataKeydataType != modelKeydataType){
                            return `'${dataKeydataType}' not valid, expected '${modelKeydataType}'`;
                        }
                        
                        // Add attrs
                        modelAttributes[key] = {
                            value: modelSchemaObj[key],
                            dataType: modelKeydataType
                        };
                }else{
                    return `'${key}' not found`;
                }
                
            })
        }
        
        // Validating length
        if (Object.keys(modelAttributes).length != Object.keys(this.data).length){
            return `Expected ${Object.keys(modelAttributes).length} fields but got ${Object.keys(this.data).length}`;
        }
        return true;
    }

    // @ Serializer USAGE in VIEWS ::: REQUESTS
    is_valid(routeRes){
        this.res = routeRes
        
        // All fields
        if(this.fields === "__all__"){
            let res = this.getAllAttributesOfClassAndCompareToData(true);
            if(res === true){
                return true
            }else{
                routeRes.json({"serializer_error": res})
            }
        }
        // Field in a list
        else if(Array.isArray(this.fields)){
            let res = this.getAllAttributesOfClassAndCompareToData();
            if(res === true){
                return true
            }else{
                routeRes.json({"serializer_error": res})
            }
        }
        return routeRes.json({"serializer_error": "Invalid request data"})
    }

    // @ Serializer USAGE in VIEWS ::: RESPONSE
    serialized_data(){
        if(this.many === true){
            // All fields
            if(this.fields === "__all__" && Array.isArray(this.data)){
                let queryset = this.data
                return queryset
            }
            // Field in a list
            else if(Array.isArray(this.fields) && Array.isArray(this.data)){
                let queryset = []
                this.data.forEach((obj)=>{
                    let new_obj = {}
                    this.fields.forEach((field)=>{
                        new_obj[field] = obj[field]
                    })
                    queryset.push(new_obj)
                })
                return queryset
            }
        }else{
            if(this.fields === "__all__" && !Array.isArray(this.data)){
                return this.data
            }else if(Array.isArray(this.fields) && !Array.isArray(this.data)){
                let new_obj = {}
                this.fields.forEach((field)=>{
                    new_obj[field] = this.data[field]
                })
                return new_obj
            }
        }
        return "Serializer error"
    }

    // @ Serializer USAGE in VIEW ::: REQUESTS
    async save(){
        if(this.res !== null){
            try{
                let new_instance = new this.model(this.data)
                let instance =  await new_instance.save()
                return instance
            }catch(e){
                this.res.json({"error": e.message})
            }
        }
        throw ErrorEvent
    }
}

module.exports = {
    ModelSerializer
}
