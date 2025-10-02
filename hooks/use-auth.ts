'use client';

import { useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';

export type UserRole = 'user' | 'shopkeeper';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopProfile {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  description?: string;
  openingTime: string;
  closingTime: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth, db } = getFirebase();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          
          // If shopkeeper, fetch shop profile
          if (profile.role === 'shopkeeper') {
            const shopsQuery = query(
              collection(db, 'shops'),
              where('ownerId', '==', user.uid)
            );
            const shopsSnapshot = await getDocs(shopsQuery);
            if (!shopsSnapshot.empty) {
              const shopData = shopsSnapshot.docs[0].data() as ShopProfile;
              setShopProfile({ ...shopData, id: shopsSnapshot.docs[0].id });
            }
          }
        }
      } else {
        setUserProfile(null);
        setShopProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: UserRole,
    phone?: string,
    address?: string
  ) => {
    const { auth, db } = getFirebase();
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      phone,
      address,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return userCredential;
  };

  const signIn = async (email: string, password: string) => {
    const { auth } = getFirebase();
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    const { auth } = getFirebase();
    await signOut(auth);
  };

  const createShop = async (shopData: Omit<ShopProfile, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || userProfile?.role !== 'shopkeeper') {
      throw new Error('Only shopkeepers can create shops');
    }

    const { db } = getFirebase();
    const shopRef = doc(collection(db, 'shops'));
    
    const shop: ShopProfile = {
      ...shopData,
      id: shopRef.id,
      ownerId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(shopRef, shop);
    setShopProfile(shop);
    
    return shop;
  };

  const updateShop = async (updates: Partial<ShopProfile>) => {
    if (!shopProfile) {
      throw new Error('No shop to update');
    }

    const { db } = getFirebase();
    const updatedShop = {
      ...shopProfile,
      ...updates,
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'shops', shopProfile.id), updatedShop);
    setShopProfile(updatedShop);
    
    return updatedShop;
  };

  return {
    user,
    userProfile,
    shopProfile,
    loading,
    signUp,
    signIn,
    logout,
    createShop,
    updateShop,
    isAuthenticated: !!user,
    isUser: userProfile?.role === 'user',
    isShopkeeper: userProfile?.role === 'shopkeeper'
  };
}