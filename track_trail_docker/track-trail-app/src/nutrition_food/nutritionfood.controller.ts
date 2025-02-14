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
import { CreateNutritionFoodDto, UpdateNutritionFoodDto } from './nutritionfood.dto';
import { NutritionFoodService } from './nutritionfood.service';
import { NutritionRecordService } from 'src/nutrition record/nutrition_record.service';
import { CreateNutritionRecordDto } from 'src/nutrition record/nutrition_record.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('nutrition-foods')
@Controller('nutrition-foods')
export class NutritionFoodController {
  constructor(
    private readonly nutritionFoodService: NutritionFoodService,
    private readonly nutritionRecordService: NutritionRecordService,
     private readonly userService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los alimentos' })
  @ApiResponse({ status: 200, description: 'Lista de alimentos obtenida correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllNutritionFoods(@Query('xml') xml?: string) {
    try {
      return this.nutritionFoodService.getAllNutritionFoods(xml);
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alimento por ID' })
  @ApiResponse({ status: 200, description: 'Alimento obtenido correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de alimento inválido.' })
  @ApiResponse({ status: 404, description: 'Alimento no encontrado.' })
  getNutritionFood(@Param('id') id: string, @Query('xml') xml?: string) {
    const nutritionFoodId = parseInt(id);
    if (isNaN(nutritionFoodId)) {
      throw new HttpException('Invalid nutrition food ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionFoodService.getNutritionFood(nutritionFoodId, xml);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alimento' })
  @ApiResponse({ status: 201, description: 'Alimento creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el alimento.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createNutritionFood(@Body() createNutritionRecordDto: CreateNutritionRecordDto) {
    const { user_id,nutritionFoods  } = createNutritionRecordDto;

    const userExists = await this.userService.getUser(user_id);
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    for (const food of nutritionFoods) {
      const foodExists = await this.nutritionFoodService.getNutritionFood(food.foodId);
      if (!foodExists) {
        throw new HttpException(`Food with ID ${food.foodId} not found`, HttpStatus.NOT_FOUND);
      }
    }
    try {
      return this.nutritionFoodService.createNutritionRecord(createNutritionRecordDto); 
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener registros de nutrición por usuario' })
  @ApiResponse({ status: 200, description: 'Registros obtenidos correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
  async getNutritionRecordsByUser(@Param('userId') userId: string) {
    const userIdParsed = parseInt(userId);
    if (isNaN(userIdParsed)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionRecordService.getNutritionRecordsByUser(userIdParsed);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un alimento' })
  @ApiResponse({ status: 200, description: 'Alimento actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de alimento inválido.' })
  @ApiResponse({ status: 404, description: 'Alimento no encontrado.' })
  updateNutritionFood(
    @Param('id') id: string,
    @Body() updateNutritionFoodDto: UpdateNutritionFoodDto
  ) {
    const nutritionFoodId = parseInt(id);
    if (isNaN(nutritionFoodId)) {
      throw new HttpException('Invalid nutrition food ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionFoodService.updateNutritionFood({
      ...updateNutritionFoodDto,
      id: nutritionFoodId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un alimento' })
  @ApiResponse({ status: 200, description: 'Alimento eliminado con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de alimento inválido.' })
  @ApiResponse({ status: 404, description: 'Alimento no encontrado.' })
  deleteNutritionFood(@Param('id') id: string) {
    const nutritionFoodId = parseInt(id);
    if (isNaN(nutritionFoodId)) {
      throw new HttpException('Invalid nutrition food ID', HttpStatus.BAD_REQUEST);
    }
    return this.nutritionFoodService.deleteNutritionFood(nutritionFoodId);
  }
}
