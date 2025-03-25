import { ReportType } from '@/types/enums/report-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'timestamp' })
  firstDate: Date;

  @Column({ type: 'timestamp' })
  lastDate: Date;

  @Column('float')
  totalEntry: number;

  @Column('float')
  totalExit: number;

  @Column('float')
  finalBalance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt: Date;
}
