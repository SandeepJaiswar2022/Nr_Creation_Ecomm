
# 🏫 Nr Creation Full Stack Website



# 1️⃣ User CRUD :

##  Entities Dependent:

- User or AppUser.
- Customer


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
