class Product {
    constructor (title, description, price, thumbnail, code, stock){
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }   
}


class ProductManager {
    #products;
    #fs;
    #path;
    #productsPath;
    constructor(){  
        this.#products = [];
        this.#path = './products';
        this.#productsPath = this.#path + "/products.json";
        this.#fs = require('fs');
    }

    getProducts = async () => { 
        try {
            //Creamos el directorio
            await this.#fs.promises.mkdir(this.#path, { recursive: true });
            //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
            if(!this.#fs.existsSync(this.#productsPath)) {
            //Se crea el archivo vacio.
            await this.#fs.promises.writeFile(this.#productsPath, "[]");
            }
            let DB = await this.#fs.promises.readFile(this.#productsPath, "utf-8");
            console.info("Archivo JSON obtenido desde archivo: ");
            this.#products = JSON.parse(DB);
            console.log("Usuarios encontrados: ");
            console.log(this.#products);
            return this.#products;
        } catch (error) {
            throw Error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#productsPath}, detalle del error: ${error}`);
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => { 
        let newProduct = new Product (title, description, price, thumbnail, code, stock);
        try {
            //Creamos el directorio
            await this.#fs.promises.mkdir(this.#path, { recursive: true });
            //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
            if(!this.#fs.existsSync(this.#productsPath)) {
                //Se crea el archivo vacio.
                await this.#fs.promises.writeFile(this.#productsPath,  "[]");
            }
                if (title == "" || description == "" || price == "" || thumbnail == "" || code == "" || stock == ""){
                    console.log("Todos los campos deben estar completos")
                } else {
                    if (this.#products.some(product => product.code == code)){
                        console.error("Ya existe el producto");
                    } else {
                        const idAutomatico = ProductManager.idAutomatico()
                        this.#products.push({id: idAutomatico,...newProduct});
                        await this.#fs.promises.writeFile(this.#productsPath, JSON.stringify(this.#products));
                    } 
                }   
        }
        catch (error) {
            throw Error(`Detalle del error: ${error}`);
        }
        
    }

    getProductById = async(id) =>{
        let DB = await this.#fs.promises.readFile(this.#productsPath, "utf-8");
        let aux = JSON.parse(DB)
        try{
            if (aux.some(product => product.id == id)){
                return console.log(aux.find(product => product.id == id))
            }else{
                return console.log("Product Not found");
            }
        }
        catch (error){
            throw Error(`Detalle del error: ${error}`)
        }
    }

    deleteProduct = async(id) => {
        let DB = await this.#fs.promises.readFile(this.#productsPath, "utf-8");
        let aux = JSON.parse(DB)
        if(aux.some(product=> product.id === id)){
            const newArrray = aux.filter(product => product.id != id);
            await this.#fs.promises.writeFile(this.#productsPath, JSON.stringify(newArrray))
            console.log("Producto eliminado exitosamente");           
        }else{
            console.error("No se encontró el producto que desea eliminar")
        }
    }

    updateProduct = async(id, title, description, price, thumbnail, code, stock) => {
        let DB = await this.#fs.promises.readFile(this.#productsPath, "utf-8");
        let aux = JSON.parse(DB)
        let index = aux.findIndex((obj => obj.id == id)) 
            try{ 
                if (aux.some(product => product.id === id)){ 
                    if (title == "" || description == "" || price == "" || thumbnail == "" || code == "" || stock == ""){
                        console.log("Todos los campos deben estar completos")
                    }else{                  
                        aux[index] = {id, title, description, price, thumbnail, code, stock} 
                        await this.#fs.promises.writeFile(this.#productsPath, JSON.stringify(aux))
                        }
                }else{
                    return console.log("Product Not found");
                } 
            }
        catch (error){
            throw Error(`Detalle del error: ${error}`)
        } 
    }
    

    static idAutomatico() {
        if (!this.id) {
          this.id = 1
        }
        else {
          this.id++
        }
        return this.id
      }
}



let productManager = new ProductManager();
let tests = async () => {
await productManager.getProducts();
await productManager.addProduct("iPhone", "Celular", 1200, "sin imagen", "X12", 40) 
await productManager.addProduct("iPhone", "Celular", 1200, "sin imagen", "X13", 40)   
await productManager.addProduct("iPhone", "Celular", 1200, "sin imagen", "X13", 40)
await productManager.getProducts();
await productManager.getProductById(1)
await productManager.getProductById(3) 
await productManager.updateProduct(2, "Samsung", "Celular", 1150, "sin imagen", "Galaxy", 30) 
await productManager.deleteProduct(2)   
await productManager.deleteProduct(2)   
}

tests()
