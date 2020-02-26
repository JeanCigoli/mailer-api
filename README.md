# Mailer - Api de envio de e-mail

## Estrutura de pastas

![](https://trello-attachments.s3.amazonaws.com/5e0f6e8f2c2a8a2b74614649/5e0f6f66bfad438d9e02c88f/428780fd83cbc462c87ce5c8d73e25ff/estrutura.png)

## Como criar um template?

Todo template criado derevá ter a extensão **.hbs** de handlebars, caso não seja não será possível renderizar ele.

**Definindo Variáveis:**

Para definir uma variável no seu template terá que seguir este formato:

![](https://trello-attachments.s3.amazonaws.com/5e0f6e8f2c2a8a2b74614649/5e0f6f66bfad438d9e02c88f/3a718afb05b70d52cea4c28ea9583f2c/variavel.png)

Colocando o nome da variável entre duas chaves.

**Definindo Imagens:**
	
Caso queira utilizar imagens no template, deverá ser hospedada e colocar como link no seu template antes de cadastrar na tag html **img**. 

## Filas

Como o projeto utiliza filas (bee-queue), além de rodar a aplicação node terá que rodar as filas:

> npm run queue

Ou:

> npm run nodemon src/queue.js


# Ends-Points

## Select All Template

> GET: {{host}}/templates

## Retornará todos os templates cadastrados

Caso tenha templates cadastrados será retornado uma lista com todos e seus atributos:

Atributos | O que são? 
--- | ---------------------------------------
Id | O id de registro no banco.
Name | Nome do template.
Variables | As variáveis que serão substituídas no envio de um e-mail.  

Caso não tenha templates cadastrado, será retornado uma mensagem:

Atributos | O que é? 
--- | ---------------------------------------
Message | O motivo desse retorno, ou um erro.

---

## Select One Template

Request URL:
> GET: localhost:3000/template/:id

## Retornando um template

Isso trará os dados do seu template cadastrado:

Atributos | O que são? 
--- | ---------------------------------------
Id | O id de registro no banco.
Name | Nome do template.
Variables | As variáveis que serão substituídas no envio de um e-mail.  

Caso não tenha template cadastrado, será retornado uma mensagem:

Atributos | O que é? 
--- | ---------------------------------------
Message | O motivo desse retorno, ou um erro.

---

## Delete Template

Request URL:
> DELETE: localhost:3000/template/:id

## Deletando um template

Com esta requisição estará deletado tudo do template passado como parâmetro:

* Será deletado do banco;
* E o template será excluído.

Caso de um erro ou ele não encontrou o arquivo para deletar será informado.

---

## Create Template

> POST: {{host}}/templates

## Criando um template

Para criar o template deverá passar os seguintes parâmetros de acordo com o seu template:

Atributos | O que são? 
--- | ---------------------------------------
 Page | Passando seu arquivo (template), que deverá ser com a extensão **.hbs** de handlebars.
 Name | O nome do seu template com a extensão.
 Variables | As variáveis que ele possue para ser renderizado.

### Atenção

* Caso possua mais de duas variáveis, o atributo **variables** deverá receber eles como string separado por vírgula:

	> " variables " : "variavel1, variavel2, ... ";

---

## Send E-mail

> POST: {{host}}/mail

## Utilizando o envio de e-mail.

Lista dos dados de envio (obrigatório e opcional):

Atributos | Situação | Para que serve?
--------- | ----------| ---------------
To | Obrigatório | Envio de um json convertido em string, onde tem o e-mail para quem vai enviar, e as variáveis que serão substituídas.
Subject | Obrigatório | Assunto do e-mail
From | Obrigatório | Quem está enviando
Attachments | Opcional | Os arquivos que serão enviados por anexo.
Template | Opcional | O arquivo de seu template, terá que ser com a extensão **.hbs** de handlebars.
Name | Opcional | O nome do template que será enviado.

Existem duas formas de envio de e-mail:

1. Com o template cadastrado:

	Para o envio de e-mail com um template cadastrado é só não enviar o parâmetro **template**, e sendo obrigatório o envio do parâmetro **name**.

2. Com o template sem o cadastrar:

	Este modo é mais indicado quando será enviado um e-mail único e não será mais utlizado este template para nenhum outro, assim que terminado o envio será descartado o template.
	Para utilizar não pode enviar o atributo **name**, assim tornando-se obrigatório o **template**.

## Atributo To

O atributo to terá que ser um json só que convertido para string na hora do envio, existem algumas regras para sua utilização:

* Ele deverá ser uma array de objetos [{},{}] ou um array com um objeto [{}];
* Dentro de cada objeto da array pode conter dois atributos:

	1. O primeiro é o **mail** que se refere ao e-mail de para quem será enviado, este atributo é obrigatório;
	
	2. O Segundo é o **variables** que são as variáveis e seus valores para serem trocados no template, este item é opcional, pois nem todos templates possuiram variáveis.

* Caso queira enviar para duas ou mais pessoas terá que criar um objeto para cada, possuindo o **mail** e **variables**.

## Atributo Variables de dentro do To

Dentro deste atributo será informado os valores da variável que será substituída no envio, existem algumas regras para sua utilização:

* Ele deverá ser uma array de objetos [{},{}] ou um array com um objeto [{}];

* Para cada variável do seu template terá que criar um objeto;

* Dentro de cada objeto terá que ter dois atributos:

	1. O atributo **Key** que á referência para a variável;

	2. O atributo **Value** é o valor que será colocado no lugar.
	


Segue exemplo:

~~~json

"variables": [
    {
        "funcionario": "Jean Cigoli",
        "chefe": "Gabriel"
    }
]

~~~

---

Segue o exemplo do atributo **To** completo:

~~~json
[
    {
        "mail": "Jean <jean@primi.com.br>",
        "variables": [
            {
                "funcionario": "Jean Cigoli",
                "chefe": "Gabriel"
            }
        ]
    },
    {
        "mail": "Micael <micaelpereira@primi.com.br>",
        "variables": [
            {
                "funcionario": "Jean Cigoli",
                "chefe": "Gabriel"
            }
        ]
    }
]
~~~

