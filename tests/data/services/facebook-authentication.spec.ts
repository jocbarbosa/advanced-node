import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import {LoadUserAccountRepository,CreateFacebookAccountRepository} from '@/data/contracts/repos/'
import { AuthenticationError } from "@/domain/errors";

import {mock, MockProxy} from 'jest-mock-extended';

describe("FacebookAuthenticationService", () => {
    
    let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
    let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
    let createFacebookAccountRepository : MockProxy<CreateFacebookAccountRepository>;

    beforeEach(() => {
        loadFacebookUserApi = mock();
        loadFacebookUserApi.loadUser.mockResolvedValue({
            name: 'any_name',
            email: 'any_email',
            facebookId: 'any_id'
        })

        loadUserAccountRepository = mock();
        createFacebookAccountRepository = mock();
    });

    it("should call LoadFacebookUserApi with correct params", async () => {
        
      
        const sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository, createFacebookAccountRepository);

        await sut.perform({
            token: 'any_token'
        });

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({token: 'any_token'});
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
    })
    
    it("should call LoadFacebookUserApi an returns undefined", async () => {
        const sut = new FacebookAuthenticationService(loadFacebookUserApi,loadUserAccountRepository, createFacebookAccountRepository);

        const authResult = await sut.perform({
            token: 'any_token'
        });

        expect(authResult).toEqual(new AuthenticationError());
    })
    
    it("should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined", async () => {

        const sut = new FacebookAuthenticationService(loadFacebookUserApi,loadUserAccountRepository, createFacebookAccountRepository);

        const authResult = await sut.perform({
            token: 'any_token'
        });

        expect(authResult).toEqual(new AuthenticationError());
    })
})