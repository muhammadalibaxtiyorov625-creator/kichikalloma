import urllib.request
import json
import sys

def test_all():
    port = sys.argv[1] if len(sys.argv) > 1 else '3077'
    base = f'http://127.0.0.1:{port}'
    try:
        # 1. Test Admin Panel index
        with urllib.request.urlopen(f'{base}/') as res:
            print(f'1. GET {base}/ (Admin Panel) -> Status: {res.status}')

        # 2. Test Planets API
        with urllib.request.urlopen(f'{base}/api/website/planets') as res:
            planets = json.loads(res.read().decode('utf-8'))
            print(f'2. GET {base}/api/website/planets -> {len(planets)} ta sayyora (Status: {res.status})')

        # 3. Test Amenities API
        with urllib.request.urlopen(f'{base}/api/website/amenities') as res:
            amenities = json.loads(res.read().decode('utf-8'))
            print(f'3. GET {base}/api/website/amenities -> {len(amenities)} ta qulaylik (Status: {res.status})')

        # 4. Test Teams API
        with urllib.request.urlopen(f'{base}/api/website/teams') as res:
            teams = json.loads(res.read().decode('utf-8'))
            print(f'4. GET {base}/api/website/teams -> {len(teams)} ta jamoa a\'zosi (Status: {res.status})')

        # 5. Test Gallery API (Yangi qo'shilgan)
        with urllib.request.urlopen(f'{base}/api/website/gallery') as res:
            gallery = json.loads(res.read().decode('utf-8'))
            print(f'5. GET {base}/api/website/gallery -> {len(gallery)} ta rasm (Status: {res.status})')
            for g in gallery:
                print(f'   - #{g["id"]} {g["title"]} -> {g["image"]}')

        # 6. Test Messages API
        with urllib.request.urlopen(f'{base}/api/website/messages') as res:
            messages = json.loads(res.read().decode('utf-8'))
            print(f'6. GET {base}/api/website/messages -> {len(messages)} ta xabar (Status: {res.status})')

        # 7. Test Stats API (with Gallery)
        with urllib.request.urlopen(f'{base}/api/website/stats') as res:
            stats = json.loads(res.read().decode('utf-8'))
            print(f'7. GET {base}/api/website/stats -> Sayyoralar: {stats["totalPlanets"]}, Qulayliklar: {stats["totalAmenities"]}, Jamoa: {stats["totalTeams"]}, Galereya: {stats["totalGallery"]} (Status: {res.status})')

        # 8. Test Landing API (with Gallery)
        with urllib.request.urlopen(f'{base}/api/website/landing') as res:
            landing = json.loads(res.read().decode('utf-8'))
            print(f'8. GET {base}/api/website/landing -> {landing["site_name"]} | Galereya: {len(landing["gallery"])} ta (Status: {res.status})')

        # 9. Test Docs
        with urllib.request.urlopen(f'{base}/docs') as res:
            print(f'9. GET http://localhost:3009/docs (Swagger UI) -> Status: {res.status}')

        print('\nBARCHA ENDPOINTLAR VA GALEREYA (GALLERY) 100% MUVAFFAQIYATLI ISHLAMOQDA!')
    except Exception as e:
        print('Xatolik:', e)
        sys.exit(1)

if __name__ == '__main__':
    test_all()
