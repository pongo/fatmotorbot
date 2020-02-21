import { DatabasePoolType, SlonikError, sql } from 'slonik';
import { IInfoRepository, UserInfo } from 'src/app/core/Info/types';
import { DatabaseError } from 'src/app/shared/errors';
import { TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export class InfoRepository implements IInfoRepository {
  constructor(private readonly db: DatabasePoolType) {}

  async set(userId: TelegramUserId, data: UserInfo): Promise<Result<undefined, DatabaseError>> {
    try {
      await this.db.any(sql`
        INSERT INTO users (user_id, gender, height)
        VALUES (${userId}, ${data.gender}, ${data.height})
        ON CONFLICT (user_id) DO UPDATE
          SET gender = excluded.gender,
              height = excluded.height;
      `);
      return Result.ok();
    } catch (e) {
      console.error('InfoRepository.set()', e);
      return Result.err(new DatabaseError(e as SlonikError));
    }
  }

  async get(userId: TelegramUserId): Promise<Result<UserInfo | null, DatabaseError>> {
    try {
      const result = await this.db.maybeOne(sql`
        SELECT gender, height
        FROM users
        WHERE user_id = ${userId};
      `);
      // TODO: нужна ли здесь валидация?
      if (result == null) return Result.ok(null);
      return Result.ok(result as UserInfo);
    } catch (e) {
      console.error('InfoRepository.get()', e);
      return Result.err(new DatabaseError(e as SlonikError));
    }
  }
}
