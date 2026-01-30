## Jak uruchomić?

### 1. npm install
### 2. npm run server (obsługa lokalnego pliku json)
### 3. npm run dev

## opis reguł zabezpieczających po stronie Firebase:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    

    match /users/{userId} {
      allow create: if request.auth != null 
                    && request.auth.uid == userId 
                    && request.resource.data.role == "user";
      allow read: if request.auth != null;
      allow update: if request.auth != null 
                    && request.auth.uid == userId 
                    && request.resource.data.role == resource.data.role;
    }

    match /appointments/{appointmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /canceled_appointments/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    match /doc_availability/{availabilityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```