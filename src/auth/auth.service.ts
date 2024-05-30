import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const username =
      await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`
    );
    // save token to local storage with expiration value

    return { accessToken };
  }

  // validates the access token
  async loggedIn(): Promise<{ loggedIn: boolean }> {
    // get bearer token from local storage
    this.logger.debug(`We should get a boolean for our login check here`);
    // if token present, check for username || loggedIn = TRUE
    // const userLoggedIn = await this.userRepository.loggedIn(authCredentialsDto);

    // else || loggedIn = False
    return { loggedIn: false };
  }
}
