import { BadRequestException } from '@nestjs/common';

export type TimestampIdCursor = {
    createdAt: Date;
    id: string;
};

export function encodeCursor({ createdAt, id }: TimestampIdCursor): string {
    const payload = JSON.stringify({ createdAt: createdAt.toISOString(), id });
    return Buffer.from(payload, 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): TimestampIdCursor {
    let payload: unknown;
    try {
        payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    } catch {
        throw new BadRequestException('Invalid pagination cursor');
    }

    const { createdAt, id } = (payload ?? {}) as Record<string, unknown>;
    if (typeof createdAt !== 'string' || typeof id !== 'string') {
        throw new BadRequestException('Invalid pagination cursor');
    }

    const createdAtDate = new Date(createdAt);
    if (Number.isNaN(createdAtDate.getTime())) {
        throw new BadRequestException('Invalid pagination cursor');
    }

    return { createdAt: createdAtDate, id };
}