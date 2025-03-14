import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { ProductUnit } from '@/types/enums/product-unit-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column('int')
  quantity: number;

  @Column({ nullable: true })
  details: string;

  @Column({
    type: 'enum',
    enum: ProductUnit,
    default: ProductUnit.UN,
  })
  unit: ProductUnit;

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockMovement, (movement) => movement.product)
  stockMovements: StockMovement[];
}
