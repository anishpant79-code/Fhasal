
import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
    Sprout,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    KeyRound,
    Globe,
} from 'lucide-react'

import { useSettings } from '../../context/SettingsContext'
import API from '../../services/api'
import FhasalMark from '../../assets/logos/fhasal-mark.svg'
import LanguageSelector from '../../components/common/LanguageSelector'

const resetTranslations = {
    en: {
        selectLanguage: 'Select language',
        platform: 'SMART FARMING PLATFORM',
        title: 'Secure your account.',
        titleAccent: 'Start fresh.',
        description: 'Create a strong new password to keep your farming information and account protected.',
        requirement1: 'Use at least 8 characters',
        requirement2: 'Include uppercase and lowercase letters',
        requirement3: 'Add at least one number',
        security: 'Your security matters to us.',
        backLogin: 'Back to login',
        heading: 'Reset password',
        subtitle: 'Choose a new password for your Fhasal account. Make sure it is strong and easy for you to remember.',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
        passwordPlaceholder: 'Enter new password',
        confirmPlaceholder: 'Confirm new password',
        requirements: 'Password requirements',
        reset: 'Reset password',
        resetting: 'Resetting...',
        validated: 'Password reset successful!',
        success: 'Your password has been changed successfully. You can now log in with your new password.',
        continueLogin: 'Continue to login',
        required: 'Please fill in both password fields.',
        minLength: 'Your password must contain at least 8 characters.',
        uppercase: 'Include at least one uppercase letter.',
        lowercase: 'Include at least one lowercase letter.',
        number: 'Include at least one number.',
        mismatch: 'Your passwords do not match.',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        showConfirm: 'Show confirm password',
        hideConfirm: 'Hide confirm password',
        copyright: 'All rights reserved.',
        rule1: 'At least 8 characters',
        rule2: 'One uppercase and one lowercase letter',
        rule3: 'At least one number',
        invalidToken: 'Password reset link is missing or invalid.',
        failed: 'Unable to reset password. Please request a new reset link.',
    },

    hi: {
        selectLanguage: 'भाषा चुनें',
        platform: 'स्मार्ट कृषि प्लेटफ़ॉर्म',
        title: 'अपना खाता सुरक्षित रखें।',
        titleAccent: 'नई शुरुआत करें।',
        description: 'अपनी कृषि जानकारी और खाते को सुरक्षित रखने के लिए एक मजबूत नया पासवर्ड बनाएँ।',
        requirement1: 'कम से कम 8 अक्षर रखें',
        requirement2: 'बड़े और छोटे अक्षरों का उपयोग करें',
        requirement3: 'कम से कम एक संख्या जोड़ें',
        security: 'आपकी सुरक्षा हमारे लिए महत्वपूर्ण है।',
        backLogin: 'लॉगिन पर वापस जाएँ',
        heading: 'पासवर्ड रीसेट करें',
        subtitle: 'अपने Fhasal खाते के लिए नया पासवर्ड चुनें। इसे मजबूत और याद रखने में आसान रखें।',
        newPassword: 'नया पासवर्ड',
        confirmPassword: 'नए पासवर्ड की पुष्टि करें',
        passwordPlaceholder: 'नया पासवर्ड दर्ज करें',
        confirmPlaceholder: 'नया पासवर्ड दोबारा दर्ज करें',
        requirements: 'पासवर्ड की आवश्यकताएँ',
        reset: 'पासवर्ड रीसेट करें',
        resetting: 'रीसेट हो रहा है...',
        validated: 'पासवर्ड सफलतापूर्वक रीसेट हुआ!',
        success: 'आपका पासवर्ड सफलतापूर्वक बदल दिया गया है। अब आप नए पासवर्ड से लॉगिन कर सकते हैं।',
        continueLogin: 'लॉगिन पर जाएँ',
        required: 'कृपया दोनों पासवर्ड फ़ील्ड भरें।',
        minLength: 'पासवर्ड में कम से कम 8 अक्षर होने चाहिए।',
        uppercase: 'कम से कम एक बड़ा अक्षर शामिल करें।',
        lowercase: 'कम से कम एक छोटा अक्षर शामिल करें।',
        number: 'कम से कम एक संख्या शामिल करें।',
        mismatch: 'दोनों पासवर्ड मेल नहीं खाते।',
        showPassword: 'पासवर्ड दिखाएँ',
        hidePassword: 'पासवर्ड छिपाएँ',
        showConfirm: 'पुष्टि पासवर्ड दिखाएँ',
        hideConfirm: 'पुष्टि पासवर्ड छिपाएँ',
        copyright: 'सर्वाधिकार सुरक्षित।',
        rule1: 'कम से कम 8 अक्षर',
        rule2: 'एक बड़ा और एक छोटा अक्षर',
        rule3: 'कम से कम एक संख्या',
        invalidToken: 'पासवर्ड रीसेट लिंक अनुपलब्ध या अमान्य है।',
        failed: 'पासवर्ड रीसेट नहीं हो सका। कृपया नया रीसेट लिंक प्राप्त करें।',
    },

    kn: {
        selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        platform: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ',
        title: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಿ.',
        titleAccent: 'ಹೊಸ ಆರಂಭ ಮಾಡಿ.',
        description: 'ನಿಮ್ಮ ಕೃಷಿ ಮಾಹಿತಿ ಮತ್ತು ಖಾತೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಲು ಬಲವಾದ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ.',
        requirement1: 'ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳನ್ನು ಬಳಸಿ',
        requirement2: 'ದೊಡ್ಡ ಮತ್ತು ಸಣ್ಣ ಅಕ್ಷರಗಳನ್ನು ಸೇರಿಸಿ',
        requirement3: 'ಕನಿಷ್ಠ ಒಂದು ಸಂಖ್ಯೆಯನ್ನು ಸೇರಿಸಿ',
        security: 'ನಿಮ್ಮ ಸುರಕ್ಷತೆ ನಮಗೆ ಮುಖ್ಯ.',
        backLogin: 'ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ',
        heading: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
        subtitle: 'ನಿಮ್ಮ Fhasal ಖಾತೆಗೆ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ. ಅದು ಬಲವಾಗಿದ್ದು ನೆನಪಿಡಲು ಸುಲಭವಾಗಿರಲಿ.',
        newPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
        confirmPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
        passwordPlaceholder: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
        confirmPlaceholder: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತೆ ನಮೂದಿಸಿ',
        requirements: 'ಪಾಸ್‌ವರ್ಡ್ ಅವಶ್ಯಕತೆಗಳು',
        reset: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
        resetting: 'ಮರುಹೊಂದಿಸಲಾಗುತ್ತಿದೆ...',
        validated: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!',
        success: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ. ಈಗ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಲಾಗಿನ್ ಮಾಡಬಹುದು.',
        continueLogin: 'ಲಾಗಿನ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ',
        required: 'ದಯವಿಟ್ಟು ಎರಡೂ ಪಾಸ್‌ವರ್ಡ್ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
        minLength: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.',
        uppercase: 'ಕನಿಷ್ಠ ಒಂದು ದೊಡ್ಡ ಅಕ್ಷರ ಸೇರಿಸಿ.',
        lowercase: 'ಕನಿಷ್ಠ ಒಂದು ಸಣ್ಣ ಅಕ್ಷರ ಸೇರಿಸಿ.',
        number: 'ಕನಿಷ್ಠ ಒಂದು ಸಂಖ್ಯೆಯನ್ನು ಸೇರಿಸಿ.',
        mismatch: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',
        showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
        hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
        showConfirm: 'ದೃಢೀಕರಣ ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
        hideConfirm: 'ದೃಢೀಕರಣ ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
        copyright: 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
        rule1: 'ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು',
        rule2: 'ಒಂದು ದೊಡ್ಡ ಮತ್ತು ಒಂದು ಸಣ್ಣ ಅಕ್ಷರ',
        rule3: 'ಕನಿಷ್ಠ ಒಂದು ಸಂಖ್ಯೆ',
        invalidToken: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಇಲ್ಲ ಅಥವಾ ಅಮಾನ್ಯವಾಗಿದೆ.',
        failed: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೊಸ ಲಿಂಕ್ ಪಡೆಯಿರಿ.',
    },

    mr: {
        selectLanguage: 'भाषा निवडा',
        platform: 'स्मार्ट शेती प्लॅटफॉर्म',
        title: 'तुमचे खाते सुरक्षित ठेवा.',
        titleAccent: 'नवीन सुरुवात करा.',
        description: 'तुमची शेतीविषयक माहिती आणि खाते सुरक्षित ठेवण्यासाठी मजबूत नवीन पासवर्ड तयार करा.',
        requirement1: 'किमान 8 अक्षरे वापरा',
        requirement2: 'मोठी आणि लहान अक्षरे समाविष्ट करा',
        requirement3: 'किमान एक अंक जोडा',
        security: 'तुमची सुरक्षा आमच्यासाठी महत्त्वाची आहे.',
        backLogin: 'लॉगिनवर परत जा',
        heading: 'पासवर्ड रीसेट करा',
        subtitle: 'तुमच्या Fhasal खात्यासाठी नवीन पासवर्ड निवडा. तो मजबूत आणि लक्षात ठेवण्यास सोपा असावा.',
        newPassword: 'नवीन पासवर्ड',
        confirmPassword: 'नवीन पासवर्डची पुष्टी करा',
        passwordPlaceholder: 'नवीन पासवर्ड टाका',
        confirmPlaceholder: 'नवीन पासवर्ड पुन्हा टाका',
        requirements: 'पासवर्डच्या आवश्यकता',
        reset: 'पासवर्ड रीसेट करा',
        resetting: 'रीसेट होत आहे...',
        validated: 'पासवर्ड यशस्वीरित्या रीसेट झाला!',
        success: 'तुमचा पासवर्ड यशस्वीरित्या बदलला आहे. आता नवीन पासवर्ड वापरून लॉगिन करू शकता.',
        continueLogin: 'लॉगिन सुरू ठेवा',
        required: 'कृपया दोन्ही पासवर्ड फील्ड भरा.',
        minLength: 'पासवर्डमध्ये किमान 8 अक्षरे असणे आवश्यक आहे.',
        uppercase: 'किमान एक मोठे अक्षर समाविष्ट करा.',
        lowercase: 'किमान एक लहान अक्षर समाविष्ट करा.',
        number: 'किमान एक अंक समाविष्ट करा.',
        mismatch: 'दोन्ही पासवर्ड जुळत नाहीत.',
        showPassword: 'पासवर्ड दाखवा',
        hidePassword: 'पासवर्ड लपवा',
        showConfirm: 'पुष्टी पासवर्ड दाखवा',
        hideConfirm: 'पुष्टी पासवर्ड लपवा',
        copyright: 'सर्व हक्क राखीव.',
        rule1: 'किमान 8 अक्षरे',
        rule2: 'एक मोठे आणि एक लहान अक्षर',
        rule3: 'किमान एक अंक',
        invalidToken: 'पासवर्ड रीसेट लिंक उपलब्ध नाही किंवा अवैध आहे.',
        failed: 'पासवर्ड रीसेट करता आला नाही. कृपया नवीन लिंक मिळवा.',
    },

    te: {
        selectLanguage: 'భాషను ఎంచుకోండి',
        platform: 'స్మార్ట్ వ్యవసాయ వేదిక',
        title: 'మీ ఖాతాను సురక్షితం చేయండి.',
        titleAccent: 'కొత్తగా ప్రారంభించండి.',
        description: 'మీ వ్యవసాయ సమాచారం మరియు ఖాతాను రక్షించడానికి బలమైన కొత్త పాస్‌వర్డ్‌ను సృష్టించండి.',
        requirement1: 'కనీసం 8 అక్షరాలను ఉపయోగించండి',
        requirement2: 'పెద్ద మరియు చిన్న అక్షరాలను చేర్చండి',
        requirement3: 'కనీసం ఒక సంఖ్యను జోడించండి',
        security: 'మీ భద్రత మాకు ముఖ్యం.',
        backLogin: 'లాగిన్‌కు తిరిగి వెళ్లండి',
        heading: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
        subtitle: 'మీ Fhasal ఖాతా కోసం కొత్త పాస్‌వర్డ్‌ను ఎంచుకోండి. అది బలంగా మరియు గుర్తుంచుకోవడానికి సులభంగా ఉండాలి.',
        newPassword: 'కొత్త పాస్‌వర్డ్',
        confirmPassword: 'కొత్త పాస్‌వర్డ్ నిర్ధారించండి',
        passwordPlaceholder: 'కొత్త పాస్‌వర్డ్ నమోదు చేయండి',
        confirmPlaceholder: 'కొత్త పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి',
        requirements: 'పాస్‌వర్డ్ అవసరాలు',
        reset: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
        resetting: 'రీసెట్ చేస్తోంది...',
        validated: 'పాస్‌వర్డ్ విజయవంతంగా రీసెట్ చేయబడింది!',
        success: 'మీ పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది. ఇప్పుడు కొత్త పాస్‌వర్డ్‌తో లాగిన్ చేయవచ్చు.',
        continueLogin: 'లాగిన్‌కు కొనసాగండి',
        required: 'దయచేసి రెండు పాస్‌వర్డ్ ఫీల్డ్‌లను పూరించండి.',
        minLength: 'పాస్‌వర్డ్‌లో కనీసం 8 అక్షరాలు ఉండాలి.',
        uppercase: 'కనీసం ఒక పెద్ద అక్షరాన్ని చేర్చండి.',
        lowercase: 'కనీసం ఒక చిన్న అక్షరాన్ని చేర్చండి.',
        number: 'కనీసం ఒక సంఖ్యను చేర్చండి.',
        mismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.',
        showPassword: 'పాస్‌వర్డ్ చూపించు',
        hidePassword: 'పాస్‌వర్డ్ దాచు',
        showConfirm: 'నిర్ధారణ పాస్‌వర్డ్ చూపించు',
        hideConfirm: 'నిర్ధారణ పాస్‌వర్డ్ దాచు',
        copyright: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.',
        rule1: 'కనీసం 8 అక్షరాలు',
        rule2: 'ఒక పెద్ద అక్షరం మరియు ఒక చిన్న అక్షరం',
        rule3: 'కనీసం ఒక సంఖ్య',
        invalidToken: 'పాస్‌వర్డ్ రీసెట్ లింక్ లేదు లేదా చెల్లదు.',
        failed: 'పాస్‌వర్డ్ రీసెట్ చేయడం సాధ్యం కాలేదు. దయచేసి కొత్త లింక్ పొందండి.',
    },

    ta: {
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
        platform: 'ஸ்மார்ட் விவசாயத் தளம்',
        title: 'உங்கள் கணக்கைப் பாதுகாக்கவும்.',
        titleAccent: 'புதிய தொடக்கத்தை உருவாக்குங்கள்.',
        description: 'உங்கள் விவசாயத் தகவல்களையும் கணக்கையும் பாதுகாக்க வலுவான புதிய கடவுச்சொல்லை உருவாக்குங்கள்.',
        requirement1: 'குறைந்தது 8 எழுத்துகளைப் பயன்படுத்தவும்',
        requirement2: 'பெரிய மற்றும் சிறிய எழுத்துகளைச் சேர்க்கவும்',
        requirement3: 'குறைந்தது ஒரு எண்ணைச் சேர்க்கவும்',
        security: 'உங்கள் பாதுகாப்பு எங்களுக்கு முக்கியம்.',
        backLogin: 'உள்நுழைவுக்குத் திரும்புங்கள்',
        heading: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
        subtitle: 'உங்கள் Fhasal கணக்கிற்குப் புதிய கடவுச்சொல்லைத் தேர்ந்தெடுக்கவும். அது வலுவாகவும் நினைவில் வைத்துக்கொள்ள எளிதாகவும் இருக்க வேண்டும்.',
        newPassword: 'புதிய கடவுச்சொல்',
        confirmPassword: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
        passwordPlaceholder: 'புதிய கடவுச்சொல்லை உள்ளிடவும்',
        confirmPlaceholder: 'புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
        requirements: 'கடவுச்சொல் தேவைகள்',
        reset: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
        resetting: 'மீட்டமைக்கப்படுகிறது...',
        validated: 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!',
        success: 'உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது. இப்போது புதிய கடவுச்சொல்லைப் பயன்படுத்தி உள்நுழையலாம்.',
        continueLogin: 'உள்நுழைவுக்குத் தொடரவும்',
        required: 'இரண்டு கடவுச்சொல் புலங்களையும் நிரப்பவும்.',
        minLength: 'கடவுச்சொல்லில் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.',
        uppercase: 'குறைந்தது ஒரு பெரிய எழுத்தைச் சேர்க்கவும்.',
        lowercase: 'குறைந்தது ஒரு சிறிய எழுத்தைச் சேர்க்கவும்.',
        number: 'குறைந்தது ஒரு எண்ணைச் சேர்க்கவும்.',
        mismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை.',
        showPassword: 'கடவுச்சொல்லைக் காட்டவும்',
        hidePassword: 'கடவுச்சொல்லை மறைக்கவும்',
        showConfirm: 'உறுதிப்படுத்தும் கடவுச்சொல்லைக் காட்டவும்',
        hideConfirm: 'உறுதிப்படுத்தும் கடவுச்சொல்லை மறைக்கவும்',
        copyright: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
        rule1: 'குறைந்தது 8 எழுத்துகள்',
        rule2: 'ஒரு பெரிய எழுத்து மற்றும் ஒரு சிறிய எழுத்து',
        rule3: 'குறைந்தது ஒரு எண்',
        invalidToken: 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு இல்லை அல்லது தவறானது.',
        failed: 'கடவுச்சொல்லை மீட்டமைக்க முடியவில்லை. புதிய இணைப்பைக் கோரவும்.',
    },

    bn: {
        selectLanguage: 'ভাষা নির্বাচন করুন',
        platform: 'স্মার্ট কৃষি প্ল্যাটফর্ম',
        title: 'আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।',
        titleAccent: 'নতুনভাবে শুরু করুন।',
        description: 'আপনার কৃষি সংক্রান্ত তথ্য এবং অ্যাকাউন্ট সুরক্ষিত রাখতে একটি শক্তিশালী নতুন পাসওয়ার্ড তৈরি করুন।',
        requirement1: 'কমপক্ষে ৮টি অক্ষর ব্যবহার করুন',
        requirement2: 'বড় ও ছোট হাতের অক্ষর রাখুন',
        requirement3: 'কমপক্ষে একটি সংখ্যা যোগ করুন',
        security: 'আপনার নিরাপত্তা আমাদের কাছে গুরুত্বপূর্ণ।',
        backLogin: 'লগইনে ফিরে যান',
        heading: 'পাসওয়ার্ড রিসেট করুন',
        subtitle: 'আপনার Fhasal অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড বেছে নিন। এটি শক্তিশালী এবং মনে রাখা সহজ হওয়া উচিত।',
        newPassword: 'নতুন পাসওয়ার্ড',
        confirmPassword: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
        passwordPlaceholder: 'নতুন পাসওয়ার্ড লিখুন',
        confirmPlaceholder: 'নতুন পাসওয়ার্ড আবার লিখুন',
        requirements: 'পাসওয়ার্ডের শর্তাবলী',
        reset: 'পাসওয়ার্ড রিসেট করুন',
        resetting: 'রিসেট করা হচ্ছে...',
        validated: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!',
        success: 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।',
        continueLogin: 'লগইনে এগিয়ে যান',
        required: 'অনুগ্রহ করে দুটি পাসওয়ার্ডের ঘর পূরণ করুন।',
        minLength: 'পাসওয়ার্ডে কমপক্ষে ৮টি অক্ষর থাকতে হবে।',
        uppercase: 'কমপক্ষে একটি বড় হাতের অক্ষর রাখুন।',
        lowercase: 'কমপক্ষে একটি ছোট হাতের অক্ষর রাখুন।',
        number: 'কমপক্ষে একটি সংখ্যা যোগ করুন।',
        mismatch: 'পাসওয়ার্ড দুটি মিলছে না।',
        showPassword: 'পাসওয়ার্ড দেখান',
        hidePassword: 'পাসওয়ার্ড লুকান',
        showConfirm: 'নিশ্চিতকরণ পাসওয়ার্ড দেখান',
        hideConfirm: 'নিশ্চিতকরণ পাসওয়ার্ড লুকান',
        copyright: 'সর্বস্বত্ব সংরক্ষিত।',
        rule1: 'কমপক্ষে ৮টি অক্ষর',
        rule2: 'একটি বড় ও একটি ছোট হাতের অক্ষর',
        rule3: 'কমপক্ষে একটি সংখ্যা',
        invalidToken: 'পাসওয়ার্ড রিসেট লিঙ্ক নেই বা অবৈধ।',
        failed: 'পাসওয়ার্ড রিসেট করা যায়নি। অনুগ্রহ করে নতুন লিঙ্ক নিন।',
    },
}

