import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
