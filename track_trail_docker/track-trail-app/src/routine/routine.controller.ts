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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRoutineDto, UpdateRoutineDto } from './routine.dto';
import { RoutineService } from './routine.service';
import { UsersService } from 'src/users/users.service';

@Controller('routines')
export class RoutineController {
  constructor(private readonly routineService: RoutineService,  
      private readonly userService: UsersService, 
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las rutinas' })
  @ApiResponse({ status: 200, description: 'Lista de rutinas obtenida con éxito.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllRoutines(@Query('xml') xml?: string) {
    try {
      return this.routineService.getAllRoutines(xml);
    } catch (err) {
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una rutina por ID' })
  @ApiResponse({ status: 200, description: 'Rutina encontrada.' })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  async getRoutine(@Param('id') id: string, @Query('xml') xml?: string) {
    const routineId = parseInt(id);
    if (isNaN(routineId)) {
      throw new HttpException('Invalid routine ID', HttpStatus.BAD_REQUEST);
    }

    const routine = await this.routineService.getRoutine(routineId, xml);
    if (!routine) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }

    return routine;
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener rutinas por usuario' })
  @ApiResponse({ status: 200, description: 'Lista de rutinas obtenida con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
  @ApiResponse({ status: 404, description: 'No se encontraron rutinas para este usuario.' })
  async getRoutinesByUser(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    const routines = await this.routineService.getRoutinesByUser(parsedUserId);
    if (!routines.length) {
      throw new HttpException('No se encontraron rutinas para este usuario', HttpStatus.NOT_FOUND);
    }

    return routines;
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva rutina' })
  @ApiResponse({ status: 201, description: 'Rutina creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async createRoutine(@Body() createRoutineDto: CreateRoutineDto) {
    const { id_user } = createRoutineDto;

    const userExists = await this.userService.getUser(id_user);
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.routineService.createRoutine(createRoutineDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una rutina' })
  @ApiResponse({ status: 200, description: 'Rutina actualizada con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  async updateRoutine(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    const routineId = parseInt(id);
    if (isNaN(routineId)) {
      throw new HttpException('Invalid routine ID', HttpStatus.BAD_REQUEST);
    }

    const updatedRoutine = await this.routineService.updateRoutine({
      ...updateRoutineDto,
      id_routine: routineId,
    });

    if (!updatedRoutine) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }

    return updatedRoutine;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una rutina' })
  @ApiResponse({ status: 200, description: 'Rutina eliminada con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de rutina inválido.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  async deleteRoutine(@Param('id') id: string) {
    const routineId = parseInt(id);
    if (isNaN(routineId)) {
      throw new HttpException('Invalid routine ID', HttpStatus.BAD_REQUEST);
    }

    const deleted = await this.routineService.deleteRoutine(routineId);
    if (!deleted) {
      throw new HttpException('Rutina no encontrada', HttpStatus.NOT_FOUND);
    }

    return { message: 'Rutina eliminada con éxito' };
  }
}
