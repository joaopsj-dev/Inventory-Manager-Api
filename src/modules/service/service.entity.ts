import { Customer } from 'src/modules/customer/customer.entity';
import { User } from 'src/modules/user/user.entity';
import { ServiceStatus } from 'src/types/enums/service-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  userId: string;

  @Column()
  device: string;

  @Column()
  defect: string;

  @Column('float')
  Value: number;

  @Column('float')
  RemainingValue: number;

  @Column('boolean', { default: false })
  IsPaid: boolean;

  @Column('float', { nullable: true })
  advanceValue: number;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.RECEIVED,
  })
  status: ServiceStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.services, {
    nullable: false,
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.services, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
