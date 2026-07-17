# Cloz - Intelligent Fashion Computer Vision Pipeline
### Guia de Arquitetura de Nuvem e Visão Computacional de Alto Desempenho

Este documento serve como a especificação de engenharia e guia de implantação de nuvem para o backend de IA do **Cloz**. Ele descreve como transformar fotos de looks diários (como selfies no espelho com fundos complexos) em peças isoladas catalogadas automaticamente, com fundo transparente (`.png`), prontas para o e-commerce social.

---

## 1. Topologia da Arquitetura de Nuvem (GCP)

Abaixo está o fluxo completo e resiliente projetado para escalar horizontalmente na **Google Cloud Platform (GCP)** com latência ultra-baixa:

```
[ Usuário tira Selfie ]
          │
          ▼
[ Cliente Mobile (React/Flutter) ] ──(Upload Base64/Multipart)──► [ API Gateway / Cloud Run (FastAPI) ]
                                                                                   │
                                                     ┌─────────────────────────────┴─────────────────────────────┐
                                                     ▼                                                           ▼
                                      [ Passo 1 & 2: Segmentação & Recorte ]                      [ Passo 3: Classificação VLM ]
                                      - Meta SAM (Segment Anything Model)                         - Gemini 1.5 Flash (Vertex AI)
                                      - Isolação de Canal Alfa (PNG Transparente)                  - Retorno JSON Estruturado
                                                     │                                                           │
                                                     └─────────────────────────────┬─────────────────────────────┘
                                                                                   │
                                                                                   ▼
                                                             [ Armazenamento GCS (Google Cloud Storage) ]
                                                             - Salva arquivos .png públicos criptografados
                                                                                   │
                                                                                   ▼
                                                             [ Persistência: Firestore / Cloud SQL ]
                                                             - Grava documento da peça associada ao usuário
```

### Componentes de Infraestrutura GCP Recomendados:
1. **Google Cloud Run (com aceleração por GPU - NVIDIA L4)**: Hospeda o contêiner Docker rodando o microsserviço FastAPI e o SAM para garantir processamentos de segmentação sob demanda em menos de 1.5 segundos.
2. **Google Cloud Storage (GCS)**: Bucket configurado para armazenar as peças de roupas individuais recortadas como ativos de alta resolução com compressão PNG otimizada.
3. **Vertex AI API (Gemini 1.5 Flash)**: Usado como o Vision-Language Model (VLM) para rotular instantaneamente as peças recortadas com nomes minimalistas e de alta apelação de mercado.
4. **Google Cloud Firestore**: Banco NoSQL durável e flexível que registra as propriedades de cada item no armário do usuário.

---

## 2. Passo a Passo do Pipeline de Processamento de Imagens

### Passo 1: Segmentação de Instância com SAM (Meta / Vertex Model Garden)
- **O Desafio**: Uma foto no espelho contém o rosto do usuário, o celular, elementos do banheiro (azulejos, pia, escova) e do quarto.
- **A Solução**: O **Segment Anything Model (SAM)** do Meta (disponível no Vertex AI Model Garden) realiza segmentação de instância de classe agnóstica de alta fidelidade. O SAM gera máscaras pixel a pixel de cada área isolada que compõe a silhueta.
- **Filtragem de Ruído**: No código, filtramos máscaras com base na área ocupada proporcionalmente (peças de roupa geralmente ocupam entre 4% e 75% da área total da foto). Isso remove ruídos minúsculos como botões individuais, reflexos de flash e molduras de espelho.

### Passo 2: Extração do Canal Alfa e Isolação (Pillow + Numpy)
- Criamos uma máscara binária a partir do array booleano de segmentação.
- Convertemos a imagem original para 4 canais (RGBA).
- Multiplicamos o canal alfa original pela máscara binária:
  $$\text{Alpha}(x, y) = \begin{cases} 255 & \text{se } \text{Segmento}(x, y) = \text{True} \\ 0 & \text{caso contrário} \end{cases}$$
