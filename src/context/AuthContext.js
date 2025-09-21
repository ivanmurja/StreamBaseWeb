import React, { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
  where,
  updateDoc,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "firebase/firestore";
import tmdbApi from "../api/tmdb";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaStates, setMediaStates] = useState({});
  const [userProfileData, setUserProfileData] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const mediaStatesDocRef = doc(db, "users", user.uid);
      const unsubscribeStates = onSnapshot(mediaStatesDocRef, (docSnap) => {
        setMediaStates(
          docSnap.exists() ? docSnap.data().mediaStates || {} : {}
        );
      });

      const userProfileDocRef = doc(db, "users", user.uid);
      const unsubscribeProfile = onSnapshot(userProfileDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfileData(
            data.profile || {
              displayName: user.displayName || user.email,
              bio: "",
            }
          );
        }
      });

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("recipientId", "==", user.uid),
        where("read", "==", false)
      );
      const unsubscribeNotifications = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const count = snapshot.size;
          setUnreadNotificationsCount(count);
        }
      );

      return () => {
        unsubscribeStates();
        unsubscribeProfile();
        unsubscribeNotifications();
      };
    } else {
      setMediaStates({});
      setUserProfileData(null);
      setUnreadNotificationsCount(0);
    }
  }, [user]);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (profileUpdates) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: profileUpdates.displayName });
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          profile: {
            displayName: profileUpdates.displayName,
            bio: profileUpdates.bio,
          },
          createdAt: (await getDoc(userDocRef)).data()?.createdAt || new Date(),
        },
        { merge: true }
      );
      setUserProfileData((prevData) => ({ ...prevData, ...profileUpdates }));
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      throw error;
    }
  };

  const getUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().profile;
    }
    return null;
  };

  const addActivity = async (activityData) => {
    if (!user) return;
    try {
      const activitiesCollectionRef = collection(db, "activities");
      await addDoc(activitiesCollectionRef, {
        userId: user.uid,
        userName: user.displayName || user.email,
        ...(user.photoURL && { userPhotoURL: user.photoURL }),
        timestamp: serverTimestamp(),
        ...activityData,
      });
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
    }
  };

  const updateMediaState = async (media, newStates) => {
    if (!user) return;
    const mediaId = `${media.mediaType}_${media.id}`;
    const docRef = doc(db, "users", user.uid);
    const currentMediaInfo = mediaStates[mediaId] || {};
    let updatedMediaInfo = { ...currentMediaInfo, ...media, ...newStates };
    if (newStates.hasOwnProperty("watched") && newStates.watched === false) {
      updatedMediaInfo.rating = null;
    }
    const newMediaStates = { ...mediaStates, [mediaId]: updatedMediaInfo };
    await setDoc(docRef, { mediaStates: newMediaStates }, { merge: true });

    if (newStates.watched && !currentMediaInfo.watched) {
      addActivity({
        type: "watched",
        mediaType: media.mediaType,
        mediaId: String(media.id),
        mediaTitle: String(media.title),
        mediaPoster: media.poster,
      });
    } else if (
      newStates.rating &&
      newStates.rating !== currentMediaInfo.rating
    ) {
      addActivity({
        type: "rated",
        mediaType: media.mediaType,
        mediaId: String(media.id),
        mediaTitle: String(media.title),
        mediaPoster: media.poster,
        rating: newStates.rating,
      });
    } else if (newStates.inWatchlist && !currentMediaInfo.inWatchlist) {
      addActivity({
        type: "added_to_watchlist",
        mediaType: media.mediaType,
        mediaId: String(media.id),
        mediaTitle: String(media.title),
        mediaPoster: media.poster,
      });
    }
  };

  const getMediaStatus = (mediaType, id) => {
    const mediaId = `${mediaType}_${id}`;
    return mediaStates[mediaId] || {};
  };

  const getFavorites = () =>
    Object.values(mediaStates).filter((item) => item.favorited);

  const getWatchlist = () =>
    Object.values(mediaStates).filter((item) => item.inWatchlist);

  const getUserMediaStats = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists())
      return { moviesWatched: 0, seriesWatched: 0, totalMinutes: 0 };
    const media = docSnap.data().mediaStates || {};
    let moviesWatched = 0,
      seriesWatched = 0,
      totalMinutes = 0;
    Object.values(media).forEach((item) => {
      if (item.watched) {
        if (item.mediaType === "movie") moviesWatched++;
        else if (item.mediaType === "tv") seriesWatched++;
        if (typeof item.runtime === "number") totalMinutes += item.runtime;
      }
    });
    return { moviesWatched, seriesWatched, totalMinutes };
  };

  const followUser = async (targetUserId) => {
    if (!user || user.uid === targetUserId) return;
    try {
      const currentUserFollowingRef = doc(
        db,
        "users",
        user.uid,
        "following",
        targetUserId
      );
      await setDoc(currentUserFollowingRef, { createdAt: serverTimestamp() });
      const targetUserFollowersRef = doc(
        db,
        "users",
        targetUserId,
        "followers",
        user.uid
      );
      await setDoc(targetUserFollowersRef, { createdAt: serverTimestamp() });
      await addNotification({
        recipientId: targetUserId,
        type: "new_follower",
        message: `${user.displayName || user.email} começou a te seguir!`,
        link: `/profile/${user.uid}`,
      });
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  const unfollowUser = async (targetUserId) => {
    if (!user || user.uid === targetUserId) return;
    try {
      const currentUserFollowingRef = doc(
        db,
        "users",
        user.uid,
        "following",
        targetUserId
      );
      await deleteDoc(currentUserFollowingRef);
      const targetUserFollowersRef = doc(
        db,
        "users",
        targetUserId,
        "followers",
        user.uid
      );
      await deleteDoc(targetUserFollowersRef);
    } catch (error) {
      console.error("Erro ao deixar de seguir usuário:", error);
    }
  };

  const isFollowing = async (targetUserId) => {
    if (!user) return false;
    const docRef = doc(db, "users", user.uid, "following", targetUserId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const getFollowing = async (userId) => {
    const followingCollectionRef = collection(db, "users", userId, "following");
    const querySnapshot = await getDocs(query(followingCollectionRef));
    const followingList = [];
    for (const docSnapshot of querySnapshot.docs) {
      const userDocSnap = await getDoc(doc(db, "users", docSnapshot.id));
      if (userDocSnap.exists() && userDocSnap.data().profile) {
        followingList.push({
          id: userDocSnap.id,
          ...userDocSnap.data().profile,
        });
      }
    }
    return followingList;
  };

  const getFollowers = async (userId) => {
    const followersCollectionRef = collection(db, "users", userId, "followers");
    const querySnapshot = await getDocs(query(followersCollectionRef));
    const followersList = [];
    for (const docSnapshot of querySnapshot.docs) {
      const userDocSnap = await getDoc(doc(db, "users", docSnapshot.id));
      if (userDocSnap.exists() && userDocSnap.data().profile) {
        followersList.push({
          id: userDocSnap.id,
          ...userDocSnap.data().profile,
        });
      }
    }
    return followersList;
  };

  const getUserActivities = async (targetUserId, limitCount = 6) => {
    try {
      const activitiesCollectionRef = collection(db, "activities");
      const q = query(
        activitiesCollectionRef,
        where("userId", "==", targetUserId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar atividades do usuário:", error);
      return [];
    }
  };

  const addNotification = async (notificationData) => {
    if (!user) return;
    try {
      const notificationsCollectionRef = collection(db, "notifications");
      await addDoc(notificationsCollectionRef, {
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderPhotoURL: user.photoURL || null,
        read: false,
        createdAt: serverTimestamp(),
        ...notificationData,
      });
    } catch (error) {
      console.error("Erro ao adicionar notificação:", error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    if (!user) {
      console.error(
        "[AuthContext] Tentativa de marcar notificação como lida sem usuário logado."
      );
      return;
    }
    const notificationRef = doc(db, "notifications", notificationId);
    try {
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error(
        `[AuthContext] FALHA ao marcar notificação ${notificationId} como lida:`,
        error
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) {
      console.error(
        "[AuthContext] Tentativa de marcar todas como lidas sem usuário logado."
      );
      return;
    }

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", user.uid),
      where("read", "==", false)
    );

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error(
        "[AuthContext] FALHA ao executar o batch para marcar todas como lidas:",
        error
      );
    }
  };

  const createCustomList = async ({ name, description, isPublic }) => {
    if (!user) throw new Error("Usuário não autenticado");
    const listsCollectionRef = collection(db, "users", user.uid, "customLists");
    const newListRef = await addDoc(listsCollectionRef, {
      name,
      description,
      isPublic,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      items: [],
    });
    return newListRef.id;
  };

  const addMediaToList = async (listId, mediaData) => {
    if (!user) throw new Error("Usuário não autenticado");
    const listRef = doc(db, "users", user.uid, "customLists", listId);
    await updateDoc(listRef, {
      items: arrayUnion(mediaData),
    });
  };

  const removeMediaFromList = async (listId, mediaDataToRemove) => {
    if (!user) return;
    const listRef = doc(db, "users", user.uid, "customLists", listId);
    await updateDoc(listRef, {
      items: arrayRemove(mediaDataToRemove),
    });
  };

  const getUserLists = async (targetUserId) => {
    const listsRef = collection(db, "users", targetUserId, "customLists");
    const q = query(listsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const getListDetails = async (targetUserId, listId) => {
    const listRef = doc(db, "users", targetUserId, "customLists", listId);
    const docSnap = await getDoc(listRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  };

  const getAllUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(query(usersCollectionRef));
    const usersList = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().profile) {
        usersList.push({ id: doc.id, ...doc.data().profile });
      }
    });
    return usersList;
  };

  const addReview = async (mediaType, mediaId, reviewData) => {
    if (!user)
      throw new Error("Usuário não autenticado para adicionar avaliação.");
    const reviewsCollectionRef = collection(
      db,
      `media/${mediaType}_${mediaId}/reviews`
    );
    await addDoc(reviewsCollectionRef, {
      userId: user.uid,
      userName: user.displayName || user.email,
      userPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...reviewData,
    });
  };

  const getReviews = async (mediaType, mediaId) => {
    const reviewsCollectionRef = collection(
      db,
      `media/${mediaType}_${mediaId}/reviews`
    );
    const q = query(reviewsCollectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const updateReview = async (mediaType, mediaId, reviewId, newText) => {
    if (!user)
      throw new Error("Usuário não autenticado para editar avaliação.");
    const reviewRef = doc(
      db,
      `media/${mediaType}_${mediaId}/reviews`,
      reviewId
    );
    await updateDoc(reviewRef, {
      text: newText,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteReview = async (mediaType, mediaId, reviewId) => {
    if (!user)
      throw new Error("Usuário não autenticado para deletar avaliação.");
    const reviewRef = doc(
      db,
      `media/${mediaType}_${mediaId}/reviews`,
      reviewId
    );
    await deleteDoc(reviewRef);
  };

  const getPersonalizedRecommendations = async () => {
    if (!user) return [];

    const userMedia = Object.values(mediaStates);
    const seedItems = userMedia
      .filter((item) => item.favorited || (item.rating && item.rating >= 4))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    if (seedItems.length === 0) {
      return [];
    }

    const recommendationPromises = seedItems.map((item) =>
      tmdbApi.get(`/${item.mediaType}/${item.id}/recommendations`)
    );

    const responses = await Promise.all(recommendationPromises);
    const allRecommendations = responses.flatMap((res) => res.data.results);

    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map((item) => [item.id, item])).values()
    );

    const userWatchedOrWatchlistedIds = new Set(
      userMedia
        .filter((item) => item.watched || item.inWatchlist)
        .map((item) => item.id)
    );

    const filteredRecommendations = uniqueRecommendations
      .filter((item) => !userWatchedOrWatchlistedIds.has(item.id))
      .filter((item) => item.poster_path && item.media_type !== "person")
      .map((item) => ({
        id: item.id,
        title: item.title || item.name,
        poster: item.poster_path,
        backdrop_path: item.backdrop_path,
        year:
          (item.release_date || item.first_air_date)?.substring(0, 4) || "N/A",
        rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
        mediaType: item.media_type || "movie",
      }));

    return filteredRecommendations;
  };

  const value = {
    user,
    loading,
    userProfileData,
    unreadNotificationsCount,
    signup,
    login,
    logout,
    updateUserProfile,
    getUserProfile,
    updateMediaState,
    getMediaStatus,
    getFavorites,
    getWatchlist,
    getUserMediaStats,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowing,
    getFollowers,
    addActivity,
    getUserActivities,
    getAllUsers,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createCustomList,
    addMediaToList,
    removeMediaFromList,
    getUserLists,
    getListDetails,
    addReview,
    getReviews,
    updateReview,
    deleteReview,
    getPersonalizedRecommendations,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
