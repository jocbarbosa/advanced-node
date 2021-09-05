import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import {LoadUserAccountRepository,CreateFacebookAccountRepository} from '@/data/contracts/repos/'
import { AuthenticationError } from "@/domain/errors";

import {mock, MockProxy} from 'jest-mock-extended';

describe("FacebookAuthenticationService", () => {
    
    let facebookApi: MockProxy<LoadFacebookUserApi>;
    let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>;

    beforeEach(() => {
        facebookApi = mock();
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_name',
            email: 'any_email',
            facebookId: 'any_id'
        })

        userAccountRepo = mock();
    });

    it("should call LoadFacebookUserApi with correct params", async () => {
        
      
        const sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);

        await sut.perform({
            token: 'any_token'
        });

        expect(facebookApi.loadUser).toHaveBeenCalledWith({token: 'any_token'});
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
    })
    
    it("should call LoadFacebookUserApi an returns undefined", async () => {
        const sut = new FacebookAuthenticationService(facebookApi,userAccountRepo);

        const authResult = await sut.perform({
            token: 'any_token'
        });

        expect(authResult).toEqual(new AuthenticationError());
    })
    
    it("should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined", async () => {

        const sut = new FacebookAuthenticationService(facebookApi,userAccountRepo);

        const authResult = await sut.perform({
            token: 'any_token'
        });

        expect(authResult).toEqual(new AuthenticationError());
    })
})