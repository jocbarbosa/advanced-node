import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import {LoadUserAccountRepository} from '@/data/contracts/repos/'
import { AuthenticationError } from "@/domain/errors";

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
    token?: string;
    callsCount = 0;
    result = undefined;
    async loadUser(params : LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
        this.token = params.token; 
        this.callsCount++;
        return this.result;
    }
}

class LoadUserAccountRepositorySpy implements LoadUserAccountRepository {
    async load(params: LoadUserAccountRepository.Params): Promise<void> {

    }
}

describe("FacebookAuthenticationService", () => {
    
    let loadFacebookUserApi: LoadFacebookUserApiSpy;
    let loadUserAccountRepository: LoadUserAccountRepositorySpy;

    beforeEach(() => {
        loadFacebookUserApi = new LoadFacebookUserApiSpy();
        loadUserAccountRepository = new LoadUserAccountRepositorySpy();
    });

    it("should call LoadFacebookUserApi with correct params", async () => {
        
      
        const sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository);

        await sut.perform({
            token: 'any_token'
        });

        expect(loadFacebookUserApi.token).toBe("any_token");
        expect(loadFacebookUserApi.callsCount).toBe(1);
    })
    
    it("should call LoadFacebookUserApi an returns undefined", async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy();
        loadFacebookUserApi.result = undefined;
        const sut = new FacebookAuthenticationService(loadFacebookUserApi,loadUserAccountRepository);

        const authResult = await sut.perform({
            token: 'any_token'
        });

        expect(authResult).toEqual(new AuthenticationError());
    })
})