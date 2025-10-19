import { Module } from "@nestjs/common";
import { UserResourceController } from "./user_resource.controller";
import { UserResourceService } from "./user_resource.service";
import { ResourceModule } from "src/resource/resource.module";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [ResourceModule, UserModule],
    controllers: [UserResourceController],
    providers: [UserResourceService]
})
export class UserResourceModule {}