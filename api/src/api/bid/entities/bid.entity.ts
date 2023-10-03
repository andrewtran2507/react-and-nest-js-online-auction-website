import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Auctions } from '../../auctions/entities/auction.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  auction_id: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false, default: 0 }) // status: 0 - bidding | 1 - win
  status: number;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Auctions, (auction) => auction.bids)
  @JoinColumn({ name: 'auction_id' })
  auction: Auctions;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  is_activated: boolean;
}
