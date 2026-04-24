from database import SessionLocal
import models

db = SessionLocal()

materials = [
    # Korporativ xavfsizlik siyosati
    models.Material(
        title="Korporativ axborot xavfsizligi siyosati",
        video_url="https://www.youtube.com/watch?v=inWWhr5tnEA",
        description="Kompaniyamizning axborot xavfsizligi siyosati asoslari, xodimlarning vazifalari va mas'uliyatlari.",
        category="Xavfsizlik Siyosati"
    ),
    models.Material(
        title="Ma'lumotlarni himoya qilish qoidalari",
        video_url="https://www.youtube.com/watch?v=3NjQ9b3pgIg",
        description="Korporativ maxfiy ma'lumotlar bilan ishlash tartibi, nima oshkor etish mumkin emas.",
        category="Xavfsizlik Siyosati"
    ),
    # Phishing va ijtimoiy muhandislik
    models.Material(
        title="Fishing hujumlarini tanib olish",
        video_url="https://www.youtube.com/watch?v=XBkzBrXlle0",
        description="Zararli elektron xatlar, soxta saytlar va fishing hujumlaridan himoyalanish usullari.",
        category="Fishing va Firibgarlik"
    ),
    models.Material(
        title="Ijtimoiy muhandislik hujumlari",
        video_url="https://www.youtube.com/watch?v=lc7scxvKoOk",
        description="Telefon va shaxsiy muloqot orqali amalga oshiriladigan manipulyatsiya usullari va ulardan himoya.",
        category="Fishing va Firibgarlik"
    ),
    # Parol xavfsizligi
    models.Material(
        title="Kuchli parol yaratish va boshqarish",
        video_url="https://www.youtube.com/watch?v=aEmXQoQloCE",
        description="Korporativ hisoblar uchun kuchli parol siyosati, parol menejerlari, parol almashmasligi.",
        category="Parol Xavfsizligi"
    ),
    models.Material(
        title="Ikki faktorli autentifikatsiya (2FA)",
        video_url="https://www.youtube.com/watch?v=0mvCeNsTa1g",
        description="2FA nima, uni qanday ulash va korporativ tizimlarda ikkinchi bosqich autentifikatsiyasi.",
        category="Parol Xavfsizligi"
    ),
    # Qurilma va tarmoq xavfsizligi
    models.Material(
        title="Ish kompyuteri va qurilmalar xavfsizligi",
        video_url="https://www.youtube.com/watch?v=2eQ0cQq3X9Y",
        description="Ish qurilmalarini qulflash, ekran paroli, USB qurilmalardan foydalanish qoidalari.",
        category="Qurilma Xavfsizligi"
    ),
    models.Material(
        title="Ommaviy Wi-Fi va VPN ishlatish",
        video_url="https://www.youtube.com/watch?v=_wQTRMBAvzg",
        description="Ommaviy tarmoqlardagi xavflar, VPN nima va uni qachon ishlatish kerak.",
        category="Qurilma Xavfsizligi"
    ),
    # Hodisa va monitoring
    models.Material(
        title="Xavfsizlik hodisalarini xabar qilish",
        video_url="https://www.youtube.com/watch?v=Dk-ZqQ-bfy4",
        description="Shubhali faoliyat, buzilishlar yuz berganda kim bilan bog'lanish va qanday harakat qilish.",
        category="Hodisa Boshqaruvi"
    ),
    models.Material(
        title="Zamonaviy ransomware hujumlari",
        video_url="https://www.youtube.com/watch?v=GqF9f5o9I-E",
        description="Fidya dasturlari qanday ishlaydi, ulardan saqlanish va zaxira nusxa (backup) ahamiyati.",
        category="Hodisa Boshqaruvi"
    ),
]

for m in materials:
    db.add(m)

db.commit()
db.close()
print(f"{len(materials)} ta material qo'shildi!")