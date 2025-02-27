import axios from 'axios';
import { getRandomDomain } from './utils';

// Use corsproxy.io for production to handle CORS
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://corsproxy.io/?https://api.guerrillamail.com/ajax.php'
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
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export async function getEmailAddress(sidToken?: string): Promise<EmailResponse> {
  try {
    const params = new URLSearchParams({
      f: 'get_email_address',
      lang: 'en',
      site: getRandomDomain(),
      ...(sidToken ? { sid_token: sidToken } : {})
    });

    const response = await api.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting email address:', error);
    throw new Error('Failed to get email address');
  }
}

export async function setEmailUser(emailUser: string, sidToken: string, domain: string): Promise<EmailResponse> {
  try {
    const params = new URLSearchParams({
      f: 'set_email_user',
      email_user: emailUser,
      lang: 'en',
      site: domain,
      sid_token: sidToken
    });

    const response = await api.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error setting email user:', error);
    throw new Error('Failed to set email user');
  }
}

export async function checkEmail(sidToken: string, seq: number): Promise<EmailListResponse> {
  try {
    const params = new URLSearchParams({
      f: 'check_email',
      sid_token: sidToken,
      seq: seq.toString()
    });

    const response = await api.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error checking email:', error);
    throw new Error('Failed to check email');
  }
}

export async function fetchEmail(sidToken: string, emailId: string): Promise<EmailContent> {
  try {
    const params = new URLSearchParams({
      f: 'fetch_email',
      sid_token: sidToken,
      email_id: emailId
    });

    const response = await api.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching email:', error);
    throw new Error('Failed to fetch email');
  }
}

export async function forgetMe(sidToken: string, emailAddr: string): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      f: 'forget_me',
      sid_token: sidToken,
      email_addr: emailAddr
    });

    const response = await api.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error forgetting email:', error);
    throw new Error('Failed to forget email');
  }
}