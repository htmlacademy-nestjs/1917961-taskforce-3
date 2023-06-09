import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { fillObject } from '@project/util/util-core';
import { UserRdo } from './rdo/user.rdo';
import { LoginUserDto } from './dto/login-user.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
    constructor (
        private readonly authenticationService: AuthenticationService
    ) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The new user has been successfully created.'
    })
    @Post('register')
    public async create(@Body() dto: CreateUserDto) {
        const newUser = await this.authenticationService.register(dto)
        return fillObject(UserRdo, newUser)
    }

    @ApiResponse({
        type: LoggedUserRdo,
        status: HttpStatus.OK,
        description: 'User has been successfully logged.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Password or Login is wrong.',
    })
    @Post('login')
    public async login(@Body() dto: LoginUserDto) {
        const verifiedUser = await this.authenticationService.verifyUser(dto);
        return fillObject(LoggedUserRdo, verifiedUser);
    }

    @ApiResponse({
        type: UserRdo,
        status: HttpStatus.OK,
        description: 'User found'
    })
    @Get(':id')
    public async show(@Param('id') id: string) {
        const existUser = await this.authenticationService.getUser(id);
        return fillObject(UserRdo, existUser);
    }

}
