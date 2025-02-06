# Link Protector with Expiration

This project demonstrates a simple approach to protecting links by attaching an expiration date. In other words, a user can create a short-lived URL that automatically becomes invalid after its expiration.

## How It Works

1. **User Inputs a Link**  
   The user types an original link (e.g., `https://example.com`) into the interface.

2. **Protecting/Creating the Link**

   - The user clicks “Protect.”
   - A request is sent to a backend route (`POST /api/protected-links`) that saves the link in a Firestore database, along with an `expiresAt` timestamp.
   - The server responds with a unique `id`.

3. **Verifying the Link**

   - When someone visits the protected link endpoint (e.g., `/protected-links/[id]`), we send a `GET` request to a backend route (`/api/protected-links/[id]`).
   - The backend checks if the link has expired by comparing `expiresAt` to the current time.
   - If the link is **not** expired, the original URL is returned. Otherwise, an error message indicates that the link has expired.

4. **Countdown Redirection**
   - Upon accessing the protected link page (`/protected-links/[id]` in the browser), a countdown displays (3,2,1...).
   - If the link is valid, the user is automatically redirected to the original URL once the countdown reaches zero.

## Project Structure

```
.
├─ app
│  ├─ api
│  │  └─ protected-links
│  │     ├─ route.ts          // POST route to create a protected link
│  │     └─ [id]
│  │        └─ route.ts       // GET route to retrieve the protected link by ID
│  └─ protected-links
│     └─ [id]
│        └─ page.tsx          // Client page that shows the countdown and redirects
├─ firebase.js                 // Firebase config and Firestore initialization
└─ package.json
```

- **`firebase.js`**  
  Initializes the Firebase app and Firestore. It exports the `db` object used to read/write documents.
- **`app/api/protected-links/route.ts`**  
  A **POST** route that takes `originalLink` from the request body, creates a new Firestore document, and includes an expiration date (`expiresAt`).
- **`app/api/protected-links/[id]/route.ts`**  
  A **GET** route that retrieves the document by `id`, checks if it’s expired, and returns the original URL if valid (or an error if expired).
- **`app/protected-links/[id]/page.tsx`**  
  A client component that fetches the link information. If valid, it starts a countdown (3 seconds) before redirecting to the original link. If invalid, it displays an error message.

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/BenjaminH7/linksafe.git
   ```
2. **Install dependencies**:
   ```bash
   cd link-protector
   npm install
   ```
3. **Configure Firebase**:

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore in your project and choose appropriate security rules.
   - Copy your Firebase config (API keys, project ID, etc.) into `firebase.js`.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Access the application at [http://localhost:3000](http://localhost:3000).

## Firestore Security Rules

In development, you can temporarily allow open access for testing:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Not secure for production
    }
  }
}
```

For production, you should implement stricter rules (e.g., require authentication or limit writes to specific fields).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature/new-feature`.
3. Commit changes and push your branch: `git push origin feature/new-feature`.
4. Open a Pull Request.

## License

[MIT License](LICENSE) — free for any use, but no warranty is provided.

---

**Enjoy your protected links!**
