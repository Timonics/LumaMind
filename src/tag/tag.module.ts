import { Module } from "@nestjs/common";
import { TagService } from "./tag.service";

@Module({
    imports: [],
    exports: [TagService]
})
export class TagModule {}