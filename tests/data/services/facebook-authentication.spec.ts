import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
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

describe("FacebookAuthenticationService", () => {
    it("should call LoadFacebookUserApi with correct params", async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy();
        const sut = new FacebookAuthenticationService(loadFacebookUserApi);

        await sut.perform({
            token: 'any_token'
        });

        expect(loadFacebookUserApi.token).toBe("any_token");
        expect(loadFacebookUserApi.callsCount).toBe(1);
    })
    
    it("should call LoadFacebookUserApi an returns undefined", async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy();
        loadFacebookUserApi.result = undefined;
        const sut = new FacebookAuthenticationService(loadFacebookUserApi);

        const authResult = await sut.perform({
            token: 'any_token'
        });

        expect(authResult).toEqual(new AuthenticationError());
    })
})