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
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  getAllUser(@Query('xml') xml?: string) {
    try {
      return this.usersService.getAllUser(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  getUser(@Param('id') id: string, @Query('xml') xml?: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('ID de usuario inválido', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersService.getUser(userId, xml);
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de usuario inválidos.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('ID de usuario inválido', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersService.updateUser({ ...updateUserDto, id_user: userId });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  deleteUser(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('ID de usuario inválido', HttpStatus.BAD_REQUEST);
    }

    const userDeleted = this.usersService.deleteUser(userId);
    if (!userDeleted) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return { message: 'Usuario eliminado correctamente' };
  }
}
