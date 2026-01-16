import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postagem } from './postagem/entities/postagem.entity';
import { PostagemModule } from './postagem/postagem.module';
import { TemaModule } from './temas/tema.module';
import { Tema } from './temas/entities/tema.entity';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProdService } from './data/services/prod.service';//Para executar Remotamente (Render)
import { DevService } from './data/services/dev.service';//Para executar localmente

// Decorator - Etiqueta de Metadados
@Module({
  imports: [  // Configurando o TypeORM
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService,
        imports: [ConfigModule],
    }),
    PostagemModule,
    TemaModule,
    AuthModule,
    UsuarioModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }