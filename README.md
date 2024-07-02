
# MVP Arquitetura Express API

Este repositório contém a API desenvolvida em Express.js para comunicação com o S3 na aplicação MVP Arquitetura.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Docker](#docker)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

### Pré-requisitos

- Node.js 14+
- npm ou yarn

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/DDFaller/MVP_Arquitetura_S3.git
cd MVP_Arquitetura_S3
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name
```

## Uso

### Iniciar a Aplicação

Inicie o servidor Express:

```bash
npm start
# ou
yarn start
```

A API estará disponível em `http://localhost:3003`.

## Endpoints

### POST /upload

Faz o upload de um arquivo para o S3.

**Corpo da Requisição**:

```form-data
{
  "user_id": "1",
  "model_name": "nome_do_modelo",
  "model_bytes": arquivo
}
```

**Resposta**:

```json
{
  "message": "Image uploaded and sent to third-party API successfully",
  "data": { ... }
}
```

### POST /get

Obtém a URL assinada de um arquivo no S3.

**Corpo da Requisição**:

```json
{
  "user_id": "1",
  "model_name": "nome_do_modelo"
}
```

**Resposta**:

```json
{
  "message": "Object url",
  "data": "signed_url"
}
```

### DELETE /delete

Deleta um arquivo no S3.

**Corpo da Requisição**:

```json
{
  "user_id": "1",
  "model_name": "nome_do_modelo"
}
```

**Resposta**:

```json
{
  "message": "File nome_do_modelo for user 1 deleted successfully"
}
```

### PUT /rename

Renomeia um arquivo no S3.

**Corpo da Requisição**:

```json
{
  "user_id": "1",
  "old_model_name": "old_model_name",
  "new_model_name": "new_model_name"
}
```

**Resposta**:

```json
{
  "message": "File renamed from old_model_name to new_model_name for user 1 successfully"
}
```

## Docker

### Construir a Imagem

```bash
docker build -t mvp_arquitetura_s3 .
```

### Executar o Container

```bash
docker run -p 3003:3003 --env-file .env mvp_arquitetura_s3
```

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/fooBar`).
3. Faça commit das suas alterações (`git commit -am 'Add some fooBar'`).
4. Envie para a branch (`git push origin feature/fooBar`).
5. Crie um novo Pull Request.

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
