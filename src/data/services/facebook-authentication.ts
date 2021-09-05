import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors/';
import { FacebookAuthentication } from '@/domain/features';
import { LoadUserAccountRepository, CreateFacebookAccountRepository, UpdateFacebookAccountRepository } from '../contracts/repos';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository
    & CreateFacebookAccountRepository
    & UpdateFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: facebookData.email,
      });

      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? facebookData.name,
          facebookId: facebookData.facebookId,
        });
      } else {
        await this.userAccountRepo.createFromFacebook(facebookData);
      }
    }
    return new AuthenticationError();
  }
}
