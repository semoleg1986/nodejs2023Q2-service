import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Track } from 'src/tracks/entities/track.entity';

@Entity('track-fav')
export class TrackFav {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  trackId: string | null;

  @OneToOne(() => Track, (track) => track.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  track: Track;
}
