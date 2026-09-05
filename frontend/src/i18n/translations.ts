export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Meta
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  
  // Navigation & Actions
  navHome: string;
  navHowItWorks: string;
  navTechnology: string;
  navVerifyHoney: string;
  navAbout: string;
  navSignIn: string;
  navDashboard: string;
  navSignOut: string;
  btnVerify: string;
  btnExplore: string;
  btnScanQr: string;
  btnEnterBatchId: string;
  btnCancel: string;
  btnSubmit: string;
  btnBack: string;
  btnInspect: string;
  
  // Two Provenance Models
  modelDirectBeekeeper: string;
  modelDirectBeekeeperDesc: string;
  modelCompanyManaged: string;
  modelCompanyManagedDesc: string;
  twoModelsTitle: string;
  twoModelsSubtitle: string;
  
  // How it works steps
  stepHive: string;
  stepHarvest: string;
  stepProcessing: string;
  stepQuality: string;
  stepLogistics: string;
  stepPackaging: string;
  stepPassport: string;
  
  // Why Honey Chain
  whyTitle: string;
  whySubtitle: string;
  featureTraceabilityTitle: string;
  featureTraceabilityDesc: string;
  featureAiTitle: string;
  featureAiDesc: string;
  featureBlockchainTitle: string;
  featureBlockchainDesc: string;
  featureLabTitle: string;
  featureLabDesc: string;
  featureConsumerTitle: string;
  featureConsumerDesc: string;
  featureIotTitle: string;
  featureIotDesc: string;

  // Technology Section
  techTitle: string;
  techSubtitle: string;
  techFabricTitle: string;
  techFabricDesc: string;
  techAiTitle: string;
  techAiDesc: string;
  techIotTitle: string;
  techIotDesc: string;
  techPassportTitle: string;
  techPassportDesc: string;
  
  // Verify Modal & Scan
  verifyModalTitle: string;
  verifyModalSubtitle: string;
  scanQrTab: string;
  manualEntryTab: string;
  scanQrPrompt: string;
  manualInputPlaceholder: string;
  tryVerifiedPreset: string;
  tryDirectPreset: string;
  trySuspiciousPreset: string;
  cameraPermissionNote: string;
  
  // Passport Page
  passportTitle: string;
  passportSubtitle: string;
  passportBatch: string;
  passportProvenanceModel: string;
  passportStatusVerified: string;
  passportStatusFlagged: string;
  passportOriginApiary: string;
  passportFloralSource: string;
  passportVolume: string;
  passportEvidenceScore: string;
  passportTimelineTitle: string;
  passportStageHarvest: string;
  passportStageProcessing: string;
  passportStageTransport: string;
  passportStagePackaging: string;
  passportBeekeeperProfile: string;
  passportCompanyProfile: string;
  passportPillarBlockchain: string;
  passportPillarAi: string;
  passportPillarLab: string;
  passportDisclaimer: string;
  passportPending: string;
  passportConfirmed: string;
  
  // Auth & Roles
  roleAdmin: string;
  roleBeekeeper: string;
  roleProcessor: string;
  roleTransporter: string;
  rolePackager: string;
  roleQualityLab: string;
  roleConsumer: string;
  
  // Footer
  footerRights: string;
  footerHonestClaim: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Honey Chain',
    tagline: 'Certified Honey Origin & Purity Assurance',
    heroHeadline: "Know Your Honey's Journey from Flower to Jar",
    heroSubheadline: '100% authentic, lab-tested, and fully traceable. Experience complete transparency from registered forest apiaries to your kitchen table.',
    
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navTechnology: 'Quality Standards',
    navVerifyHoney: 'Verify Honey',
    navAbout: 'About',
    navSignIn: 'Sign In',
    navDashboard: 'Operations Portal',
    navSignOut: 'Sign Out',
    btnVerify: 'Verify Honey Jar',
    btnExplore: 'Explore Quality Standards',
    btnScanQr: 'Scan QR Code',
    btnEnterBatchId: 'Enter Batch Code',
    btnCancel: 'Cancel',
    btnSubmit: 'Verify Batch',
    btnBack: 'Return to Operations Dashboard',
    btnInspect: 'View Honey Passport',
    
    modelDirectBeekeeper: 'Direct from Beekeeper',
    modelDirectBeekeeperDesc: 'Pure artisan honey purchased directly from registered local apiarists with immediate harvest verification.',
    modelCompanyManaged: 'Certified Managed Supply Chain',
    modelCompanyManagedDesc: 'Enterprise collection and distribution with multi-stage quality control, cold transit, and laboratory certification.',
    twoModelsTitle: 'Two Certified Supply Chain Pathways',
    twoModelsSubtitle: 'Empowering both independent artisan beekeepers and certified commercial producers within a unified quality ecosystem.',
    
    stepHive: 'Apiary Hive Telemetry',
    stepHarvest: 'Raw Honey Harvest',
    stepProcessing: 'Gentle Thermal Extraction',
    stepQuality: 'Accredited Laboratory Testing',
    stepLogistics: 'Temperature-Controlled Transit',
    stepPackaging: 'Tamper-Evident Jar Sealing',
    stepPassport: 'Digital Honey Passport',
    
    whyTitle: 'Why Choose Certified Honey Chain?',
    whySubtitle: 'Uncompromising purity, verified origin, and laboratory testing for complete consumer confidence.',
    featureTraceabilityTitle: 'Complete Farm-to-Table Traceability',
    featureTraceabilityDesc: 'Every harvest batch is logged with origin coordinates, floral sources, and time-stamped custody transfers.',
    featureAiTitle: 'Yield & Volume Consistency Audits',
    featureAiDesc: 'Automated validation checks ensure batch volumes match apiary harvest capacity and processing tolerances.',
    featureBlockchainTitle: 'Tamper-Evident Quality Records',
    featureBlockchainDesc: 'Historical records of custody handoffs, transport conditions, and lab assays are securely preserved.',
    featureLabTitle: 'Accredited Laboratory Testing',
    featureLabDesc: 'Every batch is analyzed for moisture content, freshness (HMF), and sucrose/C4 purity standards.',
    featureConsumerTitle: 'Instant Public QR Verification',
    featureConsumerDesc: 'Consumers can scan the on-jar QR code on any smartphone to view the verified honey passport with zero login required.',
    featureIotTitle: 'Colony & Hive Environment Monitoring',
    featureIotDesc: 'Apiaries maintain optimal colony health with continuous temperature and ambient tracking.',

    techTitle: 'Four Pillars of Honey Authenticity',
    techSubtitle: 'A comprehensive quality system ensuring raw purity and complete consumer trust.',
    techFabricTitle: '1. Verified Chain of Custody',
    techFabricDesc: 'Secure, multi-party custody records that prevent unauthorized record alterations or counterfeiting.',
    techAiTitle: '2. Volume & Yield Integrity',
    techAiDesc: 'Systematic checks verify processing yields and protect against batch dilution and unauthorized mixing.',
    techIotTitle: '3. Origin & Climate Telemetry',
    techIotDesc: 'Apiary sensors record micro-climate, altitude, and seasonal floral sources at harvest.',
    techPassportTitle: '4. Digital Honey Passport',
    techPassportDesc: 'A transparent, public certificate that brings the entire harvest and testing story directly to the consumer.',
    
    verifyModalTitle: 'Verify Honey Authenticity',
    verifyModalSubtitle: 'Scan the QR code on your honey jar or enter the batch code printed on the label.',
    scanQrTab: 'Camera Scanner',
    manualEntryTab: 'Batch Code Lookup',
    scanQrPrompt: 'Point your camera at the QR code printed on the honey jar.',
    manualInputPlaceholder: 'e.g. HC-2026-0001 or HC-2026-0010',
    tryVerifiedPreset: 'Company Managed (HC-2026-0001)',
    tryDirectPreset: 'Direct Beekeeper (HC-2026-0010)',
    trySuspiciousPreset: 'Flagged Deviation (HC-2026-0003)',
    cameraPermissionNote: 'Camera permissions are processed locally in your browser. You can also enter the batch code manually.',
    
    passportTitle: 'Digital Honey Passport',
    passportSubtitle: 'Public Authenticity & Quality Certification Record',
    passportBatch: 'Batch Code',
    passportProvenanceModel: 'Production Model',
    passportStatusVerified: 'CERTIFIED AUTHENTIC',
    passportStatusFlagged: 'DEVIATION DETECTED',
    passportOriginApiary: 'Origin Apiary',
    passportFloralSource: 'Floral Source',
    passportVolume: 'Batch Volume',
    passportEvidenceScore: 'Quality Score',
    passportTimelineTitle: 'Verified Supply Chain Timeline',
    passportStageHarvest: 'Apiary Harvest & Origin Logging',
    passportStageProcessing: 'Gentle Thermal Filtration',
    passportStageTransport: 'Cold-Chain Logistics',
    passportStagePackaging: 'Tamper-Evident Packaging & QR Release',
    passportBeekeeperProfile: 'Certified Beekeeper',
    passportCompanyProfile: 'Managing Enterprise',
    passportPillarBlockchain: 'Chain of Custody Record',
    passportPillarAi: 'Yield & Volume Audit',
    passportPillarLab: 'Accredited Lab Chemical Assay',
    passportDisclaimer: 'Disclaimer: This certificate confirms verified harvest origin, documented chain of custody, and accredited laboratory test results adhering to national food safety standards (FSSAI/Codex Alimentarius).',
    passportPending: 'Processing In Progress',
    passportConfirmed: 'Verified & Certified',
    
    roleAdmin: 'System Administrator',
    roleBeekeeper: 'Registered Beekeeper',
    roleProcessor: 'Processing Facility',
    roleTransporter: 'Logistics Transporter',
    rolePackager: 'Packaging Center',
    roleQualityLab: 'Accredited Quality Lab',
    roleConsumer: 'Public Consumer',
    
    footerRights: 'All rights reserved. Honey Chain Purity & Origin Trust Network.',
    footerHonestClaim: 'Honey Chain records and authenticates honey origin, supply chain handoffs, and laboratory test certificates for transparent consumer trust.'
  },
  hi: {
    appName: 'हनी चेन (Honey Chain)',
    tagline: 'प्रमाणित शहद उद्गम एवं शुद्धता आश्वासन',
    heroHeadline: 'छत्ते से लेकर जार तक, अपने शहद की असली यात्रा जानें',
    heroSubheadline: '100% प्राकृतिक, लैब-परीक्षित और पूरी तरह से ट्रेस करने योग्य। पंजीकृत वन फार्मों से लेकर आपकी रसोई तक पूर्ण पारदर्शिता।',
    
    navHome: 'होम',
    navHowItWorks: 'यह कैसे काम करता है',
    navTechnology: 'गुणवत्ता मानक',
    navVerifyHoney: 'शहद सत्यापित करें',
    navAbout: 'परिचय',
    navSignIn: 'साइन इन',
    navDashboard: 'ऑपरेशन्स पोर्टल',
    navSignOut: 'साइन आउट',
    btnVerify: 'शहद जार सत्यापित करें',
    btnExplore: 'गुणवत्ता मानक देखें',
    btnScanQr: 'QR कोड स्कैन करें',
    btnEnterBatchId: 'बैच कोड दर्ज करें',
    btnCancel: 'रद्द करें',
    btnSubmit: 'बैच सत्यापित करें',
    btnBack: 'डैशबोर्ड पर वापस जाएं',
    btnInspect: 'हनी पासपोर्ट देखें',
    
    modelDirectBeekeeper: 'सीधे मधुमक्खी पालक से',
    modelDirectBeekeeperDesc: 'स्थानीय पंजीकृत मधुमक्खी पालकों से सीधे प्राप्त शुद्ध प्राकृतिक शहद, तत्काल उद्गम सत्यापन के साथ।',
    modelCompanyManaged: 'प्रमाणित आपूर्ति श्रृंखला',
    modelCompanyManagedDesc: 'उन्नत बहु-चरणीय गुणवत्ता नियंत्रण, कोल्ड ट्रांसपोर्ट, और मान्यता प्राप्त लैब जांच के साथ प्रबंधित आपूर्ति।',
    twoModelsTitle: 'दो प्रमाणित उत्पादन मार्ग',
    twoModelsSubtitle: 'स्वतंत्र कारीगर मधुमक्खी पालकों और प्रमाणित वाणिज्यिक उत्पादकों दोनों को एक साझा गुणवत्ता मंच में सशक्त बनाना।',
    
    stepHive: 'छत्ता निगरानी',
    stepHarvest: 'शहद कटाई एवं उद्गम',
    stepProcessing: 'सौम्य प्राकृतिक निष्कर्षण',
    stepQuality: 'मान्यता प्राप्त लैब परीक्षण',
    stepLogistics: 'तापमान नियंत्रित परिवहन',
    stepPackaging: 'सुरक्षित सीलबंद पैकेजिंग',
    stepPassport: 'डिजिटल हनी पासपोर्ट',
    
    whyTitle: 'प्रमाणित हनी चेन क्यों चुनें?',
    whySubtitle: 'उपभोक्ता विश्वास के लिए असंदिग्ध शुद्धता, प्रमाणित उद्गम और प्रयोगशाला परीक्षण।',
    featureTraceabilityTitle: 'फार्म से टेबल तक पूर्ण ट्रेसिबिलिटी',
    featureTraceabilityDesc: 'प्रत्येक बैच में उद्गम स्थान, पुष्प स्रोत और समयबद्ध कस्टडी हस्तांतरण दर्ज किए जाते हैं।',
    featureAiTitle: 'मात्रा एवं उत्पादन निरंतरता जांच',
    featureAiDesc: 'स्वचालित सत्यापन प्रणाली यह सुनिश्चित करती है कि बैच की मात्रा छत्ते की क्षमता और उत्पादन मानकों के अनुरूप हो।',
    featureBlockchainTitle: 'सुरक्षित और विश्वसनीय गुणवत्ता रिकॉर्ड',
    featureBlockchainDesc: 'कस्टडी हस्तांतरण, परिवहन स्थिति और लैब परीक्षणों के ऐतिहासिक रिकॉर्ड सुरक्षित रखे जाते हैं।',
    featureLabTitle: 'मान्यता प्राप्त प्रयोगशाला परीक्षण',
    featureLabDesc: 'प्रत्येक बैच की नमी प्रतिशत, ताजगी (HMF) और शुद्धता (C4 शर्करा) की विस्तृत लैब जांच।',
    featureConsumerTitle: 'त्वरित सार्वजनिक QR सत्यापन',
    featureConsumerDesc: 'उपभोक्ता बिना लॉगिन किए जार पर लगे QR कोड को स्कैन करके शहद का प्रमाणित पासपोर्ट देख सकते हैं।',
    featureIotTitle: 'छत्ता एवं पर्यावरण निगरानी',
    featureIotDesc: 'मधुमक्खी कॉलोनी के स्वास्थ्य के लिए तापमान और परिवेश की निरंतर निगरानी।',

    techTitle: 'शहद प्रामाणिकता के चार प्रमुख स्तंभ',
    techSubtitle: 'शुद्धता और उपभोक्ता विश्वास सुनिश्चित करने वाली एक समग्र गुणवत्ता प्रणाली।',
    techFabricTitle: '1. प्रमाणित कस्टडी रिकॉर्ड',
    techFabricDesc: 'सुरक्षित आपूर्ति श्रृंखला रिकॉर्ड जो किसी भी अनधिकृत बदलाव या मिलावट को रोकते हैं।',
    techAiTitle: '2. मात्रा एवं उत्पादन संतुलन',
    techAiDesc: 'व्यवस्थित सत्यापन प्रक्रिया जो बैच में अनावश्यक मिश्रण और मात्रा वृद्धि को रोकती है।',
    techIotTitle: '3. उद्गम एवं प्राकृतिक टेलीमेट्री',
    techIotDesc: 'सेंसर कटाई के समय सूक्ष्म जलवायु, ऊंचाई और मौसमी पुष्प स्रोतों को रिकॉर्ड करते हैं।',
    techPassportTitle: '4. डिजिटल हनी पासपोर्ट',
    techPassportDesc: 'एक पारदर्शी, सार्वजनिक प्रमाण पत्र जो पूरी कटाई और परीक्षण की कहानी सीधे उपभोक्ता तक पहुंचाता है।',
    
    verifyModalTitle: 'शहद प्रामाणिकता सत्यापन',
    verifyModalSubtitle: 'अपने शहद के जार पर मुद्रित QR कोड स्कैन करें या लेबल पर लिखा बैच कोड दर्ज करें।',
    scanQrTab: 'कैमरा स्कैनर',
    manualEntryTab: 'बैच कोड खोज',
    scanQrPrompt: 'अपने कैमरे को शहद के जार पर लगे QR कोड की ओर रखें।',
    manualInputPlaceholder: 'उदा. HC-2026-0001 या HC-2026-0010',
    tryVerifiedPreset: 'कंपनी प्रबंधित (HC-2026-0001)',
    tryDirectPreset: 'मधुमक्खी पालक डायरेक्ट (HC-2026-0010)',
    trySuspiciousPreset: 'विसंगति चेतावनी (HC-2026-0003)',
    cameraPermissionNote: 'कैमरा अनुमति आपके ब्राउज़र में सुरक्षित रूप से संसाधित होती है। आप मैन्युअल रूप से भी बैच कोड दर्ज कर सकते हैं।',
    
    passportTitle: 'डिजिटल हनी पासपोर्ट',
    passportSubtitle: 'सार्वजनिक प्रामाणिकता एवं गुणवत्ता प्रमाण पत्र',
    passportBatch: 'बैच कोड',
    passportProvenanceModel: 'उत्पादन मॉडल',
    passportStatusVerified: 'प्रमाणित प्रामाणिक',
    passportStatusFlagged: 'विसंगति दर्ज',
    passportOriginApiary: 'उद्गम फार्म',
    passportFloralSource: 'पुष्प स्रोत',
    passportVolume: 'बैच मात्रा',
    passportEvidenceScore: 'गुणवत्ता स्कोर',
    passportTimelineTitle: 'प्रमाणित आपूर्ति श्रृंखला समयरेखा',
    passportStageHarvest: '1. फार्म शहद कटाई एवं पंजीकरण',
    passportStageProcessing: '2. सौम्य प्राकृतिक निष्कर्षण',
    passportStageTransport: '3. तापमान नियंत्रित कोल्ड परिवहन',
    passportStagePackaging: '4. सुरक्षित पैकेजिंग एवं QR जारी',
    passportBeekeeperProfile: 'प्रमाणित मधुमक्खी पालक',
    passportCompanyProfile: 'प्रबंधक कंपनी',
    passportPillarBlockchain: 'कस्टडी एवं उद्गम रिकॉर्ड',
    passportPillarAi: 'मात्रा एवं उत्पादन ऑडिट',
    passportPillarLab: 'मान्यता प्राप्त लैब रासायनिक जांच',
    passportDisclaimer: 'अस्वीकरण: यह प्रमाण पत्र सत्यापित कटाई उद्गम, प्रलेखित कस्टडी रिकॉर्ड और राष्ट्रीय खाद्य सुरक्षा मानकों (FSSAI/Codex Alimentarius) के अनुरूप लैब रिपोर्ट की पुष्टि करता है।',
    passportPending: 'प्रक्रिया जारी है',
    passportConfirmed: 'सत्यापित एवं प्रमाणित',
    
    roleAdmin: 'सिस्टम प्रशासक',
    roleBeekeeper: 'पंजीकृत मधुमक्खी पालक',
    roleProcessor: 'प्रसंस्करण केंद्र',
    roleTransporter: 'लॉजिस्टिक्स ट्रांसपोर्टर',
    rolePackager: 'पैकेजिंग केंद्र',
    roleQualityLab: 'मान्यता प्राप्त लैब',
    roleConsumer: 'सार्वजनिक उपभोक्ता',
    
    footerRights: 'सर्वाधिकार सुरक्षित। हनी चेन शुद्धता एवं उद्गम नेटवर्क।',
    footerHonestClaim: 'हनी चेन पारदर्शी उपभोक्ता विश्वास के लिए शहद के उद्गम, आपूर्ति श्रृंखला और लैब रिपोर्ट को प्रमाणित करता है।'
  }
};
