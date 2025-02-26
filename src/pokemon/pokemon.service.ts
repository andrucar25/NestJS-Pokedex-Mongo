import { isValidObjectId, Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    const pokemon = await this.pokemonModel.create(createPokemonDto);
    
    return pokemon;
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(value: string) {
    let condition: object = { name: value };
 
    if (!Number.isNaN(+value)) {
      condition = { no: value };
    } 
    
    if (isValidObjectId(value)) {
      condition = { _id: value };
    }
 
    const pokemon: Pokemon | null = await this.pokemonModel.findOne(condition);
 
    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with ${JSON.stringify(condition)} not found`,
      );
    }
 
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( term );
    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    await pokemon.updateOne( updatePokemonDto );
    
    return { ...pokemon.toJSON(), ...updatePokemonDto };

  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    return;
  }

}
