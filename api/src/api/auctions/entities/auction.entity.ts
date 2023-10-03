import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Bid } from '../../bid/entities/bid.entity';

@Entity()
export class Auctions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ nullable: false, })
  started_price: number;

  @Column({ nullable: false }) // default: 300000 - 5 mins
  time_window: number;

  @Column({ nullable: false, default: 0 }) // status: 0 - draft | 1 - ongoing | 2 - completed
  status: number;

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  is_activated: boolean;
}
