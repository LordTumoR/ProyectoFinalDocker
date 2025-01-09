import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateRoutineDto, UpdateRoutineDto } from './routine.dto';
import { routine } from './routine.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class RoutineService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(routine)
    private readonly routineRepository: Repository<routine>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllRoutines(xml?: string): Promise<routine[] | string> {
    const routines = await this.routineRepository.find({
      relations: ['user'], 
    });
  
    if (xml === 'true') {
      const jsonformatted = JSON.stringify({
        routines,
      });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    } else {
      return routines;
    }
  }
  

  async createRoutine(createRoutineDto: CreateRoutineDto): Promise<routine> {
    const user = await this.userRepository.findOne({
      where: { id_user: createRoutineDto.id_user },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const newRoutine = this.routineRepository.create({
      ...createRoutineDto,
      user, 
    });

    return await this.routineRepository.save(newRoutine);
  }

  async getRoutine(id_routine: number, xml?: string): Promise<routine | string | null> {
    const routine = await this.routineRepository.findOneBy({ id_routine });

    if (routine != null) {
      if (xml === 'true') {
        const jsonformatted = JSON.stringify(routine);
        return this.utilsService.convertJSONtoXML(jsonformatted);
      } else {
        return routine;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateRoutine(updateRoutineDto: UpdateRoutineDto): Promise<routine> {
    const routine = await this.routineRepository.findOne({
      where: { id_routine: updateRoutineDto.id_routine },
    });

    if (!routine) {
      throw new HttpException('Routine not found', HttpStatus.NOT_FOUND);
    }

    this.routineRepository.merge(routine, updateRoutineDto);
    return this.routineRepository.save(routine);
  }

  async deleteRoutine(id_routine: number): Promise<void> {
    const result = await this.routineRepository.delete(id_routine);
    if (result.affected === 0) {
      throw new HttpException('Routine not found', HttpStatus.NOT_FOUND);
    }
  }
}
