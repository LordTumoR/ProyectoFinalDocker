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
import { CreateRoutineExercisesDto, UpdateRoutineExercisesDto } from './routine_exercises.dto';
import { RoutineExercisesService } from './routine_exercises.service';

@Controller('routine-exercises')
export class RoutineExercisesController {
  constructor(private readonly routineExercisesService: RoutineExercisesService) {}

  @Get()
  getAllRoutineExercises(@Query('xml') xml?: string) {
    try {
      return this.routineExercisesService.getAllRoutineExercises(xml);
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
  getRoutineExercise(@Param('id') id: string, @Query('xml') xml?: string) {
    const routineExerciseId = parseInt(id);
    if (isNaN(routineExerciseId)) {
      throw new HttpException('Invalid routine exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.routineExercisesService.getRoutineExercise(routineExerciseId, xml);
  }

  @Post()
  createRoutineExercise(@Body() createRoutineExercisesDto: CreateRoutineExercisesDto) {
    return this.routineExercisesService.createRoutineExercise(createRoutineExercisesDto);
  }

  @Put(':id')
  updateRoutineExercise(@Param('id') id: string, @Body() updateRoutineExercisesDto: UpdateRoutineExercisesDto) {
    const routineExerciseId = parseInt(id);
    if (isNaN(routineExerciseId)) {
      throw new HttpException('Invalid routine exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.routineExercisesService.updateRoutineExercise({
      ...updateRoutineExercisesDto,
      id_routine_exercise: routineExerciseId,
    });
  }

  @Delete(':id')
  deleteRoutineExercise(@Param('id') id: string) {
    const routineExerciseId = parseInt(id);
    if (isNaN(routineExerciseId)) {
      throw new HttpException('Invalid routine exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.routineExercisesService.deleteRoutineExercise(routineExerciseId);
  }
}
