<h1 align="center"> 
  <img src="./assets/icon.png" alt="Humor Tracker" width="40" /> Humor Tracker 
</h1>

<p align="center"> <strong>⭐ Acompanhe seu humor diário e registre como você está se sentindo.</strong> </p>

<p align="center">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-54-000000?style=for-the-badge&logo=expo&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 📖 Sobre o projeto

O **Humor Tracker** é um aplicativo mobile para registrar o humor do dia de forma simples e visual. Você avalia como está se sentindo com estrelas, pode adicionar uma descrição, escolher data e hora, e acompanhar o histórico em uma lista organizada.

💡 A ideia do aplicativo foi inspirada no conteúdo do canal **[Lucas Souza Dev](https://www.youtube.com/@LucasSouzaDev)** no YouTube. Este projeto foi desenvolvido como prática e evolução a partir dessa proposta.

[![YouTube](https://img.shields.io/badge/YouTube-@LucasSouzaDev-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@LucasSouzaDev)

---

## ✨ Funcionalidades

<table>
  <thead>
    <tr>
      <th colspan="2">Funcionalidade</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>⭐</td>
      <td>Registro de humor</td>
      <td>Avalie o dia com até 5 estrelas e salve no histórico.</td>
    </tr>
    <tr>
      <td>📝</td>
      <td>Descrição opcional</td>
      <td>Escreva mais detalhes sobre como está se sentindo.</td>
    </tr>
    <tr>
      <td>📅</td>
      <td>Data e hora</td>
      <td>Defina ou altere a data e a hora do registro.</td>
    </tr>
    <tr>
      <td>✏️</td>
      <td>Edição e exclusão</td>
      <td>Abra um card para editar ou excluir um registro.</td>
    </tr>
    <tr>
      <td>🔀</td>
      <td>Ordenação</td>
      <td>Ordene os registros por data, nota ou descrição (A–Z / Z–A).</td>
    </tr>
    <tr>
      <td>👤</td>
      <td>Nome do usuário</td>
      <td>Personalize o aplicativo com o seu nome e altere-o quando desejar.</td>
    </tr>
    <tr>
      <td>🌙</td>
      <td>Tema claro / escuro</td>
      <td>Alterne entre os temas claro e escuro, com a preferência salva no dispositivo.</td>
    </tr>
    <tr>
      <td>🗑️</td>
      <td>Excluir todos</td>
      <td>Remova todos os registros de uma vez, com confirmação.</td>
    </tr>
    <tr>
      <td>💾</td>
      <td>Persistência local</td>
      <td>Dados armazenados localmente com AsyncStorage, sem necessidade de backend.</td>
    </tr>
  </tbody>
</table>

---

## 📱 Telas

### 🏠 Home

- 👋 Saudação personalizada com o nome do usuário
- 📋 Lista de cards de humor
- ⚙️ Menu de opções (alterar nome, tema, ordenação, excluir todos)
- ⭐ Footer para iniciar um novo registro pela avaliação em estrelas

### 🔍 Detalhe

- ➕ Criação ou edição de um humor
- ⭐📅📝 Avaliação, data/hora e descrição
- 💾❌🗑️ Ações de salvar, cancelar e excluir

### 👤 Nome do usuário

- ✍️ Cadastro e edição do nome exibido no header

---

## 🛠️ Stack tecnológica

- 📦 **[Expo](https://expo.dev/)** `~54` — toolchain e build do app
- ⚛️ **[React Native](https://reactnative.dev/)** `0.81` — interface nativa
- 📘 **[TypeScript](https://www.typescriptlang.org/)** — tipagem estática
- 🧭 **[React Navigation](https://reactnavigation.org/)** — navegação em stack / form sheets
- 💾 **[AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/)** — persistência local
- 🔤 **[Expo Google Fonts (Inter)](https://github.com/expo/google-fonts)** — tipografia
- 🗓️ **[React Native Modal Datetime Picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)** — seleção de data e hora

---

## 📂 Estrutura do projeto

```text
humor-tracker/
├── 🎨 assets/                  # Ícone, splash e favicon
├── 🎨 themes/
│   └── Theme.ts                # Tokens de cor, fonte e sombra (light/dark)
├── 📁 src/
│   ├── App.tsx                 # Entrada do app (fonts + ThemeProvider)
│   ├── Routes.tsx              # Navegação e layouts das telas
│   ├── index.ts
│   ├── 📱 screens/
│   │   ├── Home.tsx            # Lista, menu e novo humor
│   │   ├── Detail.tsx          # Criar / editar / excluir humor
│   │   └── SetUserName.tsx     # Nome do usuário
│   └── 🧩 shared/
│       ├── components/         # Header, Footer, HumorCard, StarRating, etc.
│       └── theme/              # ThemeContext (modo claro/escuro)
├── ⚙️ app.json
└── 📦 package.json
```

---

## ✅ Pré-requisitos

- 🟢 [Node.js](https://nodejs.org/) (LTS recomendado)
- 📦 [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- 📲 [Expo Go](https://expo.dev/go) no celular **ou** Android Studio / Xcode para emulador
- 🤖 Para gerar APK local: Android SDK configurado

---

## 🚀 Como rodar

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd humor-tracker

# 2. Instale as dependências
npm install

# 3. Inicie o projeto
npx expo start
```

Depois disso:

- 📷 Escaneie o QR Code com o **Expo Go** (Android/iOS), ou
- ⌨️ Pressione `a` para Android / `i` para iOS no terminal

<p align="left">
  <strong>⚠️ OBS: O aplicativo ainda não foi testado em dispositivos iOS.</strong> O funcionamento nessa plataforma não é garantido e podem ser necessários ajustes.
</p>

### 📜 Scripts disponíveis

| Comando                           | Descrição                            |
| --------------------------------- | ------------------------------------ |
| ▶️ `npm start` / `npx expo start` | Sobe o Metro bundler                 |
| 🤖 `npm run android`              | Roda no Android (`expo run:android`) |
| 🍎 `npm run ios`                  | Roda no iOS (`expo run:ios`)         |
| 🌐 `npm run web`                  | Abre versão web                      |

---

## 📦 Gerar APK (Android)

### 💻 Via prebuild + Gradle (local)

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug   # Linux/macOS
.\gradlew.bat assembleDebug   # Windows
```

O APK debug fica em:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

💡 **Dica (Windows):** se o build falhar com _Filename longer than 260 characters_, mova o projeto para um caminho mais curto (ex.: `C:\dev\humor-tracker`) ou habilite long paths no sistema.

### ☁️ Via EAS Build (nuvem)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

---

## 💾 Persistência de dados

Os dados ficam apenas no dispositivo:

| Chave           | Conteúdo                               |
| --------------- | -------------------------------------- |
| 👤 `user-name`  | Nome do usuário                        |
| 📋 `humor-list` | Lista de registros de humor (JSON)     |
| 🎨 `theme-mode` | Preferência de tema (`light` / `dark`) |

Cada humor possui: `id`, `dateTime`, `rate` e `description`.

---

## 📄 Licença

🎓 Projeto aberto para estudo e aprendizado, sob licença **MIT**.

Sinta-se à vontade para clonar, estudar e adaptar.

---

<p align="center">
  💜 Feito com <strong>React Native + Expo</strong><br />
  🎬 Inspirado em
  <a href="https://www.youtube.com/@LucasSouzaDev">@LucasSouzaDev</a><br />
  👨‍💻 Desenvolvido por <strong>Jean Knieling dos Santos</strong><br />

  <a href="https://www.linkedin.com/in/jeanknieling/">
    <img
      src="https://img.shields.io/badge/LinkedIn-Jean%20Knieling%20dos%20Santos-0A66C2?logo=linkedin&logoColor=white"
      alt="LinkedIn"
    />
  </a>
</p>
