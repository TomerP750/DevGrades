import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { CursorPaginatedResult } from "../pagination/cursor-pagination.types";



interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

/**
 * Serializes a `CursorPaginatedResult` by applying `itemDto` to each row and
 * forwarding `pageInfo` untouched. Takes the item DTO rather than an envelope
 * DTO, because generics are erased at runtime and `plainToInstance` needs a
 * concrete class.
 */
export function SerializePage(itemDto: ClassConstructor) {
    return UseInterceptors(new SerializePageInterceptor(itemDto));
}


export class SerializeInterceptor implements NestInterceptor {
    
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> | Promise<Observable<any>> {
        
        return handler.handle().pipe(
            map((data: any) => {

                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });


            })
        )
    }
    
}


export class SerializePageInterceptor implements NestInterceptor {

    constructor(private itemDto: ClassConstructor) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {

        return handler.handle().pipe(
            map(({ data, pageInfo }: CursorPaginatedResult<unknown>) => ({

                data: plainToInstance(this.itemDto, data, {
                    excludeExtraneousValues: true,
                }),
                // Built by `buildCursorPage`, never an entity, so nothing to filter.
                pageInfo,

            })),
        )
    }

}