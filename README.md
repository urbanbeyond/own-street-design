# Own Street Designs

Create a mobile-first single-page web app prototype called "OWN STREET" for a Korean custom T-shirt service.

The user is non-technical, so keep the product extremely simple. Do not create multiple pages or a complex dashboard.

Core layout, all on ONE scrolling page:

1) HERO / LOGIN
- Brand name: OWN STREET
- Short line: "YOUR IMAGE. YOUR STREET."
- Korean helper text: "원하는 이미지의 URL을 보내주세요. 나머지는 우리가 준비합니다."
- A prominent "Google로 시작하기" button with a Google icon.
- For this prototype, the button may switch the UI into a logged-in demo state and show a small user chip. Structure the code so real Google auth can be added later without redesigning the page.

2) CUSTOM REQUEST FORM
- Section title: "CUSTOM REQUEST"
- Only 3 visible fields:
  - 이름
  - 전화번호
  - URL
- Large CTA button: "REQUEST"
- Validate required fields and basic URL format.
- On submit, show a clean completion modal/card:
  "REQUEST COMPLETE"
  "접수가 완료되었습니다."
  Generate a demo request number like OS-0027.
- Prepare the submission function so it can later POST JSON to a Google Apps Script webhook endpoint. Use a clearly named config placeholder such as GOOGLE_SHEETS_WEBHOOK_URL, but do not expose secrets in the UI.

3) PRODUCT / CUSTOM INFO
Use compact accordion sections so the page stays short:
- SIZE — S / M / L / XL and a simple size table placeholder
- QUALITY — 소재, 원단, 프린팅 방식
- CARE — 세탁 및 관리 주의사항
- CUSTOM GUIDE — URL 제출 방법, 권장 이미지 품질, 제작 범위
- COPYRIGHT / NOTICE — 사용 권한, 교환/환불, 제작 시 오차 안내

4) FOOTER
- Privacy
- Terms
- Contact
- © OWN STREET

Design direction:
- Contemporary street brand, restrained neo-brutalist influence.
- Mostly black, off-white, and one strong accent color.
- Bold condensed/industrial typography feel, but highly readable Korean.
- Thick borders, rectangular buttons, generous whitespace.
- No gradients, no glossy SaaS style, no excessive cards.
- Mobile-first, responsive desktop layout.
- Feels like an independent fashion label rather than a corporate software service.
- Keep interactions obvious for older/non-technical users.
- One page only.

Important:
- Do not add cart, payment, reviews, community, search, or unnecessary navigation.
- Do not add extra form fields.
- Keep the implementation clean and production-oriented.
- Add brief developer comments indicating where real Google authentication and the Google Sheets Apps Script webhook should be connected later.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://own-street-design.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a190fd7-7ebd-4a85-adff-f8a92f3ae96e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
