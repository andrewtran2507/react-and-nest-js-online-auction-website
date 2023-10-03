import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Bid } from '../../bid/entities/bid.entity';
import { Auctions } from '../../auctions/entities/auction.entity';
import { Deposit } from '../../deposit/entities/deposit.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ default: "" })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];

  @OneToMany(() => Auctions, (auction) => auction.user)
  auctions: Auctions[];

  @OneToOne(() => Deposit, (deposit) => deposit.user_id)
  @JoinColumn({ name: 'user_id' })
  deposit: Deposit;

  // @ManyToOne(() => Role, (role) => role.users)
  // @JoinColumn({ name: 'role_id' })
  // role: Role

  @Column({ nullable: true, })
  @Exclude()
  public token?: string;

  @Column({ nullable: true, })
  @Exclude()
  public refreshToken?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  is_activated: boolean;
}
