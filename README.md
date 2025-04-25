# FlashEx

A crypto-to-fiat exchange platform. Users register with a role (user or admin), log in, and are redirected to their respective dashboards. Users can connect wallets, submit buy/sell requests, and view transaction history. Admins manage transactions with accept/decline actions. Features email notifications and a responsive UI.

## Features
- Register with role selection (user or admin).
- Login with role-based redirection to dashboards.
- Navigation bar with role-based links.
- Connect MetaMask for wallet integration.
- Buy/sell crypto with transaction submission.
- User dashboard with transaction history.
- Admin dashboard to accept/decline transactions.
- Email notifications for admins using SendGrid.
- Dark/light theme switcher.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Web3.js, Axios, Framer Motion, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, Nodemailer, JWT, Bcrypt
- **Tools**: Git, MongoDB Atlas, SendGrid

## Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/flashex.git
   cd flashex