import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonModel } from 'src/models/person.model';
import { PersonSchema } from 'src/schemas/person.schema';
import { Repository } from 'typeorm';

@Controller('/person')
export class PersonController {
  constructor(
    @InjectRepository(PersonModel) private model: Repository<PersonModel>,
  ) {}

  @Post('/create')
  public async create(
    @Body(ValidationPipe) body: PersonSchema,
  ): Promise<{ data: PersonModel }> {
    const personCreated = await this.model.save(body);
    return { data: personCreated };
  }
  @Get(':id')
  public async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: PersonModel }> {
    const person = await this.model.findOne({ where: { id } });
    return { data: person };
  }
  @Get()
  public async getAll() {
    const list = await this.model.find();
    return list;
  }
  @Put('update/:id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PersonSchema,
  ): Promise<{ data: PersonModel }> {
    const person = await this.model.findOne({ where: { id } });

    if (!person) {
      throw new NotFoundException(`Não achei uma pessoa com o id ${id}`);
    }
    await this.model.update({ id }, body);
    return { data: person };
  }
  @Delete('delete/:id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<{ data: string }> {
    const person = await this.model.findOne({ where: { id } });

    if (!person) {
      throw new NotFoundException(`Não achei uma pessoa com o id ${id}`);
    }
    await this.model.delete(id);
    return { data: `A pessoa com id ${id} foi deletada com sucesso` };
  }
}
