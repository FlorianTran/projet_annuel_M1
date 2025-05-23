import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AbonnementModule } from './abonnement/abonnement.module';
import { Abonnement } from './abonnement/entities/abonnement.entity';
import { PaiementModule } from './paiement/paiement.module';
import { Paiement } from './paiement/entities/paiement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get('DATABASE_HOST');
        console.log('> DATABASE_HOST (via ConfigService):', host);

        return {
          type: 'postgres',
          host: host ?? 'localhost',
          port: parseInt(config.get('DATABASE_PORT') ?? '5432', 10),
          username: config.get('DATABASE_USER') ?? 'postgres',
          password: config.get('DATABASE_PASSWORD') ?? 'postgres',
          database: config.get('DATABASE_NAME') ?? 'dbpostgres',
          entities: [User, Abonnement, Paiement],
          synchronize: true,
        };
      },
    }),
    UserModule,
    AbonnementModule,
    PaiementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
