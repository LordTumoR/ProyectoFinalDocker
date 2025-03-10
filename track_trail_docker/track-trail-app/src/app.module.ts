import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Entities
import { User } from './users/users.entity';
import { Routine } from './routine/routine.entity';
import { Exercise } from './exercises/exercises.entity';
import { RoutineExercises } from './rutina_ejercicios/routine_exercises.entity';
import { Food } from './food/food.entity';

// Modules
import { UsersModule } from './users/users.module';
import { RoutineModule } from './routine/routine.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutineExercisesModule } from './rutina_ejercicios/routine_exercises.module';
import { FoodModule } from './food/food.module';
import { NutritionRecord } from './nutrition record/nutrition_record.entity';
import { NutritionRecordModule } from './nutrition record/nutrition_record.module';
import { UploadModule } from './upload/upload.module';
import { FilesModule } from './files/files.module';
import { UploadEntity } from './upload/upload.entity';
import { RoutineService } from './routine/routine.service';
import { UsersService } from './users/users.service';
import { ExercisesService } from './exercises/exercises.service';
import { RoutineExercisesService } from './rutina_ejercicios/routine_exercises.service';
import { FoodService } from './food/food.service';
import { NutritionRecordService } from './nutrition record/nutrition_record.service';
import { UploadService } from './upload/upload.services';
import { FilesService } from './files/files.services';
import { UsersController } from './users/users.controller';
import { RoutineController } from './routine/routine.controller';
import { ExercisesController } from './exercises/exercises.controller';
import { UploadController } from './upload/upload.controller';
import { FilesController } from './files/files.controller';
import { NutritionRecordController } from './nutrition record/nutrition_record.controller';
import { FoodController } from './food/food.controller';
import { RoutineExercisesController } from './rutina_ejercicios/routine_exercises.controller';
import { UtilsModule } from './utils/utils.module';
import { UtilsService } from './utils/utils.service';
import { NutritionFood } from './nutrition_food/nutritionfood.entity';
import { NutritionFoodModule } from './nutrition_food/nutritionfood.module';
import { NutritionFoodService } from './nutrition_food/nutritionfood.service';
import { NutritionFoodController } from './nutrition_food/nutritionfood.controller';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.services';
import { Progress } from './progress/progress.entity';
import { ProgressModule } from './progress/progress.module';
import { ProgressController } from './progress/progress.controller';
import { ProgressService } from './progress/progress.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RoutineModule,
    ExercisesModule,
    RoutineExercisesModule,
    FoodModule,
    NutritionRecordModule,
    UploadModule,
    FilesModule,
    UtilsModule,
    NutritionFoodModule,
    NotificationModule,
    ProgressModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User,
      Routine,
      Exercise,
      RoutineExercises,
      Food,
      NutritionRecord,
      UploadEntity,
      Progress,
    NutritionFood]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'database',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          User,
          Routine,
          Exercise,
          RoutineExercises,
          Food,
          NutritionRecord,
          UploadEntity,
          NutritionFood,
          Progress,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, RoutineController,ProgressController, ExercisesController, NotificationController,RoutineExercisesController, FoodController, NutritionRecordController, UploadController, FilesController, NutritionFoodController],
  providers: [UsersService, RoutineService, ProgressService,ExercisesService, RoutineExercisesService,NotificationService, FoodService, NutritionRecordService,UtilsService, UploadService, FilesService, NutritionFoodService],
})
export class AppModule {
}
