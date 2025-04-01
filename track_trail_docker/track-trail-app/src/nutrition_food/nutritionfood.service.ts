import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionFood } from './nutritionfood.entity';
import { CreateNutritionFoodDto, UpdateNutritionFoodDto } from './nutritionfood.dto';
import { NutritionRecord } from 'src/nutrition record/nutrition_record.entity';
import { Food } from 'src/food/food.entity';
import { CreateNutritionRecordDto } from 'src/nutrition record/nutrition_record.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class NutritionFoodService {
  constructor(
    @InjectRepository(NutritionFood)
    private readonly nutritionFoodRepository: Repository<NutritionFood>,
    @InjectRepository(NutritionRecord)
    private readonly nutritionRecordRepository: Repository<NutritionRecord>,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllNutritionFoods(xml?: string): Promise<NutritionFood[]> {
    try {
      return await this.nutritionFoodRepository.find();
    } catch (err) {
      throw new Error('Error fetching nutrition foods: ' + err.message);
    }
  }

  async getNutritionFood(id: number, xml?: string): Promise<NutritionFood> {
    try {
      const nutritionFood = await this.nutritionFoodRepository.findOne({
        where: { id },
        relations: ['nutritionRecord', 'food'],
      });

      if (!nutritionFood) {
        throw new Error('Nutrition food not found');
      }

      return nutritionFood;
    } catch (err) {
      throw new Error('Error fetching nutrition food: ' + err.message);
    }
  }

  async createNutritionRecord(createNutritionRecordDto: CreateNutritionRecordDto): Promise<NutritionRecord> {
    console.log('createNutritionRecord method called'); 

    const { user_id, nutritionFoods, date, name, description,imageurl } = createNutritionRecordDto;

    const user = await this.userRepository.findOne({ where: { id_user: user_id } });
    if (!user) {
      throw new Error('User not found');
    }

    const newNutritionRecord = this.nutritionRecordRepository.create({
      name,
      description,
      user,
      date,
      imageurl,
    });

    const savedNutritionRecord = await this.nutritionRecordRepository.save(newNutritionRecord);

    const nutritionFoodEntities = nutritionFoods.map(async (foodDto) => {
      const { foodId, amount } = foodDto;
      const food = await this.foodRepository.findOne({ where: { id: foodId } });
      if (!food) {
        throw new Error('Food not found');
      }

      const nutritionFood = this.nutritionFoodRepository.create({
        nutritionRecord: savedNutritionRecord,
        food,
        amount,
      });

      return this.nutritionFoodRepository.save(nutritionFood);
    });

    await Promise.all(nutritionFoodEntities);

    return savedNutritionRecord;
  }

  async updateNutritionFood(
    updateNutritionFoodDto: UpdateNutritionFoodDto,
  ): Promise<NutritionFood> {
    const { id, nutritionRecordId, foodId, amount } = updateNutritionFoodDto;

    try {
      const nutritionFood = await this.nutritionFoodRepository.findOne({ where: { id } });

      if (!nutritionFood) {
        throw new Error('Nutrition food not found');
      }

      const nutritionRecord = await this.nutritionRecordRepository.findOne({ where: { id: nutritionRecordId } });
      const food = await this.foodRepository.findOne({ where: { id: foodId } });

      if (!nutritionRecord || !food) {
        throw new Error('NutritionRecord or Food not found');
      }

      nutritionFood.nutritionRecord = nutritionRecord;
      nutritionFood.food = food;
      nutritionFood.amount = amount;

      return await this.nutritionFoodRepository.save(nutritionFood);
    } catch (err) {
      throw new Error('Error updating nutrition food: ' + err.message);
    }
  }

  async deleteNutritionFood(id: number): Promise<void> {
    try {
      const nutritionFood = await this.nutritionFoodRepository.findOne({ where: { id } });

      if (!nutritionFood) {
        throw new Error('Nutrition food not found');
      }

      await this.nutritionFoodRepository.remove(nutritionFood);
    } catch (err) {
      throw new Error('Error deleting nutrition food: ' + err.message);
    }
  }
}
