import {
    Controller,
    Get,
    Param,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Get('evolution-weight/:muscleGroup')
    @ApiOperation({ summary: 'Obtener evolución del peso levantado por grupo muscular' })
    @ApiResponse({ status: 200, description: 'Evolución de peso levantado obtenida correctamente.' })
    @ApiResponse({ status: 400, description: 'Grupo muscular inválido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getEvolutionWeight(@Param('muscleGroup') muscleGroup: string) {
      return this.progressService.getWeightProgress(muscleGroup);
    }
    

   @Get('evolution-reps-sets/:muscleGroup')
@ApiOperation({ summary: 'Obtener evolución de repeticiones y sets por grupo muscular' })
@ApiResponse({ status: 200, description: 'Evolución de repeticiones y sets obtenida correctamente.' })
@ApiResponse({ status: 400, description: 'Grupo muscular inválido.' })
@ApiResponse({ status: 500, description: 'Error interno del servidor.' })
getEvolutionRepsSets(@Param('muscleGroup') muscleGroup: string) {
  return this.progressService.getRepetitionProgress(muscleGroup);
}

    @Get('personal-records')
    @ApiOperation({ summary: 'Obtener récords personales de los ejercicios' })
    @ApiResponse({ status: 200, description: 'Récords personales obtenidos correctamente.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getPersonalRecords() {
        return this.progressService.getPersonalRecords();
    }

    @Get('training-streak/:userId')
    @ApiOperation({ summary: 'Obtener el contador de días entrenados seguidos' })
    @ApiResponse({ status: 200, description: 'Contador de días entrenados seguidos obtenido correctamente.' })
    @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getTrainingStreak(@Param('userId') userId: string) {
        const userIdParsed = parseInt(userId);
        if (isNaN(userIdParsed)) {
            throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
        }
        return this.progressService.getTrainingStreak(userIdParsed);
    }
}
