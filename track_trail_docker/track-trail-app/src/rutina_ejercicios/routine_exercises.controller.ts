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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoutineExercisesDto, UpdateRoutineExercisesDto } from './routine_exercises.dto';
import { RoutineExercisesService } from './routine_exercises.service';
import { UsersService } from '../users/users.service';
import { RoutineService } from '../routine/routine.service';

@ApiTags('Routine Exercises')
@Controller('routine-exercises')
export class RoutineExercisesController {
  constructor(private readonly routineExercisesService: RoutineExercisesService,
    private readonly userService: UsersService, 
    private readonly routineService: RoutineService,
  ) 
  {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las rutinas de ejercicios' })
  @ApiResponse({ status: 200, description: 'Rutinas obtenidas exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllRoutineExercises(@Query('xml') xml?: string) {
    try {
      return this.routineExercisesService.getAllRoutineExercises(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una rutina de ejercicio por ID' })
  @ApiResponse({ status: 200, description: 'Rutina encontrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  getRoutineExercise(@Param('id') id: string, @Query('xml') xml?: string) {
    const routineExerciseId = parseInt(id);
    if (isNaN(routineExerciseId)) {
      throw new HttpException('ID de rutina inválido', HttpStatus.BAD_REQUEST);
    }

    const routine = this.routineExercisesService.getRoutineExercise(routineExerciseId, xml);
    if (!routine) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }

    return routine;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un ejercicio dentro de una rutina para un usuario' })
  @ApiResponse({ status: 201, description: 'Ejercicio creado y asignado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el ejercicio.' })
  @ApiResponse({ status: 404, description: 'Usuario o rutina no encontrados.' })
  async createRoutineExercise(
    @Body() createRoutineExerciseDto: CreateRoutineExercisesDto
  ) {
    const { id_user, id_routine } = createRoutineExerciseDto;

    const userExists = await this.userService.getUser(id_user);
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const routineExists = await this.routineService.getRoutine(id_routine);
    if (!routineExists) {
      throw new HttpException('Routine not found', HttpStatus.NOT_FOUND);
    }
    return this.routineExercisesService.createRoutineExercise(createRoutineExerciseDto);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una rutina de ejercicio' })
  @ApiResponse({ status: 200, description: 'Rutina actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  updateRoutineExercise(@Param('id') id: string, @Body() updateRoutineExercisesDto: UpdateRoutineExercisesDto) {
    const routineExerciseId = parseInt(id);
    if (isNaN(routineExerciseId)) {
      throw new HttpException('ID de rutina inválido', HttpStatus.BAD_REQUEST);
    }

    const routine = this.routineExercisesService.updateRoutineExercise({
      ...updateRoutineExercisesDto,
      id_routine_exercise: routineExerciseId,
    });

    if (!routine) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }

    return routine;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una rutina de ejercicio' })
  @ApiResponse({ status: 200, description: 'Rutina eliminada exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  deleteRoutineExercise(@Param('id') id: string) {
    const routineExerciseId = parseInt(id);
    if (isNaN(routineExerciseId)) {
      throw new HttpException('ID de rutina inválido', HttpStatus.BAD_REQUEST);
    }

    const deleted = this.routineExercisesService.deleteRoutineExercise(routineExerciseId);
    if (!deleted) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }

    return { message: 'Rutina eliminada correctamente' };
  }

  @Get(':routineId/completion')
  @ApiOperation({ summary: 'Obtener el porcentaje de finalización de una rutina' })
  @ApiResponse({ status: 200, description: 'Porcentaje obtenido exitosamente.', type: Object })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  async getRoutineCompletionPercentage(
    @Param('routineId') routineId: string,
  ): Promise<{ percentage: number }> {
    const routineIdNumber = parseInt(routineId);
  
    if (isNaN(routineIdNumber)) {
      throw new HttpException('ID de rutina inválido', HttpStatus.BAD_REQUEST);
    }
  
    const result = await this.routineExercisesService.calculateCompletionPercentage(routineIdNumber);
  
    if (!result) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }
  
    return result; 
  }
  
}
