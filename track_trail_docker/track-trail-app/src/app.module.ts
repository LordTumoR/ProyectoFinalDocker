import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { Exercise } from './exercises/exercises.entity';
import { routine } from './routine/routine.entity';
import { RoutineExercises } from './rutina_ejercicios/routine_exercises.entity';
import { RoutineModule } from './routine/routine.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutineExercisesModule } from './rutina_ejercicios/routine_exercises.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'database',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [User, routine, Exercise, RoutineExercises],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RoutineModule,
    ExercisesModule,
    RoutineExercisesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
