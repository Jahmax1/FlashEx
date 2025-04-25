# FlashEx

A futuristic crypto-to-fiat exchange platform with a stunning UI. Users register with a role (user or admin), log in, and access role-specific dashboards. Features real-time crypto prices, wallet integration, transaction management, email notifications, and a responsive design with a cyan/neon-green palette.

## Features
- **Futuristic UI**: Glassmorphism, cyan gradients, neon accents, and smooth animations.
- **Auth System**: Toggleable login/register with glowing inputs and role selection.
- **Real-Time Prices**: Live BTC/ETH prices with neon green/red changes (CoinGecko API).
- **Role-Based Access**: Users access Buy/Sell and Dashboard; admins manage transactions.
- **Navigation**: Minimal header on landing; in-page navigation elsewhere.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Wallet Integration**: Connect MetaMask for transactions.
- **Email Notifications**: Admins receive emails for new requests (SendGrid).
- **Dark/Light Theme**: Toggleable theme with vibrant gradients.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Web3.js, Axios, Framer Motion, React Router, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose, Nodemailer, JWT, Bcrypt
- **APIs**: CoinGecko (prices), SendGrid (emails)
- **Tools**: Git, MongoDB Atlas

## Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/flashex.git
   cd flashex