- Realizamos o corte automático para a caixa delimitadora (*bounding box*) correspondente à peça de roupa detectada, gerando um sticker perfeito.

### Passo 3: Geração de Metadados Inteligentes (Gemini 1.5 Flash)
- O Gemini 1.5 Flash é o VLM perfeito para e-commerce devido à sua velocidade e capacidade de analisar texturas e recortes de roupas com precisão cirúrgica de estilista.
- Ao enviarmos o recorte transparente, eliminamos qualquer contexto ruidoso da foto, permitindo que a IA foque unicamente nos detalhes de tecido, dobras e costura.
- **Prompt Utilizado**:
```
Analise esta imagem de roupa recortada com fundo transparente e retorne um objeto JSON estritamente estruturado com os seguintes campos:
{
  "categoria": "JEANS" | "JAQUETA" | "SUÉTER" | "CAMISETA" | "SAPATO" | "VESTIDO" | "ACESSÓRIO" | "OUTROS",
  "titulo": "Nome comercial, curto, elegante e minimalista em português"
}
```

---

## 3. Modelo de Dados e Salvamento no Banco (Exemplo Real)

Quando o pipeline termina de rodar, ele gera a seguinte saída estruturada:

```json
{
  "success": true,
  "total_extracted": 2,
  "items": [
    {
      "id": "cloz_item_24a1b0",
      "image_base64_png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "categoria": "JAQUETA",
      "titulo": "Sobretudo Alfaiataria Grafite Melange",
      "bounding_box": [180, 250, 480, 750]
    },
    {
      "id": "cloz_item_89b2c1",
      "image_base64_png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "categoria": "JEANS",
      "titulo": "Calça Jeans Reta Lavagem Estonada Clara",
      "bounding_box": [480, 280, 820, 720]
    }
  ]
}
```

### Como salvar esses registros no Firestore (Modelagem):

Para cada peça retornada no array `items`, o Cloz realiza o upload do arquivo PNG para o Cloud Storage, obtendo uma URL de download pública e salvando um documento na coleção `/closet` do Firestore:

```typescript
import { db, storage } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

async function saveExtractedItemToCloset(userId: string, item: any) {
  // 1. Upload do PNG transparente para o GCS
  const storageRef = ref(storage, `users/${userId}/closet/${item.id}.png`);
  
  // Realiza upload da string base64
  const uploadResult = await uploadString(storageRef, item.image_base64_png, 'data_url');
  const imageUrl = await getDownloadURL(uploadResult.ref);
  
  // 2. Criação do documento no banco de dados Firestore
  const closetItemDoc = {
    userId: userId,
    name: item.titulo,
    category: item.categoria,
    brand: "Cloz Studio",
    price: 0.00, // Preço inicial fictício
    image: imageUrl, // URL real e persistente do Cloud Storage
    forSale: false,
    wornCount: 0,
    costPerWear: 0.00,
    createdAt: new Date().toISOString()
  };
  
  const docRef = await addDoc(collection(db, "closet"), closetItemDoc);
  console.log("Peça catalogada automaticamente com sucesso!", docRef.id);
  return docRef.id;
}
```

---

## 4. Guia de Configuração e Implantação Local / Produção

### Dependências Requeridas:
```bash
pip install fastapi uvicorn pillow numpy torch torchvision google-genai pydantic
pip install git+https://github.com/facebookresearch/segment-anything.git
```

### Inicialização do Microsserviço de Visão Computacional:
```bash
# Baixar pesos oficiais do SAM ViT-H do Meta AI
mkdir -p weights
wget -P weights/ https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth

# Configurar chave de API para o Gemini VLM
export GEMINI_API_KEY="SUA_CHAVE_DE_API_GEMINI"

# Iniciar o servidor
uvicorn cloz_pipeline_service:app --host 0.0.0.0 --port 8000 --reload
```

---
Este microsserviço garante o mais alto padrão em processamento de imagens e inteligência artificial para o guarda-roupas digital do **Cloz**, garantindo precisão milimétrica e anonimato incomparável para os usuários da nossa rede social de moda.
