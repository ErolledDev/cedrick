import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { checkEmail } from '../lib/api';
import { formatDate } from '../lib/utils';
import EmailView from './EmailView';

interface Email {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: string;
  mail_read: string;
  mail_date: string;
}

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sidToken = localStorage.getItem('sidToken');
    if (sidToken) {
      // Load stored emails first
      const storedInbox = localStorage.getItem('inbox');
      if (storedInbox) {
        setEmails(JSON.parse(storedInbox));
      }
      
      // Then fetch new emails
      fetchEmails(sidToken);
      const interval = setInterval(() => fetchEmails(sidToken), 15000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchEmails = async (sidToken: string) => {
    try {
      setIsLoading(true);
      const response = await checkEmail(sidToken, 0);
      const filteredEmails = response.list.filter(email => 
        email.mail_from !== 'no-reply@guerrillamail.com'
      );
      
      // Merge new emails with existing ones, avoiding duplicates
      const newEmails = [...emails];
      filteredEmails.forEach(newEmail => {
        if (!newEmails.some(existing => existing.mail_id === newEmail.mail_id)) {
          newEmails.unshift(newEmail);
        }
      });
      
      setEmails(newEmails);
      // Store emails in localStorage
      localStorage.setItem('inbox', JSON.stringify(newEmails));
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && emails.length === 0) {
    return (
      <div className="w-full max-w-3xl mt-8 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="w-full max-w-3xl mt-8 bg-white rounded-lg shadow-md p-8 text-center">
        <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No emails yet</h3>
        <p className="text-gray-500">New emails will appear here automatically</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mt-8">
      {selectedEmail ? (
        <EmailView 
          emailId={selectedEmail} 
          onClose={() => setSelectedEmail(null)} 
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y">
          {emails.map((email) => (
            <div
              key={email.mail_id}
              onClick={() => setSelectedEmail(email.mail_id)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{email.mail_from}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(parseInt(email.mail_timestamp))}
                </span>
              </div>
              <h4 className="text-gray-800 mb-1">{email.mail_subject}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{email.mail_excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}