const ResetPassword = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const { settings, updateLanguage, supportedLanguages = [] } = useSettings()

    const languageCode = settings?.languageCode || 'en'
    const language = resetTranslations[languageCode] || resetTranslations.en

    const t = (key) => language[key] || resetTranslations.en[key] || key

    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isSubmitting) return

        setError('')

        if (!token) {
            setError(t('invalidToken'))
            return
        }

        if (!password || !confirmPassword) {
            setError(t('required'))
            return
        }

        if (password.length < 8) {
            setError(t('minLength'))
            return
        }

        if (!/[A-Z]/.test(password)) {
            setError(t('uppercase'))
            return
        }

        if (!/[a-z]/.test(password)) {
            setError(t('lowercase'))
            return
        }

        if (!/[0-9]/.test(password)) {
            setError(t('number'))
            return
        }

        if (password !== confirmPassword) {
            setError(t('mismatch'))
            return
        }

        try {
            setIsSubmitting(true)

            const response = await API.post('/auth/reset-password', {
                token,
                password,
            })

            if (response.data?.success === false) {
                throw new Error(response.data.message || t('failed'))
            }

            setSuccess(true)
            setPassword('')
            setConfirmPassword('')
        } catch (error) {
            console.error('Password reset error:', error)

            setError(
                error.response?.data?.message ||
                error.message ||
                t('failed')
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-[#F5F8F4] flex">

            {/* Left branding panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#347052] text-white relative overflow-hidden flex-col justify-between p-12 xl:p-16">

                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
                <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-white/5" />

                <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
                    <div className="w-12 h-12 bg-white rounded-2xl p-2 flex items-center justify-center shadow-md">
                        <img src={FhasalMark} alt="Fhasal logo" className="w-full h-full object-contain" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Fhasal</h1>
                        <p className="text-xs text-white/75 tracking-wider">
                            {t('platform')}
                        </p>
                    </div>
                </Link>

                <div className="relative z-10 max-w-lg">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                        <KeyRound className="w-9 h-9 text-white" />
                    </div>

                    <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                        {t('title')}
                        <span className="block text-[#D6E8C9]">
                            {t('titleAccent')}
                        </span>
                    </h2>

                    <p className="text-white/80 text-lg leading-relaxed">
                        {t('description')}
                    </p>

                    <div className="mt-10 space-y-4">
                        {[t('requirement1'), t('requirement2'), t('requirement3')].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#D6E8C9]" />
                                <span className="text-sm text-white/90">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-sm text-white/65">
                    <ShieldCheck className="w-5 h-5" />
                    {t('security')}
                </div>
            </div>

            {/* Right form section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8">
                <div className="w-full max-w-md">

                    {/* Mobile branding */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
                        <img src={FhasalMark} alt="Fhasal logo" className="w-9 h-9 object-contain" />

                        <div>
                            <h1 className="text-xl font-bold text-[#28563D]">Fhasal</h1>
                            <p className="text-[10px] text-gray-500 tracking-wider">
                                {t('platform')}
                            </p>
                        </div>
                    </Link>

                    {/* Language selector */}
                    <div className="flex justify-end mb-6">
                        <LanguageSelector />
                    </div>

                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#347052] mb-8 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('backLogin')}
                    </Link>

                    <div className="mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#E5F0E7] flex items-center justify-center mb-6">
                            <Lock className="w-7 h-7 text-[#347052]" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            {t('heading')}
                        </h2>

                        <p className="text-gray-500 leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    {success ? (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-7 h-7 text-green-600" />
                            </div>

                            <h3 className="text-lg font-bold text-green-800 mb-2">
                                {t('validated')}
                            </h3>

                            <p className="text-sm text-green-700 leading-relaxed mb-6">
                                {t('success')}
                            </p>

                            <button
                                type="button"
                                onClick={handleGoToLogin}
                                className="w-full bg-[#347052] hover:bg-[#28563D] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                            >
                                {t('continueLogin')}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* New password */}
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    {t('newPassword')}
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                    <input
                                        id="newPassword"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setError('')
                                        }}
                                        placeholder={t('passwordPlaceholder')}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10 transition disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#347052]"
                                        aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    {t('confirmPassword')}
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            setError('')
                                        }}
                                        placeholder={t('confirmPlaceholder')}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-[#347052] focus:ring-2 focus:ring-[#347052]/10 transition disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#347052]"
                                        aria-label={showConfirmPassword ? t('hideConfirm') : t('showConfirm')}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password requirements */}
                            <div className="rounded-xl bg-[#F0F5EF] p-4">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                    {t('requirements')}
                                </p>

                                <ul className="space-y-1.5 text-xs text-gray-500">
                                    <li>• {t('rule1')}</li>
                                    <li>• {t('rule2')}</li>
                                    <li>• {t('rule3')}</li>
                                </ul>
                            </div>

                            {/* Error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || !token}
                                className="w-full bg-[#347052] hover:bg-[#28563D] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? t('resetting') : t('reset')}
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </button>

                            {!token && (
                                <p className="text-sm text-red-600 text-center" role="alert">
                                    {t('invalidToken')}
                                </p>
                            )}
                        </form>
                    )}

                    <p className="text-center text-xs text-gray-400 mt-10">
                        © {new Date().getFullYear()} Fhasal. {t('copyright')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
