# Sistema de consultas médicas

## Descrição do projeto

Esta é uma API desenvolvida em NodeJS. Essa aplicação aborda uma maneira de se ter um controle de consultas de um hospital. Onde o médico e os pacientes possui um cadastro e conseguem verificar sua próximas consultas.



## Desenvolvimento

Para o desenvolvimento desse projeto foi utilizado algumas bibliotecas e frameworks para um melhor desenvolvimento, listei algumas delas abaixo

- **express**: ExpressJS é uma framework para realizar protocólos HTTP.
- **sequelize**: Nesse projeto foi utilizado o ORM Sequelize para a integração com o Banco de Dados (PotgreSQL).
- **bcrypt**: O bcrypt é uma biblioteca do javascript para fazer a criptografia de dados. Nesse projeto ela foi utilizada para criptografar a senha do usuário (paciente ou médico).
- **jsonwebtoken**: O jsonwebtoken é uma biblioteca para criar tokens de acesso que tem uma prazo para expiração. Caso o usuário quiser acessar a API, ele deve realizar o login, onde será retornado um token de acesso para 7 dias, após esse período ele deve fazer o login novamente.

Para esse projeto, também foi utilizada uma arquitetura de código limpa, com pastas e estruturas organizadas para melhor desenvolvimento. 



## Instruções para instalação

Para usar a aplicação, primeiramente deve criar um novo banco de dados no PGAdmin do PostgreSQL com o nome _appointments_

```
CREATE DATABSE appointments
```


Depois você precisa realizar as migrations para o banco de dados com o sequelize, para isso vá na raiz do projeto e use o comando:

```
yarn sequelize db:migrate
```
ou
```
npx sequelize db:migrate
```


Agora para rodar a aplicação utilize 
```
yarn dev
```
ou
```
npm run dev
```


## Como usar

As rotas _/login_, _/register_pacients_ e _/register_doctors_ não precisa de autorização passada do Header

<img src="/assets/images/1.png">

1. Para se criar um usuário, seja ele paciente ou médico deve-se usar o método _POST_ em algumas das rotas de registro e passar os seguintes parâmetros no body via JSON.
  - _name_: _string_
  - _email_: _string_
  - _password_: _string_
  - _tel_: _string_

<img src="/assets/images/2.png">


2. Para realizar o login, acesse a rota de _/login_ e passa o seguintes parâmetros no body via JSON.
  - _email_: _string_
  - _password_: _string_

Ele irá retornar um token de acesso válido por 7 dias, com esse token você pode passar ao header _authorization_ para poder acessar as outras rotas

<img src="/assets/images/3.png">

<img src="/assets/images/4.png">

<img src="/assets/images/5.png">


3. Para criar uma nova consulta, você deve acessar a rota _/appointments_ via _POST_ e passar os seguintes parâmetros:
  - _patient_id_: _number_
  - _doctor_id_: _number_
  - _description_: _string_
  - _date_: _string_
  - _hour_: _number_
  - _minutes_: _number_

<img src="/assets/images/6.png">


4. Para verificar as consultas marcadas do médico ou do paciente acesse as rotas passando o parâmetro ID do médico ou paciente. _/doctors/:id_, _/patients/:id_

<img src="/assets/images/7.png">


#### Nota-se: os tokens de acesso para paciente e médicos são diferente, além que de as rotas específicas onde precisa-se passar o parâmentro ID, como as rotas de _GET_, _PUT_ e _DELETE_, um usuário não consegue acessar se o ID for diferente.

#### Exemplo: o médico com ID 2 não pode accessar a rota _/doctors/1_ por que o token de acesso dele guarda o ID dele, e verifica se a rota na qual ele que acessar é de seu ID ou não.

<img src="/assets/images/8.png">
