import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEmailAddress, setEmailUser, forgetMe } from '../lib/api';
import { AVAILABLE_DOMAINS, DEFAULT_DOMAIN } from '../lib/utils';

export default function EmailBox() {
  const [emailAddress, setEmailAddress] = useState('');
  const [sidToken, setSidToken] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('tempEmail');
    const storedToken = localStorage.getItem('sidToken');
    
    if (storedEmail && storedToken) {
      setEmailAddress(storedEmail);
      setSidToken(storedToken);
      const [user, domain] = storedEmail.split('@');
      setUsername(user);
      setSelectedDomain(domain || DEFAULT_DOMAIN);
    } else {
      generateNewEmail();
    }
  }, []);

  const generateNewEmail = async () => {
    try {
      setIsLoading(true);
      const response = await getEmailAddress();
      setEmailAddress(response.email_addr);
      setSidToken(response.sid_token);
      const [user, domain] = response.email_addr.split('@');
      setUsername(user);
      setSelectedDomain(domain || DEFAULT_DOMAIN);
      
      localStorage.setItem('tempEmail', response.email_addr);
      localStorage.setItem('sidToken', response.sid_token);
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error('Failed to generate email address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      toast.success('Email address copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy email address');
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      const response = await setEmailUser(username, sidToken, selectedDomain);
      if (response && response.email_addr) {
        setEmailAddress(response.email_addr);
        localStorage.setItem('tempEmail', response.email_addr);
        setIsEditing(false);
        toast.success('Email address updated');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const [currentUser, currentDomain] = emailAddress.split('@');
    setUsername(currentUser);
    setSelectedDomain(currentDomain || DEFAULT_DOMAIN);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await forgetMe(sidToken, emailAddress);
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('sidToken');
      localStorage.removeItem('inbox');
      await generateNewEmail();
      toast.success('Generated new email address');
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Failed to generate new email address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Your temporary email address:</h2>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AVAILABLE_DOMAINS.map(domain => (
                  <option key={domain} value={domain}>@{domain}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-lg font-mono">{emailAddress}</div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copy email address"
            disabled={isLoading}
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh inbox"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-green-600"
                title="Save changes"
                disabled={isLoading}
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                title="Cancel editing"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit email address"
              disabled={isLoading}
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Generate new email address"
            disabled={isLoading}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}