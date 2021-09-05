import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors/';
import { FacebookAuthentication } from '@/domain/features';
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '../contracts/repos';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData !== undefined) {
      await this.userAccountRepo.load({
        email: facebookData.email,
      });
      await this.userAccountRepo.createFromFacebook(facebookData);
    }
    return new AuthenticationError();
  }
}
