var firebaseConfig = {
    apiKey: ApiKey,
    authDomain: AuthDomain,
    databaseURL: DatabaseURL,
    projectId: ProjectId,
    storageBucket: StorageBucket,
    messagingSenderId: MessagingSenderId,
    appId: AppId,
    measurementId: MeasurementId
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

