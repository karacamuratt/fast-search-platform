import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RateLimitGuard } from "./common/guards/rate-limit.guard";
import { SearchModule } from "./search/search.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        SearchModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RateLimitGuard,
        },
    ],
})

export class AppModule { }
