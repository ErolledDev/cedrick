import React from 'react';
import { Toaster } from 'react-hot-toast';
import EmailBox from './components/EmailBox';
import EmailList from './components/EmailList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SnapMails</h1>
          <p className="text-gray-600">Instant disposable email addresses for your privacy</p>
        </header>

        <main className="flex flex-col items-center">
          <EmailBox />
          <EmailList />
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 SnapMails. All rights reserved.</p>
        </footer>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;