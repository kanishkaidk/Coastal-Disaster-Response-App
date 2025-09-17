"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌊 Seeding Coast-Kavach database...');
    // Create users
    const admin = await prisma.user.upsert({
        where: { phone: '+910000000001' },
        update: {},
        create: {
            phone: '+910000000001',
            name: 'Admin User',
            role: client_1.Role.admin,
            language: 'en'
        },
    });
    const marine = await prisma.user.upsert({
        where: { phone: '+910000000002' },
        update: {},
        create: {
            phone: '+910000000002',
            name: 'Marine Worker',
            role: client_1.Role.marine_worker,
            language: 'en'
        },
    });
    const analyst = await prisma.user.upsert({
        where: { phone: '+910000000003' },
        update: {},
        create: {
            phone: '+910000000003',
            name: 'Data Analyst',
            role: client_1.Role.analyst,
            language: 'en'
        },
    });
    const moderator = await prisma.user.upsert({
        where: { phone: '+910000000004' },
        update: {},
        create: {
            phone: '+910000000004',
            name: 'Community Moderator',
            role: client_1.Role.moderator,
            language: 'en'
        },
    });
    const citizen1 = await prisma.user.upsert({
        where: { phone: '+919876543210' },
        update: {},
        create: {
            phone: '+919876543210',
            name: 'Rajesh Kumar',
            role: client_1.Role.citizen,
            language: 'hi'
        },
    });
    const citizen2 = await prisma.user.upsert({
        where: { phone: '+919876543211' },
        update: {},
        create: {
            phone: '+919876543211',
            name: 'Priya Sharma',
            role: client_1.Role.citizen,
            language: 'en'
        },
    });
    const citizen3 = await prisma.user.upsert({
        where: { phone: '+919876543212' },
        update: {},
        create: {
            phone: '+919876543212',
            name: 'Amit Patel',
            role: client_1.Role.citizen,
            language: 'gu'
        },
    });
    console.log('✅ Users created');
    // Create forum posts
    const forumPost1 = await prisma.forumPost.create({
        data: {
            userId: citizen1.id,
            type: 'help',
            content: 'Need immediate help! My family is trapped in flood waters near Marina Beach. Water level is rising rapidly.',
            location: 'POINT(80.2707 13.0827)',
            urgencyScore: 95,
            language: 'en',
            trustScore: 85,
            aiStatus: 'ready',
            moderationFlags: [],
            rationale: { trustScore: { value: 85, explanation: 'High urgency, clear location, specific details' } },
            translations: {
                en: 'Need immediate help! My family is trapped in flood waters near Marina Beach. Water level is rising rapidly.',
                hi: 'तत्काल सहायता चाहिए! मेरा परिवार मरीना बीच के पास बाढ़ के पानी में फंसा हुआ है। पानी का स्तर तेजी से बढ़ रहा है।',
                ta: 'உடனடி உதவி தேவை! என் குடும்பம் மரீனா கடற்கரை அருகே வெள்ளத்தில் சிக்கியுள்ளது. நீர் மட்டம் வேகமாக உயர்ந்து வருகிறது.'
            },
            summary: {
                en: 'Urgent flood rescue needed near Marina Beach',
                hi: 'मरीना बीच के पास तत्काल बाढ़ बचाव आवश्यक',
                ta: 'மரீனா கடற்கரை அருகே அவசர வெள்ள மீட்பு தேவை'
            }
        }
    });
    const forumPost2 = await prisma.forumPost.create({
        data: {
            userId: citizen2.id,
            type: 'info',
            content: 'Cyclone warning issued for Chennai coast. Please stay indoors and avoid coastal areas.',
            location: 'POINT(80.2800 13.0900)',
            urgencyScore: 80,
            language: 'en',
            trustScore: 92,
            aiStatus: 'ready',
            moderationFlags: [],
            rationale: { trustScore: { value: 92, explanation: 'Official warning information, high credibility' } },
            translations: {
                en: 'Cyclone warning issued for Chennai coast. Please stay indoors and avoid coastal areas.',
                hi: 'चेन्नई तट के लिए चक्रवात चेतावनी जारी। कृपया घर के अंदर रहें और तटीय क्षेत्रों से बचें।',
                ta: 'சென்னை கடற்கரைக்கு சூறாவளி எச்சரிக்கை விடுக்கப்பட்டது. தயவுசெய்து உள்ளே இருங்கள் மற்றும் கடற்கரை பகுதிகளைத் தவிர்க்கவும்.'
            },
            summary: {
                en: 'Cyclone warning for Chennai coast - stay indoors',
                hi: 'चेन्नई तट के लिए चक्रवात चेतावनी - घर के अंदर रहें',
                ta: 'சென்னை கடற்கரைக்கு சூறாவளி எச்சரிக்கை - உள்ளே இருங்கள்'
            }
        }
    });
    const forumPost3 = await prisma.forumPost.create({
        data: {
            userId: citizen3.id,
            type: 'offer',
            content: 'I can provide food and water supplies to affected families in the area. Contact me at +919876543212',
            location: 'POINT(80.2600 13.0700)',
            urgencyScore: 60,
            language: 'en',
            trustScore: 75,
            aiStatus: 'ready',
            moderationFlags: [],
            rationale: { trustScore: { value: 75, explanation: 'Helpful offer, contact info provided' } },
            translations: {
                en: 'I can provide food and water supplies to affected families in the area. Contact me at +919876543212',
                hi: 'मैं क्षेत्र में प्रभावित परिवारों को भोजन और पानी की आपूर्ति प्रदान कर सकता हूं। मुझसे +919876543212 पर संपर्क करें',
                ta: 'நான் பாதிக்கப்பட்ட குடும்பங்களுக்கு உணவு மற்றும் நீர் வழங்கல்களை வழங்க முடியும். +919876543212 இல் என்னைத் தொடர்பு கொள்ளுங்கள்'
            },
            summary: {
                en: 'Offering food and water supplies to affected families',
                hi: 'प्रभावित परिवारों को भोजन और पानी की आपूर्ति की पेशकश',
                ta: 'பாதிக்கப்பட்ட குடும்பங்களுக்கு உணவு மற்றும் நீர் வழங்கல்களை வழங்குதல்'
            }
        }
    });
    console.log('✅ Forum posts created');
    // Create comments
    await prisma.forumComment.create({
        data: {
            postId: forumPost1.id,
            userId: citizen2.id,
            content: 'I can help with rescue. What is your exact location?',
            language: 'en'
        }
    });
    await prisma.forumComment.create({
        data: {
            postId: forumPost1.id,
            userId: marine.id,
            content: 'Emergency services have been alerted. Help is on the way.',
            language: 'en'
        }
    });
    console.log('✅ Comments created');
    // Create reactions
    await prisma.forumReaction.create({
        data: {
            postId: forumPost1.id,
            userId: citizen2.id,
            emoji: '🙏'
        }
    });
    await prisma.forumReaction.create({
        data: {
            postId: forumPost2.id,
            userId: citizen1.id,
            emoji: '👍'
        }
    });
    await prisma.forumReaction.create({
        data: {
            postId: forumPost3.id,
            userId: citizen1.id,
            emoji: '❤️'
        }
    });
    console.log('✅ Reactions created');
    // Create reports
    const report1 = await prisma.report.create({
        data: {
            userId: citizen1.id,
            type: 'flood',
            description: 'Heavy flooding in Adyar area. Roads are completely submerged.',
            mediaUrl: 'https://s3.amazonaws.com/coast-kavach/flood1.jpg',
            location: 'POINT(80.2500 13.0100)',
            trustScore: 88,
            status: 'synced'
        }
    });
    const report2 = await prisma.report.create({
        data: {
            userId: citizen2.id,
            type: 'cyclone',
            description: 'Strong winds and heavy rain causing damage to coastal structures.',
            mediaUrl: 'https://s3.amazonaws.com/coast-kavach/cyclone1.jpg',
            location: 'POINT(80.2800 13.0900)',
            trustScore: 92,
            status: 'synced'
        }
    });
    console.log('✅ Reports created');
    // Create SOS alerts
    await prisma.sOS.create({
        data: {
            userId: citizen1.id,
            message: 'URGENT: Family trapped in flood. Need immediate rescue.',
            location: 'POINT(80.2707 13.0827)',
            delivered: true,
            channel: 'internet'
        }
    });
    await prisma.sOS.create({
        data: {
            userId: citizen2.id,
            message: 'Cyclone damage to house. Need emergency shelter.',
            location: 'POINT(80.2800 13.0900)',
            delivered: true,
            channel: 'sms'
        }
    });
    console.log('✅ SOS alerts created');
    // Create warnings
    const warning1 = await prisma.warning.create({
        data: {
            issuerId: marine.id,
            sourceRole: client_1.Role.marine_worker,
            type: 'flood',
            message: 'Heavy rainfall expected in Chennai coastal areas. Avoid low-lying areas and stay indoors.',
            severity: 4,
            area: 'POLYGON((80.2000 13.0000, 80.3000 13.0000, 80.3000 13.1000, 80.2000 13.1000, 80.2000 13.0000))',
            validFrom: new Date('2024-01-17T10:00:00Z'),
            validTo: new Date('2024-01-18T10:00:00Z'),
            message_i18n: {
                en: 'Heavy rainfall expected in Chennai coastal areas. Avoid low-lying areas and stay indoors.',
                hi: 'चेन्नई तटीय क्षेत्रों में भारी बारिश की उम्मीद है। निचले क्षेत्रों से बचें और घर के अंदर रहें।',
                ta: 'சென்னை கடற்கரை பகுதிகளில் கனமான மழை எதிர்பார்க்கப்படுகிறது. தாழ்ந்த பகுதிகளைத் தவிர்க்கவும் மற்றும் உள்ளே இருங்கள்.'
            }
        }
    });
    const warning2 = await prisma.warning.create({
        data: {
            issuerId: analyst.id,
            sourceRole: client_1.Role.analyst,
            type: 'cyclone',
            message: 'Cyclone alert: Very severe cyclonic storm approaching Chennai coast. Evacuate immediately.',
            severity: 5,
            area: 'POLYGON((80.1500 12.9000, 80.3500 12.9000, 80.3500 13.2000, 80.1500 13.2000, 80.1500 12.9000))',
            validFrom: new Date('2024-01-17T12:00:00Z'),
            validTo: new Date('2024-01-19T12:00:00Z'),
            message_i18n: {
                en: 'Cyclone alert: Very severe cyclonic storm approaching Chennai coast. Evacuate immediately.',
                hi: 'चक्रवात चेतावनी: चेन्नई तट के पास बहुत गंभीर चक्रवाती तूफान आ रहा है। तुरंत खाली करें।',
                ta: 'சூறாவளி எச்சரிக்கை: சென்னை கடற்கரைக்கு மிகவும் கடுமையான சூறாவளி புயல் வருகிறது. உடனடியாக வெளியேறுங்கள்.'
            }
        }
    });
    console.log('✅ Warnings created');
    // Create social posts
    await prisma.socialPost.create({
        data: {
            platform: 'twitter',
            content: 'Flood situation in Chennai is getting worse. Please stay safe everyone! #ChennaiFloods #StaySafe',
            mediaUrl: 'https://s3.amazonaws.com/coast-kavach/twitter1.jpg',
            location: 'POINT(80.2700 13.0800)',
            trustScore: 78
        }
    });
    await prisma.socialPost.create({
        data: {
            platform: 'instagram',
            content: 'Emergency supplies being distributed at Marina Beach. Come if you need help.',
            mediaUrl: 'https://s3.amazonaws.com/coast-kavach/instagram1.jpg',
            location: 'POINT(80.2707 13.0827)',
            trustScore: 85
        }
    });
    console.log('✅ Social posts created');
    // Create educational resources
    await prisma.educationalResource.create({
        data: {
            title: 'Flood Safety Guidelines',
            content: 'Important safety measures during floods: 1) Avoid walking through flood waters 2) Turn off electricity 3) Move to higher ground 4) Keep emergency supplies ready',
            content_i18n: {
                en: 'Important safety measures during floods: 1) Avoid walking through flood waters 2) Turn off electricity 3) Move to higher ground 4) Keep emergency supplies ready',
                hi: 'बाढ़ के दौरान महत्वपूर्ण सुरक्षा उपाय: 1) बाढ़ के पानी से चलने से बचें 2) बिजली बंद करें 3) ऊंची जमीन पर जाएं 4) आपातकालीन आपूर्ति तैयार रखें',
                ta: 'வெள்ளத்தின் போது முக்கியமான பாதுகாப்பு நடவடிக்கைகள்: 1) வெள்ள நீரில் நடப்பதைத் தவிர்க்கவும் 2) மின்சாரத்தை அணைக்கவும் 3) உயர்ந்த இடத்திற்குச் செல்லவும் 4) அவசரகால வழங்கல்களைத் தயாராக வைத்திருங்கள்'
            },
            mediaUrl: 'https://s3.amazonaws.com/coast-kavach/flood-safety.jpg'
        }
    });
    await prisma.educationalResource.create({
        data: {
            title: 'Cyclone Preparedness',
            content: 'How to prepare for cyclones: 1) Secure loose objects 2) Stock up on essentials 3) Know evacuation routes 4) Keep emergency contacts ready',
            content_i18n: {
                en: 'How to prepare for cyclones: 1) Secure loose objects 2) Stock up on essentials 3) Know evacuation routes 4) Keep emergency contacts ready',
                hi: 'चक्रवात के लिए कैसे तैयारी करें: 1) ढीली वस्तुओं को सुरक्षित करें 2) आवश्यक वस्तुओं का स्टॉक करें 3) निकासी मार्गों को जानें 4) आपातकालीन संपर्क तैयार रखें',
                ta: 'சூறாவளிக்கு எவ்வாறு தயாராக இருக்க வேண்டும்: 1) தளர்வான பொருள்களை பாதுகாப்பாக வைக்கவும் 2) அத்தியாவசிய பொருள்களை சேமிக்கவும் 3) வெளியேற்ற பாதைகளை அறிந்து கொள்ளுங்கள் 4) அவசரகால தொடர்புகளை தயாராக வைத்திருங்கள்'
            },
            mediaUrl: 'https://s3.amazonaws.com/coast-kavach/cyclone-prep.jpg'
        }
    });
    console.log('✅ Educational resources created');
    // Create resource requests
    await prisma.resourceRequest.create({
        data: {
            userId: citizen1.id,
            type: 'food',
            description: 'Need food supplies for 4 people. Stuck in flood-affected area.',
            urgency: 4,
            location: 'POINT(80.2707 13.0827)',
            status: 'pending'
        }
    });
    await prisma.resourceRequest.create({
        data: {
            userId: citizen2.id,
            type: 'water',
            description: 'Urgent need for clean drinking water. Family of 6 people.',
            urgency: 5,
            location: 'POINT(80.2800 13.0900)',
            status: 'pending'
        }
    });
    console.log('✅ Resource requests created');
    // Create sync queue items
    await prisma.syncQueue.create({
        data: {
            userId: citizen1.id,
            kind: 'forum_post',
            payload: { postId: forumPost1.id, action: 'create' },
            status: 'completed'
        }
    });
    await prisma.syncQueue.create({
        data: {
            userId: citizen2.id,
            kind: 'report',
            payload: { reportId: report2.id, action: 'create' },
            status: 'pending'
        }
    });
    console.log('✅ Sync queue items created');
    console.log('🎉 Coast-Kavach database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`- Users: 7 (Admin: 1, Marine: 1, Analyst: 1, Moderator: 1, Citizens: 3)`);
    console.log(`- Forum Posts: 3 (Help: 1, Info: 1, Offer: 1)`);
    console.log(`- Comments: 2`);
    console.log(`- Reactions: 3`);
    console.log(`- Reports: 2 (Flood: 1, Cyclone: 1)`);
    console.log(`- SOS Alerts: 2`);
    console.log(`- Warnings: 2 (Flood: 1, Cyclone: 1)`);
    console.log(`- Social Posts: 2 (Twitter: 1, Instagram: 1)`);
    console.log(`- Educational Resources: 2`);
    console.log(`- Resource Requests: 2`);
    console.log(`- Sync Queue Items: 2`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-comprehensive.js.map