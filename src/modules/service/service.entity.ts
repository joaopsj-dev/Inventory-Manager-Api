import { Customer } from '@/modules/customer/customer.entity';
import { User } from '@/modules/user/user.entity';
import {
  PaymentStatus,
  ServiceStatus,
} from '@/types/enums/service-status.enum';
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
  value: number;

  @Column('boolean', { default: false })
  isPaid: boolean;

  @Column('float', { nullable: true })
  advanceValue: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PARTIAL,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.RECEIVED,
  })
  status: ServiceStatus;

  @Column({ type: 'timestamp' })
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.services, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.services, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
