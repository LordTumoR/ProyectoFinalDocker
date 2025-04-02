import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/users.entity';
import { Food } from '../food/food.entity';
import { NutritionRecord } from './nutrition_record.entity';
import { CreateNutritionRecordDto, UpdateNutritionRecordDto } from './nutrition_record.dto';
import { NutritionFood } from '../nutrition_food/nutritionfood.entity';
import { CreateNutritionFoodDto } from '../nutrition_food/nutritionfood.dto';

@Injectable()
export class NutritionRecordService {
  constructor(
    @InjectRepository(NutritionRecord)
    private readonly nutritionRecordRepository: Repository<NutritionRecord>,
    @InjectRepository(NutritionFood)
    private readonly nutritionFoodRepository: Repository<NutritionFood>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async getAllNutritionRecords(xml?: string): Promise<NutritionRecord[] | string> {
    const nutritionRecords = await this.nutritionRecordRepository.find({
      relations: ['user', 'nutritionFoods'],
    });

    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({ nutritionRecords });
      return this.convertJSONtoXML(jsonFormatted); 
    } else {
      return nutritionRecords;
    }
  }

  async getNutritionRecord(id: number, xml?: string): Promise<NutritionRecord | string | null> {
    const nutritionRecord = await this.nutritionRecordRepository.findOne({
      where: { id },
      relations: ['user', 'nutritionFoods'],
    });

    if (nutritionRecord) {
      if (xml === 'true') {
        const jsonFormatted = JSON.stringify(nutritionRecord);
        return this.convertJSONtoXML(jsonFormatted); 
      } else {
        return nutritionRecord;
      }
    } else {
      throw new HttpException('Nutrition record not found', HttpStatus.NOT_FOUND);
    }
  }
  async getNutritionRecordsByUser(userId: number): Promise<NutritionRecord[]> {
    const nutritionRecords = await this.nutritionRecordRepository.find({
      where: { user: { id_user: userId } }, 
      relations: ['user', 'nutritionFoods','nutritionFoods.food'], 
    });
  
    if (nutritionRecords.length === 0) {
      throw new HttpException('No nutrition records found for this user', HttpStatus.NOT_FOUND);
    }
  
    return nutritionRecords;

  }async createNutritionRecord(createNutritionRecordDto: CreateNutritionRecordDto): Promise<NutritionRecord> {
    console.log('Iniciando creación de dieta...');
    console.log('Datos recibidos:', createNutritionRecordDto);

    // Crear la nueva dieta, asignando directamente el user_id
    const newNutritionRecord = this.nutritionRecordRepository.create({
        ...createNutritionRecordDto,
        user: { id_user: createNutritionRecordDto.user_id },  // Asignar directamente el user_id
    });

    console.log('Nueva dieta creada (antes de guardar):', newNutritionRecord);

    // Guardar la nueva dieta en la base de datos
    const savedNutritionRecord = await this.nutritionRecordRepository.save(newNutritionRecord);

    console.log('Dieta guardada en la BD:', savedNutritionRecord);

    // Buscar si ya existe una dieta idéntica (sin tener en cuenta el ID)
    const existingNutritionRecord = await this.nutritionRecordRepository.findOne({
        where: {
            name: savedNutritionRecord.name,
            description: savedNutritionRecord.description,
            date: savedNutritionRecord.date,
            imageurl: savedNutritionRecord.imageurl,
        },
    });

    if (existingNutritionRecord && existingNutritionRecord.id !== savedNutritionRecord.id) {
        console.log('Dieta idéntica encontrada pero con diferente ID:', existingNutritionRecord);
        console.log(`Copiando alimentos de la dieta original (${existingNutritionRecord.id}) a la nueva (${savedNutritionRecord.id})`);

        // Pasar correctamente los tres parámetros en la llamada
        await this.copyNutritionRecord(
            existingNutritionRecord.id,    // ID del registro original
            createNutritionRecordDto.user_id,  // ID del usuario
            savedNutritionRecord.id       // ID del nuevo registro
        );
    } else {
        console.log('No se encontró ninguna dieta idéntica de otro usuario o es la misma dieta.');
    }

    console.log('Finalizada la creación de dieta.');
    return savedNutritionRecord;
}

