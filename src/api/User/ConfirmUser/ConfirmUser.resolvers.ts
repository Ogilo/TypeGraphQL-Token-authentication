import { Arg, Mutation, Resolver } from "type-graphql";
import { redis } from "../../../redis";
import { User } from "../../../entity/User";

@Resolver()
export class ConfirmUserResolvers {
    @Mutation(() => Boolean)
    async confirmUser(@Arg("token") token: string): Promise<boolean> {
        const userId = await redis.get("user-confirmation" + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: userId }, { confirmed: true });
        await redis.del(token);

        return true;
    }
}
