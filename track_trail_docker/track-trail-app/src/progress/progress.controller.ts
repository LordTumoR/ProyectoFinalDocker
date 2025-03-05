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

    @Get('evolution-weight/:exerciseId')
    @ApiOperation({ summary: 'Obtener evolución del peso levantado' })
    @ApiResponse({ status: 200, description: 'Evolución de peso levantado obtenida correctamente.' })
    @ApiResponse({ status: 400, description: 'ID de ejercicio inválido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getEvolutionWeight(@Param('exerciseId') exerciseId: string) {
        const exerciseIdParsed = parseInt(exerciseId);
        if (isNaN(exerciseIdParsed)) {
            throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
        }
        return this.progressService.getWeightProgress(exerciseIdParsed);
    }

    @Get('evolution-reps-sets/:exerciseId')
    @ApiOperation({ summary: 'Obtener evolución de repeticiones y sets' })
    @ApiResponse({ status: 200, description: 'Evolución de repeticiones y sets obtenida correctamente.' })
    @ApiResponse({ status: 400, description: 'ID de ejercicio inválido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getEvolutionRepsSets(@Param('exerciseId') exerciseId: string) {
        const exerciseIdParsed = parseInt(exerciseId);
        if (isNaN(exerciseIdParsed)) {
            throw new HttpException('Invalid exercise ID', HttpStatus.BAD_REQUEST);
        }
        return this.progressService.getRepetitionProgress(exerciseIdParsed);
    }

    @Get('training-history')
    @ApiOperation({ summary: 'Obtener historial de entrenamientos' })
    @ApiResponse({ status: 200, description: 'Historial de entrenamientos obtenido correctamente.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getTrainingHistory() { 
        return this.progressService.getWorkoutHistory();
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
        return this.progressService.getStreakCount(userIdParsed);
    }

    @Get('general-summary')
    @ApiOperation({ summary: 'Obtener resumen general del progreso' })
    @ApiResponse({ status: 200, description: 'Resumen general obtenido correctamente.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    getGeneralSummary() {
        return this.progressService.getProgressSummary();
    }
}