  async addFoodsToNutritionRecord(
    nutritionRecordId: number,
    addFoodsDto: CreateNutritionFoodDto[], 
  ): Promise<NutritionRecord> {
    const nutritionRecord = await this.nutritionRecordRepository.findOne({
      where: { id: nutritionRecordId },
    });
  
    if (!nutritionRecord) {
      throw new HttpException('Nutrition record not found', HttpStatus.NOT_FOUND);
    }
  
    const nutritionFoods = await Promise.all(
      addFoodsDto.map(async (foodDto) => {
        const food = await this.foodRepository.findOne({
          where: { id: foodDto.foodId },
        });
  
        if (!food) {
          throw new HttpException(`Food with ID ${foodDto.foodId} not found`, HttpStatus.NOT_FOUND);
        }
  
        const nutritionFood = this.nutritionFoodRepository.create({
          nutritionRecord, 
          food, 
          amount: foodDto.amount,
        });
  
        return this.nutritionFoodRepository.save(nutritionFood);
      }),
    );
    return this.nutritionRecordRepository.findOne({
      where: { id: nutritionRecordId },
      relations: ['nutritionFoods', 'nutritionFoods.food'],
    });
  }
  async updateNutritionRecord(updateNutritionRecordDto: UpdateNutritionRecordDto): Promise<NutritionRecord> {
    // Buscar el NutritionRecord
    const nutritionRecord = await this.nutritionRecordRepository.findOne({
      where: { id: updateNutritionRecordDto.id },
      relations: ['nutritionFoods'], 
    });
  
    if (!nutritionRecord) {
      throw new HttpException('Nutrition record not found', HttpStatus.NOT_FOUND);
    }
  
    if (updateNutritionRecordDto.user_id) {
      const user = await this.userRepository.findOne({
        where: { id_user: updateNutritionRecordDto.user_id },
      });
  
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      nutritionRecord.user = user; 
    }
  
    if (updateNutritionRecordDto.name) nutritionRecord.name = updateNutritionRecordDto.name;
    if (updateNutritionRecordDto.description) nutritionRecord.description = updateNutritionRecordDto.description;
    if (updateNutritionRecordDto.date) nutritionRecord.date = updateNutritionRecordDto.date;
     // Asignar isFavorite si se pasa en el DTO
     if (updateNutritionRecordDto.isFavorite !== undefined) {
      nutritionRecord.isFavorite = updateNutritionRecordDto.isFavorite;  // Actualizar isFavorite
  }
    if (updateNutritionRecordDto.nutritionFoods) {
      await this.nutritionFoodRepository.delete({
        nutritionRecord: { id: nutritionRecord.id },
      });
  
      const nutritionFoods = updateNutritionRecordDto.nutritionFoods.map(async (nutritionFoodDto) => {
        const food = await this.foodRepository.findOne({
          where: { id: nutritionFoodDto.foodId },
        });
  
        if (!food) {
          throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
        }
  
        const nutritionFood = this.nutritionFoodRepository.create({
          nutritionRecord,
          food,
          amount: nutritionFoodDto.amount,
        });
  
        return this.nutritionFoodRepository.save(nutritionFood);
      });
  
      await Promise.all(nutritionFoods);
    }
  
    return this.nutritionRecordRepository.save(nutritionRecord);
  }
  

  async deleteNutritionRecord(id: number): Promise<void> {
    const result = await this.nutritionRecordRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Nutrition record not found', HttpStatus.NOT_FOUND);
    }
  }

  private convertJSONtoXML(json: string): string {
    return json; 
  }
  async copyNutritionRecord(
    id_nutrition_record_original: number,
    id_user: number,
    id_nutrition_record_nuevo: number
  ) {
    console.log(`Iniciando copia de registro de nutrición...`);
    console.log(`ID Registro Nutrición Original: ${id_nutrition_record_original}, ID Usuario: ${id_user}, ID Nuevo Registro Nutrición: ${id_nutrition_record_nuevo}`);
  
    // 1. Obtener el registro de nutrición original con sus relaciones (alimentos)
    const existingNutritionRecord = await this.nutritionRecordRepository.findOne({
      where: { id: id_nutrition_record_original },
      relations: ['nutritionFoods', 'nutritionFoods.food'],
    });
  
    if (!existingNutritionRecord) {
      console.error('Registro de nutrición original no encontrado');
      throw new NotFoundException('Registro de nutrición original no encontrado');
    }
  
    console.log(`Registro de nutrición original encontrado: ${existingNutritionRecord.id}`);
  
    const existingNutritionFoods = existingNutritionRecord.nutritionFoods;
    console.log(`Total de alimentos en el registro original: ${existingNutritionFoods.length}`);
  
    // Mapeo para relacionar alimentos originales con sus copias
    const foodMap = new Map<number, number>();
  
    for (const nutritionFood of existingNutritionFoods) {
      console.log(`Procesando alimento con ID: ${nutritionFood.food.id}`);
  
      // 2. Crear una copia del alimento original
      const newFood = this.foodRepository.create({
        name: nutritionFood.food.name,
        brand: nutritionFood.food.brand,
        category: nutritionFood.food.category,
        calories: nutritionFood.food.calories,
        carbohydrates: nutritionFood.food.carbohydrates,
        protein: nutritionFood.food.protein,
        fat: nutritionFood.food.fat,
        fiber: nutritionFood.food.fiber,
        sugar: nutritionFood.food.sugar,
        sodium: nutritionFood.food.sodium,
        cholesterol: nutritionFood.food.cholesterol,
        mealtype: nutritionFood.food.mealtype,
        date: nutritionFood.food.date,
        imageurl: nutritionFood.food.imageurl,
      });
  
      const savedFood = await this.foodRepository.save(newFood);
      console.log(`Alimento copiado con nueva ID: ${savedFood.id}`);
  
      // Guardamos la relación entre el alimento original y su copia
      foodMap.set(nutritionFood.food.id, savedFood.id);
  
      // 3. Crear la relación en nutrition_food con los nuevos IDs
      console.log(`Creando nueva relación en nutrition_food`);
      const newNutritionFood = this.nutritionFoodRepository.create({
        nutritionRecord: { id: id_nutrition_record_nuevo }, // Nuevo registro de nutrición
        food: { id: savedFood.id }, // Nuevo alimento
        amount: nutritionFood.amount,
      });
  
      const savedNutritionFood = await this.nutritionFoodRepository.save(newNutritionFood);
      console.log(`Relación creada con ID: ${savedNutritionFood.id}`);
    }
  
    console.log(`Copia de registro de nutrición finalizada correctamente.`);
  }
  
}
