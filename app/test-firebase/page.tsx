'use client';

import { useEffect, useState } from 'react';
import { getFirebase } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { PageNavigation } from '@/components/page-navigation';

export default function TestFirebasePage() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [firestoreTest, setFirestoreTest] = useState<'idle' | 'ok' | 'error'>('idle');
  const [firestoreMessage, setFirestoreMessage] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    try {
      const { app, auth, db, storage } = getFirebase();
      setMessage(`✅ Firebase initialized successfully!
      
App Name: ${app.name}
Auth: ${auth ? '✅ Connected' : '❌ Failed'}
Firestore: ${db ? '✅ Connected' : '❌ Failed'}
Storage: ${storage ? '✅ Connected' : '❌ Failed'}`);
      setStatus('ok');
    } catch (e: any) {
      setMessage(`❌ Firebase initialization failed: ${e?.message || 'Unknown error'}`);
      setStatus('error');
    }
  }, []);

  const testFirestore = async () => {
    try {
      setFirestoreTest('idle');
      setFirestoreMessage('Testing Firestore...');
      
      const { db } = getFirebase();
      const testDoc = doc(db, 'test', 'connection-test');
      
      // Write test data
      await setDoc(testDoc, {
        message: 'Hello from Firebase!',
        timestamp: new Date(),
        testId: Math.random().toString(36).substr(2, 9)
      });
      
      // Read test data
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirestoreMessage(`✅ Firestore test successful!
        
Data written and read successfully:
Message: ${data.message}
Test ID: ${data.testId}
Timestamp: ${data.timestamp?.toDate?.()?.toLocaleString() || 'N/A'}`);
        setFirestoreTest('ok');
      } else {
        throw new Error('Document not found after writing');
      }
    } catch (error: any) {
      setFirestoreMessage(`❌ Firestore test failed: ${error.message}`);
      setFirestoreTest('error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔥 Firebase Connection Test</h1>
        <p className="text-muted-foreground">
          Test your Firebase configuration and services
        </p>
      </div>

      <div className="grid gap-6">
        {/* Firebase Initialization Test */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Firebase Initialization</h2>
            <Badge variant={status === 'ok' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
              {status === 'ok' ? 'Connected' : status === 'error' ? 'Failed' : 'Testing'}
            </Badge>
          </div>
          <pre className={`whitespace-pre-wrap text-sm p-4 rounded-lg ${
            status === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 
            status === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
            'bg-gray-50 text-gray-800 border border-gray-200'
          }`}>
            {message || 'Initializing Firebase...'}
          </pre>
        </Card>

        {/* Authentication Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Authentication Status</h2>
            <Badge variant={user ? 'default' : 'secondary'}>
              {user ? 'Signed In' : 'Not Signed In'}
            </Badge>
          </div>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No user signed in. Go to <a href="/auth" className="text-primary underline">/auth</a> to sign in.
            </p>
          )}
        </Card>

        {/* Firestore Test */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Firestore Database Test</h2>
            <div className="flex gap-2">
              <Badge variant={firestoreTest === 'ok' ? 'default' : firestoreTest === 'error' ? 'destructive' : 'secondary'}>
                {firestoreTest === 'ok' ? 'Success' : firestoreTest === 'error' ? 'Failed' : 'Ready'}
              </Badge>
              <Button onClick={testFirestore} size="sm" disabled={status !== 'ok'}>
                Test Firestore
              </Button>
            </div>
          </div>
          {firestoreMessage && (
            <pre className={`whitespace-pre-wrap text-sm p-4 rounded-lg ${
              firestoreTest === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 
              firestoreTest === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {firestoreMessage}
            </pre>
          )}
          {!firestoreMessage && (
            <p className="text-muted-foreground">
              Click "Test Firestore" to verify database read/write operations.
            </p>
          )}
        </Card>

        {/* Environment Variables Check */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              'NEXT_PUBLIC_FIREBASE_API_KEY',
              'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
              'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
              'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
              'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
              'NEXT_PUBLIC_FIREBASE_APP_ID',
              'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
            ].map((envVar) => {
              const value = process.env[envVar];
              return (
                <div key={envVar} className="flex items-center justify-between p-2 rounded border">
                  <span className="font-mono text-xs">{envVar}</span>
                  <Badge variant={value ? 'default' : 'destructive'} className="text-xs">
                    {value ? '✅ Set' : '❌ Missing'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Setup Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">📋 Setup Instructions</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Create a Firebase project at <a href="https://console.firebase.google.com" className="underline" target="_blank" rel="noopener noreferrer">Firebase Console</a></p>
            <p>2. Add a web app to your project</p>
            <p>3. Copy the config values to your <code className="bg-blue-100 px-1 rounded">.env.local</code> file</p>
            <p>4. Enable Authentication (Email/Password and Google)</p>
            <p>5. Create a Firestore database</p>
            <p>6. Restart your development server</p>
            <p className="mt-4 font-semibold">📖 See FIREBASE_SETUP.md for detailed instructions</p>
          </div>
        </Card>
      </div>
      
      <PageNavigation 
        previousPage={{ href: '/dashboard', label: 'Dashboard' }}
        nextPage={{ href: '/', label: 'Home' }}
      />
    </div>
  );
}



