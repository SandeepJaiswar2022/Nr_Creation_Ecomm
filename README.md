
# 🏫 Nr Creation Full Stack Website



# 1️⃣ User CRUD :


## Approach:

- Register => on registration create user and with the same details create Customer.(If user already exists then conflict, and Field Validation),
- Login => on login (credentials verification)

         if(success)
           {
               return JWT(JSON web token)
               then => fetch the userProfile using JWT
               Frontend Logic (What to do if role is Admin or Customer)
           }        
         else
          {
               return not varified validation Message.
          }


## Achieved 

- Register or Login =>  to get JWT
- fetch the UserProfile using this JWT by passing it as an AuthHeader

- UserProfile Result => 
```json
     {
       "message": "User Fetched!",
       "data": 
        {
          "userId": 1,
          "firstName": "Niraj",
          "lastName": "Gupta",
          "email": "nirajgupta@gmail.com",
          "phone": "9839119626",
          "dateOfBirth": null,
          "addresses": [], //no address yet
          "cart": null, //nothing in cart
          "orders": [],//no orders yet
          "reviews": [],//no reviews yet
          "paymentHistory": [], //not made payment yet
          "role": "USER" 
        }
     }
```

# 2️⃣ Product CRUD :

## Approach:

- Admin : CREATE, UPDATE, DELETE, READ,
- USER  : Only READ
- without any user login we have to show the products
- `Any One Can read all product` (getAllProduct and getProductById endpoints are not pre-authorized) 


## Achieved

### Category
- Category CRUD :  `ADMIN Only`
- `Category Delete` : All the product Associated with the particualr category will be deleted because of `CASCADE`

### Product
- `Read AllProduct or productByID ` : Public Endpoints in PublicController (will be fetched without authentication)
- Create, Update, Delete operations on Products : `ADMIN Only`