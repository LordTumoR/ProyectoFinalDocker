import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateFoodDto, UpdateFoodDto } from './food.dto';
import { Food } from './food.entity';

@Injectable()
export class FoodService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async getAllFoods(xml?: string): Promise<Food[] | string> {
    const foods = await this.foodRepository.find();

    if (xml === 'true') {
      const jsonformatted = JSON.stringify({ foods });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    } else {
      return foods;
    }
  }

  async createFood(createFoodDto: CreateFoodDto): Promise<Food> {
    const newFood = this.foodRepository.create(createFoodDto);
    return await this.foodRepository.save(newFood);
  }

  async getFood(id: number, xml?: string): Promise<Food | string | null> {
    const food = await this.foodRepository.findOne({ where: { id } });

    if (food != null) {
      if (xml === 'true') {
        const jsonformatted = JSON.stringify(food);
        return this.utilsService.convertJSONtoXML(jsonformatted);
      } else {
        return food;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateFood(updateFoodDto: UpdateFoodDto): Promise<Food> {
    const food = await this.foodRepository.findOne({
      where: { id: updateFoodDto.id },
    });

    if (!food) {
      throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
    }

    this.foodRepository.merge(food, updateFoodDto);
    return this.foodRepository.save(food);
  }

  async deleteFood(id: number): Promise<void> {
    const result = await this.foodRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
    }
  }
}
