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
import { NutritionRecordService } from './nutrition_record.service';
import { CreateNutritionRecordDto, UpdateNutritionRecordDto } from './nutrition_record.dto';

@ApiTags('nutrition-records')
@Controller('nutrition-records')
export class NutritionRecordController {
  constructor(private readonly nutritionRecordService: NutritionRecordService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de nutrición' })
  @ApiResponse({ status: 200, description: 'Lista de registros obtenida correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllNutritionRecords(@Query('xml') xml?: string) {
    try {
      return this.nutritionRecordService.getAllNutritionRecords(xml);
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de nutrición por ID' })
  @ApiResponse({ status: 200, description: 'Registro de nutrición obtenido correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de registro inválido.' })
  @ApiResponse({ status: 404, description: 'Registro de nutrición no encontrado.' })
  getNutritionRecord(@Param('id') id: string, @Query('xml') xml?: string) {
    const recordId = parseInt(id);
    if (isNaN(recordId)) {
      throw new HttpException('Invalid nutrition record ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionRecordService.getNutritionRecord(recordId, xml);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de nutrición' })
  @ApiResponse({ status: 201, description: 'Registro de nutrición creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el registro de nutrición.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  createNutritionRecord(@Body() createNutritionRecordDto: CreateNutritionRecordDto) {
    console.log(createNutritionRecordDto);
    return this.nutritionRecordService.createNutritionRecord(createNutritionRecordDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener registros de nutrición por usuario' })
  @ApiResponse({ status: 200, description: 'Registros de nutrición obtenidos correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
  async getNutritionRecordsByUser(@Param('userId') userId: string) {
    const userIdParsed = parseInt(userId);
    if (isNaN(userIdParsed)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionRecordService.getNutritionRecordsByUser(userIdParsed);
  }

  @Post(':id/add-foods')
  @ApiOperation({ summary: 'Agregar alimentos a un registro de nutrición' })
  @ApiResponse({ status: 200, description: 'Alimentos añadidos al registro de nutrición.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos al añadir alimentos.' })
  async addFoodsToNutritionRecord(
    @Param('id') nutritionRecordId: number,
    @Body() foods: { foodId: number; amount: number; nutritionRecordId: number }[],
  ) {
    return this.nutritionRecordService.addFoodsToNutritionRecord(nutritionRecordId, foods);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un registro de nutrición' })
  @ApiResponse({ status: 200, description: 'Registro de nutrición actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de registro inválido.' })
  @ApiResponse({ status: 404, description: 'Registro de nutrición no encontrado.' })
  updateNutritionRecord(
    @Param('id') id: string,
    @Body() updateNutritionRecordDto: UpdateNutritionRecordDto
  ) {
    const recordId = parseInt(id);
    if (isNaN(recordId)) {
      throw new HttpException('Invalid nutrition record ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionRecordService.updateNutritionRecord({
      ...updateNutritionRecordDto,
      id: recordId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de nutrición' })
  @ApiResponse({ status: 200, description: 'Registro de nutrición eliminado con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de registro inválido.' })
  @ApiResponse({ status: 404, description: 'Registro de nutrición no encontrado.' })
  deleteNutritionRecord(@Param('id') id: string) {
    const recordId = parseInt(id);
    if (isNaN(recordId)) {
      throw new HttpException('Invalid nutrition record ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionRecordService.deleteNutritionRecord(recordId);
  }
}
