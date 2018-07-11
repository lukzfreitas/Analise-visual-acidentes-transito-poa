# Analise Visual e Interativa de Acidentes de Trânsito na cidade de Porto Alegre/RS Brasil
Trabalho de conclusão do curso de Sistemas de Informação PUCRS realizado pelos alunos Camila Moser e Lucas de Freitas, orientados pela Profª. Drª. Isabel H. Manssour.

## Requerimentos

- [Node e npm](http://nodejs.org)
- [ElasticSearch e Logstash](https://www.elastic.co/)

## Instalação

1. Clone do repositório: 
```
git clone git@github.com:lukzfreitas/Analise-visual-acidentes-transito-poa.git
```
2. Instalar dependencias do backend: 
```
npm install
```
3. Instalar componentes do frontend: 
```
bower install
```

## Configuração do Banco de Dados

1. Iniciar ElasticSearch:
```
elasticsearch\bin\elasticsearch
```
2. Importar dados para o elasticsearch via logstash
```
logstash/bin/logstash -f logstash_acidentes.conf
```

## Inicialização

1. Rodando projeto:
```
node web.js
```
2. Acessar:
```
localhost:5000
```
