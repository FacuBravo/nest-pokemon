import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationParametes } from 'src/common/dto/paginationParameters.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
    private defaultLimit: number;

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly configService: ConfigService,
    ) {
        this.defaultLimit = configService.get<number>('defaultLimit') || 2;
    }

    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return pokemon;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    findAll(paginationParametes: PaginationParametes) {
        const { limit = this.defaultLimit, offset = 0 } = paginationParametes;

        return this.pokemonModel
            .find()
            .limit(limit)
            .skip(offset)
            .sort({ no: 1 })
            .select('-__v');
    }

    async findOne(id: string) {
        const pokemon: Pokemon | null = await this.pokemonModel.findById(id);

        if (pokemon == null) {
            throw new NotFoundException(`Pokemon "${id}" not found`);
        }

        return pokemon;
    }

    async update(id: string, updatePokemonDto: UpdatePokemonDto) {
        const pokemon = await this.findOne(id);

        if (updatePokemonDto.name)
            updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

        try {
            await pokemon.updateOne(updatePokemonDto);

            return { ...pokemon.toJSON(), ...updatePokemonDto };
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    async remove(id: string) {
        const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

        if (deletedCount == 0) {
            throw new NotFoundException(`Pokemon with id "${id}" not found`);
        }
    }

    async createMany(createPokemonDtos: CreatePokemonDto[]) {
        try {
            await this.pokemonModel.insertMany(createPokemonDtos);
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    async deleteMany() {
        await this.pokemonModel.deleteMany();
    }

    private handleExceptions(error: any) {
        if (error.code === 11000) {
            throw new BadRequestException(
                `Duplicate value in ${JSON.stringify(error.keyValue)}`,
            );
        }

        throw new InternalServerErrorException();
    }
}
