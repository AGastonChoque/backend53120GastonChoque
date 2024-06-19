# Pre-Entrega 1 Backend Gaston Choque

## _Comision 53120_

## Caracteristicas y uso

- Inicio

```
"./"
```

Se mostrara un mensaje de bienvenida.

- Products (GET) VER PRODUCTOS

```
"/api/products"
```

Se listaran todos los productos previamente creados.

```
"/api/products?limit=5"
```

Se listaran todos los productos previamente creados pero se limitaran los datos obtenidos a partir del limit.

- Products (POST) CREAR PRODUCTO

```
"/api/products"
```

Se utilizara el metodo POST para incorporar un nuevo producto mediante Postman con formato (RAW), para ello verificara que el nuevo producto no tenga el mismo CODE de otro producto cargado previamente, sino lanzara error, el mismo se creara con un ID autoincrementable el cual no se debera repetir y verificara que todos los campos obligatorios posean su propiedad y valor, en caso contrario lanzara error.
Formato:

```
{
   "title": "Coca Cola", (Obligatorio)
   "description": "Coca Cola de 100Ml para disfrutar", (Obligatorio)
   "price": 1000, (Obligatorio)
   "thumbnail": "", (Opcional, en caso de no crearlo se definira como un array por default)
   "code": "coc", (Obligatorio)
   "stock": 10, (Obligatorio)
   "category": "bebidas" (Obligatorio)
   "status": true (Opcional, en caso de no crearlo se definira como true por defoult)
}
```

- Products/:pId (GET) OBTENER UNICO PRODUCTO

```
"/api/products/:pId"
```

Mediante esta ruta tendremos acceso a un producto especifico el cual sera consultado mediante su ID.

- Products (PUT) MODIFICAR PRODUCTO

```
"/api/products/"
```

Se utilizara el metodo PUT para editar un producto previamente creado, enviaremos un ID y un PRODUCTO en formato objeto mediante Postman con formato (RAW), esto verificara si el producto existe, en caso contrario devolvera error, luego verificara el si la nueva edicion del producto proporciona un ID, si este contiene un ID distinto, es decir se intenta modificar el ID, lanzara un error, si no contiene un ID o es el mismo ID que se intenta modificar se procedera a la siguiente verificacion que es verificar si el CODE que se esta intentando actualizar ya existe, si existe arrojara un error, caso contrario y con todas las verificaciones pasadas se procedera a actualizar el producto. (Ningun campo del nuevo producto es obligatorio, propiedades en las cuales sus valores no posean cambios quedaran con las anteriormente asignadas)
Formato:

```
{
   "id": 2,
   "newProduct": {
	    "title": "Coca", (Opcional)
	    "description": "Coca Cola de 500Ml para disfrutar", (Opcional)
	    "price": 1500, (Opcional)
	    "thumbnail": [], (Opcional)
	    "code": "123", (Opcional)
	    "stock": 50, (Opcional)
	    "status": true, (Opcional)
       "category": "gaseosas", (Opcional)
       "id": 2 (Opcional)
	}
}
```

- Products (DELETE) ELIMINAR PRODUCTO

```
"/api/products/"
```

Se utilizara el metodo DELETE para eliminar un producto previamente creado, enviaremos un ID mediante Postman con formato (RAW), esto verificara si el producto existe, si este existe lo eliminara, en caso contrario devolvera error.
Formato:

```
{
    "id": 4
}
```

- Carrito (GET) VER CARRITOS

```
"/api/carts/"
```

Esta ruta devolvera todos los carritos que hayan sido creados.

- Carrito (POST) CREAR CARRITO

```
"/api/carts/"
```

Esta ruta creara un nuevo carrito con el formato correspondiente, este recibira un ID, el cual se ira autoincrementando automaticamente.

```
{
    id: this.currentId,
    products: []
}
```

- Carrito/:cId/products/:pId (POST) AGREGA EL PRODUCTO SELECCIONADO AL CARRITO SELECCIONADO

```
"/api/carts/:cId/products/:pId"
```

Mediante Postman enviaremos el ID del carrito que queremos modificar y tambien el ID del producto que queremos agregar a ese carrito, en caso de que el carrito no exista devolvera error, en caso de que el producto no exista devolvera error, el producto agregado se incluira en el array PRODUCTS del carrito, el mismo tendra el ID del producto agregado y la cantidad agregada que por defecto sera 1, en caso de que el producto ya se encuentre en el carrito la cantidad ira aumentando de 1 en 1.

```
api/carts/1/products/2
```

Como vemos en este caso se selecciono el carrito 1 y se añadio o producto con el ID 2.

```
{
	"id": 1,
	"products":
    [
		{
			"productId": 2,
			"quantity": 1
		}
	]
}
```

- Carrito/:cId/products/:pId (DELETE) ELIMINA EL PRODUCTO SELECCIONADO DEL CARRITO SELECCIONADO

```
"/api/carts/:cId/products/:pId"
```

Mediante Postman enviaremos el ID del producto que queremos eliminar y tambien el ID del carrito del cual lo queremos eliminar, en caso de que el carrito no exista devolvera error, en caso de que el producto no exista en ese carrito devolvera error, en caso de que el producto y el carrito existan se eliminara ese producto del carrito.

```
api/carts/1/products/2
```

Como vemos en este caso se selecciono el carrito 1 y se elimino el producto con ID 2.

```
{
	"id": 1,
	"products": []
}
```

## Instalacion

(Se requiere node, nodemon y postman)

- 1 Clonar el proyecto

```
git clone https://github.com/AGastonChoque/GastonChoqueBackend53120
```

- 2 Posicionarse en la carpeta del proyecto
```
cd .\desafio4PreEntrega1\  
```

- 3 Instalar las depencias mediante el npm

```
npm install
```

- 5 Iniciar el servidor

```
npm start
```