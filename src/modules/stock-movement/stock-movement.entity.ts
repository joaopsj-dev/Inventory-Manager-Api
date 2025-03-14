import { Product } from '@/modules/product/product.entity';
import { Service } from '@/modules/service/service.entity';
import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  productId: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'enum', enum: StockMovementType })
  movementType: StockMovementType;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  serviceId: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  negotiatedValue: number;

  @Column('boolean')
  isFirstMovement: boolean;

  @ManyToOne(() => Product, (product) => product.stockMovements, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;
}
