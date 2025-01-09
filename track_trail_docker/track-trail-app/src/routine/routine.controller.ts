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
import { CreateRoutineDto, UpdateRoutineDto } from './routine.dto';
import { RoutineService } from './routine.service';

@Controller('routines')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Get()
  getAllRoutines(@Query('xml') xml?: string) {
    try {
      return this.routineService.getAllRoutines(xml);
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
  getRoutine(@Param('id') id: string, @Query('xml') xml?: string) {
    const routineId = parseInt(id);
    if (isNaN(routineId)) {
      throw new HttpException('Invalid routine ID', HttpStatus.BAD_REQUEST);
    }
    return this.routineService.getRoutine(routineId, xml);
  }

  @Post()
  createRoutine(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.createRoutine(createRoutineDto);
  }

  @Put(':id')
  updateRoutine(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    const routineId = parseInt(id);
    if (isNaN(routineId)) {
      throw new HttpException('Invalid routine ID', HttpStatus.BAD_REQUEST);
    }
    return this.routineService.updateRoutine({
      ...updateRoutineDto,
      id_routine: routineId,
    });
  }

  @Delete(':id')
  deleteRoutine(@Param('id') id: string) {
    const routineId = parseInt(id);
    if (isNaN(routineId)) {
      throw new HttpException('Invalid routine ID', HttpStatus.BAD_REQUEST);
    }
    return this.routineService.deleteRoutine(routineId);
  }
}
