import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
            TypeOrmModule.forRoot({
            type: "sqlite",
            database: ":memory:",
            entities: [__dirname + "./../src/**/entities/*.entity.ts"],
            synchronize: true,
          dropSchema: true
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
	await app.close();
  });

 // it - este, isso
    // usamos essa estrutura para criar o nosso teste 
    it("01 - Deve Cadastrar um novo Usuário", async () => {
        const resposta = await request(app.getHttpServer()) // simulamos uma requisição HTTP
            .post('/usuarios/cadastrar')    // indicamos qual endpoint da nossa aplicação essa requisição será enviada
            .send({                         // simulamos o objeto JSON
                nome: 'Root',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: '-',
            })
            .expect(201)                    // indicamos qual resultado é esperado (expect) para esse teste

        usuarioId = resposta.body.id;       // guardamos o id criado em uma variavel para reutilizá-lo em outro teste

    });

    it("02 - Não Deve Cadastrar um Usuário Duplicado", async () => {
        await request(app.getHttpServer())
            .post('/usuarios/cadastrar')
            .send({
                nome: 'Root',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: '-',
            })
            .expect(400)
    });

    it("03 - Deve Autenticar o Usuário (Login)", async () => {
        const resposta = await request(app.getHttpServer())
            .post("/usuarios/logar")
            .send({
                usuario: 'root@root.com',
                senha: 'rootroot',
            })
            .expect(200)

        token = resposta.body.token;    // guardamos o token criado em uma variavel para reutilizá-lo em outro teste
    })

    it("04 - Deve Listar todos os Usuários", async () => {
        return request(app.getHttpServer())
            .get('/usuarios/all')
            .set('Authorization', `${token}`)   // passamos a variavel token nessa requisição pois ela é protegida pela Security
            .send({})
            .expect(200)
    })

    it("05 - Deve Atualizar um Usuário", async () => {
        return request(app.getHttpServer())
            .put('/usuarios/atualizar')
            .set('Authorization', `${token}`)
            .send({
                id: usuarioId,
                nome: 'Root Atualizado',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: '-',
            })
            .expect(200)
            .then(resposta => { // Depois da execução do teste, então (then) execute o a asserção abaixo
                expect("Root Atualizado").toEqual(resposta.body.nome)   // esperamos que o valor do nome dentro corpo da resposta seja igual a Root Atualizado
            })

    })

});
