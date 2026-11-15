
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Sprout,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Leaf,
    ShieldCheck,
    CheckCircle2,
    Globe,
} from 'lucide-react'

import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'

const signupTranslations = {
    en: {
        selectLanguage: 'Select language',
        community: 'Join the Farming Community',
        title1: 'Your farm.',
        title2: 'Your future.',
        title3: 'Our technology.',
        description: 'Create your Fhasal account and start managing your agricultural journey with smarter tools, useful insights and digital farm management.',
        manageFields: 'Manage your fields',
        manageDescription: 'Keep your farming information organized.',
        decisions: 'Make informed decisions',
        decisionsDescription: 'Explore farming insights and recommendations.',
        getStarted: 'GET STARTED',
        heading: 'Create your account',
        subtitle: 'Join Fhasal and start your smart farming journey.',
        name: 'Full name',
        namePlaceholder: 'Enter your full name',
        phone: 'Phone number',
        phonePlaceholder: '10-digit mobile number',
        email: 'Email address',
        emailPlaceholder: 'Enter your email',
        password: 'Password',
        passwordPlaceholder: 'Create a password',
        passwordHint: 'At least 8 characters, including uppercase, lowercase and a number.',
        confirmPassword: 'Confirm password',
        confirmPlaceholder: 'Re-enter your password',
        termsStart: 'I agree to the',
        terms: 'Terms and Conditions',
        privacy: 'and Privacy Policy.',
        createAccount: 'Create account',
        creatingAccount: 'Creating account...',
        alreadyAccount: 'Already have an account?',
        signIn: 'Sign in',
        backHome: '← Back to home',
        required: 'Please fill in all the required fields.',
        invalidEmail: 'Please enter a valid email address.',
        invalidPhone: 'Please enter a valid 10-digit phone number.',
        shortPassword: 'Password must contain at least 8 characters.',
        weakPassword: 'Password must include uppercase, lowercase and a number.',
        mismatch: 'Passwords do not match.',
        acceptTerms: 'Please accept the Terms and Conditions.',
        success: 'Account created successfully!',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        signupError: 'Registration failed. Please try again.',
    },

    hi: {
        selectLanguage: 'भाषा चुनें',
        community: 'किसान समुदाय से जुड़ें',
        title1: 'आपका खेत।',
        title2: 'आपका भविष्य।',
        title3: 'हमारी तकनीक।',
        description: 'अपना Fhasal खाता बनाएँ और स्मार्ट कृषि उपकरणों तथा उपयोगी जानकारी के साथ अपनी खेती का प्रबंधन शुरू करें।',
        manageFields: 'अपने खेतों का प्रबंधन करें',
        manageDescription: 'खेती की जानकारी व्यवस्थित रखें।',
        decisions: 'सही निर्णय लें',
        decisionsDescription: 'कृषि जानकारी और सुझाव देखें।',
        getStarted: 'शुरू करें',
        heading: 'अपना खाता बनाएँ',
        subtitle: 'Fhasal से जुड़ें और स्मार्ट खेती शुरू करें।',
        name: 'पूरा नाम',
        namePlaceholder: 'अपना पूरा नाम दर्ज करें',
        phone: 'फ़ोन नंबर',
        phonePlaceholder: '10 अंकों का मोबाइल नंबर',
        email: 'ईमेल पता',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        password: 'पासवर्ड',
        passwordPlaceholder: 'पासवर्ड बनाएँ',
        passwordHint: 'कम से कम 8 अक्षर, जिसमें बड़े और छोटे अक्षर तथा एक संख्या हो।',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        confirmPlaceholder: 'पासवर्ड दोबारा दर्ज करें',
        termsStart: 'मैं सहमत हूँ',
        terms: 'नियम और शर्तें',
        privacy: 'और गोपनीयता नीति।',
        createAccount: 'खाता बनाएँ',
        creatingAccount: 'खाता बनाया जा रहा है...',
        alreadyAccount: 'क्या आपका पहले से खाता है?',
        signIn: 'लॉग इन करें',
        backHome: '← होम पर वापस जाएँ',
        required: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
        invalidEmail: 'कृपया सही ईमेल पता दर्ज करें।',
        invalidPhone: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।',
        shortPassword: 'पासवर्ड में कम से कम 8 अक्षर होने चाहिए।',
        weakPassword: 'पासवर्ड में बड़े अक्षर, छोटे अक्षर और एक संख्या होनी चाहिए।',
        mismatch: 'दोनों पासवर्ड मेल नहीं खाते।',
        acceptTerms: 'कृपया नियम और शर्तें स्वीकार करें।',
        success: 'खाता सफलतापूर्वक बनाया गया!',
        showPassword: 'पासवर्ड दिखाएँ',
        hidePassword: 'पासवर्ड छिपाएँ',
        signupError: 'पंजीकरण विफल हुआ। कृपया पुनः प्रयास करें।',
    },

    kn: {
        selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        community: 'ಕೃಷಿ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ',
        title1: 'ನಿಮ್ಮ ಹೊಲ.',
        title2: 'ನಿಮ್ಮ ಭವಿಷ್ಯ.',
        title3: 'ನಮ್ಮ ತಂತ್ರಜ್ಞಾನ.',
        description: 'ನಿಮ್ಮ Fhasal ಖಾತೆಯನ್ನು ರಚಿಸಿ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಸಾಧನಗಳು ಹಾಗೂ ಉಪಯುಕ್ತ ಮಾಹಿತಿಯೊಂದಿಗೆ ಕೃಷಿಯನ್ನು ನಿರ್ವಹಿಸಿ.',
        manageFields: 'ನಿಮ್ಮ ಹೊಲಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
        manageDescription: 'ನಿಮ್ಮ ಕೃಷಿ ಮಾಹಿತಿಯನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿಡಿ.',
        decisions: 'ಸರಿಯಾದ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ',
        decisionsDescription: 'ಕೃಷಿ ಮಾಹಿತಿ ಮತ್ತು ಶಿಫಾರಸುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
        getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
        heading: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ',
        subtitle: 'Fhasal ಸೇರಿ ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಪ್ರಯಾಣ ಆರಂಭಿಸಿ.',
        name: 'ಪೂರ್ಣ ಹೆಸರು',
        namePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
        phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
        phonePlaceholder: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
        email: 'ಇಮೇಲ್ ವಿಳಾಸ',
        emailPlaceholder: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
        password: 'ಪಾಸ್‌ವರ್ಡ್',
        passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ',
        passwordHint: 'ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು, ದೊಡ್ಡ ಮತ್ತು ಸಣ್ಣ ಅಕ್ಷರಗಳು ಹಾಗೂ ಒಂದು ಸಂಖ್ಯೆ ಇರಬೇಕು.',
        confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
        confirmPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತೆ ನಮೂದಿಸಿ',
        termsStart: 'ನಾನು ಒಪ್ಪುತ್ತೇನೆ',
        terms: 'ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು',
        privacy: 'ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಗೆ.',
        createAccount: 'ಖಾತೆ ರಚಿಸಿ',
        creatingAccount: 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...',
        alreadyAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
        signIn: 'ಲಾಗಿನ್ ಮಾಡಿ',
        backHome: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
        required: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
        invalidEmail: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.',
        invalidPhone: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
        shortPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.',
        weakPassword: 'ಪಾಸ್‌ವರ್ಡ್‌ನಲ್ಲಿ ದೊಡ್ಡ ಅಕ್ಷರ, ಸಣ್ಣ ಅಕ್ಷರ ಮತ್ತು ಸಂಖ್ಯೆ ಇರಬೇಕು.',
        mismatch: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',
        acceptTerms: 'ದಯವಿಟ್ಟು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ.',
        success: 'ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
        showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
        hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
        signupError: 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    },

    mr: {
        selectLanguage: 'भाषा निवडा',
        community: 'शेतकरी समुदायात सामील व्हा',
        title1: 'तुमचे शेत.',
        title2: 'तुमचे भविष्य.',
        title3: 'आमचे तंत्रज्ञान.',
        description: 'तुमचे Fhasal खाते तयार करा आणि स्मार्ट साधने व उपयुक्त माहितीच्या मदतीने शेतीचे व्यवस्थापन सुरू करा.',
        manageFields: 'तुमच्या शेतांचे व्यवस्थापन करा',
        manageDescription: 'शेतीविषयक माहिती व्यवस्थित ठेवा.',
        decisions: 'योग्य निर्णय घ्या',
        decisionsDescription: 'शेतीविषयक माहिती आणि शिफारसी पाहा.',
        getStarted: 'सुरू करा',
        heading: 'तुमचे खाते तयार करा',
        subtitle: 'Fhasal मध्ये सामील व्हा आणि स्मार्ट शेती सुरू करा.',
        name: 'पूर्ण नाव',
        namePlaceholder: 'तुमचे पूर्ण नाव टाका',
        phone: 'फोन नंबर',
        phonePlaceholder: '10 अंकी मोबाईल नंबर',
        email: 'ईमेल पत्ता',
        emailPlaceholder: 'तुमचा ईमेल टाका',
        password: 'पासवर्ड',
        passwordPlaceholder: 'पासवर्ड तयार करा',
        passwordHint: 'किमान 8 अक्षरे, मोठी व लहान अक्षरे आणि एक अंक असावा.',
        confirmPassword: 'पासवर्डची पुष्टी करा',
        confirmPlaceholder: 'पासवर्ड पुन्हा टाका',
        termsStart: 'मी सहमत आहे',
        terms: 'नियम आणि अटी',
        privacy: 'आणि गोपनीयता धोरण.',
        createAccount: 'खाते तयार करा',
        creatingAccount: 'खाते तयार होत आहे...',
        alreadyAccount: 'तुमचे आधीच खाते आहे का?',
        signIn: 'लॉग इन करा',
        backHome: '← मुख्यपृष्ठावर परत जा',
        required: 'कृपया सर्व आवश्यक माहिती भरा.',
        invalidEmail: 'कृपया योग्य ईमेल पत्ता टाका.',
        invalidPhone: 'कृपया योग्य 10 अंकी मोबाईल नंबर टाका.',
        shortPassword: 'पासवर्डमध्ये किमान 8 अक्षरे असणे आवश्यक आहे.',
        weakPassword: 'पासवर्डमध्ये मोठी अक्षरे, लहान अक्षरे आणि एक अंक असावा.',
        mismatch: 'दोन्ही पासवर्ड जुळत नाहीत.',
        acceptTerms: 'कृपया नियम आणि अटी स्वीकारा.',
        success: 'खाते यशस्वीरित्या तयार झाले!',
        showPassword: 'पासवर्ड दाखवा',
        hidePassword: 'पासवर्ड लपवा',
        signupError: 'नोंदणी अयशस्वी झाली. पुन्हा प्रयत्न करा.',
    },

    te: {
        selectLanguage: 'భాషను ఎంచుకోండి',
        community: 'రైతుల సమాజంలో చేరండి',
        title1: 'మీ పొలం.',
        title2: 'మీ భవిష్యత్తు.',
        title3: 'మా సాంకేతికత.',
        description: 'మీ Fhasal ఖాతాను సృష్టించి స్మార్ట్ సాధనాలు మరియు ఉపయోగకరమైన సమాచారంతో మీ వ్యవసాయాన్ని నిర్వహించండి.',
        manageFields: 'మీ పొలాలను నిర్వహించండి',
        manageDescription: 'మీ వ్యవసాయ సమాచారాన్ని క్రమబద్ధంగా ఉంచండి.',
        decisions: 'సరైన నిర్ణయాలు తీసుకోండి',
        decisionsDescription: 'వ్యవసాయ సమాచారం మరియు సిఫార్సులను చూడండి.',
        getStarted: 'ప్రారంభించండి',
        heading: 'మీ ఖాతాను సృష్టించండి',
        subtitle: 'Fhasalలో చేరి మీ స్మార్ట్ వ్యవసాయ ప్రయాణాన్ని ప్రారంభించండి.',
        name: 'పూర్తి పేరు',
        namePlaceholder: 'మీ పూర్తి పేరును నమోదు చేయండి',
        phone: 'ఫోన్ నంబర్',
        phonePlaceholder: '10 అంకెల మొబైల్ నంబర్',
        email: 'ఈమెయిల్ చిరునామా',
        emailPlaceholder: 'మీ ఈమెయిల్ నమోదు చేయండి',
        password: 'పాస్‌వర్డ్',
        passwordPlaceholder: 'పాస్‌వర్డ్ సృష్టించండి',
        passwordHint: 'కనీసం 8 అక్షరాలు, పెద్ద అక్షరం, చిన్న అక్షరం మరియు ఒక సంఖ్య ఉండాలి.',
        confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
        confirmPlaceholder: 'పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి',
        termsStart: 'నేను అంగీకరిస్తున్నాను',
        terms: 'నిబంధనలు మరియు షరతులు',
        privacy: 'మరియు గోప్యతా విధానానికి.',
        createAccount: 'ఖాతా సృష్టించండి',
        creatingAccount: 'ఖాతా సృష్టించబడుతోంది...',
        alreadyAccount: 'మీకు ఇప్పటికే ఖాతా ఉందా?',
        signIn: 'లాగిన్ అవ్వండి',
        backHome: '← హోమ్‌కు తిరిగి వెళ్లండి',
        required: 'దయచేసి అవసరమైన అన్ని వివరాలను నమోదు చేయండి.',
        invalidEmail: 'దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.',
        invalidPhone: 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.',
        shortPassword: 'పాస్‌వర్డ్‌లో కనీసం 8 అక్షరాలు ఉండాలి.',
        weakPassword: 'పాస్‌వర్డ్‌లో పెద్ద అక్షరం, చిన్న అక్షరం మరియు సంఖ్య ఉండాలి.',
        mismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.',
        acceptTerms: 'దయచేసి నిబంధనలు మరియు షరతులను అంగీకరించండి.',
        success: 'ఖాతా విజయవంతంగా సృష్టించబడింది!',
        showPassword: 'పాస్‌వర్డ్ చూపించు',
        hidePassword: 'పాస్‌వర్డ్ దాచు',
        signupError: 'నమోదు విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    },

    ta: {
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
        community: 'விவசாய சமூகத்தில் இணையுங்கள்',
        title1: 'உங்கள் பண்ணை.',
        title2: 'உங்கள் எதிர்காலம்.',
        title3: 'எங்கள் தொழில்நுட்பம்.',
        description: 'உங்கள் Fhasal கணக்கை உருவாக்கி, சிறந்த கருவிகள் மற்றும் பயனுள்ள தகவல்களுடன் உங்கள் விவசாயத்தை நிர்வகிக்கத் தொடங்குங்கள்.',
        manageFields: 'உங்கள் வயல்களை நிர்வகிக்கவும்',
        manageDescription: 'உங்கள் விவசாயத் தகவல்களை ஒழுங்குபடுத்துங்கள்.',
        decisions: 'சரியான முடிவுகளை எடுங்கள்',
        decisionsDescription: 'விவசாயத் தகவல்களையும் பரிந்துரைகளையும் பாருங்கள்.',
        getStarted: 'தொடங்குங்கள்',
        heading: 'உங்கள் கணக்கை உருவாக்குங்கள்',
        subtitle: 'Fhasal-இல் இணைந்து உங்கள் ஸ்மார்ட் விவசாயப் பயணத்தைத் தொடங்குங்கள்.',
        name: 'முழுப் பெயர்',
        namePlaceholder: 'உங்கள் முழுப் பெயரை உள்ளிடவும்',
        phone: 'தொலைபேசி எண்',
        phonePlaceholder: '10 இலக்க கைபேசி எண்',
        email: 'மின்னஞ்சல் முகவரி',
        emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
        password: 'கடவுச்சொல்',
        passwordPlaceholder: 'கடவுச்சொல்லை உருவாக்கவும்',
        passwordHint: 'குறைந்தது 8 எழுத்துகள், பெரிய எழுத்து, சிறிய எழுத்து மற்றும் ஒரு எண் இருக்க வேண்டும்.',
        confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
        confirmPlaceholder: 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
        termsStart: 'நான் ஏற்கிறேன்',
        terms: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
        privacy: 'மற்றும் தனியுரிமைக் கொள்கை.',
        createAccount: 'கணக்கை உருவாக்குங்கள்',
        creatingAccount: 'கணக்கு உருவாக்கப்படுகிறது...',
        alreadyAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
        signIn: 'உள்நுழையுங்கள்',
        backHome: '← முகப்புக்குத் திரும்புங்கள்',
        required: 'தேவையான அனைத்து விவரங்களையும் நிரப்பவும்.',
        invalidEmail: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
        invalidPhone: 'சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்.',
        shortPassword: 'கடவுச்சொல்லில் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.',
        weakPassword: 'பெரிய எழுத்து, சிறிய எழுத்து மற்றும் ஒரு எண் இருக்க வேண்டும்.',
        mismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை.',
        acceptTerms: 'விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கவும்.',
        success: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!',
        showPassword: 'கடவுச்சொல்லைக் காட்டவும்',
        hidePassword: 'கடவுச்சொல்லை மறைக்கவும்',
        signupError: 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    },

    bn: {
        selectLanguage: 'ভাষা নির্বাচন করুন',
        community: 'কৃষক সম্প্রদায়ে যোগ দিন',
        title1: 'আপনার জমি।',
        title2: 'আপনার ভবিষ্যৎ।',
        title3: 'আমাদের প্রযুক্তি।',
        description: 'আপনার Fhasal অ্যাকাউন্ট তৈরি করুন এবং স্মার্ট সরঞ্জাম ও দরকারি তথ্যের সাহায্যে কৃষিকাজ পরিচালনা শুরু করুন।',
        manageFields: 'আপনার জমি পরিচালনা করুন',
        manageDescription: 'আপনার কৃষি সংক্রান্ত তথ্য গুছিয়ে রাখুন।',
        decisions: 'সঠিক সিদ্ধান্ত নিন',
        decisionsDescription: 'কৃষি সংক্রান্ত তথ্য ও সুপারিশ দেখুন।',
        getStarted: 'শুরু করুন',
        heading: 'আপনার অ্যাকাউন্ট তৈরি করুন',
        subtitle: 'Fhasal-এ যোগ দিন এবং স্মার্ট কৃষিযাত্রা শুরু করুন।',
        name: 'পুরো নাম',
        namePlaceholder: 'আপনার পুরো নাম লিখুন',
        phone: 'ফোন নম্বর',
        phonePlaceholder: '১০ সংখ্যার মোবাইল নম্বর',
        email: 'ইমেল ঠিকানা',
        emailPlaceholder: 'আপনার ইমেল লিখুন',
        password: 'পাসওয়ার্ড',
        passwordPlaceholder: 'একটি পাসওয়ার্ড তৈরি করুন',
        passwordHint: 'কমপক্ষে ৮টি অক্ষর, বড় হাতের অক্ষর, ছোট হাতের অক্ষর এবং একটি সংখ্যা থাকতে হবে।',
        confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
        confirmPlaceholder: 'আবার পাসওয়ার্ড লিখুন',
        termsStart: 'আমি সম্মত',
        terms: 'নিয়ম ও শর্তাবলীতে',
        privacy: 'এবং গোপনীয়তা নীতিতে।',
        createAccount: 'অ্যাকাউন্ট তৈরি করুন',
        creatingAccount: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
        alreadyAccount: 'আপনার কি ইতিমধ্যে অ্যাকাউন্ট আছে?',
        signIn: 'লগইন করুন',
        backHome: '← হোমে ফিরে যান',
        required: 'অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।',
        invalidEmail: 'অনুগ্রহ করে সঠিক ইমেল ঠিকানা লিখুন।',
        invalidPhone: 'অনুগ্রহ করে সঠিক ১০ সংখ্যার মোবাইল নম্বর লিখুন।',
        shortPassword: 'পাসওয়ার্ডে কমপক্ষে ৮টি অক্ষর থাকতে হবে।',
        weakPassword: 'পাসওয়ার্ডে বড় হাতের অক্ষর, ছোট হাতের অক্ষর এবং একটি সংখ্যা থাকতে হবে।',
        mismatch: 'পাসওয়ার্ড দুটি মিলছে না।',
        acceptTerms: 'অনুগ্রহ করে নিয়ম ও শর্তাবলী মেনে নিন।',
        success: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!',
        showPassword: 'পাসওয়ার্ড দেখান',
        hidePassword: 'পাসওয়ার্ড লুকান',
        signupError: 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    },
}

const Signup = () => {
    const { settings, updateLanguage, supportedLanguages } = useSettings()
    const { signup } = useAuth()
    const navigate = useNavigate()

    const languageCode = settings.languageCode || 'en'
    const language = signupTranslations[languageCode] || signupTranslations.en

    const t = (key) => language[key] || signupTranslations.en[key] || key

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }))

        setError('')
    }

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10)

        setFormData((previous) => ({
            ...previous,
            phone: value,
        }))

        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { name, phone, email, password, confirmPassword } = formData

        if (
            !name.trim() ||
            !phone.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError(t('required'))
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email.trim())) {
            setError(t('invalidEmail'))
            return
        }

        const phonePattern = /^[0-9]{10}$/

        if (!phonePattern.test(phone)) {
            setError(t('invalidPhone'))
            return
        }

        if (password.length < 8) {
            setError(t('shortPassword'))
            return
        }

        if (
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            setError(t('weakPassword'))
            return
        }

        if (password !== confirmPassword) {
            setError(t('mismatch'))
            return
        }

        if (!agreeTerms) {
            setError(t('acceptTerms'))
            return
        }

        try {
            setIsLoading(true)
            setError('')

            await signup({
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                password,
            })

            navigate('/dashboard', { replace: true })
        } catch (error) {
            console.error('Registration failed:', error)

            setError(
                error.response?.data?.message || t('signupError')
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F8F4] flex">

            {/* Left Branding Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#347052] relative overflow-hidden items-center justify-center p-12">

                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5" />
                <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-white/5" />

                <div className="relative z-10 max-w-lg text-white">

                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                            <Sprout size={30} className="text-[#347052]" />
                        </div>

                        <span className="text-3xl font-bold tracking-tight">
                            Fhasal
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-8">
                        <Leaf size={16} />
                        {t('community')}
                    </span>

                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        {t('title1')}
                        <br />
                        {t('title2')}
                        <br />
                        {t('title3')}
                    </h1>

                    <p className="text-white/80 text-lg leading-8 mb-12">
                        {t('description')}
                    </p>

                    <div className="space-y-5">

                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                                <CheckCircle2 size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    {t('manageFields')}
                                </h3>
                                <p className="text-sm text-white/70">
                                    {t('manageDescription')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                                <ShieldCheck size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    {t('decisions')}
                                </h3>
                                <p className="text-sm text-white/70">
                                    {t('decisionsDescription')}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-10">

                <div className="w-full max-w-md">

                    {/* Mobile Branding */}
                    <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
                        <div className="w-11 h-11 bg-[#347052] rounded-xl flex items-center justify-center">
                            <Sprout size={27} className="text-white" />
                        </div>

                        <span className="text-3xl font-bold text-[#347052]">
                            Fhasal
                        </span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex justify-end mb-7">
                        <div className="relative">
                            <Globe
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#347052] pointer-events-none"
                            />

                            <select
                                value={languageCode}
                                onChange={(e) => updateLanguage(e.target.value)}
                                aria-label={t('selectLanguage')}
                                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-[#347052]"
                            >
                                {supportedLanguages.map((languageOption) => (
                                    <option
                                        key={languageOption.code}
                                        value={languageOption.code}
                                    >
                                        {languageOption.nativeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-7">
                        <p className="text-sm font-semibold text-[#347052] mb-3">
                            {t('getStarted')}
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            {t('heading')}
                        </h2>

                        <p className="text-gray-500">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('name')}
                            </label>

                            <div className="relative">
                                <User
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder={t('namePlaceholder')}
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('phone')}
                            </label>

                            <div className="relative">
                                <Phone
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder={t('phonePlaceholder')}
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    autoComplete="tel"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('email')}
                            </label>

                            <div className="relative">
                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t('emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('password')}
                            </label>

                            <div className="relative">
                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('passwordPlaceholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#347052]"
                                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                {t('passwordHint')}
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                {t('confirmPassword')}
                            </label>

                            <div className="relative">
                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder={t('confirmPlaceholder')}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#347052] focus:ring-4 focus:ring-[#347052]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#347052]"
                                    aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => {
                                    setAgreeTerms(e.target.checked)
                                    setError('')
                                }}
                                className="w-4 h-4 mt-0.5 accent-[#347052]"
                            />

                            <span>
                                {t('termsStart')}{' '}
                                <Link
                                    to="/"
                                    className="font-semibold text-[#347052] hover:underline"
                                >
                                    {t('terms')}
                                </Link>
                                {' '}{t('privacy')}
                            </span>
                        </label>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#347052] hover:bg-[#28583F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-[#347052]/20 transition"
                        >
                            {isLoading ? t('creatingAccount') : t('createAccount')}

                            {!isLoading && <ArrowRight size={19} />}
                        </button>

                    </form>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-500 mt-7">
                        {t('alreadyAccount')}{' '}
                        <Link
                            to="/login"
                            className="font-bold text-[#347052] hover:underline"
                        >
                            {t('signIn')}
                        </Link>
                    </p>

                    {/* Home Link */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="text-sm text-gray-400 hover:text-[#347052] transition"
                        >
                            {t('backHome')}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Signup
