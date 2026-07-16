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

O **Humor Tracker** é um aplicativo mobile para registrar o humor do dia de forma simples e visual. Você avalia como está se sentindo com estrelas, adiciona uma descrição, escolhe data e hora, e acompanha o histórico em uma lista organizada.

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
      <td>Descrição</td>
      <td>Escreva detalhes sobre como está se sentindo.</td>
    </tr>
    <tr>
      <td>📅</td>
      <td>Data e hora</td>
      <td>Defina ou altere a data e a hora do registro.</td>
    </tr>
    <tr>
      <td>🗓️</td>
      <td>Filtro por dia</td>
      <td>Escolha um dia no calendário do header e veja só os humores daquela data. Dias com registro aparecem marcados no calendário. Novos registros herdam o dia selecionado.</td>
    </tr>
    <tr>
      <td>📊</td>
      <td>Estatísticas de humor</td>
      <td>Média do humor em um período (mês ou ano, com de/até). Mostra volume de registros, melhor(es)/pior(es) e barras por mês. Toque para listar e editar os registros.</td>
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
      <td>✅</td>
      <td>Exclusão em massa</td>
      <td>Selecione vários cards (do dia ou de todos) e exclua de uma vez, com confirmação.</td>
    </tr>
    <tr>
      <td>👤</td>
      <td>Nome do usuário</td>
      <td>Personalize o aplicativo com o seu nome e altere-o quando desejar (espaços extras são removidos ao salvar).</td>
    </tr>
    <tr>
      <td>🌙</td>
      <td>Tema claro / escuro</td>
      <td>Alterne entre os temas claro e escuro, com a preferência salva no dispositivo.</td>
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
- 🗓️ Calendário no header para filtrar humores por dia
- 📋 Lista de cards do dia selecionado (ou de todos, no modo exclusão em massa)
- ⚙️ Menu de opções (alterar nome, estatísticas, tema, ordenação, excluir vários)
- ✅ Modo de seleção para excluir vários registros de uma vez
- ⭐ Footer para iniciar um novo registro pela avaliação em estrelas (no dia escolhido)

### 📊 Estatísticas

- 📅 Período por **mês** ou **ano**, sempre com intervalo de/até
- ⭐ Média do humor no período e quantidade de registros
- 🏆 Cartões de **melhor** / **melhores** e **pior** / **piores** (conforme a quantidade); toque abre a lista e permite editar
- 📈 Barras de média por mês; toque abre os registros daquele mês
- 🔄 Ao voltar da edição, as estatísticas e a lista são atualizadas

### 🔍 Detalhe

- ➕ Criação ou edição de um humor
- ⭐📅📝 Avaliação, data/hora e descrição (obrigatória para salvar)
- 🗓️ Ao criar a partir de um dia filtrado, a data inicial já usa esse dia
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
- 📆 **[React Native UI DatePicker](https://github.com/farhoudshapouran/react-native-ui-datepicker)** — calendário com marcação dos dias com humor e seleção de horário
- 🩹 **[patch-package](https://github.com/ds300/patch-package)** — ajustes no datepicker (header de seleção mês/ano/hora)

---

## 📂 Estrutura do projeto

```text
humor-tracker/
├── 🎨 assets/                  # Ícone, splash e favicon
├── 🎨 themes/
│   └── Theme.ts                # Tokens de cor, fonte e sombra (light/dark)
├── 🩹 patches/                 # Patches aplicados no postinstall
│   └── react-native-ui-datepicker+3.3.0.patch
├── 📁 src/
│   ├── App.tsx                 # Entrada do app (fonts + AppProviders)
│   ├── Routes.tsx              # Navegação e layouts das telas
│   ├── index.ts
│   ├── 📱 screens/
│   │   ├── Home.tsx            # Lista por dia, menu, seleção e novo humor
│   │   ├── Insights.tsx        # Estatísticas: média e barras por período
│   │   ├── InsightsHumors.tsx  # Lista de melhores/piores ou humores do mês
│   │   ├── Detail.tsx          # Criar / editar / excluir humor
│   │   └── SetUserName.tsx     # Nome do usuário
│   └── 🧩 shared/
│       ├── components/         # Header, Footer, HumorCard, DayCalendarModal, etc.
│       ├── providers/          # AppProviders, Theme e SelectedDay
│       ├── storage/            # Leitura/escrita no AsyncStorage
│       ├── types/              # Tipos de humor e ordenação
│       └── utils/              # Helpers de data, períodos e estatísticas
├── ⚙️ app.json
└── 📦 package.json
```

---

## ✅ Pré-requisitos

- 🟢 [Node.js](https://nodejs.org/) (LTS recomendado)
- 📦 [yarn](https://yarnpkg.com/) (recomendado) ou [npm](https://www.npmjs.com/)
- 📲 [Expo Go](https://expo.dev/go) no celular **ou** Android Studio / Xcode para emulador
- 🤖 Para gerar APK local: Android SDK configurado

---

## 🚀 Como rodar

```bash
# 1. Clone o repositório
git clone "https://github.com/jeanknieling/humor-tracker"
cd humor-tracker

# 2. Instale as dependências (aplica o patch do datepicker no postinstall)
yarn install

# 3. Inicie o projeto
yarn start
```

Depois disso:

- 📷 Escaneie o QR Code com o **Expo Go** (Android/iOS), ou
- ⌨️ Pressione `a` para Android / `i` para iOS no terminal

<p align="left">
  <strong>⚠️ OBS: O aplicativo ainda não foi testado em dispositivos iOS.</strong> O funcionamento nessa plataforma não é garantido e podem ser necessários ajustes.
</p>

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
yarn global add eas-cli
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
