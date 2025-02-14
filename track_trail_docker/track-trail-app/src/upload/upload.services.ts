import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from './upload.entity';
import * as path from 'path';
import { Routine } from 'src/routine/routine.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
  ) {}

  async saveFile(file: Express.Multer.File, routineId: number) {
    const routine = await this.routineRepository.findOne({
      where: { id_routine: routineId },
    });

    if (!routine) {
      throw new Error(
        `Routine con ID ${routineId} no encontrado.`,
      );
    }
    const filePath = path.join('/upload', file.filename);
    const newUpload = this.uploadRepository.create({
      path: filePath,
      name: file.originalname,
      Routine: routine, 
    });
    return await this.uploadRepository.save(newUpload);
  }

  async getAlluploads(): Promise<any> {
    const result = await this.uploadRepository.find({
      relations: ['Routine'], 
    });
    return result;
  }

  async getUpload(id: number): Promise<any> {
    console.log('Buscando archivo con ID:', id);
    const result = await this.uploadRepository.findOneBy({ id });
  
    if (!result) {
      throw new HttpException(`No se encontró un archivo con el ID: ${id}`, HttpStatus.NOT_FOUND);
    }
  
    console.log('Resultado obtenido:', result);
  
    return {
      ...result,
      url: `http://localhost:8080/upload/${result.name}`,
    };
  }
  

  async updateUpload(id: number, file: Express.Multer.File): Promise<any> {
    const existingUpload = await this.uploadRepository.findOne({
      where: { id },
      relations: ['routine'],
    });

    if (!existingUpload) {
      throw new HttpException('Upload no encontrado', HttpStatus.NOT_FOUND);
    }

    const updatedFilePath = path.join('/upload', file.filename);
    existingUpload.name = file.originalname;
    existingUpload.path = updatedFilePath;
    return await this.uploadRepository.save(existingUpload);
  }

  async deleteUpload(id: number): Promise<{ message: string }> {
    const result = await this.uploadRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Upload no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Upload eliminado' };
  }
  
}