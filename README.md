**Hedera Team Certificates Link**
https://drive.google.com/drive/folders/1abRcy4Lu7etjwUV4a3WzdgT-0ft87LEC?usp=sharing

# Hedera Property Loans - Frontend Demo

A beautiful, responsive React web app that simulates tokenized property loans on the Hedera network. Built for hackathon demonstration purposes.

## 🚀 Features

- **Modern UI**: Sleek design with TailwindCSS and glassmorphism effects
- **Wallet Integration**: Simulated wallet connection functionality
- **Dual Roles**: Borrower and Lender dashboards
- **Property Management**: Tokenized property assets
- **Loan System**: Request, approve, repay, and claim collateral
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18** with functional components and hooks
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hedera-property-loans
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started
1. Click "Connect Wallet" to simulate wallet connection
2. Navigate to Dashboard to access the main features
3. Switch between Borrower and Lender views using the tabs

### As a Borrower
- View your tokenized properties
- Request loans against your properties
- Monitor loan status and repayments
- Track loan history

### As a Lender
- Browse available loan requests
- Approve or reject loan applications
- Claim collateral in case of default
- Monitor your lending portfolio

## 🎨 Design Features

- **Hedera Branding**: Purple and blue gradient theme
- **Glassmorphism**: Modern glass-like card effects
- **Smooth Animations**: Framer Motion for polished interactions
- **Responsive Design**: Works on all screen sizes
- **Professional UI**: Fintech/Web3 dashboard aesthetic

## 📱 Pages

- **Home**: Hero section with project introduction
- **Dashboard**: Main application interface
- **About**: Detailed explanation of the system

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── PropertyCard.jsx
│   ├── LoanCard.jsx
│   └── LoanRequestModal.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   └── About.jsx
├── App.jsx             # Main app with routing
├── main.jsx           # Entry point
└── index.css          # Global styles
```

### Key Components

- **App.jsx**: Main application with state management
- **Navbar.jsx**: Navigation with wallet connection
- **Dashboard.jsx**: Borrower/Lender interface
- **PropertyCard.jsx**: Property display component
- **LoanCard.jsx**: Loan information display
- **LoanRequestModal.jsx**: Loan request form

## 🎭 Demo Data

The application includes mock data for immediate demonstration:
- 3 sample properties (Apartment A, Plot 17, Commercial Space B)
- Sample loan requests with different statuses
- Simulated wallet addresses
- Realistic property values and loan amounts

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 📄 License

This project is created for hackathon demonstration purposes.

## 🤝 Contributing

This is a demo project, but suggestions and improvements are welcome!

---

**Built for Hedera Network** - Demonstrating the future of tokenized property loans on blockchain.

