import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateExerciseDto, UpdateExerciseDto } from './exercises.dto';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  getAllExercises(@Query('xml') xml?: string) {
    try {
      return this.exercisesService.getAllExercises(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  @Get(':id')
  getExercise(@Param('id') id: string, @Query('xml') xml?: string) {
    const exerciseId = parseInt(id);
    if (isNaN(exerciseId)) {
      throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.exercisesService.getExercise(exerciseId, xml);
  }

  @Post()
  createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.createExercise(createExerciseDto);
  }

  @Put(':id')
  updateExercise(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    const exerciseId = parseInt(id);
    if (isNaN(exerciseId)) {
      throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.exercisesService.updateExercise({
      ...updateExerciseDto,
      id_exercises: exerciseId,
    });
  }

  @Delete(':id')
  deleteExercise(@Param('id') id: string) {
    const exerciseId = parseInt(id);
    if (isNaN(exerciseId)) {
      throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.exercisesService.deleteExercise(exerciseId);
  }
}
