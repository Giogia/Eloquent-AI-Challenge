 <!-- Title -->
 
<div align="center">

  <a href="https://github.com/Giogia/Eloquent-AI-Challenge">
    <img alt="logo" src="https://github.com/user-attachments/assets/1f9103bd-f071-46cf-8493-5895b6cceba4" height="180">
  </a>
  <h1>RAG Chatbot Challenge</h1>
  <span>Full-Stack AI-Powered Chatbot using Retrieval-Augmented Generation (RAG)</span>
</div>

<br/>

<!-- Tech Stack -->

<div align="center">
 <img src="https://user-images.githubusercontent.com/9254840/232627617-74388095-b8bc-4c73-b550-eb2362778a10.png" height="22" align="top">
 <a href="https://www.typescriptlang.org/">TypeScript</a> 
  
 <img src="https://cdn.worldvectorlogo.com/logos/python-5.svg" height="24" align="top"> 
 <a href="https://www.python.org/">Python</a> 
  
 <img src="https://cdn.worldvectorlogo.com/logos/aws-2.svg" height="24" align="top"> 
 <a href="https://aws.amazon.com/">AWS</a>
</div>

<br/>
<!--<br/>--> 

<!-- Dev Environments -->

<!--<div align="center">
 <a href="https://docs.docker.com/desktop/dev-environments/">
  <img src="https://github.com/Giogia/video-manager/assets/9254840/564bd950-a2a9-45a1-8fcf-2b07f92eb4da" height="48">
 </a>
</div>

<div align="center">
  <a href="https://open.docker.com/dashboard/dev-envs?url=https://github.com/Giogia/Eloquent-AI-Challenge.git">Open in Docker Dev Environments</a> 
</div>-->

## Overview

This project implements an AI-powered chatbot using retrieval-augmented generation (RAG) to provide accurate, context-aware responses about an imaginary fintech company's FAQs. The chatbot retrieves relevant information from a knowledge base before generating answers, reducing hallucinations and improving response quality.

The application supports authenticated users with persistent chat history, and is designed for scalable deployment on AWS.

### Key Features

- RAG-enhanced AI chatbot that answers questions accurately using contextual information
- Persisted chat history for both anonymous and authenticated users
- Clean, intuitive chat interface inspired by modern AI assistants
- Comprehensive knowledge base covering fintech topics:

  - Account & Registration
  - Payments & Transactions
  - Security & Fraud Prevention
  - Regulations & Compliance
  - Technical Support & Troubleshooting

<br/>

### Get Started

Clone the git repository:
```bash
git clone https://github.com/Giogia/Eloquent-AI-Challenge.git
```

<br/>

## Frontend (Client)

<div align="left">
  <b>Tech Stack:</b>
   
  <img src="https://user-images.githubusercontent.com/9254840/236691251-3cd72510-58d3-49b9-804c-073c2a86c96d.png" height="24" align="top">
  <a href="https://react.dev/">React</a>

  <img src="https://cdn.worldvectorlogo.com/logos/next-js.svg" height="24" align="center">
  <a href="https://nextjs.org/">Next.js</a>
   
  <img src="https://user-images.githubusercontent.com/9254840/232627617-74388095-b8bc-4c73-b550-eb2362778a10.png" height="22" align="top">
  <a href="https://www.typescriptlang.org/">TypeScript</a>
</div>

<br/>

Move into the frontend directory: 
```bash
cd frontend
```

### Installation

Install dependencies using [`npm`](https://www.npmjs.com/):
```bash
npm install
```
### Usage

Start the client:
```bash
npm dev
```
Then open http://localhost:3000 to see your app.

<br/>

## Backend (Server)

<div align="left">
  <b>Tech Stack:</b>
   
  <img src="https://cdn.worldvectorlogo.com/logos/python-5.svg" height="24" align="top"> 
  <a href="https://www.python.org/">Python</a>
   
  <img src="https://cdn.worldvectorlogo.com/logos/fastapi-1.svg" height="24" align="top">
  <a href="https://fastapi.tiangolo.com/">FastAPI</a>

  <img src="https://github.com/user-attachments/assets/cdbf013b-787f-495e-827c-299deb4bc317" height="24" align="top"> 
  <a href="https://www.pinecone.io/">Pinecone</a>
</div>
 
<br/>

Move into the backend directory: 
```bash
cd backend
```

### Installation

Set up a Python virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:

For Windows:
```bash
venv\Scripts\activate
```

For macOS/Linux:
```bash
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### Usage

Start the server:
```bash
uvicorn app.main:app --reload
```
Then open http://localhost:8000/docs to view the API documentation.

<br/>

## Implementation Approach

This project uses a retrieval-augmented generation (RAG) approach to enhance AI responses:

1. User prompts are processed and vectorized
2. Relevant context is retrieved from the Pinecone vector database
3. The retrieved context is combined with the prompt and sent to the language model
4. The language model generates a response based on both the prompt and the retrieved context
5. Responses and chat history are stored for returning users

For more details on the implementation approach, see `docs/implementation-details.md`.

<br/>

## Deployment

<div align="left">
  <b>Tech Stack:</b>
   
  <img src="https://cdn.worldvectorlogo.com/logos/aws-2.svg" height="24" align="top">
  <a href="https://aws.amazon.com/">AWS</a>
   
  <img src="https://cdn.worldvectorlogo.com/logos/docker-4.svg" height="24" align="top">
  <a href="https://www.docker.com/">Docker</a>

  <img src="https://cdn.worldvectorlogo.com/logos/vercel.svg" height="24" align="top">
  <a href="https://vercel.com/">Vercel</a>
</div>

<br/>

The application is designed to be deployed on AWS with the following components:

- Frontend: Hosted on Vercel
- API Gateway: Managing API requests
- Application Load Balancer: For routing and scaling HTTP traffic
- Backend: Deployed as containers on AWS Fargate ECS
- Database: AWS RDS (or Aurora) for relational data storage
- ElastiCache: For caching and session management
- Authentication: AWS Cognito for user authentication and authorization
- CI/CD Pipeline: GitHub Actions

Detailed deployment architecture documentation can be found in the `docs/aws-architecture.md` file.
