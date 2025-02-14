import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/users.entity';
import { Food } from 'src/food/food.entity';
import { NutritionRecord } from './nutrition_record.entity';
import { CreateNutritionRecordDto, UpdateNutritionRecordDto } from './nutrition_record.dto';
import { NutritionFood } from 'src/nutrition_food/nutritionfood.entity';
import { CreateNutritionFoodDto } from 'src/nutrition_food/nutritionfood.dto';

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

  }async createNutritionRecord(
    createNutritionRecordDto: CreateNutritionRecordDto,
  ): Promise<NutritionRecord> {
    const user = await this.userRepository.findOne({
      where: { id_user: createNutritionRecordDto.user_id },
    });
  
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    const newNutritionRecord = this.nutritionRecordRepository.create({
      name: createNutritionRecordDto.name,
      description: createNutritionRecordDto.description,
      user,
      date: createNutritionRecordDto.date,
    });
  
    return this.nutritionRecordRepository.save(newNutritionRecord);
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
}
