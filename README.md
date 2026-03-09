# Doctor appointment web aplication


Admin can add doctors, choose database (firebase or json file).

Doctors can create and delete/cancel appointments.

Users can see appointments on week calendar, reserve/cancel appointment, pay for appointment (simulated payment), see list of doctors.

## How to run?

### 1. npm install
### 2. npm run server
### 3. npm run dev

## Description of security rules on the Firebase side:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    

    match /users/{userId} {
      function isAdmin() {
        return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
      }
      allow create: if (request.auth != null 
                    && request.auth.uid == userId 
                    && request.resource.data.role == "user")
                    || isAdmin();
      allow read: if request.auth != null || resource.data.role == "doctor";
      allow update: if (request.auth != null 
                    && request.auth.uid == userId 
                    && request.resource.data.role == resource.data.role)
                    || isAdmin();
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
