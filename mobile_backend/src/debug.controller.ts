import { Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('debug')
export class DebugController {
  constructor(private dataSource: DataSource) {}

  @Post('reset-db')
  async resetDb() {
    // WARNING: This will delete all data in these tables!
    const tables = ['workout', 'exercise', 'seance', 'message', 'chatroom', 'user'];
    
    for (const table of tables) {
      try {
        // Check if table exists before truncating
        const tableExists = await this.dataSource.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )`,
          [table]
        );
        
        if (tableExists[0].exists) {
          await this.dataSource.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
          console.log(`✓ Table ${table} truncated`);
        } else {
          console.log(`⚠ Table ${table} does not exist, skipping`);
        }
      } catch (error) {
        console.error(`✗ Error truncating table ${table}:`, error.message);
      }
    }
    
    return { message: 'Database reset completed' };
  }
} 