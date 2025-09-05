# 📚 Genial

Este projeto tem como objetivo desenvolver um recurso inovador na plataforma educacional existente que permita ao aluno apontar a câmera do celular para uma questão em lousa, livro ou papel, capturá-la via OCR e receber respostas automáticas geradas por IA, enriquecidas com elementos em Realidade Aumentada (RA).  
O foco é **potencializar o aprendizado ativo**, tornando a compreensão dos conteúdos mais interativa, visual e acessível.  


## 🚀 Começando

Desenvolver um sistema que utilize **OCR, Inteligência Artificial e Realidade Aumentada** para transformar questões físicas (em livros, folhas ou lousa) em experiências digitais interativas com explicações e objetos 3D educativos.


## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado/configurado as seguintes ferramentas no seu ambiente de desenvolvimento:  


**[Python v3.11](https://www.python.org/downloads/)**  
```
  - Usado no backend e em rotinas de processamento de IA e OCR.  
  - Instalação:  
    - Windows: baixe o instalador no site oficial e marque a opção **Add to PATH**.  
    - Linux/Mac: use o gerenciador de pacotes (`sudo apt install python3` ou `brew install python`).  
```

**[AWS CLI v2](https://docs.aws.amazon.com/cli/)**  
```
  - Usado para configurar e interagir com serviços AWS (Lambda, S3, DynamoDB, etc.).  
  - Instalação:  
    - Windows/Mac: baixe o instalador do site oficial.  
    - Linux: `curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"`  
      depois `unzip awscliv2.zip && sudo ./aws/install`.  
  - Após instalar, configure com:  
    aws configure
```

**[Visual Studio Code (VS Code)](https://code.visualstudio.com/)**  
```
  - IDE utilizada para edição de código (React Native, Python, Unity scripts).  
  - Instalação: baixe do site oficial e instale conforme seu sistema operacional.  
  - Extensões recomendadas: *Python*, *React Native Tools*, *AWS Toolkit*, *C# (Unity)*.
```  

**[React Native v0.74](https://reactnative.dev/docs/environment-setup)**  
```
  - Framework usado para o desenvolvimento mobile multiplataforma (Android/iOS).  
  - Instalação:  
    npm install -g react-native-cli

  - Requisitos adicionais:  
    - Node.js v20.x  
    - Android Studio (para Android) ou Xcode (para iOS).  
```

 **[Unity 2022 LTS](https://unity.com/releases/editor/whats-new/2022-lts)** com **AR Foundation**  
 ```
  - Utilizado para criar experiências de Realidade Aumentada (RA).  
  - Instalação:  
    - Baixe e instale o **Unity Hub**.  
    - No Unity Hub, instale a versão **2022 LTS** com os módulos: *Android Build Support*, *iOS Build Support* e *AR Foundation*.  
```
 **[Git](https://git-scm.com/)**  
 
 ```
  - Sistema de controle de versão para clonar, versionar e colaborar no código.  
  - Instalação:  
    - Windows: baixe e instale o **Git for Windows**.  
    - Linux (Debian/Ubuntu):  
      ```
      sudo apt install git
      ```  
    - Mac (Homebrew):  
      ```
      brew install git
      ```  
  - Verifique a instalação:
 ```
    git --version
    ```


## 🔧 Instalação

Clone o repositório e instale as dependências necessárias:

```
git clone https://github.com/seu-usuario/trashhunt.git
cd trashhunt
npm install
```

Para rodar o aplicativo em modo desenvolvimento:

```
npm run start
```


## 🛠️ Construído com

Ferramentas utilizadas e bibliotecas principais:

-   **Unity 3D + AR Foundation** -- motor para Realidade Aumentada
-   **React Native** -- Interface mobile
-   **Python** -- Suporte de backend e API
-   **VS Code** -- IDE utilizada no desenvolvimento
-   **Trello** -- Ferramenta de gestão de tarefas e organização do fluxo de trabalho em equipe
-   **AWS (Amazon Web Services)** --Serviços de backend, armazenamento e IA (ex.: AWS Lambda, S3, DynamoDB, Rekognition)
-   **Figma** -- Plataforma para design de interfaces e prototipação do aplicativo.  

## 📌 Versão

-   **Versão 1.0** - Estrutura inicial do projeto

## ✒️ Autores

-   **Caique Mendes Pinto** - 223007
-   **Guilherme Bordignon Janczak** - 222688
-   **João Luiz Orlandini Ales** - 223497
-   **Gustavo Figueiredo Passos** - 222560
-   **Lucas Laureano Jorge da Silva** - 222679
