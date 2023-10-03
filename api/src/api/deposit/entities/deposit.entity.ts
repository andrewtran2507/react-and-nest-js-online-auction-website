import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'uuid', nullable: false })
  user_id: string;

  @Column({ nullable: false })
  amount: number;

  @OneToOne(() => User, (user) => user.deposit)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  is_activated: boolean;
}
