import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExerciseDto, UpdateExerciseDto } from './exercises.dto';
import { ExercisesService } from './exercises.service';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ejercicios' })
  @ApiResponse({ status: 200, description: 'Lista de ejercicios obtenida correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllExercises(@Query('xml') xml?: string) {
    try {
      return this.exercisesService.getAllExercises(xml);
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ejercicio por ID' })
  @ApiResponse({ status: 200, description: 'Ejercicio obtenido correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de ejercicio inválido.' })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado.' })
  getExercise(@Param('id') id: string, @Query('xml') xml?: string) {
    const exerciseId = parseInt(id);
    if (isNaN(exerciseId)) {
      throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.exercisesService.getExercise(exerciseId, xml);
  }

  @Post(':routineId/:userId')
  @ApiOperation({ summary: 'Crear un ejercicio y asignarlo a una rutina' })
  @ApiResponse({ status: 201, description: 'Ejercicio creado y asignado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el ejercicio.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createExercise(
    @Body() createExerciseDto: CreateExerciseDto,
    @Param('routineId', ParseIntPipe) routineId?: number,
    @Param('userId', ParseIntPipe) userId?: number,
  ) {
    if (routineId) {
      return this.exercisesService.addExerciseToRoutine(routineId, createExerciseDto, userId);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un ejercicio' })
  @ApiResponse({ status: 200, description: 'Ejercicio actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de ejercicio inválido.' })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado.' })
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
  @ApiOperation({ summary: 'Eliminar un ejercicio' })
  @ApiResponse({ status: 200, description: 'Ejercicio eliminado con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de ejercicio inválido.' })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado.' })
  deleteExercise(@Param('id') id: string) {
    const exerciseId = parseInt(id);
    if (isNaN(exerciseId)) {
      throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
    }
    return this.exercisesService.deleteExercise(exerciseId);
  }
}
