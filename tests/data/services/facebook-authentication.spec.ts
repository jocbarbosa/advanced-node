import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/'
import { AuthenticationError } from "@/domain/errors";
import { FacebookAccount } from "@/domain/models";

import { mock, MockProxy } from 'jest-mock-extended';



describe("FacebookAuthenticationService", () => {
    let facebookApi: MockProxy<LoadFacebookUserApi>;
    let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
    let sut: FacebookAuthenticationService;
    const token = 'any_token';

    beforeEach(() => {
        facebookApi = mock();
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_name',
            email: 'any_email',
            facebookId: 'any_id'
        })

        userAccountRepo = mock();
        userAccountRepo.load.mockResolvedValue(undefined);

        sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
    });

    it("should call LoadFacebookUserApi with correct params", async () => {
        await sut.perform({ token });

        expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
    })

    it("should call LoadFacebookUserApi an returns undefined", async () => {
        facebookApi.loadUser.mockResolvedValueOnce(undefined);

        const authResult = await sut.perform({ token });

        expect(authResult).toEqual(new AuthenticationError());
    })

    it("should call LoadUserAccountRepo when LoaFacebookUserApi returns undefined", async () => {

        await sut.perform({ token });

        expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_email' });
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
    })

    it("should create account with facebook data", async () => {
        await sut.perform({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            email: 'any_email',
            name: 'any_name',
            facebookId: 'any_id'
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
    })

    it("should not update account name", async () => {
        userAccountRepo.load.mockResolvedValueOnce({
            id: 'any_id',
            name: 'any_name'
        });

        await sut.perform({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            id: 'any_id',
            name: 'any_name',
            email: 'any_email',
            facebookId: 'any_id'
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
    })

    it("should update account name", async () => {

        userAccountRepo.load.mockResolvedValueOnce({
            id: 'any_id',
        });

        await sut.perform({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            id: 'any_id',
            name: 'any_name',
            email: 'any_email',
            facebookId: 'any_id'
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
        await sut.perform({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            "email": "any_email",
            "facebookId": "any_id",
            "name": "any_name",
        })
    })
})