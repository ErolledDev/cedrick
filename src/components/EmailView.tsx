import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { fetchEmail } from '../lib/api';
import { formatDate } from '../lib/utils';

interface EmailViewProps {
  emailId: string;
  onClose: () => void;
}

export default function EmailView({ emailId, onClose }: EmailViewProps) {
  const [email, setEmail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    const sidToken = localStorage.getItem('sidToken');
    if (sidToken) {
      loadEmail(sidToken);
    }
  }, [emailId]);

  const loadEmail = async (sidToken: string) => {
    try {
      setIsLoading(true);
      const data = await fetchEmail(sidToken, emailId);
      setEmail(data);
    } catch (error) {
      console.error('Failed to fetch email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processEmailBody = (body: string) => {
    let processed = DOMPurify.sanitize(body);
    if (!showImages) {
      processed = processed.replace(/<img[^>]*>/g, '<div class="blocked-image">Image blocked</div>');
    }
    return processed;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">Failed to load email</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to inbox
        </button>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{email.mail_subject}</h2>
          <div className="flex justify-between items-start text-sm text-gray-600">
            <div>
              <p className="font-medium">From: {email.mail_from}</p>
              <p>To: {localStorage.getItem('tempEmail')}</p>
            </div>
            <p>{formatDate(parseInt(email.mail_timestamp))}</p>
          </div>
        </div>
        
        {email.content_type.includes('html') && (
          <div className="mb-4">
            <button
              onClick={() => setShowImages(!showImages)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showImages ? 'Hide Images' : 'Show Images'}
            </button>
          </div>
        )}
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: processEmailBody(email.mail_body)
          }}
        />
      </div>
    </div>
  );
}