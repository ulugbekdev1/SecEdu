from database import SessionLocal, Base, engine
import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

questions = [
    models.Question(
        question="Korporativ axborot xavfsizligi siyosatining asosiy maqsadi nima?",
        options=["Internetni tezlashtirish", "Kompaniya ma'lumotlari va tizimlarini himoya qilish", "Xodimlarning ish vaqtini nazorat qilish"],
        answer=1,
        explanation="Xavfsizlik siyosati kompaniyaning maxfiy ma'lumotlari, tizimlari va resurslarini ruxsatsiz kirish, yo'qolish yoki buzilishdan himoya qilishga qaratilgan.",
        category="Xavfsizlik Siyosati"
    ),
    models.Question(
        question="Fishing (phishing) elektron xatni qanday aniqlab olish mumkin?",
        options=["Xatda kompaniya logotipi bor, demak xavfsiz", "Shoshilinch talab, noto'g'ri manzil yoki shubhali havola mavjud", "Elektron xat ingliz tilida yozilgan"],
        answer=1,
        explanation="Fishing xatlari ko'pincha: shoshilinch harakat talab qiladi, noto'g'ri domen manzilidan keladi, shaxsiy ma'lumot so'raydi yoki shubhali havolalar o'z ichiga oladi.",
        category="Fishing va Firibgarlik"
    ),
    models.Question(
        question="Korporativ parol siyosatiga ko'ra parol qanday bo'lishi shart?",
        options=["Kamida 6 ta raqamdan iborat", "Faqat katta harflardan iborat", "Kamida 12 ta belgi, katta-kichik harf, raqam va maxsus belgidan iborat"],
        answer=2,
        explanation="Kuchli korporativ parol kamida 12 ta belgidan iborat bo'lib, turli xil belgilar kombinatsiyasini o'z ichiga olishi va boshqa hisoblar bilan takrorlanmasligi kerak.",
        category="Parol Xavfsizligi"
    ),
    models.Question(
        question="Ish kompyuterida xavfsizlik hodisasi yuz berganda birinchi navbatda nima qilish kerak?",
        options=["Muammoni o'zim hal qilishga harakat qilaman", "Kompyuterni yopib, IT bo'limiga darhol xabar beraman", "Hodisa haqida hamkasblarimga aytaman"],
        answer=1,
        explanation="Xavfsizlik hodisasida darhol IT xavfsizlik bo'limiga xabar berish kerak. O'z-o'zidan harakat qilish hodisani yanada kattalashtirishi mumkin.",
        category="Hodisa Boshqaruvi"
    ),
    models.Question(
        question="Noma'lum USB flesh-xotira topib qoldingiz. Nima qilasiz?",
        options=["Tarkibini ko'rish uchun ish kompyuteriga ulayman", "Uni topib olgan joyda qoldiraman", "IT bo'limiga yoki xavfsizlik xizmatiga topshiraman"],
        answer=2,
        explanation="Noma'lum USB qurilmalar qasddan qoldirilgan bo'lishi va zararli dastur o'z ichiga olishi mumkin. Uni hech qachon ish kompyuteriga ulamang.",
        category="Qurilma Xavfsizligi"
    ),
    models.Question(
        question="Ikki faktorli autentifikatsiya (2FA) nimani ta'minlaydi?",
        options=["Parol o'rnini bosadi", "Parolga qo'shimcha xavfsizlik qatlami — SMS yoki app kodi orqali", "Tizimni sekinlashtiradi"],
        answer=1,
        explanation="2FA parol buzilgan taqdirda ham hisobni himoya qiladi. Ikkinchi omil (SMS, authenticator app) bo'lmasa, tajovuzkor kirisha olmaydi.",
        category="Parol Xavfsizligi"
    ),
    models.Question(
        question="Ommaviy Wi-Fi tarmog'idan foydalanishda nima qilish kerak?",
        options=["Korporativ hujjatlarni erkin yuklab olish mumkin", "VPN ulash va maxfiy tizimlar bilan ishlamaslik", "Parollarni bir joyda saqlash"],
        answer=1,
        explanation="Ommaviy Wi-Fi tarmoqlari shifrlangan emas. VPN trafigingizni shifrlaydi va korporativ ma'lumotlaringizni himoya qiladi.",
        category="Qurilma Xavfsizligi"
    ),
    models.Question(
        question="Maxfiy korporativ hujjatni tashqi shaxsga yuborishdan oldin nima kerak?",
        options=["Menejerimdan ruxsat olaman va faqat zarur ma'lumotni yuboraman", "Kerak bo'lsa yuboraveraman, vaqt yo'q", "Ijtimoiy tarmoqda post qilaman"],
        answer=0,
        explanation="Korporativ ma'lumotlarni tashqariga yuborishdan oldin menejerdan ruxsat olish, minimal zarur ma'lumot yuborish va shifrlangan kanal ishlatish shart.",
        category="Xavfsizlik Siyosati"
    ),
    models.Question(
        question="Ijtimoiy muhandislik (social engineering) hujumi qanday amalga oshiriladi?",
        options=["Dasturiy zaifliklarni topib exploit ishlatish orqali", "Odamlarni manipulyatsiya qilib, maxfiy ma'lumot olish orqali", "Tarmoq trafikini ushlab qolish orqali"],
        answer=1,
        explanation="Ijtimoiy muhandislik texnik zaifliklardan emas, insoniy omillardan foydalanadi. Tajovuzkor o'zini IT xodimi yoki menejer sifatida ko'rsatib, parol yoki ma'lumot olishga urinadi.",
        category="Fishing va Firibgarlik"
    ),
    models.Question(
        question="Ish kompyuteridan chiqishda nima qilish kerak?",
        options=["Ishim tugamagan, yopib o'tirmayman", "Win+L yoki ekran qulfini faollashtiraman", "Faqat brauzer tablarini yopaman"],
        answer=1,
        explanation="Kompyuterni har doim qulflash (Win+L) — 'clean desk policy'ning asosiy talabi. Qulflangan ekran ruxsatsiz kirishni oldini oladi.",
        category="Xavfsizlik Siyosati"
    ),
]

added = 0
for q in questions:
    exists = db.query(models.Question).filter(models.Question.question == q.question).first()
    if not exists:
        db.add(q)
        added += 1

db.commit()
db.close()
print(f"{added} ta savol qo'shildi!")