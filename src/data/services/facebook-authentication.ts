import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors/';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookAccount } from '@/domain/models/facebook-account';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contracts/repos';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository
    & SaveFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookData.email });
      const facebookAccount = new FacebookAccount(facebookData, accountData);
      await this.userAccountRepo.saveWithFacebook(facebookAccount);
    }
    return new AuthenticationError();
  }
}
