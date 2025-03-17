import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeAPIResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {
    private readonly axios: AxiosInstance = axios;

    constructor(private readonly pokemonService: PokemonService) {}

    async executeSeed() {
        await this.pokemonService.deleteMany()

        const { data } = await this.axios.get<PokeAPIResponse>(
            'https://pokeapi.co/api/v2/pokemon?limit=650',
        );
        const pokemons: CreatePokemonDto[] = [];

        data.results.forEach(({ name, url }) => {
            const segments = url.split('/');
            const no = +segments[segments.length - 2];
            pokemons.push({ name, no });
        });

        try {
            await this.pokemonService.createMany(pokemons);
            return 'Seed executed';
        } catch (error) {
            if (error.status == 400) {
                throw new BadRequestException(error.response.message)
            }
        }
    }
}
