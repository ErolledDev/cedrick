import axios from 'axios';
import { getRandomDomain } from './utils';

// Use different base URLs for development and production
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.guerrillamail.com/ajax.php'
  : '/api/ajax.php';

interface EmailResponse {
  email_addr: string;
  email_timestamp: number;
  alias: string;
  sid_token: string;
}

interface Email {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: string;
  mail_read: string;
  mail_date: string;
}

interface EmailListResponse {
  list: Email[];
  count: string;
  email: string;
  alias: string;
  ts: number;
  sid_token: string;
}

interface EmailContent {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_body: string;
  mail_timestamp: string;
  mail_date: string;
  content_type: string;
}

// Configure axios defaults
axios.defaults.withCredentials = true;

// Create axios instance with default config
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export async function getEmailAddress(sidToken?: string): Promise<EmailResponse> {
  try {
    const params = {
      f: 'get_email_address',
      lang: 'en',
      site: getRandomDomain(),
      ...(sidToken && { sid_token: sidToken })
    };

    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting email address:', error);
    throw error;
  }
}

export async function setEmailUser(emailUser: string, sidToken: string): Promise<EmailResponse> {
  try {
    const params = {
      f: 'set_email_user',
      email_user: emailUser,
      lang: 'en',
      site: getRandomDomain(),
      sid_token: sidToken
    };

    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error setting email user:', error);
    throw error;
  }
}

export async function checkEmail(sidToken: string, seq: number): Promise<EmailListResponse> {
  try {
    const params = {
      f: 'check_email',
      sid_token: sidToken,
      seq
    };

    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
}

export async function fetchEmail(sidToken: string, emailId: string): Promise<EmailContent> {
  try {
    const params = {
      f: 'fetch_email',
      sid_token: sidToken,
      email_id: emailId
    };

    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  }
}

export async function forgetMe(sidToken: string, emailAddr: string): Promise<boolean> {
  try {
    const params = {
      f: 'forget_me',
      sid_token: sidToken,
      email_addr: emailAddr
    };

    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error forgetting email:', error);
    throw error;
  }
}