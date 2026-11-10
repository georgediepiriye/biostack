# BioStack

BioStack is a creator bio hub that groups Selar products, stores, and affiliate offers into targeted niches.

## Run locally

1. Copy `.env.example` to `.env` and set a real `JWT_SECRET` and MongoDB connection string.
2. Install the root dependencies with `npm install`.
3. Install the Next.js dependencies with `npm --prefix client install`.
4. Run `npm run dev`.

To enable Google sign-in, create a Google OAuth web client ID with `http://localhost:3000` as an authorized JavaScript origin. Set that same client ID as both `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in the root `.env`, then restart both servers. Email and password sign-in work without Google OAuth setup.

Product cover uploads use authenticated, signed Cloudinary uploads. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the root `.env`, then restart the API and client. The API secret stays server-side; the upload signature endpoint requires a BioStack login.

The client runs at `http://localhost:3000` and the API at `http://localhost:4000`.

## Deploy as one web service

The production start command serves the Next.js client and Express API from one Node.js service and one public URL. Configure the host to install both dependency sets, run `npm run build`, and start with `npm start` (for Render, the build command can be `npm install && npm --prefix client install && npm run build`). Set `NEXT_PUBLIC_API_URL=/api` so browser requests use the same domain. Set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, `CLIENT_ORIGIN` to the deployed site origin, and the Cloudinary variables in the service environment. Set both Google client ID variables if Google sign-in is enabled. The host supplies `PORT`.

`npm run dev` still starts the frontend and API separately for local development. `npm run start:api` remains available when running only the API.

## API surface

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Niches | `GET`, `POST /api/niches`; `PATCH`, `DELETE /api/niches/:id` |
| Offers | `GET`, `POST /api/links`; `PATCH`, `DELETE /api/links/:id` |
| Profiles | `GET /api/profiles/:username`, `GET/PATCH /api/profiles/me/profile` |

Protected endpoints expect `Authorization: Bearer <JWT>`. All responses use `{ success, data?, error? }`.
