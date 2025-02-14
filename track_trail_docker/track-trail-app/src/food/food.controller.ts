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
import { CreateFoodDto, UpdateFoodDto } from './food.dto';
import { FoodService } from './food.service';

@ApiTags('foods')
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los alimentos' })
  @ApiResponse({ status: 200, description: 'Lista de alimentos obtenida correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllFoods(@Query('xml') xml?: string) {
    try {
      return this.foodService.getAllFoods(xml);
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
  getFood(@Param('id') id: string, @Query('xml') xml?: string) {
    const foodId = parseInt(id);
    if (isNaN(foodId)) {
      throw new HttpException('Invalid food ID', HttpStatus.BAD_REQUEST);
    }
    return this.foodService.getFood(foodId, xml);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alimento' })
  @ApiResponse({ status: 201, description: 'Alimento creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el alimento.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  createFood(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.createFood(createFoodDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un alimento' })
  @ApiResponse({ status: 200, description: 'Alimento actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'ID de alimento inválido.' })
  @ApiResponse({ status: 404, description: 'Alimento no encontrado.' })
  updateFood(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    const foodId = parseInt(id);
    if (isNaN(foodId)) {
      throw new HttpException('Invalid food ID', HttpStatus.BAD_REQUEST);
    }
    return this.foodService.updateFood({
      ...updateFoodDto,
      id: foodId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un alimento' })
  @ApiResponse({ status: 200, description: 'Alimento eliminado con éxito.' })
  @ApiResponse({ status: 400, description: 'ID de alimento inválido.' })
  @ApiResponse({ status: 404, description: 'Alimento no encontrado.' })
  deleteFood(@Param('id') id: string) {
    const foodId = parseInt(id);
    if (isNaN(foodId)) {
      throw new HttpException('Invalid food ID', HttpStatus.BAD_REQUEST);
    }
    return this.foodService.deleteFood(foodId);
  }
}
