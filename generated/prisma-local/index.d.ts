
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model LocalUser
 * 
 */
export type LocalUser = $Result.DefaultSelection<Prisma.$LocalUserPayload>
/**
 * Model SyncQueue
 * 
 */
export type SyncQueue = $Result.DefaultSelection<Prisma.$SyncQueuePayload>
/**
 * Model LocalOrder
 * 
 */
export type LocalOrder = $Result.DefaultSelection<Prisma.$LocalOrderPayload>
/**
 * Model LocalProduct
 * 
 */
export type LocalProduct = $Result.DefaultSelection<Prisma.$LocalProductPayload>
/**
 * Model LocalCategory
 * 
 */
export type LocalCategory = $Result.DefaultSelection<Prisma.$LocalCategoryPayload>
/**
 * Model LocalSubCategory
 * 
 */
export type LocalSubCategory = $Result.DefaultSelection<Prisma.$LocalSubCategoryPayload>
/**
 * Model LocalGRN
 * 
 */
export type LocalGRN = $Result.DefaultSelection<Prisma.$LocalGRNPayload>
/**
 * Model SyncMetadata
 * 
 */
export type SyncMetadata = $Result.DefaultSelection<Prisma.$SyncMetadataPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LocalUsers
 * const localUsers = await prisma.localUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more LocalUsers
   * const localUsers = await prisma.localUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.localUser`: Exposes CRUD operations for the **LocalUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalUsers
    * const localUsers = await prisma.localUser.findMany()
    * ```
    */
  get localUser(): Prisma.LocalUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncQueue`: Exposes CRUD operations for the **SyncQueue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncQueues
    * const syncQueues = await prisma.syncQueue.findMany()
    * ```
    */
  get syncQueue(): Prisma.SyncQueueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localOrder`: Exposes CRUD operations for the **LocalOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalOrders
    * const localOrders = await prisma.localOrder.findMany()
    * ```
    */
  get localOrder(): Prisma.LocalOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localProduct`: Exposes CRUD operations for the **LocalProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalProducts
    * const localProducts = await prisma.localProduct.findMany()
    * ```
    */
  get localProduct(): Prisma.LocalProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localCategory`: Exposes CRUD operations for the **LocalCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalCategories
    * const localCategories = await prisma.localCategory.findMany()
    * ```
    */
  get localCategory(): Prisma.LocalCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localSubCategory`: Exposes CRUD operations for the **LocalSubCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalSubCategories
    * const localSubCategories = await prisma.localSubCategory.findMany()
    * ```
    */
  get localSubCategory(): Prisma.LocalSubCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localGRN`: Exposes CRUD operations for the **LocalGRN** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalGRNS
    * const localGRNS = await prisma.localGRN.findMany()
    * ```
    */
  get localGRN(): Prisma.LocalGRNDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncMetadata`: Exposes CRUD operations for the **SyncMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncMetadata
    * const syncMetadata = await prisma.syncMetadata.findMany()
    * ```
    */
  get syncMetadata(): Prisma.SyncMetadataDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    LocalUser: 'LocalUser',
    SyncQueue: 'SyncQueue',
    LocalOrder: 'LocalOrder',
    LocalProduct: 'LocalProduct',
    LocalCategory: 'LocalCategory',
    LocalSubCategory: 'LocalSubCategory',
    LocalGRN: 'LocalGRN',
    SyncMetadata: 'SyncMetadata'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "localUser" | "syncQueue" | "localOrder" | "localProduct" | "localCategory" | "localSubCategory" | "localGRN" | "syncMetadata"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LocalUser: {
        payload: Prisma.$LocalUserPayload<ExtArgs>
        fields: Prisma.LocalUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          findFirst: {
            args: Prisma.LocalUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          findMany: {
            args: Prisma.LocalUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>[]
          }
          create: {
            args: Prisma.LocalUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          createMany: {
            args: Prisma.LocalUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>[]
          }
          delete: {
            args: Prisma.LocalUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          update: {
            args: Prisma.LocalUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          deleteMany: {
            args: Prisma.LocalUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>[]
          }
          upsert: {
            args: Prisma.LocalUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          aggregate: {
            args: Prisma.LocalUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalUser>
          }
          groupBy: {
            args: Prisma.LocalUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalUserCountArgs<ExtArgs>
            result: $Utils.Optional<LocalUserCountAggregateOutputType> | number
          }
        }
      }
      SyncQueue: {
        payload: Prisma.$SyncQueuePayload<ExtArgs>
        fields: Prisma.SyncQueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncQueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncQueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          findFirst: {
            args: Prisma.SyncQueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncQueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          findMany: {
            args: Prisma.SyncQueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>[]
          }
          create: {
            args: Prisma.SyncQueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          createMany: {
            args: Prisma.SyncQueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncQueueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>[]
          }
          delete: {
            args: Prisma.SyncQueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          update: {
            args: Prisma.SyncQueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          deleteMany: {
            args: Prisma.SyncQueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncQueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncQueueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>[]
          }
          upsert: {
            args: Prisma.SyncQueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          aggregate: {
            args: Prisma.SyncQueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncQueue>
          }
          groupBy: {
            args: Prisma.SyncQueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncQueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncQueueCountArgs<ExtArgs>
            result: $Utils.Optional<SyncQueueCountAggregateOutputType> | number
          }
        }
      }
      LocalOrder: {
        payload: Prisma.$LocalOrderPayload<ExtArgs>
        fields: Prisma.LocalOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          findFirst: {
            args: Prisma.LocalOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          findMany: {
            args: Prisma.LocalOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>[]
          }
          create: {
            args: Prisma.LocalOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          createMany: {
            args: Prisma.LocalOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>[]
          }
          delete: {
            args: Prisma.LocalOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          update: {
            args: Prisma.LocalOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          deleteMany: {
            args: Prisma.LocalOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>[]
          }
          upsert: {
            args: Prisma.LocalOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          aggregate: {
            args: Prisma.LocalOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalOrder>
          }
          groupBy: {
            args: Prisma.LocalOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalOrderCountArgs<ExtArgs>
            result: $Utils.Optional<LocalOrderCountAggregateOutputType> | number
          }
        }
      }
      LocalProduct: {
        payload: Prisma.$LocalProductPayload<ExtArgs>
        fields: Prisma.LocalProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          findFirst: {
            args: Prisma.LocalProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          findMany: {
            args: Prisma.LocalProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>[]
          }
          create: {
            args: Prisma.LocalProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          createMany: {
            args: Prisma.LocalProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>[]
          }
          delete: {
            args: Prisma.LocalProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          update: {
            args: Prisma.LocalProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          deleteMany: {
            args: Prisma.LocalProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>[]
          }
          upsert: {
            args: Prisma.LocalProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          aggregate: {
            args: Prisma.LocalProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalProduct>
          }
          groupBy: {
            args: Prisma.LocalProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalProductCountArgs<ExtArgs>
            result: $Utils.Optional<LocalProductCountAggregateOutputType> | number
          }
        }
      }
      LocalCategory: {
        payload: Prisma.$LocalCategoryPayload<ExtArgs>
        fields: Prisma.LocalCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>
          }
          findFirst: {
            args: Prisma.LocalCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>
          }
          findMany: {
            args: Prisma.LocalCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>[]
          }
          create: {
            args: Prisma.LocalCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>
          }
          createMany: {
            args: Prisma.LocalCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>[]
          }
          delete: {
            args: Prisma.LocalCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>
          }
          update: {
            args: Prisma.LocalCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>
          }
          deleteMany: {
            args: Prisma.LocalCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>[]
          }
          upsert: {
            args: Prisma.LocalCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCategoryPayload>
          }
          aggregate: {
            args: Prisma.LocalCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalCategory>
          }
          groupBy: {
            args: Prisma.LocalCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<LocalCategoryCountAggregateOutputType> | number
          }
        }
      }
      LocalSubCategory: {
        payload: Prisma.$LocalSubCategoryPayload<ExtArgs>
        fields: Prisma.LocalSubCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalSubCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalSubCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>
          }
          findFirst: {
            args: Prisma.LocalSubCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalSubCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>
          }
          findMany: {
            args: Prisma.LocalSubCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>[]
          }
          create: {
            args: Prisma.LocalSubCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>
          }
          createMany: {
            args: Prisma.LocalSubCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalSubCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>[]
          }
          delete: {
            args: Prisma.LocalSubCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>
          }
          update: {
            args: Prisma.LocalSubCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>
          }
          deleteMany: {
            args: Prisma.LocalSubCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalSubCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalSubCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>[]
          }
          upsert: {
            args: Prisma.LocalSubCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSubCategoryPayload>
          }
          aggregate: {
            args: Prisma.LocalSubCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalSubCategory>
          }
          groupBy: {
            args: Prisma.LocalSubCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalSubCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalSubCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<LocalSubCategoryCountAggregateOutputType> | number
          }
        }
      }
      LocalGRN: {
        payload: Prisma.$LocalGRNPayload<ExtArgs>
        fields: Prisma.LocalGRNFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalGRNFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalGRNFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>
          }
          findFirst: {
            args: Prisma.LocalGRNFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalGRNFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>
          }
          findMany: {
            args: Prisma.LocalGRNFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>[]
          }
          create: {
            args: Prisma.LocalGRNCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>
          }
          createMany: {
            args: Prisma.LocalGRNCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalGRNCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>[]
          }
          delete: {
            args: Prisma.LocalGRNDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>
          }
          update: {
            args: Prisma.LocalGRNUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>
          }
          deleteMany: {
            args: Prisma.LocalGRNDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalGRNUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalGRNUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>[]
          }
          upsert: {
            args: Prisma.LocalGRNUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalGRNPayload>
          }
          aggregate: {
            args: Prisma.LocalGRNAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalGRN>
          }
          groupBy: {
            args: Prisma.LocalGRNGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalGRNGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalGRNCountArgs<ExtArgs>
            result: $Utils.Optional<LocalGRNCountAggregateOutputType> | number
          }
        }
      }
      SyncMetadata: {
        payload: Prisma.$SyncMetadataPayload<ExtArgs>
        fields: Prisma.SyncMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>
          }
          findFirst: {
            args: Prisma.SyncMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>
          }
          findMany: {
            args: Prisma.SyncMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>[]
          }
          create: {
            args: Prisma.SyncMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>
          }
          createMany: {
            args: Prisma.SyncMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncMetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>[]
          }
          delete: {
            args: Prisma.SyncMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>
          }
          update: {
            args: Prisma.SyncMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>
          }
          deleteMany: {
            args: Prisma.SyncMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncMetadataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>[]
          }
          upsert: {
            args: Prisma.SyncMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncMetadataPayload>
          }
          aggregate: {
            args: Prisma.SyncMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncMetadata>
          }
          groupBy: {
            args: Prisma.SyncMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<SyncMetadataCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    localUser?: LocalUserOmit
    syncQueue?: SyncQueueOmit
    localOrder?: LocalOrderOmit
    localProduct?: LocalProductOmit
    localCategory?: LocalCategoryOmit
    localSubCategory?: LocalSubCategoryOmit
    localGRN?: LocalGRNOmit
    syncMetadata?: SyncMetadataOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model LocalUser
   */

  export type AggregateLocalUser = {
    _count: LocalUserCountAggregateOutputType | null
    _avg: LocalUserAvgAggregateOutputType | null
    _sum: LocalUserSumAggregateOutputType | null
    _min: LocalUserMinAggregateOutputType | null
    _max: LocalUserMaxAggregateOutputType | null
  }

  export type LocalUserAvgAggregateOutputType = {
    id: number | null
    cloudId: number | null
  }

  export type LocalUserSumAggregateOutputType = {
    id: number | null
    cloudId: number | null
  }

  export type LocalUserMinAggregateOutputType = {
    id: number | null
    cloudId: number | null
    username: string | null
    password: string | null
    role: string | null
    status: string | null
    pinCode: string | null
    canUnlockScreen: boolean | null
    lastLoginAt: Date | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalUserMaxAggregateOutputType = {
    id: number | null
    cloudId: number | null
    username: string | null
    password: string | null
    role: string | null
    status: string | null
    pinCode: string | null
    canUnlockScreen: boolean | null
    lastLoginAt: Date | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalUserCountAggregateOutputType = {
    id: number
    cloudId: number
    username: number
    password: number
    role: number
    status: number
    pinCode: number
    canUnlockScreen: number
    lastLoginAt: number
    lastSyncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalUserAvgAggregateInputType = {
    id?: true
    cloudId?: true
  }

  export type LocalUserSumAggregateInputType = {
    id?: true
    cloudId?: true
  }

  export type LocalUserMinAggregateInputType = {
    id?: true
    cloudId?: true
    username?: true
    password?: true
    role?: true
    status?: true
    pinCode?: true
    canUnlockScreen?: true
    lastLoginAt?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalUserMaxAggregateInputType = {
    id?: true
    cloudId?: true
    username?: true
    password?: true
    role?: true
    status?: true
    pinCode?: true
    canUnlockScreen?: true
    lastLoginAt?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalUserCountAggregateInputType = {
    id?: true
    cloudId?: true
    username?: true
    password?: true
    role?: true
    status?: true
    pinCode?: true
    canUnlockScreen?: true
    lastLoginAt?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalUser to aggregate.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalUsers
    **/
    _count?: true | LocalUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalUserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalUserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalUserMaxAggregateInputType
  }

  export type GetLocalUserAggregateType<T extends LocalUserAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalUser[P]>
      : GetScalarType<T[P], AggregateLocalUser[P]>
  }




  export type LocalUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalUserWhereInput
    orderBy?: LocalUserOrderByWithAggregationInput | LocalUserOrderByWithAggregationInput[]
    by: LocalUserScalarFieldEnum[] | LocalUserScalarFieldEnum
    having?: LocalUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalUserCountAggregateInputType | true
    _avg?: LocalUserAvgAggregateInputType
    _sum?: LocalUserSumAggregateInputType
    _min?: LocalUserMinAggregateInputType
    _max?: LocalUserMaxAggregateInputType
  }

  export type LocalUserGroupByOutputType = {
    id: number
    cloudId: number
    username: string
    password: string
    role: string
    status: string
    pinCode: string | null
    canUnlockScreen: boolean
    lastLoginAt: Date | null
    lastSyncedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: LocalUserCountAggregateOutputType | null
    _avg: LocalUserAvgAggregateOutputType | null
    _sum: LocalUserSumAggregateOutputType | null
    _min: LocalUserMinAggregateOutputType | null
    _max: LocalUserMaxAggregateOutputType | null
  }

  type GetLocalUserGroupByPayload<T extends LocalUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalUserGroupByOutputType[P]>
            : GetScalarType<T[P], LocalUserGroupByOutputType[P]>
        }
      >
    >


  export type LocalUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    pinCode?: boolean
    canUnlockScreen?: boolean
    lastLoginAt?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localUser"]>

  export type LocalUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    pinCode?: boolean
    canUnlockScreen?: boolean
    lastLoginAt?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localUser"]>

  export type LocalUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    pinCode?: boolean
    canUnlockScreen?: boolean
    lastLoginAt?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localUser"]>

  export type LocalUserSelectScalar = {
    id?: boolean
    cloudId?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    pinCode?: boolean
    canUnlockScreen?: boolean
    lastLoginAt?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cloudId" | "username" | "password" | "role" | "status" | "pinCode" | "canUnlockScreen" | "lastLoginAt" | "lastSyncedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["localUser"]>

  export type $LocalUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cloudId: number
      username: string
      password: string
      role: string
      status: string
      pinCode: string | null
      canUnlockScreen: boolean
      lastLoginAt: Date | null
      lastSyncedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localUser"]>
    composites: {}
  }

  type LocalUserGetPayload<S extends boolean | null | undefined | LocalUserDefaultArgs> = $Result.GetResult<Prisma.$LocalUserPayload, S>

  type LocalUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalUserCountAggregateInputType | true
    }

  export interface LocalUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalUser'], meta: { name: 'LocalUser' } }
    /**
     * Find zero or one LocalUser that matches the filter.
     * @param {LocalUserFindUniqueArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalUserFindUniqueArgs>(args: SelectSubset<T, LocalUserFindUniqueArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalUserFindUniqueOrThrowArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalUserFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserFindFirstArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalUserFindFirstArgs>(args?: SelectSubset<T, LocalUserFindFirstArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserFindFirstOrThrowArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalUserFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalUsers
     * const localUsers = await prisma.localUser.findMany()
     * 
     * // Get first 10 LocalUsers
     * const localUsers = await prisma.localUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localUserWithIdOnly = await prisma.localUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalUserFindManyArgs>(args?: SelectSubset<T, LocalUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalUser.
     * @param {LocalUserCreateArgs} args - Arguments to create a LocalUser.
     * @example
     * // Create one LocalUser
     * const LocalUser = await prisma.localUser.create({
     *   data: {
     *     // ... data to create a LocalUser
     *   }
     * })
     * 
     */
    create<T extends LocalUserCreateArgs>(args: SelectSubset<T, LocalUserCreateArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalUsers.
     * @param {LocalUserCreateManyArgs} args - Arguments to create many LocalUsers.
     * @example
     * // Create many LocalUsers
     * const localUser = await prisma.localUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalUserCreateManyArgs>(args?: SelectSubset<T, LocalUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalUsers and returns the data saved in the database.
     * @param {LocalUserCreateManyAndReturnArgs} args - Arguments to create many LocalUsers.
     * @example
     * // Create many LocalUsers
     * const localUser = await prisma.localUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalUsers and only return the `id`
     * const localUserWithIdOnly = await prisma.localUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalUserCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalUser.
     * @param {LocalUserDeleteArgs} args - Arguments to delete one LocalUser.
     * @example
     * // Delete one LocalUser
     * const LocalUser = await prisma.localUser.delete({
     *   where: {
     *     // ... filter to delete one LocalUser
     *   }
     * })
     * 
     */
    delete<T extends LocalUserDeleteArgs>(args: SelectSubset<T, LocalUserDeleteArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalUser.
     * @param {LocalUserUpdateArgs} args - Arguments to update one LocalUser.
     * @example
     * // Update one LocalUser
     * const localUser = await prisma.localUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalUserUpdateArgs>(args: SelectSubset<T, LocalUserUpdateArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalUsers.
     * @param {LocalUserDeleteManyArgs} args - Arguments to filter LocalUsers to delete.
     * @example
     * // Delete a few LocalUsers
     * const { count } = await prisma.localUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalUserDeleteManyArgs>(args?: SelectSubset<T, LocalUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalUsers
     * const localUser = await prisma.localUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalUserUpdateManyArgs>(args: SelectSubset<T, LocalUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalUsers and returns the data updated in the database.
     * @param {LocalUserUpdateManyAndReturnArgs} args - Arguments to update many LocalUsers.
     * @example
     * // Update many LocalUsers
     * const localUser = await prisma.localUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalUsers and only return the `id`
     * const localUserWithIdOnly = await prisma.localUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalUserUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalUser.
     * @param {LocalUserUpsertArgs} args - Arguments to update or create a LocalUser.
     * @example
     * // Update or create a LocalUser
     * const localUser = await prisma.localUser.upsert({
     *   create: {
     *     // ... data to create a LocalUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalUser we want to update
     *   }
     * })
     */
    upsert<T extends LocalUserUpsertArgs>(args: SelectSubset<T, LocalUserUpsertArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserCountArgs} args - Arguments to filter LocalUsers to count.
     * @example
     * // Count the number of LocalUsers
     * const count = await prisma.localUser.count({
     *   where: {
     *     // ... the filter for the LocalUsers we want to count
     *   }
     * })
    **/
    count<T extends LocalUserCountArgs>(
      args?: Subset<T, LocalUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalUserAggregateArgs>(args: Subset<T, LocalUserAggregateArgs>): Prisma.PrismaPromise<GetLocalUserAggregateType<T>>

    /**
     * Group by LocalUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalUserGroupByArgs['orderBy'] }
        : { orderBy?: LocalUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalUser model
   */
  readonly fields: LocalUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalUser model
   */
  interface LocalUserFieldRefs {
    readonly id: FieldRef<"LocalUser", 'Int'>
    readonly cloudId: FieldRef<"LocalUser", 'Int'>
    readonly username: FieldRef<"LocalUser", 'String'>
    readonly password: FieldRef<"LocalUser", 'String'>
    readonly role: FieldRef<"LocalUser", 'String'>
    readonly status: FieldRef<"LocalUser", 'String'>
    readonly pinCode: FieldRef<"LocalUser", 'String'>
    readonly canUnlockScreen: FieldRef<"LocalUser", 'Boolean'>
    readonly lastLoginAt: FieldRef<"LocalUser", 'DateTime'>
    readonly lastSyncedAt: FieldRef<"LocalUser", 'DateTime'>
    readonly createdAt: FieldRef<"LocalUser", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalUser findUnique
   */
  export type LocalUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser findUniqueOrThrow
   */
  export type LocalUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser findFirst
   */
  export type LocalUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalUsers.
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalUsers.
     */
    distinct?: LocalUserScalarFieldEnum | LocalUserScalarFieldEnum[]
  }

  /**
   * LocalUser findFirstOrThrow
   */
  export type LocalUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalUsers.
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalUsers.
     */
    distinct?: LocalUserScalarFieldEnum | LocalUserScalarFieldEnum[]
  }

  /**
   * LocalUser findMany
   */
  export type LocalUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUsers to fetch.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalUsers.
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    distinct?: LocalUserScalarFieldEnum | LocalUserScalarFieldEnum[]
  }

  /**
   * LocalUser create
   */
  export type LocalUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalUser.
     */
    data: XOR<LocalUserCreateInput, LocalUserUncheckedCreateInput>
  }

  /**
   * LocalUser createMany
   */
  export type LocalUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalUsers.
     */
    data: LocalUserCreateManyInput | LocalUserCreateManyInput[]
  }

  /**
   * LocalUser createManyAndReturn
   */
  export type LocalUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data used to create many LocalUsers.
     */
    data: LocalUserCreateManyInput | LocalUserCreateManyInput[]
  }

  /**
   * LocalUser update
   */
  export type LocalUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalUser.
     */
    data: XOR<LocalUserUpdateInput, LocalUserUncheckedUpdateInput>
    /**
     * Choose, which LocalUser to update.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser updateMany
   */
  export type LocalUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalUsers.
     */
    data: XOR<LocalUserUpdateManyMutationInput, LocalUserUncheckedUpdateManyInput>
    /**
     * Filter which LocalUsers to update
     */
    where?: LocalUserWhereInput
    /**
     * Limit how many LocalUsers to update.
     */
    limit?: number
  }

  /**
   * LocalUser updateManyAndReturn
   */
  export type LocalUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data used to update LocalUsers.
     */
    data: XOR<LocalUserUpdateManyMutationInput, LocalUserUncheckedUpdateManyInput>
    /**
     * Filter which LocalUsers to update
     */
    where?: LocalUserWhereInput
    /**
     * Limit how many LocalUsers to update.
     */
    limit?: number
  }

  /**
   * LocalUser upsert
   */
  export type LocalUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalUser to update in case it exists.
     */
    where: LocalUserWhereUniqueInput
    /**
     * In case the LocalUser found by the `where` argument doesn't exist, create a new LocalUser with this data.
     */
    create: XOR<LocalUserCreateInput, LocalUserUncheckedCreateInput>
    /**
     * In case the LocalUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalUserUpdateInput, LocalUserUncheckedUpdateInput>
  }

  /**
   * LocalUser delete
   */
  export type LocalUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter which LocalUser to delete.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser deleteMany
   */
  export type LocalUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalUsers to delete
     */
    where?: LocalUserWhereInput
    /**
     * Limit how many LocalUsers to delete.
     */
    limit?: number
  }

  /**
   * LocalUser without action
   */
  export type LocalUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
  }


  /**
   * Model SyncQueue
   */

  export type AggregateSyncQueue = {
    _count: SyncQueueCountAggregateOutputType | null
    _avg: SyncQueueAvgAggregateOutputType | null
    _sum: SyncQueueSumAggregateOutputType | null
    _min: SyncQueueMinAggregateOutputType | null
    _max: SyncQueueMaxAggregateOutputType | null
  }

  export type SyncQueueAvgAggregateOutputType = {
    attempts: number | null
  }

  export type SyncQueueSumAggregateOutputType = {
    attempts: number | null
  }

  export type SyncQueueMinAggregateOutputType = {
    id: string | null
    operation: string | null
    tableName: string | null
    recordId: string | null
    payload: string | null
    status: string | null
    attempts: number | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncQueueMaxAggregateOutputType = {
    id: string | null
    operation: string | null
    tableName: string | null
    recordId: string | null
    payload: string | null
    status: string | null
    attempts: number | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncQueueCountAggregateOutputType = {
    id: number
    operation: number
    tableName: number
    recordId: number
    payload: number
    status: number
    attempts: number
    lastError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SyncQueueAvgAggregateInputType = {
    attempts?: true
  }

  export type SyncQueueSumAggregateInputType = {
    attempts?: true
  }

  export type SyncQueueMinAggregateInputType = {
    id?: true
    operation?: true
    tableName?: true
    recordId?: true
    payload?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncQueueMaxAggregateInputType = {
    id?: true
    operation?: true
    tableName?: true
    recordId?: true
    payload?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncQueueCountAggregateInputType = {
    id?: true
    operation?: true
    tableName?: true
    recordId?: true
    payload?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncQueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncQueue to aggregate.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncQueues
    **/
    _count?: true | SyncQueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncQueueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncQueueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncQueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncQueueMaxAggregateInputType
  }

  export type GetSyncQueueAggregateType<T extends SyncQueueAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncQueue[P]>
      : GetScalarType<T[P], AggregateSyncQueue[P]>
  }




  export type SyncQueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncQueueWhereInput
    orderBy?: SyncQueueOrderByWithAggregationInput | SyncQueueOrderByWithAggregationInput[]
    by: SyncQueueScalarFieldEnum[] | SyncQueueScalarFieldEnum
    having?: SyncQueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncQueueCountAggregateInputType | true
    _avg?: SyncQueueAvgAggregateInputType
    _sum?: SyncQueueSumAggregateInputType
    _min?: SyncQueueMinAggregateInputType
    _max?: SyncQueueMaxAggregateInputType
  }

  export type SyncQueueGroupByOutputType = {
    id: string
    operation: string
    tableName: string
    recordId: string | null
    payload: string
    status: string
    attempts: number
    lastError: string | null
    createdAt: Date
    updatedAt: Date
    _count: SyncQueueCountAggregateOutputType | null
    _avg: SyncQueueAvgAggregateOutputType | null
    _sum: SyncQueueSumAggregateOutputType | null
    _min: SyncQueueMinAggregateOutputType | null
    _max: SyncQueueMaxAggregateOutputType | null
  }

  type GetSyncQueueGroupByPayload<T extends SyncQueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncQueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncQueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncQueueGroupByOutputType[P]>
            : GetScalarType<T[P], SyncQueueGroupByOutputType[P]>
        }
      >
    >


  export type SyncQueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operation?: boolean
    tableName?: boolean
    recordId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncQueue"]>

  export type SyncQueueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operation?: boolean
    tableName?: boolean
    recordId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncQueue"]>

  export type SyncQueueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    operation?: boolean
    tableName?: boolean
    recordId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncQueue"]>

  export type SyncQueueSelectScalar = {
    id?: boolean
    operation?: boolean
    tableName?: boolean
    recordId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SyncQueueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "operation" | "tableName" | "recordId" | "payload" | "status" | "attempts" | "lastError" | "createdAt" | "updatedAt", ExtArgs["result"]["syncQueue"]>

  export type $SyncQueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncQueue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      operation: string
      tableName: string
      recordId: string | null
      payload: string
      status: string
      attempts: number
      lastError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["syncQueue"]>
    composites: {}
  }

  type SyncQueueGetPayload<S extends boolean | null | undefined | SyncQueueDefaultArgs> = $Result.GetResult<Prisma.$SyncQueuePayload, S>

  type SyncQueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncQueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncQueueCountAggregateInputType | true
    }

  export interface SyncQueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncQueue'], meta: { name: 'SyncQueue' } }
    /**
     * Find zero or one SyncQueue that matches the filter.
     * @param {SyncQueueFindUniqueArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncQueueFindUniqueArgs>(args: SelectSubset<T, SyncQueueFindUniqueArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncQueue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncQueueFindUniqueOrThrowArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncQueueFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueFindFirstArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncQueueFindFirstArgs>(args?: SelectSubset<T, SyncQueueFindFirstArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueFindFirstOrThrowArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncQueueFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncQueues
     * const syncQueues = await prisma.syncQueue.findMany()
     * 
     * // Get first 10 SyncQueues
     * const syncQueues = await prisma.syncQueue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncQueueWithIdOnly = await prisma.syncQueue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncQueueFindManyArgs>(args?: SelectSubset<T, SyncQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncQueue.
     * @param {SyncQueueCreateArgs} args - Arguments to create a SyncQueue.
     * @example
     * // Create one SyncQueue
     * const SyncQueue = await prisma.syncQueue.create({
     *   data: {
     *     // ... data to create a SyncQueue
     *   }
     * })
     * 
     */
    create<T extends SyncQueueCreateArgs>(args: SelectSubset<T, SyncQueueCreateArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncQueues.
     * @param {SyncQueueCreateManyArgs} args - Arguments to create many SyncQueues.
     * @example
     * // Create many SyncQueues
     * const syncQueue = await prisma.syncQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncQueueCreateManyArgs>(args?: SelectSubset<T, SyncQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncQueues and returns the data saved in the database.
     * @param {SyncQueueCreateManyAndReturnArgs} args - Arguments to create many SyncQueues.
     * @example
     * // Create many SyncQueues
     * const syncQueue = await prisma.syncQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncQueues and only return the `id`
     * const syncQueueWithIdOnly = await prisma.syncQueue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncQueueCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncQueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncQueue.
     * @param {SyncQueueDeleteArgs} args - Arguments to delete one SyncQueue.
     * @example
     * // Delete one SyncQueue
     * const SyncQueue = await prisma.syncQueue.delete({
     *   where: {
     *     // ... filter to delete one SyncQueue
     *   }
     * })
     * 
     */
    delete<T extends SyncQueueDeleteArgs>(args: SelectSubset<T, SyncQueueDeleteArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncQueue.
     * @param {SyncQueueUpdateArgs} args - Arguments to update one SyncQueue.
     * @example
     * // Update one SyncQueue
     * const syncQueue = await prisma.syncQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncQueueUpdateArgs>(args: SelectSubset<T, SyncQueueUpdateArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncQueues.
     * @param {SyncQueueDeleteManyArgs} args - Arguments to filter SyncQueues to delete.
     * @example
     * // Delete a few SyncQueues
     * const { count } = await prisma.syncQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncQueueDeleteManyArgs>(args?: SelectSubset<T, SyncQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncQueues
     * const syncQueue = await prisma.syncQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncQueueUpdateManyArgs>(args: SelectSubset<T, SyncQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncQueues and returns the data updated in the database.
     * @param {SyncQueueUpdateManyAndReturnArgs} args - Arguments to update many SyncQueues.
     * @example
     * // Update many SyncQueues
     * const syncQueue = await prisma.syncQueue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncQueues and only return the `id`
     * const syncQueueWithIdOnly = await prisma.syncQueue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SyncQueueUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncQueueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncQueue.
     * @param {SyncQueueUpsertArgs} args - Arguments to update or create a SyncQueue.
     * @example
     * // Update or create a SyncQueue
     * const syncQueue = await prisma.syncQueue.upsert({
     *   create: {
     *     // ... data to create a SyncQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncQueue we want to update
     *   }
     * })
     */
    upsert<T extends SyncQueueUpsertArgs>(args: SelectSubset<T, SyncQueueUpsertArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueCountArgs} args - Arguments to filter SyncQueues to count.
     * @example
     * // Count the number of SyncQueues
     * const count = await prisma.syncQueue.count({
     *   where: {
     *     // ... the filter for the SyncQueues we want to count
     *   }
     * })
    **/
    count<T extends SyncQueueCountArgs>(
      args?: Subset<T, SyncQueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncQueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncQueueAggregateArgs>(args: Subset<T, SyncQueueAggregateArgs>): Prisma.PrismaPromise<GetSyncQueueAggregateType<T>>

    /**
     * Group by SyncQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncQueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncQueueGroupByArgs['orderBy'] }
        : { orderBy?: SyncQueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncQueue model
   */
  readonly fields: SyncQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncQueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncQueue model
   */
  interface SyncQueueFieldRefs {
    readonly id: FieldRef<"SyncQueue", 'String'>
    readonly operation: FieldRef<"SyncQueue", 'String'>
    readonly tableName: FieldRef<"SyncQueue", 'String'>
    readonly recordId: FieldRef<"SyncQueue", 'String'>
    readonly payload: FieldRef<"SyncQueue", 'String'>
    readonly status: FieldRef<"SyncQueue", 'String'>
    readonly attempts: FieldRef<"SyncQueue", 'Int'>
    readonly lastError: FieldRef<"SyncQueue", 'String'>
    readonly createdAt: FieldRef<"SyncQueue", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncQueue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncQueue findUnique
   */
  export type SyncQueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue findUniqueOrThrow
   */
  export type SyncQueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue findFirst
   */
  export type SyncQueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncQueues.
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueues.
     */
    distinct?: SyncQueueScalarFieldEnum | SyncQueueScalarFieldEnum[]
  }

  /**
   * SyncQueue findFirstOrThrow
   */
  export type SyncQueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncQueues.
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueues.
     */
    distinct?: SyncQueueScalarFieldEnum | SyncQueueScalarFieldEnum[]
  }

  /**
   * SyncQueue findMany
   */
  export type SyncQueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueues to fetch.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncQueues.
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    distinct?: SyncQueueScalarFieldEnum | SyncQueueScalarFieldEnum[]
  }

  /**
   * SyncQueue create
   */
  export type SyncQueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data needed to create a SyncQueue.
     */
    data: XOR<SyncQueueCreateInput, SyncQueueUncheckedCreateInput>
  }

  /**
   * SyncQueue createMany
   */
  export type SyncQueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncQueues.
     */
    data: SyncQueueCreateManyInput | SyncQueueCreateManyInput[]
  }

  /**
   * SyncQueue createManyAndReturn
   */
  export type SyncQueueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data used to create many SyncQueues.
     */
    data: SyncQueueCreateManyInput | SyncQueueCreateManyInput[]
  }

  /**
   * SyncQueue update
   */
  export type SyncQueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data needed to update a SyncQueue.
     */
    data: XOR<SyncQueueUpdateInput, SyncQueueUncheckedUpdateInput>
    /**
     * Choose, which SyncQueue to update.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue updateMany
   */
  export type SyncQueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncQueues.
     */
    data: XOR<SyncQueueUpdateManyMutationInput, SyncQueueUncheckedUpdateManyInput>
    /**
     * Filter which SyncQueues to update
     */
    where?: SyncQueueWhereInput
    /**
     * Limit how many SyncQueues to update.
     */
    limit?: number
  }

  /**
   * SyncQueue updateManyAndReturn
   */
  export type SyncQueueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data used to update SyncQueues.
     */
    data: XOR<SyncQueueUpdateManyMutationInput, SyncQueueUncheckedUpdateManyInput>
    /**
     * Filter which SyncQueues to update
     */
    where?: SyncQueueWhereInput
    /**
     * Limit how many SyncQueues to update.
     */
    limit?: number
  }

  /**
   * SyncQueue upsert
   */
  export type SyncQueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The filter to search for the SyncQueue to update in case it exists.
     */
    where: SyncQueueWhereUniqueInput
    /**
     * In case the SyncQueue found by the `where` argument doesn't exist, create a new SyncQueue with this data.
     */
    create: XOR<SyncQueueCreateInput, SyncQueueUncheckedCreateInput>
    /**
     * In case the SyncQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncQueueUpdateInput, SyncQueueUncheckedUpdateInput>
  }

  /**
   * SyncQueue delete
   */
  export type SyncQueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter which SyncQueue to delete.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue deleteMany
   */
  export type SyncQueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncQueues to delete
     */
    where?: SyncQueueWhereInput
    /**
     * Limit how many SyncQueues to delete.
     */
    limit?: number
  }

  /**
   * SyncQueue without action
   */
  export type SyncQueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
  }


  /**
   * Model LocalOrder
   */

  export type AggregateLocalOrder = {
    _count: LocalOrderCountAggregateOutputType | null
    _avg: LocalOrderAvgAggregateOutputType | null
    _sum: LocalOrderSumAggregateOutputType | null
    _min: LocalOrderMinAggregateOutputType | null
    _max: LocalOrderMaxAggregateOutputType | null
  }

  export type LocalOrderAvgAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
    subtotal: number | null
    tax: number | null
    discount: number | null
    totalPrice: number | null
    shiftId: number | null
    commission: number | null
    cloudOrderId: number | null
  }

  export type LocalOrderSumAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
    subtotal: number | null
    tax: number | null
    discount: number | null
    totalPrice: number | null
    shiftId: number | null
    commission: number | null
    cloudOrderId: number | null
  }

  export type LocalOrderMinAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
    subtotal: number | null
    tax: number | null
    discount: number | null
    totalPrice: number | null
    paymentMethod: string | null
    customerName: string | null
    customerPhone: string | null
    cardAuthCode: string | null
    cardType: string | null
    qrRefNo: string | null
    shiftId: number | null
    orderSource: string | null
    deliveryOrderId: string | null
    deliveryPlatform: string | null
    commission: number | null
    isSynced: boolean | null
    cloudOrderId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalOrderMaxAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
    subtotal: number | null
    tax: number | null
    discount: number | null
    totalPrice: number | null
    paymentMethod: string | null
    customerName: string | null
    customerPhone: string | null
    cardAuthCode: string | null
    cardType: string | null
    qrRefNo: string | null
    shiftId: number | null
    orderSource: string | null
    deliveryOrderId: string | null
    deliveryPlatform: string | null
    commission: number | null
    isSynced: boolean | null
    cloudOrderId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalOrderCountAggregateOutputType = {
    id: number
    productId: number
    quantity: number
    subtotal: number
    tax: number
    discount: number
    totalPrice: number
    paymentMethod: number
    customerName: number
    customerPhone: number
    cardAuthCode: number
    cardType: number
    qrRefNo: number
    shiftId: number
    orderSource: number
    deliveryOrderId: number
    deliveryPlatform: number
    commission: number
    isSynced: number
    cloudOrderId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalOrderAvgAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    subtotal?: true
    tax?: true
    discount?: true
    totalPrice?: true
    shiftId?: true
    commission?: true
    cloudOrderId?: true
  }

  export type LocalOrderSumAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    subtotal?: true
    tax?: true
    discount?: true
    totalPrice?: true
    shiftId?: true
    commission?: true
    cloudOrderId?: true
  }

  export type LocalOrderMinAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    subtotal?: true
    tax?: true
    discount?: true
    totalPrice?: true
    paymentMethod?: true
    customerName?: true
    customerPhone?: true
    cardAuthCode?: true
    cardType?: true
    qrRefNo?: true
    shiftId?: true
    orderSource?: true
    deliveryOrderId?: true
    deliveryPlatform?: true
    commission?: true
    isSynced?: true
    cloudOrderId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalOrderMaxAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    subtotal?: true
    tax?: true
    discount?: true
    totalPrice?: true
    paymentMethod?: true
    customerName?: true
    customerPhone?: true
    cardAuthCode?: true
    cardType?: true
    qrRefNo?: true
    shiftId?: true
    orderSource?: true
    deliveryOrderId?: true
    deliveryPlatform?: true
    commission?: true
    isSynced?: true
    cloudOrderId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalOrderCountAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    subtotal?: true
    tax?: true
    discount?: true
    totalPrice?: true
    paymentMethod?: true
    customerName?: true
    customerPhone?: true
    cardAuthCode?: true
    cardType?: true
    qrRefNo?: true
    shiftId?: true
    orderSource?: true
    deliveryOrderId?: true
    deliveryPlatform?: true
    commission?: true
    isSynced?: true
    cloudOrderId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalOrder to aggregate.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalOrders
    **/
    _count?: true | LocalOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalOrderMaxAggregateInputType
  }

  export type GetLocalOrderAggregateType<T extends LocalOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalOrder[P]>
      : GetScalarType<T[P], AggregateLocalOrder[P]>
  }




  export type LocalOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalOrderWhereInput
    orderBy?: LocalOrderOrderByWithAggregationInput | LocalOrderOrderByWithAggregationInput[]
    by: LocalOrderScalarFieldEnum[] | LocalOrderScalarFieldEnum
    having?: LocalOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalOrderCountAggregateInputType | true
    _avg?: LocalOrderAvgAggregateInputType
    _sum?: LocalOrderSumAggregateInputType
    _min?: LocalOrderMinAggregateInputType
    _max?: LocalOrderMaxAggregateInputType
  }

  export type LocalOrderGroupByOutputType = {
    id: number
    productId: number
    quantity: number
    subtotal: number | null
    tax: number | null
    discount: number | null
    totalPrice: number
    paymentMethod: string
    customerName: string | null
    customerPhone: string | null
    cardAuthCode: string | null
    cardType: string | null
    qrRefNo: string | null
    shiftId: number | null
    orderSource: string
    deliveryOrderId: string | null
    deliveryPlatform: string | null
    commission: number | null
    isSynced: boolean
    cloudOrderId: number | null
    createdAt: Date
    updatedAt: Date
    _count: LocalOrderCountAggregateOutputType | null
    _avg: LocalOrderAvgAggregateOutputType | null
    _sum: LocalOrderSumAggregateOutputType | null
    _min: LocalOrderMinAggregateOutputType | null
    _max: LocalOrderMaxAggregateOutputType | null
  }

  type GetLocalOrderGroupByPayload<T extends LocalOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalOrderGroupByOutputType[P]>
            : GetScalarType<T[P], LocalOrderGroupByOutputType[P]>
        }
      >
    >


  export type LocalOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    quantity?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    totalPrice?: boolean
    paymentMethod?: boolean
    customerName?: boolean
    customerPhone?: boolean
    cardAuthCode?: boolean
    cardType?: boolean
    qrRefNo?: boolean
    shiftId?: boolean
    orderSource?: boolean
    deliveryOrderId?: boolean
    deliveryPlatform?: boolean
    commission?: boolean
    isSynced?: boolean
    cloudOrderId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localOrder"]>

  export type LocalOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    quantity?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    totalPrice?: boolean
    paymentMethod?: boolean
    customerName?: boolean
    customerPhone?: boolean
    cardAuthCode?: boolean
    cardType?: boolean
    qrRefNo?: boolean
    shiftId?: boolean
    orderSource?: boolean
    deliveryOrderId?: boolean
    deliveryPlatform?: boolean
    commission?: boolean
    isSynced?: boolean
    cloudOrderId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localOrder"]>

  export type LocalOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    quantity?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    totalPrice?: boolean
    paymentMethod?: boolean
    customerName?: boolean
    customerPhone?: boolean
    cardAuthCode?: boolean
    cardType?: boolean
    qrRefNo?: boolean
    shiftId?: boolean
    orderSource?: boolean
    deliveryOrderId?: boolean
    deliveryPlatform?: boolean
    commission?: boolean
    isSynced?: boolean
    cloudOrderId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localOrder"]>

  export type LocalOrderSelectScalar = {
    id?: boolean
    productId?: boolean
    quantity?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    totalPrice?: boolean
    paymentMethod?: boolean
    customerName?: boolean
    customerPhone?: boolean
    cardAuthCode?: boolean
    cardType?: boolean
    qrRefNo?: boolean
    shiftId?: boolean
    orderSource?: boolean
    deliveryOrderId?: boolean
    deliveryPlatform?: boolean
    commission?: boolean
    isSynced?: boolean
    cloudOrderId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "quantity" | "subtotal" | "tax" | "discount" | "totalPrice" | "paymentMethod" | "customerName" | "customerPhone" | "cardAuthCode" | "cardType" | "qrRefNo" | "shiftId" | "orderSource" | "deliveryOrderId" | "deliveryPlatform" | "commission" | "isSynced" | "cloudOrderId" | "createdAt" | "updatedAt", ExtArgs["result"]["localOrder"]>

  export type $LocalOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalOrder"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      productId: number
      quantity: number
      subtotal: number | null
      tax: number | null
      discount: number | null
      totalPrice: number
      paymentMethod: string
      customerName: string | null
      customerPhone: string | null
      cardAuthCode: string | null
      cardType: string | null
      qrRefNo: string | null
      shiftId: number | null
      orderSource: string
      deliveryOrderId: string | null
      deliveryPlatform: string | null
      commission: number | null
      isSynced: boolean
      cloudOrderId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localOrder"]>
    composites: {}
  }

  type LocalOrderGetPayload<S extends boolean | null | undefined | LocalOrderDefaultArgs> = $Result.GetResult<Prisma.$LocalOrderPayload, S>

  type LocalOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalOrderCountAggregateInputType | true
    }

  export interface LocalOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalOrder'], meta: { name: 'LocalOrder' } }
    /**
     * Find zero or one LocalOrder that matches the filter.
     * @param {LocalOrderFindUniqueArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalOrderFindUniqueArgs>(args: SelectSubset<T, LocalOrderFindUniqueArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalOrderFindUniqueOrThrowArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderFindFirstArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalOrderFindFirstArgs>(args?: SelectSubset<T, LocalOrderFindFirstArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderFindFirstOrThrowArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalOrders
     * const localOrders = await prisma.localOrder.findMany()
     * 
     * // Get first 10 LocalOrders
     * const localOrders = await prisma.localOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localOrderWithIdOnly = await prisma.localOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalOrderFindManyArgs>(args?: SelectSubset<T, LocalOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalOrder.
     * @param {LocalOrderCreateArgs} args - Arguments to create a LocalOrder.
     * @example
     * // Create one LocalOrder
     * const LocalOrder = await prisma.localOrder.create({
     *   data: {
     *     // ... data to create a LocalOrder
     *   }
     * })
     * 
     */
    create<T extends LocalOrderCreateArgs>(args: SelectSubset<T, LocalOrderCreateArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalOrders.
     * @param {LocalOrderCreateManyArgs} args - Arguments to create many LocalOrders.
     * @example
     * // Create many LocalOrders
     * const localOrder = await prisma.localOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalOrderCreateManyArgs>(args?: SelectSubset<T, LocalOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalOrders and returns the data saved in the database.
     * @param {LocalOrderCreateManyAndReturnArgs} args - Arguments to create many LocalOrders.
     * @example
     * // Create many LocalOrders
     * const localOrder = await prisma.localOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalOrders and only return the `id`
     * const localOrderWithIdOnly = await prisma.localOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalOrder.
     * @param {LocalOrderDeleteArgs} args - Arguments to delete one LocalOrder.
     * @example
     * // Delete one LocalOrder
     * const LocalOrder = await prisma.localOrder.delete({
     *   where: {
     *     // ... filter to delete one LocalOrder
     *   }
     * })
     * 
     */
    delete<T extends LocalOrderDeleteArgs>(args: SelectSubset<T, LocalOrderDeleteArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalOrder.
     * @param {LocalOrderUpdateArgs} args - Arguments to update one LocalOrder.
     * @example
     * // Update one LocalOrder
     * const localOrder = await prisma.localOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalOrderUpdateArgs>(args: SelectSubset<T, LocalOrderUpdateArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalOrders.
     * @param {LocalOrderDeleteManyArgs} args - Arguments to filter LocalOrders to delete.
     * @example
     * // Delete a few LocalOrders
     * const { count } = await prisma.localOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalOrderDeleteManyArgs>(args?: SelectSubset<T, LocalOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalOrders
     * const localOrder = await prisma.localOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalOrderUpdateManyArgs>(args: SelectSubset<T, LocalOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalOrders and returns the data updated in the database.
     * @param {LocalOrderUpdateManyAndReturnArgs} args - Arguments to update many LocalOrders.
     * @example
     * // Update many LocalOrders
     * const localOrder = await prisma.localOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalOrders and only return the `id`
     * const localOrderWithIdOnly = await prisma.localOrder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalOrder.
     * @param {LocalOrderUpsertArgs} args - Arguments to update or create a LocalOrder.
     * @example
     * // Update or create a LocalOrder
     * const localOrder = await prisma.localOrder.upsert({
     *   create: {
     *     // ... data to create a LocalOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalOrder we want to update
     *   }
     * })
     */
    upsert<T extends LocalOrderUpsertArgs>(args: SelectSubset<T, LocalOrderUpsertArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderCountArgs} args - Arguments to filter LocalOrders to count.
     * @example
     * // Count the number of LocalOrders
     * const count = await prisma.localOrder.count({
     *   where: {
     *     // ... the filter for the LocalOrders we want to count
     *   }
     * })
    **/
    count<T extends LocalOrderCountArgs>(
      args?: Subset<T, LocalOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalOrderAggregateArgs>(args: Subset<T, LocalOrderAggregateArgs>): Prisma.PrismaPromise<GetLocalOrderAggregateType<T>>

    /**
     * Group by LocalOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalOrderGroupByArgs['orderBy'] }
        : { orderBy?: LocalOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalOrder model
   */
  readonly fields: LocalOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalOrder model
   */
  interface LocalOrderFieldRefs {
    readonly id: FieldRef<"LocalOrder", 'Int'>
    readonly productId: FieldRef<"LocalOrder", 'Int'>
    readonly quantity: FieldRef<"LocalOrder", 'Int'>
    readonly subtotal: FieldRef<"LocalOrder", 'Float'>
    readonly tax: FieldRef<"LocalOrder", 'Float'>
    readonly discount: FieldRef<"LocalOrder", 'Float'>
    readonly totalPrice: FieldRef<"LocalOrder", 'Float'>
    readonly paymentMethod: FieldRef<"LocalOrder", 'String'>
    readonly customerName: FieldRef<"LocalOrder", 'String'>
    readonly customerPhone: FieldRef<"LocalOrder", 'String'>
    readonly cardAuthCode: FieldRef<"LocalOrder", 'String'>
    readonly cardType: FieldRef<"LocalOrder", 'String'>
    readonly qrRefNo: FieldRef<"LocalOrder", 'String'>
    readonly shiftId: FieldRef<"LocalOrder", 'Int'>
    readonly orderSource: FieldRef<"LocalOrder", 'String'>
    readonly deliveryOrderId: FieldRef<"LocalOrder", 'String'>
    readonly deliveryPlatform: FieldRef<"LocalOrder", 'String'>
    readonly commission: FieldRef<"LocalOrder", 'Float'>
    readonly isSynced: FieldRef<"LocalOrder", 'Boolean'>
    readonly cloudOrderId: FieldRef<"LocalOrder", 'Int'>
    readonly createdAt: FieldRef<"LocalOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalOrder findUnique
   */
  export type LocalOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder findUniqueOrThrow
   */
  export type LocalOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder findFirst
   */
  export type LocalOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalOrders.
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrders.
     */
    distinct?: LocalOrderScalarFieldEnum | LocalOrderScalarFieldEnum[]
  }

  /**
   * LocalOrder findFirstOrThrow
   */
  export type LocalOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalOrders.
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrders.
     */
    distinct?: LocalOrderScalarFieldEnum | LocalOrderScalarFieldEnum[]
  }

  /**
   * LocalOrder findMany
   */
  export type LocalOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Filter, which LocalOrders to fetch.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalOrders.
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    distinct?: LocalOrderScalarFieldEnum | LocalOrderScalarFieldEnum[]
  }

  /**
   * LocalOrder create
   */
  export type LocalOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalOrder.
     */
    data: XOR<LocalOrderCreateInput, LocalOrderUncheckedCreateInput>
  }

  /**
   * LocalOrder createMany
   */
  export type LocalOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalOrders.
     */
    data: LocalOrderCreateManyInput | LocalOrderCreateManyInput[]
  }

  /**
   * LocalOrder createManyAndReturn
   */
  export type LocalOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The data used to create many LocalOrders.
     */
    data: LocalOrderCreateManyInput | LocalOrderCreateManyInput[]
  }

  /**
   * LocalOrder update
   */
  export type LocalOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalOrder.
     */
    data: XOR<LocalOrderUpdateInput, LocalOrderUncheckedUpdateInput>
    /**
     * Choose, which LocalOrder to update.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder updateMany
   */
  export type LocalOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalOrders.
     */
    data: XOR<LocalOrderUpdateManyMutationInput, LocalOrderUncheckedUpdateManyInput>
    /**
     * Filter which LocalOrders to update
     */
    where?: LocalOrderWhereInput
    /**
     * Limit how many LocalOrders to update.
     */
    limit?: number
  }

  /**
   * LocalOrder updateManyAndReturn
   */
  export type LocalOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The data used to update LocalOrders.
     */
    data: XOR<LocalOrderUpdateManyMutationInput, LocalOrderUncheckedUpdateManyInput>
    /**
     * Filter which LocalOrders to update
     */
    where?: LocalOrderWhereInput
    /**
     * Limit how many LocalOrders to update.
     */
    limit?: number
  }

  /**
   * LocalOrder upsert
   */
  export type LocalOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalOrder to update in case it exists.
     */
    where: LocalOrderWhereUniqueInput
    /**
     * In case the LocalOrder found by the `where` argument doesn't exist, create a new LocalOrder with this data.
     */
    create: XOR<LocalOrderCreateInput, LocalOrderUncheckedCreateInput>
    /**
     * In case the LocalOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalOrderUpdateInput, LocalOrderUncheckedUpdateInput>
  }

  /**
   * LocalOrder delete
   */
  export type LocalOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Filter which LocalOrder to delete.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder deleteMany
   */
  export type LocalOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalOrders to delete
     */
    where?: LocalOrderWhereInput
    /**
     * Limit how many LocalOrders to delete.
     */
    limit?: number
  }

  /**
   * LocalOrder without action
   */
  export type LocalOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
  }


  /**
   * Model LocalProduct
   */

  export type AggregateLocalProduct = {
    _count: LocalProductCountAggregateOutputType | null
    _avg: LocalProductAvgAggregateOutputType | null
    _sum: LocalProductSumAggregateOutputType | null
    _min: LocalProductMinAggregateOutputType | null
    _max: LocalProductMaxAggregateOutputType | null
  }

  export type LocalProductAvgAggregateOutputType = {
    id: number | null
    cloudId: number | null
    categoryId: number | null
    subCategoryId: number | null
    costPrice: number | null
    sellingPrice: number | null
    packagingCost: number | null
    currentStock: number | null
    reorderLevel: number | null
    supplierId: number | null
  }

  export type LocalProductSumAggregateOutputType = {
    id: number | null
    cloudId: number | null
    categoryId: number | null
    subCategoryId: number | null
    costPrice: number | null
    sellingPrice: number | null
    packagingCost: number | null
    currentStock: number | null
    reorderLevel: number | null
    supplierId: number | null
  }

  export type LocalProductMinAggregateOutputType = {
    id: number | null
    cloudId: number | null
    name: string | null
    category: string | null
    categoryId: number | null
    subCategoryId: number | null
    costPrice: number | null
    sellingPrice: number | null
    packagingCost: number | null
    currentStock: number | null
    reorderLevel: number | null
    supplierId: number | null
    imageUrl: string | null
    productType: string | null
    trackStock: boolean | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalProductMaxAggregateOutputType = {
    id: number | null
    cloudId: number | null
    name: string | null
    category: string | null
    categoryId: number | null
    subCategoryId: number | null
    costPrice: number | null
    sellingPrice: number | null
    packagingCost: number | null
    currentStock: number | null
    reorderLevel: number | null
    supplierId: number | null
    imageUrl: string | null
    productType: string | null
    trackStock: boolean | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalProductCountAggregateOutputType = {
    id: number
    cloudId: number
    name: number
    category: number
    categoryId: number
    subCategoryId: number
    costPrice: number
    sellingPrice: number
    packagingCost: number
    currentStock: number
    reorderLevel: number
    supplierId: number
    imageUrl: number
    productType: number
    trackStock: number
    lastSyncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalProductAvgAggregateInputType = {
    id?: true
    cloudId?: true
    categoryId?: true
    subCategoryId?: true
    costPrice?: true
    sellingPrice?: true
    packagingCost?: true
    currentStock?: true
    reorderLevel?: true
    supplierId?: true
  }

  export type LocalProductSumAggregateInputType = {
    id?: true
    cloudId?: true
    categoryId?: true
    subCategoryId?: true
    costPrice?: true
    sellingPrice?: true
    packagingCost?: true
    currentStock?: true
    reorderLevel?: true
    supplierId?: true
  }

  export type LocalProductMinAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    category?: true
    categoryId?: true
    subCategoryId?: true
    costPrice?: true
    sellingPrice?: true
    packagingCost?: true
    currentStock?: true
    reorderLevel?: true
    supplierId?: true
    imageUrl?: true
    productType?: true
    trackStock?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalProductMaxAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    category?: true
    categoryId?: true
    subCategoryId?: true
    costPrice?: true
    sellingPrice?: true
    packagingCost?: true
    currentStock?: true
    reorderLevel?: true
    supplierId?: true
    imageUrl?: true
    productType?: true
    trackStock?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalProductCountAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    category?: true
    categoryId?: true
    subCategoryId?: true
    costPrice?: true
    sellingPrice?: true
    packagingCost?: true
    currentStock?: true
    reorderLevel?: true
    supplierId?: true
    imageUrl?: true
    productType?: true
    trackStock?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalProduct to aggregate.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalProducts
    **/
    _count?: true | LocalProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalProductMaxAggregateInputType
  }

  export type GetLocalProductAggregateType<T extends LocalProductAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalProduct[P]>
      : GetScalarType<T[P], AggregateLocalProduct[P]>
  }




  export type LocalProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalProductWhereInput
    orderBy?: LocalProductOrderByWithAggregationInput | LocalProductOrderByWithAggregationInput[]
    by: LocalProductScalarFieldEnum[] | LocalProductScalarFieldEnum
    having?: LocalProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalProductCountAggregateInputType | true
    _avg?: LocalProductAvgAggregateInputType
    _sum?: LocalProductSumAggregateInputType
    _min?: LocalProductMinAggregateInputType
    _max?: LocalProductMaxAggregateInputType
  }

  export type LocalProductGroupByOutputType = {
    id: number
    cloudId: number
    name: string
    category: string | null
    categoryId: number | null
    subCategoryId: number | null
    costPrice: number
    sellingPrice: number
    packagingCost: number | null
    currentStock: number
    reorderLevel: number | null
    supplierId: number
    imageUrl: string | null
    productType: string | null
    trackStock: boolean
    lastSyncedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: LocalProductCountAggregateOutputType | null
    _avg: LocalProductAvgAggregateOutputType | null
    _sum: LocalProductSumAggregateOutputType | null
    _min: LocalProductMinAggregateOutputType | null
    _max: LocalProductMaxAggregateOutputType | null
  }

  type GetLocalProductGroupByPayload<T extends LocalProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalProductGroupByOutputType[P]>
            : GetScalarType<T[P], LocalProductGroupByOutputType[P]>
        }
      >
    >


  export type LocalProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    category?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    costPrice?: boolean
    sellingPrice?: boolean
    packagingCost?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    supplierId?: boolean
    imageUrl?: boolean
    productType?: boolean
    trackStock?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localProduct"]>

  export type LocalProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    category?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    costPrice?: boolean
    sellingPrice?: boolean
    packagingCost?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    supplierId?: boolean
    imageUrl?: boolean
    productType?: boolean
    trackStock?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localProduct"]>

  export type LocalProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    category?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    costPrice?: boolean
    sellingPrice?: boolean
    packagingCost?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    supplierId?: boolean
    imageUrl?: boolean
    productType?: boolean
    trackStock?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localProduct"]>

  export type LocalProductSelectScalar = {
    id?: boolean
    cloudId?: boolean
    name?: boolean
    category?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    costPrice?: boolean
    sellingPrice?: boolean
    packagingCost?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    supplierId?: boolean
    imageUrl?: boolean
    productType?: boolean
    trackStock?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cloudId" | "name" | "category" | "categoryId" | "subCategoryId" | "costPrice" | "sellingPrice" | "packagingCost" | "currentStock" | "reorderLevel" | "supplierId" | "imageUrl" | "productType" | "trackStock" | "lastSyncedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["localProduct"]>

  export type $LocalProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalProduct"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cloudId: number
      name: string
      category: string | null
      categoryId: number | null
      subCategoryId: number | null
      costPrice: number
      sellingPrice: number
      packagingCost: number | null
      currentStock: number
      reorderLevel: number | null
      supplierId: number
      imageUrl: string | null
      productType: string | null
      trackStock: boolean
      lastSyncedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localProduct"]>
    composites: {}
  }

  type LocalProductGetPayload<S extends boolean | null | undefined | LocalProductDefaultArgs> = $Result.GetResult<Prisma.$LocalProductPayload, S>

  type LocalProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalProductCountAggregateInputType | true
    }

  export interface LocalProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalProduct'], meta: { name: 'LocalProduct' } }
    /**
     * Find zero or one LocalProduct that matches the filter.
     * @param {LocalProductFindUniqueArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalProductFindUniqueArgs>(args: SelectSubset<T, LocalProductFindUniqueArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalProduct that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalProductFindUniqueOrThrowArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalProductFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductFindFirstArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalProductFindFirstArgs>(args?: SelectSubset<T, LocalProductFindFirstArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductFindFirstOrThrowArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalProductFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalProducts
     * const localProducts = await prisma.localProduct.findMany()
     * 
     * // Get first 10 LocalProducts
     * const localProducts = await prisma.localProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localProductWithIdOnly = await prisma.localProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalProductFindManyArgs>(args?: SelectSubset<T, LocalProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalProduct.
     * @param {LocalProductCreateArgs} args - Arguments to create a LocalProduct.
     * @example
     * // Create one LocalProduct
     * const LocalProduct = await prisma.localProduct.create({
     *   data: {
     *     // ... data to create a LocalProduct
     *   }
     * })
     * 
     */
    create<T extends LocalProductCreateArgs>(args: SelectSubset<T, LocalProductCreateArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalProducts.
     * @param {LocalProductCreateManyArgs} args - Arguments to create many LocalProducts.
     * @example
     * // Create many LocalProducts
     * const localProduct = await prisma.localProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalProductCreateManyArgs>(args?: SelectSubset<T, LocalProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalProducts and returns the data saved in the database.
     * @param {LocalProductCreateManyAndReturnArgs} args - Arguments to create many LocalProducts.
     * @example
     * // Create many LocalProducts
     * const localProduct = await prisma.localProduct.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalProducts and only return the `id`
     * const localProductWithIdOnly = await prisma.localProduct.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalProductCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalProduct.
     * @param {LocalProductDeleteArgs} args - Arguments to delete one LocalProduct.
     * @example
     * // Delete one LocalProduct
     * const LocalProduct = await prisma.localProduct.delete({
     *   where: {
     *     // ... filter to delete one LocalProduct
     *   }
     * })
     * 
     */
    delete<T extends LocalProductDeleteArgs>(args: SelectSubset<T, LocalProductDeleteArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalProduct.
     * @param {LocalProductUpdateArgs} args - Arguments to update one LocalProduct.
     * @example
     * // Update one LocalProduct
     * const localProduct = await prisma.localProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalProductUpdateArgs>(args: SelectSubset<T, LocalProductUpdateArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalProducts.
     * @param {LocalProductDeleteManyArgs} args - Arguments to filter LocalProducts to delete.
     * @example
     * // Delete a few LocalProducts
     * const { count } = await prisma.localProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalProductDeleteManyArgs>(args?: SelectSubset<T, LocalProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalProducts
     * const localProduct = await prisma.localProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalProductUpdateManyArgs>(args: SelectSubset<T, LocalProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalProducts and returns the data updated in the database.
     * @param {LocalProductUpdateManyAndReturnArgs} args - Arguments to update many LocalProducts.
     * @example
     * // Update many LocalProducts
     * const localProduct = await prisma.localProduct.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalProducts and only return the `id`
     * const localProductWithIdOnly = await prisma.localProduct.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalProductUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalProduct.
     * @param {LocalProductUpsertArgs} args - Arguments to update or create a LocalProduct.
     * @example
     * // Update or create a LocalProduct
     * const localProduct = await prisma.localProduct.upsert({
     *   create: {
     *     // ... data to create a LocalProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalProduct we want to update
     *   }
     * })
     */
    upsert<T extends LocalProductUpsertArgs>(args: SelectSubset<T, LocalProductUpsertArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductCountArgs} args - Arguments to filter LocalProducts to count.
     * @example
     * // Count the number of LocalProducts
     * const count = await prisma.localProduct.count({
     *   where: {
     *     // ... the filter for the LocalProducts we want to count
     *   }
     * })
    **/
    count<T extends LocalProductCountArgs>(
      args?: Subset<T, LocalProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalProductAggregateArgs>(args: Subset<T, LocalProductAggregateArgs>): Prisma.PrismaPromise<GetLocalProductAggregateType<T>>

    /**
     * Group by LocalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalProductGroupByArgs['orderBy'] }
        : { orderBy?: LocalProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalProduct model
   */
  readonly fields: LocalProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalProduct model
   */
  interface LocalProductFieldRefs {
    readonly id: FieldRef<"LocalProduct", 'Int'>
    readonly cloudId: FieldRef<"LocalProduct", 'Int'>
    readonly name: FieldRef<"LocalProduct", 'String'>
    readonly category: FieldRef<"LocalProduct", 'String'>
    readonly categoryId: FieldRef<"LocalProduct", 'Int'>
    readonly subCategoryId: FieldRef<"LocalProduct", 'Int'>
    readonly costPrice: FieldRef<"LocalProduct", 'Float'>
    readonly sellingPrice: FieldRef<"LocalProduct", 'Float'>
    readonly packagingCost: FieldRef<"LocalProduct", 'Float'>
    readonly currentStock: FieldRef<"LocalProduct", 'Int'>
    readonly reorderLevel: FieldRef<"LocalProduct", 'Int'>
    readonly supplierId: FieldRef<"LocalProduct", 'Int'>
    readonly imageUrl: FieldRef<"LocalProduct", 'String'>
    readonly productType: FieldRef<"LocalProduct", 'String'>
    readonly trackStock: FieldRef<"LocalProduct", 'Boolean'>
    readonly lastSyncedAt: FieldRef<"LocalProduct", 'DateTime'>
    readonly createdAt: FieldRef<"LocalProduct", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalProduct", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalProduct findUnique
   */
  export type LocalProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct findUniqueOrThrow
   */
  export type LocalProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct findFirst
   */
  export type LocalProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalProducts.
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalProducts.
     */
    distinct?: LocalProductScalarFieldEnum | LocalProductScalarFieldEnum[]
  }

  /**
   * LocalProduct findFirstOrThrow
   */
  export type LocalProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalProducts.
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalProducts.
     */
    distinct?: LocalProductScalarFieldEnum | LocalProductScalarFieldEnum[]
  }

  /**
   * LocalProduct findMany
   */
  export type LocalProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProducts to fetch.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalProducts.
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    distinct?: LocalProductScalarFieldEnum | LocalProductScalarFieldEnum[]
  }

  /**
   * LocalProduct create
   */
  export type LocalProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalProduct.
     */
    data: XOR<LocalProductCreateInput, LocalProductUncheckedCreateInput>
  }

  /**
   * LocalProduct createMany
   */
  export type LocalProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalProducts.
     */
    data: LocalProductCreateManyInput | LocalProductCreateManyInput[]
  }

  /**
   * LocalProduct createManyAndReturn
   */
  export type LocalProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data used to create many LocalProducts.
     */
    data: LocalProductCreateManyInput | LocalProductCreateManyInput[]
  }

  /**
   * LocalProduct update
   */
  export type LocalProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalProduct.
     */
    data: XOR<LocalProductUpdateInput, LocalProductUncheckedUpdateInput>
    /**
     * Choose, which LocalProduct to update.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct updateMany
   */
  export type LocalProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalProducts.
     */
    data: XOR<LocalProductUpdateManyMutationInput, LocalProductUncheckedUpdateManyInput>
    /**
     * Filter which LocalProducts to update
     */
    where?: LocalProductWhereInput
    /**
     * Limit how many LocalProducts to update.
     */
    limit?: number
  }

  /**
   * LocalProduct updateManyAndReturn
   */
  export type LocalProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data used to update LocalProducts.
     */
    data: XOR<LocalProductUpdateManyMutationInput, LocalProductUncheckedUpdateManyInput>
    /**
     * Filter which LocalProducts to update
     */
    where?: LocalProductWhereInput
    /**
     * Limit how many LocalProducts to update.
     */
    limit?: number
  }

  /**
   * LocalProduct upsert
   */
  export type LocalProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalProduct to update in case it exists.
     */
    where: LocalProductWhereUniqueInput
    /**
     * In case the LocalProduct found by the `where` argument doesn't exist, create a new LocalProduct with this data.
     */
    create: XOR<LocalProductCreateInput, LocalProductUncheckedCreateInput>
    /**
     * In case the LocalProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalProductUpdateInput, LocalProductUncheckedUpdateInput>
  }

  /**
   * LocalProduct delete
   */
  export type LocalProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter which LocalProduct to delete.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct deleteMany
   */
  export type LocalProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalProducts to delete
     */
    where?: LocalProductWhereInput
    /**
     * Limit how many LocalProducts to delete.
     */
    limit?: number
  }

  /**
   * LocalProduct without action
   */
  export type LocalProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
  }


  /**
   * Model LocalCategory
   */

  export type AggregateLocalCategory = {
    _count: LocalCategoryCountAggregateOutputType | null
    _avg: LocalCategoryAvgAggregateOutputType | null
    _sum: LocalCategorySumAggregateOutputType | null
    _min: LocalCategoryMinAggregateOutputType | null
    _max: LocalCategoryMaxAggregateOutputType | null
  }

  export type LocalCategoryAvgAggregateOutputType = {
    id: number | null
    cloudId: number | null
    displayOrder: number | null
    taxRate: number | null
  }

  export type LocalCategorySumAggregateOutputType = {
    id: number | null
    cloudId: number | null
    displayOrder: number | null
    taxRate: number | null
  }

  export type LocalCategoryMinAggregateOutputType = {
    id: number | null
    cloudId: number | null
    name: string | null
    description: string | null
    isActive: boolean | null
    displayOrder: number | null
    color: string | null
    imageUrl: string | null
    taxRate: number | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalCategoryMaxAggregateOutputType = {
    id: number | null
    cloudId: number | null
    name: string | null
    description: string | null
    isActive: boolean | null
    displayOrder: number | null
    color: string | null
    imageUrl: string | null
    taxRate: number | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalCategoryCountAggregateOutputType = {
    id: number
    cloudId: number
    name: number
    description: number
    isActive: number
    displayOrder: number
    color: number
    imageUrl: number
    taxRate: number
    lastSyncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalCategoryAvgAggregateInputType = {
    id?: true
    cloudId?: true
    displayOrder?: true
    taxRate?: true
  }

  export type LocalCategorySumAggregateInputType = {
    id?: true
    cloudId?: true
    displayOrder?: true
    taxRate?: true
  }

  export type LocalCategoryMinAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    description?: true
    isActive?: true
    displayOrder?: true
    color?: true
    imageUrl?: true
    taxRate?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalCategoryMaxAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    description?: true
    isActive?: true
    displayOrder?: true
    color?: true
    imageUrl?: true
    taxRate?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalCategoryCountAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    description?: true
    isActive?: true
    displayOrder?: true
    color?: true
    imageUrl?: true
    taxRate?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalCategory to aggregate.
     */
    where?: LocalCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCategories to fetch.
     */
    orderBy?: LocalCategoryOrderByWithRelationInput | LocalCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalCategories
    **/
    _count?: true | LocalCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalCategoryMaxAggregateInputType
  }

  export type GetLocalCategoryAggregateType<T extends LocalCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalCategory[P]>
      : GetScalarType<T[P], AggregateLocalCategory[P]>
  }




  export type LocalCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalCategoryWhereInput
    orderBy?: LocalCategoryOrderByWithAggregationInput | LocalCategoryOrderByWithAggregationInput[]
    by: LocalCategoryScalarFieldEnum[] | LocalCategoryScalarFieldEnum
    having?: LocalCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalCategoryCountAggregateInputType | true
    _avg?: LocalCategoryAvgAggregateInputType
    _sum?: LocalCategorySumAggregateInputType
    _min?: LocalCategoryMinAggregateInputType
    _max?: LocalCategoryMaxAggregateInputType
  }

  export type LocalCategoryGroupByOutputType = {
    id: number
    cloudId: number
    name: string
    description: string | null
    isActive: boolean
    displayOrder: number
    color: string | null
    imageUrl: string | null
    taxRate: number | null
    lastSyncedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: LocalCategoryCountAggregateOutputType | null
    _avg: LocalCategoryAvgAggregateOutputType | null
    _sum: LocalCategorySumAggregateOutputType | null
    _min: LocalCategoryMinAggregateOutputType | null
    _max: LocalCategoryMaxAggregateOutputType | null
  }

  type GetLocalCategoryGroupByPayload<T extends LocalCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], LocalCategoryGroupByOutputType[P]>
        }
      >
    >


  export type LocalCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    taxRate?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCategory"]>

  export type LocalCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    taxRate?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCategory"]>

  export type LocalCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    taxRate?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCategory"]>

  export type LocalCategorySelectScalar = {
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    taxRate?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cloudId" | "name" | "description" | "isActive" | "displayOrder" | "color" | "imageUrl" | "taxRate" | "lastSyncedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["localCategory"]>

  export type $LocalCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalCategory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cloudId: number
      name: string
      description: string | null
      isActive: boolean
      displayOrder: number
      color: string | null
      imageUrl: string | null
      taxRate: number | null
      lastSyncedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localCategory"]>
    composites: {}
  }

  type LocalCategoryGetPayload<S extends boolean | null | undefined | LocalCategoryDefaultArgs> = $Result.GetResult<Prisma.$LocalCategoryPayload, S>

  type LocalCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalCategoryCountAggregateInputType | true
    }

  export interface LocalCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalCategory'], meta: { name: 'LocalCategory' } }
    /**
     * Find zero or one LocalCategory that matches the filter.
     * @param {LocalCategoryFindUniqueArgs} args - Arguments to find a LocalCategory
     * @example
     * // Get one LocalCategory
     * const localCategory = await prisma.localCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalCategoryFindUniqueArgs>(args: SelectSubset<T, LocalCategoryFindUniqueArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalCategoryFindUniqueOrThrowArgs} args - Arguments to find a LocalCategory
     * @example
     * // Get one LocalCategory
     * const localCategory = await prisma.localCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryFindFirstArgs} args - Arguments to find a LocalCategory
     * @example
     * // Get one LocalCategory
     * const localCategory = await prisma.localCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalCategoryFindFirstArgs>(args?: SelectSubset<T, LocalCategoryFindFirstArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryFindFirstOrThrowArgs} args - Arguments to find a LocalCategory
     * @example
     * // Get one LocalCategory
     * const localCategory = await prisma.localCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalCategories
     * const localCategories = await prisma.localCategory.findMany()
     * 
     * // Get first 10 LocalCategories
     * const localCategories = await prisma.localCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localCategoryWithIdOnly = await prisma.localCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalCategoryFindManyArgs>(args?: SelectSubset<T, LocalCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalCategory.
     * @param {LocalCategoryCreateArgs} args - Arguments to create a LocalCategory.
     * @example
     * // Create one LocalCategory
     * const LocalCategory = await prisma.localCategory.create({
     *   data: {
     *     // ... data to create a LocalCategory
     *   }
     * })
     * 
     */
    create<T extends LocalCategoryCreateArgs>(args: SelectSubset<T, LocalCategoryCreateArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalCategories.
     * @param {LocalCategoryCreateManyArgs} args - Arguments to create many LocalCategories.
     * @example
     * // Create many LocalCategories
     * const localCategory = await prisma.localCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalCategoryCreateManyArgs>(args?: SelectSubset<T, LocalCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalCategories and returns the data saved in the database.
     * @param {LocalCategoryCreateManyAndReturnArgs} args - Arguments to create many LocalCategories.
     * @example
     * // Create many LocalCategories
     * const localCategory = await prisma.localCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalCategories and only return the `id`
     * const localCategoryWithIdOnly = await prisma.localCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalCategory.
     * @param {LocalCategoryDeleteArgs} args - Arguments to delete one LocalCategory.
     * @example
     * // Delete one LocalCategory
     * const LocalCategory = await prisma.localCategory.delete({
     *   where: {
     *     // ... filter to delete one LocalCategory
     *   }
     * })
     * 
     */
    delete<T extends LocalCategoryDeleteArgs>(args: SelectSubset<T, LocalCategoryDeleteArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalCategory.
     * @param {LocalCategoryUpdateArgs} args - Arguments to update one LocalCategory.
     * @example
     * // Update one LocalCategory
     * const localCategory = await prisma.localCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalCategoryUpdateArgs>(args: SelectSubset<T, LocalCategoryUpdateArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalCategories.
     * @param {LocalCategoryDeleteManyArgs} args - Arguments to filter LocalCategories to delete.
     * @example
     * // Delete a few LocalCategories
     * const { count } = await prisma.localCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalCategoryDeleteManyArgs>(args?: SelectSubset<T, LocalCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalCategories
     * const localCategory = await prisma.localCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalCategoryUpdateManyArgs>(args: SelectSubset<T, LocalCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalCategories and returns the data updated in the database.
     * @param {LocalCategoryUpdateManyAndReturnArgs} args - Arguments to update many LocalCategories.
     * @example
     * // Update many LocalCategories
     * const localCategory = await prisma.localCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalCategories and only return the `id`
     * const localCategoryWithIdOnly = await prisma.localCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalCategory.
     * @param {LocalCategoryUpsertArgs} args - Arguments to update or create a LocalCategory.
     * @example
     * // Update or create a LocalCategory
     * const localCategory = await prisma.localCategory.upsert({
     *   create: {
     *     // ... data to create a LocalCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalCategory we want to update
     *   }
     * })
     */
    upsert<T extends LocalCategoryUpsertArgs>(args: SelectSubset<T, LocalCategoryUpsertArgs<ExtArgs>>): Prisma__LocalCategoryClient<$Result.GetResult<Prisma.$LocalCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryCountArgs} args - Arguments to filter LocalCategories to count.
     * @example
     * // Count the number of LocalCategories
     * const count = await prisma.localCategory.count({
     *   where: {
     *     // ... the filter for the LocalCategories we want to count
     *   }
     * })
    **/
    count<T extends LocalCategoryCountArgs>(
      args?: Subset<T, LocalCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalCategoryAggregateArgs>(args: Subset<T, LocalCategoryAggregateArgs>): Prisma.PrismaPromise<GetLocalCategoryAggregateType<T>>

    /**
     * Group by LocalCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalCategoryGroupByArgs['orderBy'] }
        : { orderBy?: LocalCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalCategory model
   */
  readonly fields: LocalCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalCategory model
   */
  interface LocalCategoryFieldRefs {
    readonly id: FieldRef<"LocalCategory", 'Int'>
    readonly cloudId: FieldRef<"LocalCategory", 'Int'>
    readonly name: FieldRef<"LocalCategory", 'String'>
    readonly description: FieldRef<"LocalCategory", 'String'>
    readonly isActive: FieldRef<"LocalCategory", 'Boolean'>
    readonly displayOrder: FieldRef<"LocalCategory", 'Int'>
    readonly color: FieldRef<"LocalCategory", 'String'>
    readonly imageUrl: FieldRef<"LocalCategory", 'String'>
    readonly taxRate: FieldRef<"LocalCategory", 'Float'>
    readonly lastSyncedAt: FieldRef<"LocalCategory", 'DateTime'>
    readonly createdAt: FieldRef<"LocalCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalCategory findUnique
   */
  export type LocalCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalCategory to fetch.
     */
    where: LocalCategoryWhereUniqueInput
  }

  /**
   * LocalCategory findUniqueOrThrow
   */
  export type LocalCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalCategory to fetch.
     */
    where: LocalCategoryWhereUniqueInput
  }

  /**
   * LocalCategory findFirst
   */
  export type LocalCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalCategory to fetch.
     */
    where?: LocalCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCategories to fetch.
     */
    orderBy?: LocalCategoryOrderByWithRelationInput | LocalCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalCategories.
     */
    cursor?: LocalCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCategories.
     */
    distinct?: LocalCategoryScalarFieldEnum | LocalCategoryScalarFieldEnum[]
  }

  /**
   * LocalCategory findFirstOrThrow
   */
  export type LocalCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalCategory to fetch.
     */
    where?: LocalCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCategories to fetch.
     */
    orderBy?: LocalCategoryOrderByWithRelationInput | LocalCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalCategories.
     */
    cursor?: LocalCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCategories.
     */
    distinct?: LocalCategoryScalarFieldEnum | LocalCategoryScalarFieldEnum[]
  }

  /**
   * LocalCategory findMany
   */
  export type LocalCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalCategories to fetch.
     */
    where?: LocalCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCategories to fetch.
     */
    orderBy?: LocalCategoryOrderByWithRelationInput | LocalCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalCategories.
     */
    cursor?: LocalCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCategories.
     */
    skip?: number
    distinct?: LocalCategoryScalarFieldEnum | LocalCategoryScalarFieldEnum[]
  }

  /**
   * LocalCategory create
   */
  export type LocalCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalCategory.
     */
    data: XOR<LocalCategoryCreateInput, LocalCategoryUncheckedCreateInput>
  }

  /**
   * LocalCategory createMany
   */
  export type LocalCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalCategories.
     */
    data: LocalCategoryCreateManyInput | LocalCategoryCreateManyInput[]
  }

  /**
   * LocalCategory createManyAndReturn
   */
  export type LocalCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many LocalCategories.
     */
    data: LocalCategoryCreateManyInput | LocalCategoryCreateManyInput[]
  }

  /**
   * LocalCategory update
   */
  export type LocalCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalCategory.
     */
    data: XOR<LocalCategoryUpdateInput, LocalCategoryUncheckedUpdateInput>
    /**
     * Choose, which LocalCategory to update.
     */
    where: LocalCategoryWhereUniqueInput
  }

  /**
   * LocalCategory updateMany
   */
  export type LocalCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalCategories.
     */
    data: XOR<LocalCategoryUpdateManyMutationInput, LocalCategoryUncheckedUpdateManyInput>
    /**
     * Filter which LocalCategories to update
     */
    where?: LocalCategoryWhereInput
    /**
     * Limit how many LocalCategories to update.
     */
    limit?: number
  }

  /**
   * LocalCategory updateManyAndReturn
   */
  export type LocalCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * The data used to update LocalCategories.
     */
    data: XOR<LocalCategoryUpdateManyMutationInput, LocalCategoryUncheckedUpdateManyInput>
    /**
     * Filter which LocalCategories to update
     */
    where?: LocalCategoryWhereInput
    /**
     * Limit how many LocalCategories to update.
     */
    limit?: number
  }

  /**
   * LocalCategory upsert
   */
  export type LocalCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalCategory to update in case it exists.
     */
    where: LocalCategoryWhereUniqueInput
    /**
     * In case the LocalCategory found by the `where` argument doesn't exist, create a new LocalCategory with this data.
     */
    create: XOR<LocalCategoryCreateInput, LocalCategoryUncheckedCreateInput>
    /**
     * In case the LocalCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalCategoryUpdateInput, LocalCategoryUncheckedUpdateInput>
  }

  /**
   * LocalCategory delete
   */
  export type LocalCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
    /**
     * Filter which LocalCategory to delete.
     */
    where: LocalCategoryWhereUniqueInput
  }

  /**
   * LocalCategory deleteMany
   */
  export type LocalCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalCategories to delete
     */
    where?: LocalCategoryWhereInput
    /**
     * Limit how many LocalCategories to delete.
     */
    limit?: number
  }

  /**
   * LocalCategory without action
   */
  export type LocalCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCategory
     */
    select?: LocalCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCategory
     */
    omit?: LocalCategoryOmit<ExtArgs> | null
  }


  /**
   * Model LocalSubCategory
   */

  export type AggregateLocalSubCategory = {
    _count: LocalSubCategoryCountAggregateOutputType | null
    _avg: LocalSubCategoryAvgAggregateOutputType | null
    _sum: LocalSubCategorySumAggregateOutputType | null
    _min: LocalSubCategoryMinAggregateOutputType | null
    _max: LocalSubCategoryMaxAggregateOutputType | null
  }

  export type LocalSubCategoryAvgAggregateOutputType = {
    id: number | null
    cloudId: number | null
    categoryId: number | null
    displayOrder: number | null
  }

  export type LocalSubCategorySumAggregateOutputType = {
    id: number | null
    cloudId: number | null
    categoryId: number | null
    displayOrder: number | null
  }

  export type LocalSubCategoryMinAggregateOutputType = {
    id: number | null
    cloudId: number | null
    name: string | null
    categoryId: number | null
    displayOrder: number | null
    color: string | null
    imageUrl: string | null
    isActive: boolean | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalSubCategoryMaxAggregateOutputType = {
    id: number | null
    cloudId: number | null
    name: string | null
    categoryId: number | null
    displayOrder: number | null
    color: string | null
    imageUrl: string | null
    isActive: boolean | null
    lastSyncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalSubCategoryCountAggregateOutputType = {
    id: number
    cloudId: number
    name: number
    categoryId: number
    displayOrder: number
    color: number
    imageUrl: number
    isActive: number
    lastSyncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalSubCategoryAvgAggregateInputType = {
    id?: true
    cloudId?: true
    categoryId?: true
    displayOrder?: true
  }

  export type LocalSubCategorySumAggregateInputType = {
    id?: true
    cloudId?: true
    categoryId?: true
    displayOrder?: true
  }

  export type LocalSubCategoryMinAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    categoryId?: true
    displayOrder?: true
    color?: true
    imageUrl?: true
    isActive?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalSubCategoryMaxAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    categoryId?: true
    displayOrder?: true
    color?: true
    imageUrl?: true
    isActive?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalSubCategoryCountAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    categoryId?: true
    displayOrder?: true
    color?: true
    imageUrl?: true
    isActive?: true
    lastSyncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalSubCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSubCategory to aggregate.
     */
    where?: LocalSubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSubCategories to fetch.
     */
    orderBy?: LocalSubCategoryOrderByWithRelationInput | LocalSubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalSubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSubCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalSubCategories
    **/
    _count?: true | LocalSubCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalSubCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalSubCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalSubCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalSubCategoryMaxAggregateInputType
  }

  export type GetLocalSubCategoryAggregateType<T extends LocalSubCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalSubCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalSubCategory[P]>
      : GetScalarType<T[P], AggregateLocalSubCategory[P]>
  }




  export type LocalSubCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalSubCategoryWhereInput
    orderBy?: LocalSubCategoryOrderByWithAggregationInput | LocalSubCategoryOrderByWithAggregationInput[]
    by: LocalSubCategoryScalarFieldEnum[] | LocalSubCategoryScalarFieldEnum
    having?: LocalSubCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalSubCategoryCountAggregateInputType | true
    _avg?: LocalSubCategoryAvgAggregateInputType
    _sum?: LocalSubCategorySumAggregateInputType
    _min?: LocalSubCategoryMinAggregateInputType
    _max?: LocalSubCategoryMaxAggregateInputType
  }

  export type LocalSubCategoryGroupByOutputType = {
    id: number
    cloudId: number
    name: string
    categoryId: number
    displayOrder: number
    color: string | null
    imageUrl: string | null
    isActive: boolean
    lastSyncedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: LocalSubCategoryCountAggregateOutputType | null
    _avg: LocalSubCategoryAvgAggregateOutputType | null
    _sum: LocalSubCategorySumAggregateOutputType | null
    _min: LocalSubCategoryMinAggregateOutputType | null
    _max: LocalSubCategoryMaxAggregateOutputType | null
  }

  type GetLocalSubCategoryGroupByPayload<T extends LocalSubCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalSubCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalSubCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalSubCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], LocalSubCategoryGroupByOutputType[P]>
        }
      >
    >


  export type LocalSubCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    categoryId?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localSubCategory"]>

  export type LocalSubCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    categoryId?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localSubCategory"]>

  export type LocalSubCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    categoryId?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localSubCategory"]>

  export type LocalSubCategorySelectScalar = {
    id?: boolean
    cloudId?: boolean
    name?: boolean
    categoryId?: boolean
    displayOrder?: boolean
    color?: boolean
    imageUrl?: boolean
    isActive?: boolean
    lastSyncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalSubCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cloudId" | "name" | "categoryId" | "displayOrder" | "color" | "imageUrl" | "isActive" | "lastSyncedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["localSubCategory"]>

  export type $LocalSubCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalSubCategory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cloudId: number
      name: string
      categoryId: number
      displayOrder: number
      color: string | null
      imageUrl: string | null
      isActive: boolean
      lastSyncedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localSubCategory"]>
    composites: {}
  }

  type LocalSubCategoryGetPayload<S extends boolean | null | undefined | LocalSubCategoryDefaultArgs> = $Result.GetResult<Prisma.$LocalSubCategoryPayload, S>

  type LocalSubCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalSubCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalSubCategoryCountAggregateInputType | true
    }

  export interface LocalSubCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalSubCategory'], meta: { name: 'LocalSubCategory' } }
    /**
     * Find zero or one LocalSubCategory that matches the filter.
     * @param {LocalSubCategoryFindUniqueArgs} args - Arguments to find a LocalSubCategory
     * @example
     * // Get one LocalSubCategory
     * const localSubCategory = await prisma.localSubCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalSubCategoryFindUniqueArgs>(args: SelectSubset<T, LocalSubCategoryFindUniqueArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalSubCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalSubCategoryFindUniqueOrThrowArgs} args - Arguments to find a LocalSubCategory
     * @example
     * // Get one LocalSubCategory
     * const localSubCategory = await prisma.localSubCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalSubCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalSubCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSubCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryFindFirstArgs} args - Arguments to find a LocalSubCategory
     * @example
     * // Get one LocalSubCategory
     * const localSubCategory = await prisma.localSubCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalSubCategoryFindFirstArgs>(args?: SelectSubset<T, LocalSubCategoryFindFirstArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSubCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryFindFirstOrThrowArgs} args - Arguments to find a LocalSubCategory
     * @example
     * // Get one LocalSubCategory
     * const localSubCategory = await prisma.localSubCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalSubCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalSubCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalSubCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalSubCategories
     * const localSubCategories = await prisma.localSubCategory.findMany()
     * 
     * // Get first 10 LocalSubCategories
     * const localSubCategories = await prisma.localSubCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localSubCategoryWithIdOnly = await prisma.localSubCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalSubCategoryFindManyArgs>(args?: SelectSubset<T, LocalSubCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalSubCategory.
     * @param {LocalSubCategoryCreateArgs} args - Arguments to create a LocalSubCategory.
     * @example
     * // Create one LocalSubCategory
     * const LocalSubCategory = await prisma.localSubCategory.create({
     *   data: {
     *     // ... data to create a LocalSubCategory
     *   }
     * })
     * 
     */
    create<T extends LocalSubCategoryCreateArgs>(args: SelectSubset<T, LocalSubCategoryCreateArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalSubCategories.
     * @param {LocalSubCategoryCreateManyArgs} args - Arguments to create many LocalSubCategories.
     * @example
     * // Create many LocalSubCategories
     * const localSubCategory = await prisma.localSubCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalSubCategoryCreateManyArgs>(args?: SelectSubset<T, LocalSubCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalSubCategories and returns the data saved in the database.
     * @param {LocalSubCategoryCreateManyAndReturnArgs} args - Arguments to create many LocalSubCategories.
     * @example
     * // Create many LocalSubCategories
     * const localSubCategory = await prisma.localSubCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalSubCategories and only return the `id`
     * const localSubCategoryWithIdOnly = await prisma.localSubCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalSubCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalSubCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalSubCategory.
     * @param {LocalSubCategoryDeleteArgs} args - Arguments to delete one LocalSubCategory.
     * @example
     * // Delete one LocalSubCategory
     * const LocalSubCategory = await prisma.localSubCategory.delete({
     *   where: {
     *     // ... filter to delete one LocalSubCategory
     *   }
     * })
     * 
     */
    delete<T extends LocalSubCategoryDeleteArgs>(args: SelectSubset<T, LocalSubCategoryDeleteArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalSubCategory.
     * @param {LocalSubCategoryUpdateArgs} args - Arguments to update one LocalSubCategory.
     * @example
     * // Update one LocalSubCategory
     * const localSubCategory = await prisma.localSubCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalSubCategoryUpdateArgs>(args: SelectSubset<T, LocalSubCategoryUpdateArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalSubCategories.
     * @param {LocalSubCategoryDeleteManyArgs} args - Arguments to filter LocalSubCategories to delete.
     * @example
     * // Delete a few LocalSubCategories
     * const { count } = await prisma.localSubCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalSubCategoryDeleteManyArgs>(args?: SelectSubset<T, LocalSubCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSubCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalSubCategories
     * const localSubCategory = await prisma.localSubCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalSubCategoryUpdateManyArgs>(args: SelectSubset<T, LocalSubCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSubCategories and returns the data updated in the database.
     * @param {LocalSubCategoryUpdateManyAndReturnArgs} args - Arguments to update many LocalSubCategories.
     * @example
     * // Update many LocalSubCategories
     * const localSubCategory = await prisma.localSubCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalSubCategories and only return the `id`
     * const localSubCategoryWithIdOnly = await prisma.localSubCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalSubCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalSubCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalSubCategory.
     * @param {LocalSubCategoryUpsertArgs} args - Arguments to update or create a LocalSubCategory.
     * @example
     * // Update or create a LocalSubCategory
     * const localSubCategory = await prisma.localSubCategory.upsert({
     *   create: {
     *     // ... data to create a LocalSubCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalSubCategory we want to update
     *   }
     * })
     */
    upsert<T extends LocalSubCategoryUpsertArgs>(args: SelectSubset<T, LocalSubCategoryUpsertArgs<ExtArgs>>): Prisma__LocalSubCategoryClient<$Result.GetResult<Prisma.$LocalSubCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalSubCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryCountArgs} args - Arguments to filter LocalSubCategories to count.
     * @example
     * // Count the number of LocalSubCategories
     * const count = await prisma.localSubCategory.count({
     *   where: {
     *     // ... the filter for the LocalSubCategories we want to count
     *   }
     * })
    **/
    count<T extends LocalSubCategoryCountArgs>(
      args?: Subset<T, LocalSubCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalSubCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalSubCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalSubCategoryAggregateArgs>(args: Subset<T, LocalSubCategoryAggregateArgs>): Prisma.PrismaPromise<GetLocalSubCategoryAggregateType<T>>

    /**
     * Group by LocalSubCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSubCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalSubCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalSubCategoryGroupByArgs['orderBy'] }
        : { orderBy?: LocalSubCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalSubCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalSubCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalSubCategory model
   */
  readonly fields: LocalSubCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalSubCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalSubCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalSubCategory model
   */
  interface LocalSubCategoryFieldRefs {
    readonly id: FieldRef<"LocalSubCategory", 'Int'>
    readonly cloudId: FieldRef<"LocalSubCategory", 'Int'>
    readonly name: FieldRef<"LocalSubCategory", 'String'>
    readonly categoryId: FieldRef<"LocalSubCategory", 'Int'>
    readonly displayOrder: FieldRef<"LocalSubCategory", 'Int'>
    readonly color: FieldRef<"LocalSubCategory", 'String'>
    readonly imageUrl: FieldRef<"LocalSubCategory", 'String'>
    readonly isActive: FieldRef<"LocalSubCategory", 'Boolean'>
    readonly lastSyncedAt: FieldRef<"LocalSubCategory", 'DateTime'>
    readonly createdAt: FieldRef<"LocalSubCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalSubCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalSubCategory findUnique
   */
  export type LocalSubCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalSubCategory to fetch.
     */
    where: LocalSubCategoryWhereUniqueInput
  }

  /**
   * LocalSubCategory findUniqueOrThrow
   */
  export type LocalSubCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalSubCategory to fetch.
     */
    where: LocalSubCategoryWhereUniqueInput
  }

  /**
   * LocalSubCategory findFirst
   */
  export type LocalSubCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalSubCategory to fetch.
     */
    where?: LocalSubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSubCategories to fetch.
     */
    orderBy?: LocalSubCategoryOrderByWithRelationInput | LocalSubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSubCategories.
     */
    cursor?: LocalSubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSubCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSubCategories.
     */
    distinct?: LocalSubCategoryScalarFieldEnum | LocalSubCategoryScalarFieldEnum[]
  }

  /**
   * LocalSubCategory findFirstOrThrow
   */
  export type LocalSubCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalSubCategory to fetch.
     */
    where?: LocalSubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSubCategories to fetch.
     */
    orderBy?: LocalSubCategoryOrderByWithRelationInput | LocalSubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSubCategories.
     */
    cursor?: LocalSubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSubCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSubCategories.
     */
    distinct?: LocalSubCategoryScalarFieldEnum | LocalSubCategoryScalarFieldEnum[]
  }

  /**
   * LocalSubCategory findMany
   */
  export type LocalSubCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * Filter, which LocalSubCategories to fetch.
     */
    where?: LocalSubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSubCategories to fetch.
     */
    orderBy?: LocalSubCategoryOrderByWithRelationInput | LocalSubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalSubCategories.
     */
    cursor?: LocalSubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSubCategories.
     */
    skip?: number
    distinct?: LocalSubCategoryScalarFieldEnum | LocalSubCategoryScalarFieldEnum[]
  }

  /**
   * LocalSubCategory create
   */
  export type LocalSubCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalSubCategory.
     */
    data: XOR<LocalSubCategoryCreateInput, LocalSubCategoryUncheckedCreateInput>
  }

  /**
   * LocalSubCategory createMany
   */
  export type LocalSubCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalSubCategories.
     */
    data: LocalSubCategoryCreateManyInput | LocalSubCategoryCreateManyInput[]
  }

  /**
   * LocalSubCategory createManyAndReturn
   */
  export type LocalSubCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many LocalSubCategories.
     */
    data: LocalSubCategoryCreateManyInput | LocalSubCategoryCreateManyInput[]
  }

  /**
   * LocalSubCategory update
   */
  export type LocalSubCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalSubCategory.
     */
    data: XOR<LocalSubCategoryUpdateInput, LocalSubCategoryUncheckedUpdateInput>
    /**
     * Choose, which LocalSubCategory to update.
     */
    where: LocalSubCategoryWhereUniqueInput
  }

  /**
   * LocalSubCategory updateMany
   */
  export type LocalSubCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalSubCategories.
     */
    data: XOR<LocalSubCategoryUpdateManyMutationInput, LocalSubCategoryUncheckedUpdateManyInput>
    /**
     * Filter which LocalSubCategories to update
     */
    where?: LocalSubCategoryWhereInput
    /**
     * Limit how many LocalSubCategories to update.
     */
    limit?: number
  }

  /**
   * LocalSubCategory updateManyAndReturn
   */
  export type LocalSubCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * The data used to update LocalSubCategories.
     */
    data: XOR<LocalSubCategoryUpdateManyMutationInput, LocalSubCategoryUncheckedUpdateManyInput>
    /**
     * Filter which LocalSubCategories to update
     */
    where?: LocalSubCategoryWhereInput
    /**
     * Limit how many LocalSubCategories to update.
     */
    limit?: number
  }

  /**
   * LocalSubCategory upsert
   */
  export type LocalSubCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalSubCategory to update in case it exists.
     */
    where: LocalSubCategoryWhereUniqueInput
    /**
     * In case the LocalSubCategory found by the `where` argument doesn't exist, create a new LocalSubCategory with this data.
     */
    create: XOR<LocalSubCategoryCreateInput, LocalSubCategoryUncheckedCreateInput>
    /**
     * In case the LocalSubCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalSubCategoryUpdateInput, LocalSubCategoryUncheckedUpdateInput>
  }

  /**
   * LocalSubCategory delete
   */
  export type LocalSubCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
    /**
     * Filter which LocalSubCategory to delete.
     */
    where: LocalSubCategoryWhereUniqueInput
  }

  /**
   * LocalSubCategory deleteMany
   */
  export type LocalSubCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSubCategories to delete
     */
    where?: LocalSubCategoryWhereInput
    /**
     * Limit how many LocalSubCategories to delete.
     */
    limit?: number
  }

  /**
   * LocalSubCategory without action
   */
  export type LocalSubCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSubCategory
     */
    select?: LocalSubCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSubCategory
     */
    omit?: LocalSubCategoryOmit<ExtArgs> | null
  }


  /**
   * Model LocalGRN
   */

  export type AggregateLocalGRN = {
    _count: LocalGRNCountAggregateOutputType | null
    _avg: LocalGRNAvgAggregateOutputType | null
    _sum: LocalGRNSumAggregateOutputType | null
    _min: LocalGRNMinAggregateOutputType | null
    _max: LocalGRNMaxAggregateOutputType | null
  }

  export type LocalGRNAvgAggregateOutputType = {
    id: number | null
    creditPeriod: number | null
    productId: number | null
    quantity: number | null
    freeQuantity: number | null
    unitCost: number | null
    discount: number | null
    landedCost: number | null
    freightCost: number | null
    handlingCost: number | null
    taxCost: number | null
    trueUnitCost: number | null
    totalAmount: number | null
    balanceAmount: number | null
    rejectedQty: number | null
    paidAmount: number | null
    supplierId: number | null
    categoryId: number | null
    subCategoryId: number | null
    cloudGRNId: number | null
  }

  export type LocalGRNSumAggregateOutputType = {
    id: number | null
    creditPeriod: number | null
    productId: number | null
    quantity: number | null
    freeQuantity: number | null
    unitCost: number | null
    discount: number | null
    landedCost: number | null
    freightCost: number | null
    handlingCost: number | null
    taxCost: number | null
    trueUnitCost: number | null
    totalAmount: number | null
    balanceAmount: number | null
    rejectedQty: number | null
    paidAmount: number | null
    supplierId: number | null
    categoryId: number | null
    subCategoryId: number | null
    cloudGRNId: number | null
  }

  export type LocalGRNMinAggregateOutputType = {
    id: number | null
    invoiceNumber: string | null
    poNumber: string | null
    paymentType: string | null
    creditPeriod: number | null
    dueDate: Date | null
    receivedDate: Date | null
    productId: number | null
    quantity: number | null
    freeQuantity: number | null
    uom: string | null
    unitCost: number | null
    discount: number | null
    discountType: string | null
    landedCost: number | null
    freightCost: number | null
    handlingCost: number | null
    taxCost: number | null
    trueUnitCost: number | null
    totalAmount: number | null
    balanceAmount: number | null
    expiryDate: Date | null
    batchNumber: string | null
    qcStatus: string | null
    rejectedQty: number | null
    rejectionReason: string | null
    paymentStatus: string | null
    paidAmount: number | null
    supplierId: number | null
    categoryId: number | null
    subCategoryId: number | null
    isSynced: boolean | null
    cloudGRNId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalGRNMaxAggregateOutputType = {
    id: number | null
    invoiceNumber: string | null
    poNumber: string | null
    paymentType: string | null
    creditPeriod: number | null
    dueDate: Date | null
    receivedDate: Date | null
    productId: number | null
    quantity: number | null
    freeQuantity: number | null
    uom: string | null
    unitCost: number | null
    discount: number | null
    discountType: string | null
    landedCost: number | null
    freightCost: number | null
    handlingCost: number | null
    taxCost: number | null
    trueUnitCost: number | null
    totalAmount: number | null
    balanceAmount: number | null
    expiryDate: Date | null
    batchNumber: string | null
    qcStatus: string | null
    rejectedQty: number | null
    rejectionReason: string | null
    paymentStatus: string | null
    paidAmount: number | null
    supplierId: number | null
    categoryId: number | null
    subCategoryId: number | null
    isSynced: boolean | null
    cloudGRNId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalGRNCountAggregateOutputType = {
    id: number
    invoiceNumber: number
    poNumber: number
    paymentType: number
    creditPeriod: number
    dueDate: number
    receivedDate: number
    productId: number
    quantity: number
    freeQuantity: number
    uom: number
    unitCost: number
    discount: number
    discountType: number
    landedCost: number
    freightCost: number
    handlingCost: number
    taxCost: number
    trueUnitCost: number
    totalAmount: number
    balanceAmount: number
    expiryDate: number
    batchNumber: number
    qcStatus: number
    rejectedQty: number
    rejectionReason: number
    paymentStatus: number
    paidAmount: number
    supplierId: number
    categoryId: number
    subCategoryId: number
    isSynced: number
    cloudGRNId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalGRNAvgAggregateInputType = {
    id?: true
    creditPeriod?: true
    productId?: true
    quantity?: true
    freeQuantity?: true
    unitCost?: true
    discount?: true
    landedCost?: true
    freightCost?: true
    handlingCost?: true
    taxCost?: true
    trueUnitCost?: true
    totalAmount?: true
    balanceAmount?: true
    rejectedQty?: true
    paidAmount?: true
    supplierId?: true
    categoryId?: true
    subCategoryId?: true
    cloudGRNId?: true
  }

  export type LocalGRNSumAggregateInputType = {
    id?: true
    creditPeriod?: true
    productId?: true
    quantity?: true
    freeQuantity?: true
    unitCost?: true
    discount?: true
    landedCost?: true
    freightCost?: true
    handlingCost?: true
    taxCost?: true
    trueUnitCost?: true
    totalAmount?: true
    balanceAmount?: true
    rejectedQty?: true
    paidAmount?: true
    supplierId?: true
    categoryId?: true
    subCategoryId?: true
    cloudGRNId?: true
  }

  export type LocalGRNMinAggregateInputType = {
    id?: true
    invoiceNumber?: true
    poNumber?: true
    paymentType?: true
    creditPeriod?: true
    dueDate?: true
    receivedDate?: true
    productId?: true
    quantity?: true
    freeQuantity?: true
    uom?: true
    unitCost?: true
    discount?: true
    discountType?: true
    landedCost?: true
    freightCost?: true
    handlingCost?: true
    taxCost?: true
    trueUnitCost?: true
    totalAmount?: true
    balanceAmount?: true
    expiryDate?: true
    batchNumber?: true
    qcStatus?: true
    rejectedQty?: true
    rejectionReason?: true
    paymentStatus?: true
    paidAmount?: true
    supplierId?: true
    categoryId?: true
    subCategoryId?: true
    isSynced?: true
    cloudGRNId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalGRNMaxAggregateInputType = {
    id?: true
    invoiceNumber?: true
    poNumber?: true
    paymentType?: true
    creditPeriod?: true
    dueDate?: true
    receivedDate?: true
    productId?: true
    quantity?: true
    freeQuantity?: true
    uom?: true
    unitCost?: true
    discount?: true
    discountType?: true
    landedCost?: true
    freightCost?: true
    handlingCost?: true
    taxCost?: true
    trueUnitCost?: true
    totalAmount?: true
    balanceAmount?: true
    expiryDate?: true
    batchNumber?: true
    qcStatus?: true
    rejectedQty?: true
    rejectionReason?: true
    paymentStatus?: true
    paidAmount?: true
    supplierId?: true
    categoryId?: true
    subCategoryId?: true
    isSynced?: true
    cloudGRNId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalGRNCountAggregateInputType = {
    id?: true
    invoiceNumber?: true
    poNumber?: true
    paymentType?: true
    creditPeriod?: true
    dueDate?: true
    receivedDate?: true
    productId?: true
    quantity?: true
    freeQuantity?: true
    uom?: true
    unitCost?: true
    discount?: true
    discountType?: true
    landedCost?: true
    freightCost?: true
    handlingCost?: true
    taxCost?: true
    trueUnitCost?: true
    totalAmount?: true
    balanceAmount?: true
    expiryDate?: true
    batchNumber?: true
    qcStatus?: true
    rejectedQty?: true
    rejectionReason?: true
    paymentStatus?: true
    paidAmount?: true
    supplierId?: true
    categoryId?: true
    subCategoryId?: true
    isSynced?: true
    cloudGRNId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalGRNAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalGRN to aggregate.
     */
    where?: LocalGRNWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalGRNS to fetch.
     */
    orderBy?: LocalGRNOrderByWithRelationInput | LocalGRNOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalGRNWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalGRNS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalGRNS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalGRNS
    **/
    _count?: true | LocalGRNCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalGRNAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalGRNSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalGRNMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalGRNMaxAggregateInputType
  }

  export type GetLocalGRNAggregateType<T extends LocalGRNAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalGRN]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalGRN[P]>
      : GetScalarType<T[P], AggregateLocalGRN[P]>
  }




  export type LocalGRNGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalGRNWhereInput
    orderBy?: LocalGRNOrderByWithAggregationInput | LocalGRNOrderByWithAggregationInput[]
    by: LocalGRNScalarFieldEnum[] | LocalGRNScalarFieldEnum
    having?: LocalGRNScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalGRNCountAggregateInputType | true
    _avg?: LocalGRNAvgAggregateInputType
    _sum?: LocalGRNSumAggregateInputType
    _min?: LocalGRNMinAggregateInputType
    _max?: LocalGRNMaxAggregateInputType
  }

  export type LocalGRNGroupByOutputType = {
    id: number
    invoiceNumber: string | null
    poNumber: string | null
    paymentType: string | null
    creditPeriod: number | null
    dueDate: Date | null
    receivedDate: Date
    productId: number
    quantity: number
    freeQuantity: number | null
    uom: string | null
    unitCost: number
    discount: number | null
    discountType: string | null
    landedCost: number | null
    freightCost: number | null
    handlingCost: number | null
    taxCost: number | null
    trueUnitCost: number | null
    totalAmount: number | null
    balanceAmount: number | null
    expiryDate: Date | null
    batchNumber: string | null
    qcStatus: string | null
    rejectedQty: number | null
    rejectionReason: string | null
    paymentStatus: string
    paidAmount: number | null
    supplierId: number
    categoryId: number | null
    subCategoryId: number | null
    isSynced: boolean
    cloudGRNId: number | null
    createdAt: Date
    updatedAt: Date
    _count: LocalGRNCountAggregateOutputType | null
    _avg: LocalGRNAvgAggregateOutputType | null
    _sum: LocalGRNSumAggregateOutputType | null
    _min: LocalGRNMinAggregateOutputType | null
    _max: LocalGRNMaxAggregateOutputType | null
  }

  type GetLocalGRNGroupByPayload<T extends LocalGRNGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalGRNGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalGRNGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalGRNGroupByOutputType[P]>
            : GetScalarType<T[P], LocalGRNGroupByOutputType[P]>
        }
      >
    >


  export type LocalGRNSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    poNumber?: boolean
    paymentType?: boolean
    creditPeriod?: boolean
    dueDate?: boolean
    receivedDate?: boolean
    productId?: boolean
    quantity?: boolean
    freeQuantity?: boolean
    uom?: boolean
    unitCost?: boolean
    discount?: boolean
    discountType?: boolean
    landedCost?: boolean
    freightCost?: boolean
    handlingCost?: boolean
    taxCost?: boolean
    trueUnitCost?: boolean
    totalAmount?: boolean
    balanceAmount?: boolean
    expiryDate?: boolean
    batchNumber?: boolean
    qcStatus?: boolean
    rejectedQty?: boolean
    rejectionReason?: boolean
    paymentStatus?: boolean
    paidAmount?: boolean
    supplierId?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    isSynced?: boolean
    cloudGRNId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localGRN"]>

  export type LocalGRNSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    poNumber?: boolean
    paymentType?: boolean
    creditPeriod?: boolean
    dueDate?: boolean
    receivedDate?: boolean
    productId?: boolean
    quantity?: boolean
    freeQuantity?: boolean
    uom?: boolean
    unitCost?: boolean
    discount?: boolean
    discountType?: boolean
    landedCost?: boolean
    freightCost?: boolean
    handlingCost?: boolean
    taxCost?: boolean
    trueUnitCost?: boolean
    totalAmount?: boolean
    balanceAmount?: boolean
    expiryDate?: boolean
    batchNumber?: boolean
    qcStatus?: boolean
    rejectedQty?: boolean
    rejectionReason?: boolean
    paymentStatus?: boolean
    paidAmount?: boolean
    supplierId?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    isSynced?: boolean
    cloudGRNId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localGRN"]>

  export type LocalGRNSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    poNumber?: boolean
    paymentType?: boolean
    creditPeriod?: boolean
    dueDate?: boolean
    receivedDate?: boolean
    productId?: boolean
    quantity?: boolean
    freeQuantity?: boolean
    uom?: boolean
    unitCost?: boolean
    discount?: boolean
    discountType?: boolean
    landedCost?: boolean
    freightCost?: boolean
    handlingCost?: boolean
    taxCost?: boolean
    trueUnitCost?: boolean
    totalAmount?: boolean
    balanceAmount?: boolean
    expiryDate?: boolean
    batchNumber?: boolean
    qcStatus?: boolean
    rejectedQty?: boolean
    rejectionReason?: boolean
    paymentStatus?: boolean
    paidAmount?: boolean
    supplierId?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    isSynced?: boolean
    cloudGRNId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localGRN"]>

  export type LocalGRNSelectScalar = {
    id?: boolean
    invoiceNumber?: boolean
    poNumber?: boolean
    paymentType?: boolean
    creditPeriod?: boolean
    dueDate?: boolean
    receivedDate?: boolean
    productId?: boolean
    quantity?: boolean
    freeQuantity?: boolean
    uom?: boolean
    unitCost?: boolean
    discount?: boolean
    discountType?: boolean
    landedCost?: boolean
    freightCost?: boolean
    handlingCost?: boolean
    taxCost?: boolean
    trueUnitCost?: boolean
    totalAmount?: boolean
    balanceAmount?: boolean
    expiryDate?: boolean
    batchNumber?: boolean
    qcStatus?: boolean
    rejectedQty?: boolean
    rejectionReason?: boolean
    paymentStatus?: boolean
    paidAmount?: boolean
    supplierId?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    isSynced?: boolean
    cloudGRNId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalGRNOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceNumber" | "poNumber" | "paymentType" | "creditPeriod" | "dueDate" | "receivedDate" | "productId" | "quantity" | "freeQuantity" | "uom" | "unitCost" | "discount" | "discountType" | "landedCost" | "freightCost" | "handlingCost" | "taxCost" | "trueUnitCost" | "totalAmount" | "balanceAmount" | "expiryDate" | "batchNumber" | "qcStatus" | "rejectedQty" | "rejectionReason" | "paymentStatus" | "paidAmount" | "supplierId" | "categoryId" | "subCategoryId" | "isSynced" | "cloudGRNId" | "createdAt" | "updatedAt", ExtArgs["result"]["localGRN"]>

  export type $LocalGRNPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalGRN"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      invoiceNumber: string | null
      poNumber: string | null
      paymentType: string | null
      creditPeriod: number | null
      dueDate: Date | null
      receivedDate: Date
      productId: number
      quantity: number
      freeQuantity: number | null
      uom: string | null
      unitCost: number
      discount: number | null
      discountType: string | null
      landedCost: number | null
      freightCost: number | null
      handlingCost: number | null
      taxCost: number | null
      trueUnitCost: number | null
      totalAmount: number | null
      balanceAmount: number | null
      expiryDate: Date | null
      batchNumber: string | null
      qcStatus: string | null
      rejectedQty: number | null
      rejectionReason: string | null
      paymentStatus: string
      paidAmount: number | null
      supplierId: number
      categoryId: number | null
      subCategoryId: number | null
      isSynced: boolean
      cloudGRNId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localGRN"]>
    composites: {}
  }

  type LocalGRNGetPayload<S extends boolean | null | undefined | LocalGRNDefaultArgs> = $Result.GetResult<Prisma.$LocalGRNPayload, S>

  type LocalGRNCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalGRNFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalGRNCountAggregateInputType | true
    }

  export interface LocalGRNDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalGRN'], meta: { name: 'LocalGRN' } }
    /**
     * Find zero or one LocalGRN that matches the filter.
     * @param {LocalGRNFindUniqueArgs} args - Arguments to find a LocalGRN
     * @example
     * // Get one LocalGRN
     * const localGRN = await prisma.localGRN.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalGRNFindUniqueArgs>(args: SelectSubset<T, LocalGRNFindUniqueArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalGRN that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalGRNFindUniqueOrThrowArgs} args - Arguments to find a LocalGRN
     * @example
     * // Get one LocalGRN
     * const localGRN = await prisma.localGRN.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalGRNFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalGRNFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalGRN that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNFindFirstArgs} args - Arguments to find a LocalGRN
     * @example
     * // Get one LocalGRN
     * const localGRN = await prisma.localGRN.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalGRNFindFirstArgs>(args?: SelectSubset<T, LocalGRNFindFirstArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalGRN that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNFindFirstOrThrowArgs} args - Arguments to find a LocalGRN
     * @example
     * // Get one LocalGRN
     * const localGRN = await prisma.localGRN.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalGRNFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalGRNFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalGRNS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalGRNS
     * const localGRNS = await prisma.localGRN.findMany()
     * 
     * // Get first 10 LocalGRNS
     * const localGRNS = await prisma.localGRN.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localGRNWithIdOnly = await prisma.localGRN.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalGRNFindManyArgs>(args?: SelectSubset<T, LocalGRNFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalGRN.
     * @param {LocalGRNCreateArgs} args - Arguments to create a LocalGRN.
     * @example
     * // Create one LocalGRN
     * const LocalGRN = await prisma.localGRN.create({
     *   data: {
     *     // ... data to create a LocalGRN
     *   }
     * })
     * 
     */
    create<T extends LocalGRNCreateArgs>(args: SelectSubset<T, LocalGRNCreateArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalGRNS.
     * @param {LocalGRNCreateManyArgs} args - Arguments to create many LocalGRNS.
     * @example
     * // Create many LocalGRNS
     * const localGRN = await prisma.localGRN.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalGRNCreateManyArgs>(args?: SelectSubset<T, LocalGRNCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalGRNS and returns the data saved in the database.
     * @param {LocalGRNCreateManyAndReturnArgs} args - Arguments to create many LocalGRNS.
     * @example
     * // Create many LocalGRNS
     * const localGRN = await prisma.localGRN.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalGRNS and only return the `id`
     * const localGRNWithIdOnly = await prisma.localGRN.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalGRNCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalGRNCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalGRN.
     * @param {LocalGRNDeleteArgs} args - Arguments to delete one LocalGRN.
     * @example
     * // Delete one LocalGRN
     * const LocalGRN = await prisma.localGRN.delete({
     *   where: {
     *     // ... filter to delete one LocalGRN
     *   }
     * })
     * 
     */
    delete<T extends LocalGRNDeleteArgs>(args: SelectSubset<T, LocalGRNDeleteArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalGRN.
     * @param {LocalGRNUpdateArgs} args - Arguments to update one LocalGRN.
     * @example
     * // Update one LocalGRN
     * const localGRN = await prisma.localGRN.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalGRNUpdateArgs>(args: SelectSubset<T, LocalGRNUpdateArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalGRNS.
     * @param {LocalGRNDeleteManyArgs} args - Arguments to filter LocalGRNS to delete.
     * @example
     * // Delete a few LocalGRNS
     * const { count } = await prisma.localGRN.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalGRNDeleteManyArgs>(args?: SelectSubset<T, LocalGRNDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalGRNS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalGRNS
     * const localGRN = await prisma.localGRN.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalGRNUpdateManyArgs>(args: SelectSubset<T, LocalGRNUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalGRNS and returns the data updated in the database.
     * @param {LocalGRNUpdateManyAndReturnArgs} args - Arguments to update many LocalGRNS.
     * @example
     * // Update many LocalGRNS
     * const localGRN = await prisma.localGRN.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalGRNS and only return the `id`
     * const localGRNWithIdOnly = await prisma.localGRN.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalGRNUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalGRNUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalGRN.
     * @param {LocalGRNUpsertArgs} args - Arguments to update or create a LocalGRN.
     * @example
     * // Update or create a LocalGRN
     * const localGRN = await prisma.localGRN.upsert({
     *   create: {
     *     // ... data to create a LocalGRN
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalGRN we want to update
     *   }
     * })
     */
    upsert<T extends LocalGRNUpsertArgs>(args: SelectSubset<T, LocalGRNUpsertArgs<ExtArgs>>): Prisma__LocalGRNClient<$Result.GetResult<Prisma.$LocalGRNPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalGRNS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNCountArgs} args - Arguments to filter LocalGRNS to count.
     * @example
     * // Count the number of LocalGRNS
     * const count = await prisma.localGRN.count({
     *   where: {
     *     // ... the filter for the LocalGRNS we want to count
     *   }
     * })
    **/
    count<T extends LocalGRNCountArgs>(
      args?: Subset<T, LocalGRNCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalGRNCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalGRN.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalGRNAggregateArgs>(args: Subset<T, LocalGRNAggregateArgs>): Prisma.PrismaPromise<GetLocalGRNAggregateType<T>>

    /**
     * Group by LocalGRN.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalGRNGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalGRNGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalGRNGroupByArgs['orderBy'] }
        : { orderBy?: LocalGRNGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalGRNGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalGRNGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalGRN model
   */
  readonly fields: LocalGRNFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalGRN.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalGRNClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalGRN model
   */
  interface LocalGRNFieldRefs {
    readonly id: FieldRef<"LocalGRN", 'Int'>
    readonly invoiceNumber: FieldRef<"LocalGRN", 'String'>
    readonly poNumber: FieldRef<"LocalGRN", 'String'>
    readonly paymentType: FieldRef<"LocalGRN", 'String'>
    readonly creditPeriod: FieldRef<"LocalGRN", 'Int'>
    readonly dueDate: FieldRef<"LocalGRN", 'DateTime'>
    readonly receivedDate: FieldRef<"LocalGRN", 'DateTime'>
    readonly productId: FieldRef<"LocalGRN", 'Int'>
    readonly quantity: FieldRef<"LocalGRN", 'Int'>
    readonly freeQuantity: FieldRef<"LocalGRN", 'Int'>
    readonly uom: FieldRef<"LocalGRN", 'String'>
    readonly unitCost: FieldRef<"LocalGRN", 'Float'>
    readonly discount: FieldRef<"LocalGRN", 'Float'>
    readonly discountType: FieldRef<"LocalGRN", 'String'>
    readonly landedCost: FieldRef<"LocalGRN", 'Float'>
    readonly freightCost: FieldRef<"LocalGRN", 'Float'>
    readonly handlingCost: FieldRef<"LocalGRN", 'Float'>
    readonly taxCost: FieldRef<"LocalGRN", 'Float'>
    readonly trueUnitCost: FieldRef<"LocalGRN", 'Float'>
    readonly totalAmount: FieldRef<"LocalGRN", 'Float'>
    readonly balanceAmount: FieldRef<"LocalGRN", 'Float'>
    readonly expiryDate: FieldRef<"LocalGRN", 'DateTime'>
    readonly batchNumber: FieldRef<"LocalGRN", 'String'>
    readonly qcStatus: FieldRef<"LocalGRN", 'String'>
    readonly rejectedQty: FieldRef<"LocalGRN", 'Int'>
    readonly rejectionReason: FieldRef<"LocalGRN", 'String'>
    readonly paymentStatus: FieldRef<"LocalGRN", 'String'>
    readonly paidAmount: FieldRef<"LocalGRN", 'Float'>
    readonly supplierId: FieldRef<"LocalGRN", 'Int'>
    readonly categoryId: FieldRef<"LocalGRN", 'Int'>
    readonly subCategoryId: FieldRef<"LocalGRN", 'Int'>
    readonly isSynced: FieldRef<"LocalGRN", 'Boolean'>
    readonly cloudGRNId: FieldRef<"LocalGRN", 'Int'>
    readonly createdAt: FieldRef<"LocalGRN", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalGRN", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalGRN findUnique
   */
  export type LocalGRNFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * Filter, which LocalGRN to fetch.
     */
    where: LocalGRNWhereUniqueInput
  }

  /**
   * LocalGRN findUniqueOrThrow
   */
  export type LocalGRNFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * Filter, which LocalGRN to fetch.
     */
    where: LocalGRNWhereUniqueInput
  }

  /**
   * LocalGRN findFirst
   */
  export type LocalGRNFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * Filter, which LocalGRN to fetch.
     */
    where?: LocalGRNWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalGRNS to fetch.
     */
    orderBy?: LocalGRNOrderByWithRelationInput | LocalGRNOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalGRNS.
     */
    cursor?: LocalGRNWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalGRNS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalGRNS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalGRNS.
     */
    distinct?: LocalGRNScalarFieldEnum | LocalGRNScalarFieldEnum[]
  }

  /**
   * LocalGRN findFirstOrThrow
   */
  export type LocalGRNFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * Filter, which LocalGRN to fetch.
     */
    where?: LocalGRNWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalGRNS to fetch.
     */
    orderBy?: LocalGRNOrderByWithRelationInput | LocalGRNOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalGRNS.
     */
    cursor?: LocalGRNWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalGRNS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalGRNS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalGRNS.
     */
    distinct?: LocalGRNScalarFieldEnum | LocalGRNScalarFieldEnum[]
  }

  /**
   * LocalGRN findMany
   */
  export type LocalGRNFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * Filter, which LocalGRNS to fetch.
     */
    where?: LocalGRNWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalGRNS to fetch.
     */
    orderBy?: LocalGRNOrderByWithRelationInput | LocalGRNOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalGRNS.
     */
    cursor?: LocalGRNWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalGRNS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalGRNS.
     */
    skip?: number
    distinct?: LocalGRNScalarFieldEnum | LocalGRNScalarFieldEnum[]
  }

  /**
   * LocalGRN create
   */
  export type LocalGRNCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalGRN.
     */
    data: XOR<LocalGRNCreateInput, LocalGRNUncheckedCreateInput>
  }

  /**
   * LocalGRN createMany
   */
  export type LocalGRNCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalGRNS.
     */
    data: LocalGRNCreateManyInput | LocalGRNCreateManyInput[]
  }

  /**
   * LocalGRN createManyAndReturn
   */
  export type LocalGRNCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * The data used to create many LocalGRNS.
     */
    data: LocalGRNCreateManyInput | LocalGRNCreateManyInput[]
  }

  /**
   * LocalGRN update
   */
  export type LocalGRNUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalGRN.
     */
    data: XOR<LocalGRNUpdateInput, LocalGRNUncheckedUpdateInput>
    /**
     * Choose, which LocalGRN to update.
     */
    where: LocalGRNWhereUniqueInput
  }

  /**
   * LocalGRN updateMany
   */
  export type LocalGRNUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalGRNS.
     */
    data: XOR<LocalGRNUpdateManyMutationInput, LocalGRNUncheckedUpdateManyInput>
    /**
     * Filter which LocalGRNS to update
     */
    where?: LocalGRNWhereInput
    /**
     * Limit how many LocalGRNS to update.
     */
    limit?: number
  }

  /**
   * LocalGRN updateManyAndReturn
   */
  export type LocalGRNUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * The data used to update LocalGRNS.
     */
    data: XOR<LocalGRNUpdateManyMutationInput, LocalGRNUncheckedUpdateManyInput>
    /**
     * Filter which LocalGRNS to update
     */
    where?: LocalGRNWhereInput
    /**
     * Limit how many LocalGRNS to update.
     */
    limit?: number
  }

  /**
   * LocalGRN upsert
   */
  export type LocalGRNUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalGRN to update in case it exists.
     */
    where: LocalGRNWhereUniqueInput
    /**
     * In case the LocalGRN found by the `where` argument doesn't exist, create a new LocalGRN with this data.
     */
    create: XOR<LocalGRNCreateInput, LocalGRNUncheckedCreateInput>
    /**
     * In case the LocalGRN was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalGRNUpdateInput, LocalGRNUncheckedUpdateInput>
  }

  /**
   * LocalGRN delete
   */
  export type LocalGRNDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
    /**
     * Filter which LocalGRN to delete.
     */
    where: LocalGRNWhereUniqueInput
  }

  /**
   * LocalGRN deleteMany
   */
  export type LocalGRNDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalGRNS to delete
     */
    where?: LocalGRNWhereInput
    /**
     * Limit how many LocalGRNS to delete.
     */
    limit?: number
  }

  /**
   * LocalGRN without action
   */
  export type LocalGRNDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalGRN
     */
    select?: LocalGRNSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalGRN
     */
    omit?: LocalGRNOmit<ExtArgs> | null
  }


  /**
   * Model SyncMetadata
   */

  export type AggregateSyncMetadata = {
    _count: SyncMetadataCountAggregateOutputType | null
    _avg: SyncMetadataAvgAggregateOutputType | null
    _sum: SyncMetadataSumAggregateOutputType | null
    _min: SyncMetadataMinAggregateOutputType | null
    _max: SyncMetadataMaxAggregateOutputType | null
  }

  export type SyncMetadataAvgAggregateOutputType = {
    pendingCount: number | null
    failedCount: number | null
  }

  export type SyncMetadataSumAggregateOutputType = {
    pendingCount: number | null
    failedCount: number | null
  }

  export type SyncMetadataMinAggregateOutputType = {
    id: string | null
    lastSyncAt: Date | null
    lastSuccessfulSync: Date | null
    syncStatus: string | null
    pendingCount: number | null
    failedCount: number | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncMetadataMaxAggregateOutputType = {
    id: string | null
    lastSyncAt: Date | null
    lastSuccessfulSync: Date | null
    syncStatus: string | null
    pendingCount: number | null
    failedCount: number | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncMetadataCountAggregateOutputType = {
    id: number
    lastSyncAt: number
    lastSuccessfulSync: number
    syncStatus: number
    pendingCount: number
    failedCount: number
    lastError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SyncMetadataAvgAggregateInputType = {
    pendingCount?: true
    failedCount?: true
  }

  export type SyncMetadataSumAggregateInputType = {
    pendingCount?: true
    failedCount?: true
  }

  export type SyncMetadataMinAggregateInputType = {
    id?: true
    lastSyncAt?: true
    lastSuccessfulSync?: true
    syncStatus?: true
    pendingCount?: true
    failedCount?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncMetadataMaxAggregateInputType = {
    id?: true
    lastSyncAt?: true
    lastSuccessfulSync?: true
    syncStatus?: true
    pendingCount?: true
    failedCount?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncMetadataCountAggregateInputType = {
    id?: true
    lastSyncAt?: true
    lastSuccessfulSync?: true
    syncStatus?: true
    pendingCount?: true
    failedCount?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncMetadata to aggregate.
     */
    where?: SyncMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncMetadata to fetch.
     */
    orderBy?: SyncMetadataOrderByWithRelationInput | SyncMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncMetadata
    **/
    _count?: true | SyncMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncMetadataMaxAggregateInputType
  }

  export type GetSyncMetadataAggregateType<T extends SyncMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncMetadata[P]>
      : GetScalarType<T[P], AggregateSyncMetadata[P]>
  }




  export type SyncMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncMetadataWhereInput
    orderBy?: SyncMetadataOrderByWithAggregationInput | SyncMetadataOrderByWithAggregationInput[]
    by: SyncMetadataScalarFieldEnum[] | SyncMetadataScalarFieldEnum
    having?: SyncMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncMetadataCountAggregateInputType | true
    _avg?: SyncMetadataAvgAggregateInputType
    _sum?: SyncMetadataSumAggregateInputType
    _min?: SyncMetadataMinAggregateInputType
    _max?: SyncMetadataMaxAggregateInputType
  }

  export type SyncMetadataGroupByOutputType = {
    id: string
    lastSyncAt: Date
    lastSuccessfulSync: Date | null
    syncStatus: string
    pendingCount: number
    failedCount: number
    lastError: string | null
    createdAt: Date
    updatedAt: Date
    _count: SyncMetadataCountAggregateOutputType | null
    _avg: SyncMetadataAvgAggregateOutputType | null
    _sum: SyncMetadataSumAggregateOutputType | null
    _min: SyncMetadataMinAggregateOutputType | null
    _max: SyncMetadataMaxAggregateOutputType | null
  }

  type GetSyncMetadataGroupByPayload<T extends SyncMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], SyncMetadataGroupByOutputType[P]>
        }
      >
    >


  export type SyncMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSyncAt?: boolean
    lastSuccessfulSync?: boolean
    syncStatus?: boolean
    pendingCount?: boolean
    failedCount?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncMetadata"]>

  export type SyncMetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSyncAt?: boolean
    lastSuccessfulSync?: boolean
    syncStatus?: boolean
    pendingCount?: boolean
    failedCount?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncMetadata"]>

  export type SyncMetadataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSyncAt?: boolean
    lastSuccessfulSync?: boolean
    syncStatus?: boolean
    pendingCount?: boolean
    failedCount?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncMetadata"]>

  export type SyncMetadataSelectScalar = {
    id?: boolean
    lastSyncAt?: boolean
    lastSuccessfulSync?: boolean
    syncStatus?: boolean
    pendingCount?: boolean
    failedCount?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SyncMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lastSyncAt" | "lastSuccessfulSync" | "syncStatus" | "pendingCount" | "failedCount" | "lastError" | "createdAt" | "updatedAt", ExtArgs["result"]["syncMetadata"]>

  export type $SyncMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncMetadata"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lastSyncAt: Date
      lastSuccessfulSync: Date | null
      syncStatus: string
      pendingCount: number
      failedCount: number
      lastError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["syncMetadata"]>
    composites: {}
  }

  type SyncMetadataGetPayload<S extends boolean | null | undefined | SyncMetadataDefaultArgs> = $Result.GetResult<Prisma.$SyncMetadataPayload, S>

  type SyncMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncMetadataCountAggregateInputType | true
    }

  export interface SyncMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncMetadata'], meta: { name: 'SyncMetadata' } }
    /**
     * Find zero or one SyncMetadata that matches the filter.
     * @param {SyncMetadataFindUniqueArgs} args - Arguments to find a SyncMetadata
     * @example
     * // Get one SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncMetadataFindUniqueArgs>(args: SelectSubset<T, SyncMetadataFindUniqueArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncMetadataFindUniqueOrThrowArgs} args - Arguments to find a SyncMetadata
     * @example
     * // Get one SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataFindFirstArgs} args - Arguments to find a SyncMetadata
     * @example
     * // Get one SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncMetadataFindFirstArgs>(args?: SelectSubset<T, SyncMetadataFindFirstArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataFindFirstOrThrowArgs} args - Arguments to find a SyncMetadata
     * @example
     * // Get one SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.findMany()
     * 
     * // Get first 10 SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncMetadataWithIdOnly = await prisma.syncMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncMetadataFindManyArgs>(args?: SelectSubset<T, SyncMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncMetadata.
     * @param {SyncMetadataCreateArgs} args - Arguments to create a SyncMetadata.
     * @example
     * // Create one SyncMetadata
     * const SyncMetadata = await prisma.syncMetadata.create({
     *   data: {
     *     // ... data to create a SyncMetadata
     *   }
     * })
     * 
     */
    create<T extends SyncMetadataCreateArgs>(args: SelectSubset<T, SyncMetadataCreateArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncMetadata.
     * @param {SyncMetadataCreateManyArgs} args - Arguments to create many SyncMetadata.
     * @example
     * // Create many SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncMetadataCreateManyArgs>(args?: SelectSubset<T, SyncMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncMetadata and returns the data saved in the database.
     * @param {SyncMetadataCreateManyAndReturnArgs} args - Arguments to create many SyncMetadata.
     * @example
     * // Create many SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncMetadata and only return the `id`
     * const syncMetadataWithIdOnly = await prisma.syncMetadata.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncMetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncMetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncMetadata.
     * @param {SyncMetadataDeleteArgs} args - Arguments to delete one SyncMetadata.
     * @example
     * // Delete one SyncMetadata
     * const SyncMetadata = await prisma.syncMetadata.delete({
     *   where: {
     *     // ... filter to delete one SyncMetadata
     *   }
     * })
     * 
     */
    delete<T extends SyncMetadataDeleteArgs>(args: SelectSubset<T, SyncMetadataDeleteArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncMetadata.
     * @param {SyncMetadataUpdateArgs} args - Arguments to update one SyncMetadata.
     * @example
     * // Update one SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncMetadataUpdateArgs>(args: SelectSubset<T, SyncMetadataUpdateArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncMetadata.
     * @param {SyncMetadataDeleteManyArgs} args - Arguments to filter SyncMetadata to delete.
     * @example
     * // Delete a few SyncMetadata
     * const { count } = await prisma.syncMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncMetadataDeleteManyArgs>(args?: SelectSubset<T, SyncMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncMetadataUpdateManyArgs>(args: SelectSubset<T, SyncMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncMetadata and returns the data updated in the database.
     * @param {SyncMetadataUpdateManyAndReturnArgs} args - Arguments to update many SyncMetadata.
     * @example
     * // Update many SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncMetadata and only return the `id`
     * const syncMetadataWithIdOnly = await prisma.syncMetadata.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SyncMetadataUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncMetadataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncMetadata.
     * @param {SyncMetadataUpsertArgs} args - Arguments to update or create a SyncMetadata.
     * @example
     * // Update or create a SyncMetadata
     * const syncMetadata = await prisma.syncMetadata.upsert({
     *   create: {
     *     // ... data to create a SyncMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncMetadata we want to update
     *   }
     * })
     */
    upsert<T extends SyncMetadataUpsertArgs>(args: SelectSubset<T, SyncMetadataUpsertArgs<ExtArgs>>): Prisma__SyncMetadataClient<$Result.GetResult<Prisma.$SyncMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataCountArgs} args - Arguments to filter SyncMetadata to count.
     * @example
     * // Count the number of SyncMetadata
     * const count = await prisma.syncMetadata.count({
     *   where: {
     *     // ... the filter for the SyncMetadata we want to count
     *   }
     * })
    **/
    count<T extends SyncMetadataCountArgs>(
      args?: Subset<T, SyncMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncMetadataAggregateArgs>(args: Subset<T, SyncMetadataAggregateArgs>): Prisma.PrismaPromise<GetSyncMetadataAggregateType<T>>

    /**
     * Group by SyncMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncMetadataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncMetadataGroupByArgs['orderBy'] }
        : { orderBy?: SyncMetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncMetadata model
   */
  readonly fields: SyncMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncMetadata model
   */
  interface SyncMetadataFieldRefs {
    readonly id: FieldRef<"SyncMetadata", 'String'>
    readonly lastSyncAt: FieldRef<"SyncMetadata", 'DateTime'>
    readonly lastSuccessfulSync: FieldRef<"SyncMetadata", 'DateTime'>
    readonly syncStatus: FieldRef<"SyncMetadata", 'String'>
    readonly pendingCount: FieldRef<"SyncMetadata", 'Int'>
    readonly failedCount: FieldRef<"SyncMetadata", 'Int'>
    readonly lastError: FieldRef<"SyncMetadata", 'String'>
    readonly createdAt: FieldRef<"SyncMetadata", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncMetadata", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncMetadata findUnique
   */
  export type SyncMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * Filter, which SyncMetadata to fetch.
     */
    where: SyncMetadataWhereUniqueInput
  }

  /**
   * SyncMetadata findUniqueOrThrow
   */
  export type SyncMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * Filter, which SyncMetadata to fetch.
     */
    where: SyncMetadataWhereUniqueInput
  }

  /**
   * SyncMetadata findFirst
   */
  export type SyncMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * Filter, which SyncMetadata to fetch.
     */
    where?: SyncMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncMetadata to fetch.
     */
    orderBy?: SyncMetadataOrderByWithRelationInput | SyncMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncMetadata.
     */
    cursor?: SyncMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncMetadata.
     */
    distinct?: SyncMetadataScalarFieldEnum | SyncMetadataScalarFieldEnum[]
  }

  /**
   * SyncMetadata findFirstOrThrow
   */
  export type SyncMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * Filter, which SyncMetadata to fetch.
     */
    where?: SyncMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncMetadata to fetch.
     */
    orderBy?: SyncMetadataOrderByWithRelationInput | SyncMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncMetadata.
     */
    cursor?: SyncMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncMetadata.
     */
    distinct?: SyncMetadataScalarFieldEnum | SyncMetadataScalarFieldEnum[]
  }

  /**
   * SyncMetadata findMany
   */
  export type SyncMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * Filter, which SyncMetadata to fetch.
     */
    where?: SyncMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncMetadata to fetch.
     */
    orderBy?: SyncMetadataOrderByWithRelationInput | SyncMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncMetadata.
     */
    cursor?: SyncMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncMetadata.
     */
    skip?: number
    distinct?: SyncMetadataScalarFieldEnum | SyncMetadataScalarFieldEnum[]
  }

  /**
   * SyncMetadata create
   */
  export type SyncMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * The data needed to create a SyncMetadata.
     */
    data: XOR<SyncMetadataCreateInput, SyncMetadataUncheckedCreateInput>
  }

  /**
   * SyncMetadata createMany
   */
  export type SyncMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncMetadata.
     */
    data: SyncMetadataCreateManyInput | SyncMetadataCreateManyInput[]
  }

  /**
   * SyncMetadata createManyAndReturn
   */
  export type SyncMetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * The data used to create many SyncMetadata.
     */
    data: SyncMetadataCreateManyInput | SyncMetadataCreateManyInput[]
  }

  /**
   * SyncMetadata update
   */
  export type SyncMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * The data needed to update a SyncMetadata.
     */
    data: XOR<SyncMetadataUpdateInput, SyncMetadataUncheckedUpdateInput>
    /**
     * Choose, which SyncMetadata to update.
     */
    where: SyncMetadataWhereUniqueInput
  }

  /**
   * SyncMetadata updateMany
   */
  export type SyncMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncMetadata.
     */
    data: XOR<SyncMetadataUpdateManyMutationInput, SyncMetadataUncheckedUpdateManyInput>
    /**
     * Filter which SyncMetadata to update
     */
    where?: SyncMetadataWhereInput
    /**
     * Limit how many SyncMetadata to update.
     */
    limit?: number
  }

  /**
   * SyncMetadata updateManyAndReturn
   */
  export type SyncMetadataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * The data used to update SyncMetadata.
     */
    data: XOR<SyncMetadataUpdateManyMutationInput, SyncMetadataUncheckedUpdateManyInput>
    /**
     * Filter which SyncMetadata to update
     */
    where?: SyncMetadataWhereInput
    /**
     * Limit how many SyncMetadata to update.
     */
    limit?: number
  }

  /**
   * SyncMetadata upsert
   */
  export type SyncMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * The filter to search for the SyncMetadata to update in case it exists.
     */
    where: SyncMetadataWhereUniqueInput
    /**
     * In case the SyncMetadata found by the `where` argument doesn't exist, create a new SyncMetadata with this data.
     */
    create: XOR<SyncMetadataCreateInput, SyncMetadataUncheckedCreateInput>
    /**
     * In case the SyncMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncMetadataUpdateInput, SyncMetadataUncheckedUpdateInput>
  }

  /**
   * SyncMetadata delete
   */
  export type SyncMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
    /**
     * Filter which SyncMetadata to delete.
     */
    where: SyncMetadataWhereUniqueInput
  }

  /**
   * SyncMetadata deleteMany
   */
  export type SyncMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncMetadata to delete
     */
    where?: SyncMetadataWhereInput
    /**
     * Limit how many SyncMetadata to delete.
     */
    limit?: number
  }

  /**
   * SyncMetadata without action
   */
  export type SyncMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncMetadata
     */
    select?: SyncMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncMetadata
     */
    omit?: SyncMetadataOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LocalUserScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    username: 'username',
    password: 'password',
    role: 'role',
    status: 'status',
    pinCode: 'pinCode',
    canUnlockScreen: 'canUnlockScreen',
    lastLoginAt: 'lastLoginAt',
    lastSyncedAt: 'lastSyncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalUserScalarFieldEnum = (typeof LocalUserScalarFieldEnum)[keyof typeof LocalUserScalarFieldEnum]


  export const SyncQueueScalarFieldEnum: {
    id: 'id',
    operation: 'operation',
    tableName: 'tableName',
    recordId: 'recordId',
    payload: 'payload',
    status: 'status',
    attempts: 'attempts',
    lastError: 'lastError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SyncQueueScalarFieldEnum = (typeof SyncQueueScalarFieldEnum)[keyof typeof SyncQueueScalarFieldEnum]


  export const LocalOrderScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    quantity: 'quantity',
    subtotal: 'subtotal',
    tax: 'tax',
    discount: 'discount',
    totalPrice: 'totalPrice',
    paymentMethod: 'paymentMethod',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    cardAuthCode: 'cardAuthCode',
    cardType: 'cardType',
    qrRefNo: 'qrRefNo',
    shiftId: 'shiftId',
    orderSource: 'orderSource',
    deliveryOrderId: 'deliveryOrderId',
    deliveryPlatform: 'deliveryPlatform',
    commission: 'commission',
    isSynced: 'isSynced',
    cloudOrderId: 'cloudOrderId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalOrderScalarFieldEnum = (typeof LocalOrderScalarFieldEnum)[keyof typeof LocalOrderScalarFieldEnum]


  export const LocalProductScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    name: 'name',
    category: 'category',
    categoryId: 'categoryId',
    subCategoryId: 'subCategoryId',
    costPrice: 'costPrice',
    sellingPrice: 'sellingPrice',
    packagingCost: 'packagingCost',
    currentStock: 'currentStock',
    reorderLevel: 'reorderLevel',
    supplierId: 'supplierId',
    imageUrl: 'imageUrl',
    productType: 'productType',
    trackStock: 'trackStock',
    lastSyncedAt: 'lastSyncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalProductScalarFieldEnum = (typeof LocalProductScalarFieldEnum)[keyof typeof LocalProductScalarFieldEnum]


  export const LocalCategoryScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    name: 'name',
    description: 'description',
    isActive: 'isActive',
    displayOrder: 'displayOrder',
    color: 'color',
    imageUrl: 'imageUrl',
    taxRate: 'taxRate',
    lastSyncedAt: 'lastSyncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalCategoryScalarFieldEnum = (typeof LocalCategoryScalarFieldEnum)[keyof typeof LocalCategoryScalarFieldEnum]


  export const LocalSubCategoryScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    name: 'name',
    categoryId: 'categoryId',
    displayOrder: 'displayOrder',
    color: 'color',
    imageUrl: 'imageUrl',
    isActive: 'isActive',
    lastSyncedAt: 'lastSyncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalSubCategoryScalarFieldEnum = (typeof LocalSubCategoryScalarFieldEnum)[keyof typeof LocalSubCategoryScalarFieldEnum]


  export const LocalGRNScalarFieldEnum: {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    poNumber: 'poNumber',
    paymentType: 'paymentType',
    creditPeriod: 'creditPeriod',
    dueDate: 'dueDate',
    receivedDate: 'receivedDate',
    productId: 'productId',
    quantity: 'quantity',
    freeQuantity: 'freeQuantity',
    uom: 'uom',
    unitCost: 'unitCost',
    discount: 'discount',
    discountType: 'discountType',
    landedCost: 'landedCost',
    freightCost: 'freightCost',
    handlingCost: 'handlingCost',
    taxCost: 'taxCost',
    trueUnitCost: 'trueUnitCost',
    totalAmount: 'totalAmount',
    balanceAmount: 'balanceAmount',
    expiryDate: 'expiryDate',
    batchNumber: 'batchNumber',
    qcStatus: 'qcStatus',
    rejectedQty: 'rejectedQty',
    rejectionReason: 'rejectionReason',
    paymentStatus: 'paymentStatus',
    paidAmount: 'paidAmount',
    supplierId: 'supplierId',
    categoryId: 'categoryId',
    subCategoryId: 'subCategoryId',
    isSynced: 'isSynced',
    cloudGRNId: 'cloudGRNId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalGRNScalarFieldEnum = (typeof LocalGRNScalarFieldEnum)[keyof typeof LocalGRNScalarFieldEnum]


  export const SyncMetadataScalarFieldEnum: {
    id: 'id',
    lastSyncAt: 'lastSyncAt',
    lastSuccessfulSync: 'lastSuccessfulSync',
    syncStatus: 'syncStatus',
    pendingCount: 'pendingCount',
    failedCount: 'failedCount',
    lastError: 'lastError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SyncMetadataScalarFieldEnum = (typeof SyncMetadataScalarFieldEnum)[keyof typeof SyncMetadataScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type LocalUserWhereInput = {
    AND?: LocalUserWhereInput | LocalUserWhereInput[]
    OR?: LocalUserWhereInput[]
    NOT?: LocalUserWhereInput | LocalUserWhereInput[]
    id?: IntFilter<"LocalUser"> | number
    cloudId?: IntFilter<"LocalUser"> | number
    username?: StringFilter<"LocalUser"> | string
    password?: StringFilter<"LocalUser"> | string
    role?: StringFilter<"LocalUser"> | string
    status?: StringFilter<"LocalUser"> | string
    pinCode?: StringNullableFilter<"LocalUser"> | string | null
    canUnlockScreen?: BoolFilter<"LocalUser"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"LocalUser"> | Date | string | null
    lastSyncedAt?: DateTimeFilter<"LocalUser"> | Date | string
    createdAt?: DateTimeFilter<"LocalUser"> | Date | string
    updatedAt?: DateTimeFilter<"LocalUser"> | Date | string
  }

  export type LocalUserOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    pinCode?: SortOrderInput | SortOrder
    canUnlockScreen?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cloudId?: number
    username?: string
    pinCode?: string
    AND?: LocalUserWhereInput | LocalUserWhereInput[]
    OR?: LocalUserWhereInput[]
    NOT?: LocalUserWhereInput | LocalUserWhereInput[]
    password?: StringFilter<"LocalUser"> | string
    role?: StringFilter<"LocalUser"> | string
    status?: StringFilter<"LocalUser"> | string
    canUnlockScreen?: BoolFilter<"LocalUser"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"LocalUser"> | Date | string | null
    lastSyncedAt?: DateTimeFilter<"LocalUser"> | Date | string
    createdAt?: DateTimeFilter<"LocalUser"> | Date | string
    updatedAt?: DateTimeFilter<"LocalUser"> | Date | string
  }, "id" | "cloudId" | "username" | "pinCode">

  export type LocalUserOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    pinCode?: SortOrderInput | SortOrder
    canUnlockScreen?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalUserCountOrderByAggregateInput
    _avg?: LocalUserAvgOrderByAggregateInput
    _max?: LocalUserMaxOrderByAggregateInput
    _min?: LocalUserMinOrderByAggregateInput
    _sum?: LocalUserSumOrderByAggregateInput
  }

  export type LocalUserScalarWhereWithAggregatesInput = {
    AND?: LocalUserScalarWhereWithAggregatesInput | LocalUserScalarWhereWithAggregatesInput[]
    OR?: LocalUserScalarWhereWithAggregatesInput[]
    NOT?: LocalUserScalarWhereWithAggregatesInput | LocalUserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocalUser"> | number
    cloudId?: IntWithAggregatesFilter<"LocalUser"> | number
    username?: StringWithAggregatesFilter<"LocalUser"> | string
    password?: StringWithAggregatesFilter<"LocalUser"> | string
    role?: StringWithAggregatesFilter<"LocalUser"> | string
    status?: StringWithAggregatesFilter<"LocalUser"> | string
    pinCode?: StringNullableWithAggregatesFilter<"LocalUser"> | string | null
    canUnlockScreen?: BoolWithAggregatesFilter<"LocalUser"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"LocalUser"> | Date | string | null
    lastSyncedAt?: DateTimeWithAggregatesFilter<"LocalUser"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LocalUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalUser"> | Date | string
  }

  export type SyncQueueWhereInput = {
    AND?: SyncQueueWhereInput | SyncQueueWhereInput[]
    OR?: SyncQueueWhereInput[]
    NOT?: SyncQueueWhereInput | SyncQueueWhereInput[]
    id?: StringFilter<"SyncQueue"> | string
    operation?: StringFilter<"SyncQueue"> | string
    tableName?: StringFilter<"SyncQueue"> | string
    recordId?: StringNullableFilter<"SyncQueue"> | string | null
    payload?: StringFilter<"SyncQueue"> | string
    status?: StringFilter<"SyncQueue"> | string
    attempts?: IntFilter<"SyncQueue"> | number
    lastError?: StringNullableFilter<"SyncQueue"> | string | null
    createdAt?: DateTimeFilter<"SyncQueue"> | Date | string
    updatedAt?: DateTimeFilter<"SyncQueue"> | Date | string
  }

  export type SyncQueueOrderByWithRelationInput = {
    id?: SortOrder
    operation?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrderInput | SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SyncQueueWhereInput | SyncQueueWhereInput[]
    OR?: SyncQueueWhereInput[]
    NOT?: SyncQueueWhereInput | SyncQueueWhereInput[]
    operation?: StringFilter<"SyncQueue"> | string
    tableName?: StringFilter<"SyncQueue"> | string
    recordId?: StringNullableFilter<"SyncQueue"> | string | null
    payload?: StringFilter<"SyncQueue"> | string
    status?: StringFilter<"SyncQueue"> | string
    attempts?: IntFilter<"SyncQueue"> | number
    lastError?: StringNullableFilter<"SyncQueue"> | string | null
    createdAt?: DateTimeFilter<"SyncQueue"> | Date | string
    updatedAt?: DateTimeFilter<"SyncQueue"> | Date | string
  }, "id">

  export type SyncQueueOrderByWithAggregationInput = {
    id?: SortOrder
    operation?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrderInput | SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncQueueCountOrderByAggregateInput
    _avg?: SyncQueueAvgOrderByAggregateInput
    _max?: SyncQueueMaxOrderByAggregateInput
    _min?: SyncQueueMinOrderByAggregateInput
    _sum?: SyncQueueSumOrderByAggregateInput
  }

  export type SyncQueueScalarWhereWithAggregatesInput = {
    AND?: SyncQueueScalarWhereWithAggregatesInput | SyncQueueScalarWhereWithAggregatesInput[]
    OR?: SyncQueueScalarWhereWithAggregatesInput[]
    NOT?: SyncQueueScalarWhereWithAggregatesInput | SyncQueueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncQueue"> | string
    operation?: StringWithAggregatesFilter<"SyncQueue"> | string
    tableName?: StringWithAggregatesFilter<"SyncQueue"> | string
    recordId?: StringNullableWithAggregatesFilter<"SyncQueue"> | string | null
    payload?: StringWithAggregatesFilter<"SyncQueue"> | string
    status?: StringWithAggregatesFilter<"SyncQueue"> | string
    attempts?: IntWithAggregatesFilter<"SyncQueue"> | number
    lastError?: StringNullableWithAggregatesFilter<"SyncQueue"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SyncQueue"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncQueue"> | Date | string
  }

  export type LocalOrderWhereInput = {
    AND?: LocalOrderWhereInput | LocalOrderWhereInput[]
    OR?: LocalOrderWhereInput[]
    NOT?: LocalOrderWhereInput | LocalOrderWhereInput[]
    id?: IntFilter<"LocalOrder"> | number
    productId?: IntFilter<"LocalOrder"> | number
    quantity?: IntFilter<"LocalOrder"> | number
    subtotal?: FloatNullableFilter<"LocalOrder"> | number | null
    tax?: FloatNullableFilter<"LocalOrder"> | number | null
    discount?: FloatNullableFilter<"LocalOrder"> | number | null
    totalPrice?: FloatFilter<"LocalOrder"> | number
    paymentMethod?: StringFilter<"LocalOrder"> | string
    customerName?: StringNullableFilter<"LocalOrder"> | string | null
    customerPhone?: StringNullableFilter<"LocalOrder"> | string | null
    cardAuthCode?: StringNullableFilter<"LocalOrder"> | string | null
    cardType?: StringNullableFilter<"LocalOrder"> | string | null
    qrRefNo?: StringNullableFilter<"LocalOrder"> | string | null
    shiftId?: IntNullableFilter<"LocalOrder"> | number | null
    orderSource?: StringFilter<"LocalOrder"> | string
    deliveryOrderId?: StringNullableFilter<"LocalOrder"> | string | null
    deliveryPlatform?: StringNullableFilter<"LocalOrder"> | string | null
    commission?: FloatNullableFilter<"LocalOrder"> | number | null
    isSynced?: BoolFilter<"LocalOrder"> | boolean
    cloudOrderId?: IntNullableFilter<"LocalOrder"> | number | null
    createdAt?: DateTimeFilter<"LocalOrder"> | Date | string
    updatedAt?: DateTimeFilter<"LocalOrder"> | Date | string
  }

  export type LocalOrderOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrderInput | SortOrder
    tax?: SortOrderInput | SortOrder
    discount?: SortOrderInput | SortOrder
    totalPrice?: SortOrder
    paymentMethod?: SortOrder
    customerName?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    cardAuthCode?: SortOrderInput | SortOrder
    cardType?: SortOrderInput | SortOrder
    qrRefNo?: SortOrderInput | SortOrder
    shiftId?: SortOrderInput | SortOrder
    orderSource?: SortOrder
    deliveryOrderId?: SortOrderInput | SortOrder
    deliveryPlatform?: SortOrderInput | SortOrder
    commission?: SortOrderInput | SortOrder
    isSynced?: SortOrder
    cloudOrderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LocalOrderWhereInput | LocalOrderWhereInput[]
    OR?: LocalOrderWhereInput[]
    NOT?: LocalOrderWhereInput | LocalOrderWhereInput[]
    productId?: IntFilter<"LocalOrder"> | number
    quantity?: IntFilter<"LocalOrder"> | number
    subtotal?: FloatNullableFilter<"LocalOrder"> | number | null
    tax?: FloatNullableFilter<"LocalOrder"> | number | null
    discount?: FloatNullableFilter<"LocalOrder"> | number | null
    totalPrice?: FloatFilter<"LocalOrder"> | number
    paymentMethod?: StringFilter<"LocalOrder"> | string
    customerName?: StringNullableFilter<"LocalOrder"> | string | null
    customerPhone?: StringNullableFilter<"LocalOrder"> | string | null
    cardAuthCode?: StringNullableFilter<"LocalOrder"> | string | null
    cardType?: StringNullableFilter<"LocalOrder"> | string | null
    qrRefNo?: StringNullableFilter<"LocalOrder"> | string | null
    shiftId?: IntNullableFilter<"LocalOrder"> | number | null
    orderSource?: StringFilter<"LocalOrder"> | string
    deliveryOrderId?: StringNullableFilter<"LocalOrder"> | string | null
    deliveryPlatform?: StringNullableFilter<"LocalOrder"> | string | null
    commission?: FloatNullableFilter<"LocalOrder"> | number | null
    isSynced?: BoolFilter<"LocalOrder"> | boolean
    cloudOrderId?: IntNullableFilter<"LocalOrder"> | number | null
    createdAt?: DateTimeFilter<"LocalOrder"> | Date | string
    updatedAt?: DateTimeFilter<"LocalOrder"> | Date | string
  }, "id">

  export type LocalOrderOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrderInput | SortOrder
    tax?: SortOrderInput | SortOrder
    discount?: SortOrderInput | SortOrder
    totalPrice?: SortOrder
    paymentMethod?: SortOrder
    customerName?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    cardAuthCode?: SortOrderInput | SortOrder
    cardType?: SortOrderInput | SortOrder
    qrRefNo?: SortOrderInput | SortOrder
    shiftId?: SortOrderInput | SortOrder
    orderSource?: SortOrder
    deliveryOrderId?: SortOrderInput | SortOrder
    deliveryPlatform?: SortOrderInput | SortOrder
    commission?: SortOrderInput | SortOrder
    isSynced?: SortOrder
    cloudOrderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalOrderCountOrderByAggregateInput
    _avg?: LocalOrderAvgOrderByAggregateInput
    _max?: LocalOrderMaxOrderByAggregateInput
    _min?: LocalOrderMinOrderByAggregateInput
    _sum?: LocalOrderSumOrderByAggregateInput
  }

  export type LocalOrderScalarWhereWithAggregatesInput = {
    AND?: LocalOrderScalarWhereWithAggregatesInput | LocalOrderScalarWhereWithAggregatesInput[]
    OR?: LocalOrderScalarWhereWithAggregatesInput[]
    NOT?: LocalOrderScalarWhereWithAggregatesInput | LocalOrderScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocalOrder"> | number
    productId?: IntWithAggregatesFilter<"LocalOrder"> | number
    quantity?: IntWithAggregatesFilter<"LocalOrder"> | number
    subtotal?: FloatNullableWithAggregatesFilter<"LocalOrder"> | number | null
    tax?: FloatNullableWithAggregatesFilter<"LocalOrder"> | number | null
    discount?: FloatNullableWithAggregatesFilter<"LocalOrder"> | number | null
    totalPrice?: FloatWithAggregatesFilter<"LocalOrder"> | number
    paymentMethod?: StringWithAggregatesFilter<"LocalOrder"> | string
    customerName?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    customerPhone?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    cardAuthCode?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    cardType?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    qrRefNo?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    shiftId?: IntNullableWithAggregatesFilter<"LocalOrder"> | number | null
    orderSource?: StringWithAggregatesFilter<"LocalOrder"> | string
    deliveryOrderId?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    deliveryPlatform?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    commission?: FloatNullableWithAggregatesFilter<"LocalOrder"> | number | null
    isSynced?: BoolWithAggregatesFilter<"LocalOrder"> | boolean
    cloudOrderId?: IntNullableWithAggregatesFilter<"LocalOrder"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"LocalOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalOrder"> | Date | string
  }

  export type LocalProductWhereInput = {
    AND?: LocalProductWhereInput | LocalProductWhereInput[]
    OR?: LocalProductWhereInput[]
    NOT?: LocalProductWhereInput | LocalProductWhereInput[]
    id?: IntFilter<"LocalProduct"> | number
    cloudId?: IntFilter<"LocalProduct"> | number
    name?: StringFilter<"LocalProduct"> | string
    category?: StringNullableFilter<"LocalProduct"> | string | null
    categoryId?: IntNullableFilter<"LocalProduct"> | number | null
    subCategoryId?: IntNullableFilter<"LocalProduct"> | number | null
    costPrice?: FloatFilter<"LocalProduct"> | number
    sellingPrice?: FloatFilter<"LocalProduct"> | number
    packagingCost?: FloatNullableFilter<"LocalProduct"> | number | null
    currentStock?: IntFilter<"LocalProduct"> | number
    reorderLevel?: IntNullableFilter<"LocalProduct"> | number | null
    supplierId?: IntFilter<"LocalProduct"> | number
    imageUrl?: StringNullableFilter<"LocalProduct"> | string | null
    productType?: StringNullableFilter<"LocalProduct"> | string | null
    trackStock?: BoolFilter<"LocalProduct"> | boolean
    lastSyncedAt?: DateTimeFilter<"LocalProduct"> | Date | string
    createdAt?: DateTimeFilter<"LocalProduct"> | Date | string
    updatedAt?: DateTimeFilter<"LocalProduct"> | Date | string
  }

  export type LocalProductOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    category?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    subCategoryId?: SortOrderInput | SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrderInput | SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrderInput | SortOrder
    supplierId?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    productType?: SortOrderInput | SortOrder
    trackStock?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cloudId?: number
    AND?: LocalProductWhereInput | LocalProductWhereInput[]
    OR?: LocalProductWhereInput[]
    NOT?: LocalProductWhereInput | LocalProductWhereInput[]
    name?: StringFilter<"LocalProduct"> | string
    category?: StringNullableFilter<"LocalProduct"> | string | null
    categoryId?: IntNullableFilter<"LocalProduct"> | number | null
    subCategoryId?: IntNullableFilter<"LocalProduct"> | number | null
    costPrice?: FloatFilter<"LocalProduct"> | number
    sellingPrice?: FloatFilter<"LocalProduct"> | number
    packagingCost?: FloatNullableFilter<"LocalProduct"> | number | null
    currentStock?: IntFilter<"LocalProduct"> | number
    reorderLevel?: IntNullableFilter<"LocalProduct"> | number | null
    supplierId?: IntFilter<"LocalProduct"> | number
    imageUrl?: StringNullableFilter<"LocalProduct"> | string | null
    productType?: StringNullableFilter<"LocalProduct"> | string | null
    trackStock?: BoolFilter<"LocalProduct"> | boolean
    lastSyncedAt?: DateTimeFilter<"LocalProduct"> | Date | string
    createdAt?: DateTimeFilter<"LocalProduct"> | Date | string
    updatedAt?: DateTimeFilter<"LocalProduct"> | Date | string
  }, "id" | "cloudId">

  export type LocalProductOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    category?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    subCategoryId?: SortOrderInput | SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrderInput | SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrderInput | SortOrder
    supplierId?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    productType?: SortOrderInput | SortOrder
    trackStock?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalProductCountOrderByAggregateInput
    _avg?: LocalProductAvgOrderByAggregateInput
    _max?: LocalProductMaxOrderByAggregateInput
    _min?: LocalProductMinOrderByAggregateInput
    _sum?: LocalProductSumOrderByAggregateInput
  }

  export type LocalProductScalarWhereWithAggregatesInput = {
    AND?: LocalProductScalarWhereWithAggregatesInput | LocalProductScalarWhereWithAggregatesInput[]
    OR?: LocalProductScalarWhereWithAggregatesInput[]
    NOT?: LocalProductScalarWhereWithAggregatesInput | LocalProductScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocalProduct"> | number
    cloudId?: IntWithAggregatesFilter<"LocalProduct"> | number
    name?: StringWithAggregatesFilter<"LocalProduct"> | string
    category?: StringNullableWithAggregatesFilter<"LocalProduct"> | string | null
    categoryId?: IntNullableWithAggregatesFilter<"LocalProduct"> | number | null
    subCategoryId?: IntNullableWithAggregatesFilter<"LocalProduct"> | number | null
    costPrice?: FloatWithAggregatesFilter<"LocalProduct"> | number
    sellingPrice?: FloatWithAggregatesFilter<"LocalProduct"> | number
    packagingCost?: FloatNullableWithAggregatesFilter<"LocalProduct"> | number | null
    currentStock?: IntWithAggregatesFilter<"LocalProduct"> | number
    reorderLevel?: IntNullableWithAggregatesFilter<"LocalProduct"> | number | null
    supplierId?: IntWithAggregatesFilter<"LocalProduct"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"LocalProduct"> | string | null
    productType?: StringNullableWithAggregatesFilter<"LocalProduct"> | string | null
    trackStock?: BoolWithAggregatesFilter<"LocalProduct"> | boolean
    lastSyncedAt?: DateTimeWithAggregatesFilter<"LocalProduct"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LocalProduct"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalProduct"> | Date | string
  }

  export type LocalCategoryWhereInput = {
    AND?: LocalCategoryWhereInput | LocalCategoryWhereInput[]
    OR?: LocalCategoryWhereInput[]
    NOT?: LocalCategoryWhereInput | LocalCategoryWhereInput[]
    id?: IntFilter<"LocalCategory"> | number
    cloudId?: IntFilter<"LocalCategory"> | number
    name?: StringFilter<"LocalCategory"> | string
    description?: StringNullableFilter<"LocalCategory"> | string | null
    isActive?: BoolFilter<"LocalCategory"> | boolean
    displayOrder?: IntFilter<"LocalCategory"> | number
    color?: StringNullableFilter<"LocalCategory"> | string | null
    imageUrl?: StringNullableFilter<"LocalCategory"> | string | null
    taxRate?: FloatNullableFilter<"LocalCategory"> | number | null
    lastSyncedAt?: DateTimeFilter<"LocalCategory"> | Date | string
    createdAt?: DateTimeFilter<"LocalCategory"> | Date | string
    updatedAt?: DateTimeFilter<"LocalCategory"> | Date | string
  }

  export type LocalCategoryOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    taxRate?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cloudId?: number
    AND?: LocalCategoryWhereInput | LocalCategoryWhereInput[]
    OR?: LocalCategoryWhereInput[]
    NOT?: LocalCategoryWhereInput | LocalCategoryWhereInput[]
    name?: StringFilter<"LocalCategory"> | string
    description?: StringNullableFilter<"LocalCategory"> | string | null
    isActive?: BoolFilter<"LocalCategory"> | boolean
    displayOrder?: IntFilter<"LocalCategory"> | number
    color?: StringNullableFilter<"LocalCategory"> | string | null
    imageUrl?: StringNullableFilter<"LocalCategory"> | string | null
    taxRate?: FloatNullableFilter<"LocalCategory"> | number | null
    lastSyncedAt?: DateTimeFilter<"LocalCategory"> | Date | string
    createdAt?: DateTimeFilter<"LocalCategory"> | Date | string
    updatedAt?: DateTimeFilter<"LocalCategory"> | Date | string
  }, "id" | "cloudId">

  export type LocalCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    taxRate?: SortOrderInput | SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalCategoryCountOrderByAggregateInput
    _avg?: LocalCategoryAvgOrderByAggregateInput
    _max?: LocalCategoryMaxOrderByAggregateInput
    _min?: LocalCategoryMinOrderByAggregateInput
    _sum?: LocalCategorySumOrderByAggregateInput
  }

  export type LocalCategoryScalarWhereWithAggregatesInput = {
    AND?: LocalCategoryScalarWhereWithAggregatesInput | LocalCategoryScalarWhereWithAggregatesInput[]
    OR?: LocalCategoryScalarWhereWithAggregatesInput[]
    NOT?: LocalCategoryScalarWhereWithAggregatesInput | LocalCategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocalCategory"> | number
    cloudId?: IntWithAggregatesFilter<"LocalCategory"> | number
    name?: StringWithAggregatesFilter<"LocalCategory"> | string
    description?: StringNullableWithAggregatesFilter<"LocalCategory"> | string | null
    isActive?: BoolWithAggregatesFilter<"LocalCategory"> | boolean
    displayOrder?: IntWithAggregatesFilter<"LocalCategory"> | number
    color?: StringNullableWithAggregatesFilter<"LocalCategory"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"LocalCategory"> | string | null
    taxRate?: FloatNullableWithAggregatesFilter<"LocalCategory"> | number | null
    lastSyncedAt?: DateTimeWithAggregatesFilter<"LocalCategory"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LocalCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalCategory"> | Date | string
  }

  export type LocalSubCategoryWhereInput = {
    AND?: LocalSubCategoryWhereInput | LocalSubCategoryWhereInput[]
    OR?: LocalSubCategoryWhereInput[]
    NOT?: LocalSubCategoryWhereInput | LocalSubCategoryWhereInput[]
    id?: IntFilter<"LocalSubCategory"> | number
    cloudId?: IntFilter<"LocalSubCategory"> | number
    name?: StringFilter<"LocalSubCategory"> | string
    categoryId?: IntFilter<"LocalSubCategory"> | number
    displayOrder?: IntFilter<"LocalSubCategory"> | number
    color?: StringNullableFilter<"LocalSubCategory"> | string | null
    imageUrl?: StringNullableFilter<"LocalSubCategory"> | string | null
    isActive?: BoolFilter<"LocalSubCategory"> | boolean
    lastSyncedAt?: DateTimeFilter<"LocalSubCategory"> | Date | string
    createdAt?: DateTimeFilter<"LocalSubCategory"> | Date | string
    updatedAt?: DateTimeFilter<"LocalSubCategory"> | Date | string
  }

  export type LocalSubCategoryOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalSubCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cloudId?: number
    categoryId_name?: LocalSubCategoryCategoryIdNameCompoundUniqueInput
    AND?: LocalSubCategoryWhereInput | LocalSubCategoryWhereInput[]
    OR?: LocalSubCategoryWhereInput[]
    NOT?: LocalSubCategoryWhereInput | LocalSubCategoryWhereInput[]
    name?: StringFilter<"LocalSubCategory"> | string
    categoryId?: IntFilter<"LocalSubCategory"> | number
    displayOrder?: IntFilter<"LocalSubCategory"> | number
    color?: StringNullableFilter<"LocalSubCategory"> | string | null
    imageUrl?: StringNullableFilter<"LocalSubCategory"> | string | null
    isActive?: BoolFilter<"LocalSubCategory"> | boolean
    lastSyncedAt?: DateTimeFilter<"LocalSubCategory"> | Date | string
    createdAt?: DateTimeFilter<"LocalSubCategory"> | Date | string
    updatedAt?: DateTimeFilter<"LocalSubCategory"> | Date | string
  }, "id" | "cloudId" | "categoryId_name">

  export type LocalSubCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalSubCategoryCountOrderByAggregateInput
    _avg?: LocalSubCategoryAvgOrderByAggregateInput
    _max?: LocalSubCategoryMaxOrderByAggregateInput
    _min?: LocalSubCategoryMinOrderByAggregateInput
    _sum?: LocalSubCategorySumOrderByAggregateInput
  }

  export type LocalSubCategoryScalarWhereWithAggregatesInput = {
    AND?: LocalSubCategoryScalarWhereWithAggregatesInput | LocalSubCategoryScalarWhereWithAggregatesInput[]
    OR?: LocalSubCategoryScalarWhereWithAggregatesInput[]
    NOT?: LocalSubCategoryScalarWhereWithAggregatesInput | LocalSubCategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocalSubCategory"> | number
    cloudId?: IntWithAggregatesFilter<"LocalSubCategory"> | number
    name?: StringWithAggregatesFilter<"LocalSubCategory"> | string
    categoryId?: IntWithAggregatesFilter<"LocalSubCategory"> | number
    displayOrder?: IntWithAggregatesFilter<"LocalSubCategory"> | number
    color?: StringNullableWithAggregatesFilter<"LocalSubCategory"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"LocalSubCategory"> | string | null
    isActive?: BoolWithAggregatesFilter<"LocalSubCategory"> | boolean
    lastSyncedAt?: DateTimeWithAggregatesFilter<"LocalSubCategory"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LocalSubCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalSubCategory"> | Date | string
  }

  export type LocalGRNWhereInput = {
    AND?: LocalGRNWhereInput | LocalGRNWhereInput[]
    OR?: LocalGRNWhereInput[]
    NOT?: LocalGRNWhereInput | LocalGRNWhereInput[]
    id?: IntFilter<"LocalGRN"> | number
    invoiceNumber?: StringNullableFilter<"LocalGRN"> | string | null
    poNumber?: StringNullableFilter<"LocalGRN"> | string | null
    paymentType?: StringNullableFilter<"LocalGRN"> | string | null
    creditPeriod?: IntNullableFilter<"LocalGRN"> | number | null
    dueDate?: DateTimeNullableFilter<"LocalGRN"> | Date | string | null
    receivedDate?: DateTimeFilter<"LocalGRN"> | Date | string
    productId?: IntFilter<"LocalGRN"> | number
    quantity?: IntFilter<"LocalGRN"> | number
    freeQuantity?: IntNullableFilter<"LocalGRN"> | number | null
    uom?: StringNullableFilter<"LocalGRN"> | string | null
    unitCost?: FloatFilter<"LocalGRN"> | number
    discount?: FloatNullableFilter<"LocalGRN"> | number | null
    discountType?: StringNullableFilter<"LocalGRN"> | string | null
    landedCost?: FloatNullableFilter<"LocalGRN"> | number | null
    freightCost?: FloatNullableFilter<"LocalGRN"> | number | null
    handlingCost?: FloatNullableFilter<"LocalGRN"> | number | null
    taxCost?: FloatNullableFilter<"LocalGRN"> | number | null
    trueUnitCost?: FloatNullableFilter<"LocalGRN"> | number | null
    totalAmount?: FloatNullableFilter<"LocalGRN"> | number | null
    balanceAmount?: FloatNullableFilter<"LocalGRN"> | number | null
    expiryDate?: DateTimeNullableFilter<"LocalGRN"> | Date | string | null
    batchNumber?: StringNullableFilter<"LocalGRN"> | string | null
    qcStatus?: StringNullableFilter<"LocalGRN"> | string | null
    rejectedQty?: IntNullableFilter<"LocalGRN"> | number | null
    rejectionReason?: StringNullableFilter<"LocalGRN"> | string | null
    paymentStatus?: StringFilter<"LocalGRN"> | string
    paidAmount?: FloatNullableFilter<"LocalGRN"> | number | null
    supplierId?: IntFilter<"LocalGRN"> | number
    categoryId?: IntNullableFilter<"LocalGRN"> | number | null
    subCategoryId?: IntNullableFilter<"LocalGRN"> | number | null
    isSynced?: BoolFilter<"LocalGRN"> | boolean
    cloudGRNId?: IntNullableFilter<"LocalGRN"> | number | null
    createdAt?: DateTimeFilter<"LocalGRN"> | Date | string
    updatedAt?: DateTimeFilter<"LocalGRN"> | Date | string
  }

  export type LocalGRNOrderByWithRelationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    poNumber?: SortOrderInput | SortOrder
    paymentType?: SortOrderInput | SortOrder
    creditPeriod?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    receivedDate?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrderInput | SortOrder
    uom?: SortOrderInput | SortOrder
    unitCost?: SortOrder
    discount?: SortOrderInput | SortOrder
    discountType?: SortOrderInput | SortOrder
    landedCost?: SortOrderInput | SortOrder
    freightCost?: SortOrderInput | SortOrder
    handlingCost?: SortOrderInput | SortOrder
    taxCost?: SortOrderInput | SortOrder
    trueUnitCost?: SortOrderInput | SortOrder
    totalAmount?: SortOrderInput | SortOrder
    balanceAmount?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    batchNumber?: SortOrderInput | SortOrder
    qcStatus?: SortOrderInput | SortOrder
    rejectedQty?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    paidAmount?: SortOrderInput | SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    subCategoryId?: SortOrderInput | SortOrder
    isSynced?: SortOrder
    cloudGRNId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalGRNWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LocalGRNWhereInput | LocalGRNWhereInput[]
    OR?: LocalGRNWhereInput[]
    NOT?: LocalGRNWhereInput | LocalGRNWhereInput[]
    invoiceNumber?: StringNullableFilter<"LocalGRN"> | string | null
    poNumber?: StringNullableFilter<"LocalGRN"> | string | null
    paymentType?: StringNullableFilter<"LocalGRN"> | string | null
    creditPeriod?: IntNullableFilter<"LocalGRN"> | number | null
    dueDate?: DateTimeNullableFilter<"LocalGRN"> | Date | string | null
    receivedDate?: DateTimeFilter<"LocalGRN"> | Date | string
    productId?: IntFilter<"LocalGRN"> | number
    quantity?: IntFilter<"LocalGRN"> | number
    freeQuantity?: IntNullableFilter<"LocalGRN"> | number | null
    uom?: StringNullableFilter<"LocalGRN"> | string | null
    unitCost?: FloatFilter<"LocalGRN"> | number
    discount?: FloatNullableFilter<"LocalGRN"> | number | null
    discountType?: StringNullableFilter<"LocalGRN"> | string | null
    landedCost?: FloatNullableFilter<"LocalGRN"> | number | null
    freightCost?: FloatNullableFilter<"LocalGRN"> | number | null
    handlingCost?: FloatNullableFilter<"LocalGRN"> | number | null
    taxCost?: FloatNullableFilter<"LocalGRN"> | number | null
    trueUnitCost?: FloatNullableFilter<"LocalGRN"> | number | null
    totalAmount?: FloatNullableFilter<"LocalGRN"> | number | null
    balanceAmount?: FloatNullableFilter<"LocalGRN"> | number | null
    expiryDate?: DateTimeNullableFilter<"LocalGRN"> | Date | string | null
    batchNumber?: StringNullableFilter<"LocalGRN"> | string | null
    qcStatus?: StringNullableFilter<"LocalGRN"> | string | null
    rejectedQty?: IntNullableFilter<"LocalGRN"> | number | null
    rejectionReason?: StringNullableFilter<"LocalGRN"> | string | null
    paymentStatus?: StringFilter<"LocalGRN"> | string
    paidAmount?: FloatNullableFilter<"LocalGRN"> | number | null
    supplierId?: IntFilter<"LocalGRN"> | number
    categoryId?: IntNullableFilter<"LocalGRN"> | number | null
    subCategoryId?: IntNullableFilter<"LocalGRN"> | number | null
    isSynced?: BoolFilter<"LocalGRN"> | boolean
    cloudGRNId?: IntNullableFilter<"LocalGRN"> | number | null
    createdAt?: DateTimeFilter<"LocalGRN"> | Date | string
    updatedAt?: DateTimeFilter<"LocalGRN"> | Date | string
  }, "id">

  export type LocalGRNOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    poNumber?: SortOrderInput | SortOrder
    paymentType?: SortOrderInput | SortOrder
    creditPeriod?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    receivedDate?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrderInput | SortOrder
    uom?: SortOrderInput | SortOrder
    unitCost?: SortOrder
    discount?: SortOrderInput | SortOrder
    discountType?: SortOrderInput | SortOrder
    landedCost?: SortOrderInput | SortOrder
    freightCost?: SortOrderInput | SortOrder
    handlingCost?: SortOrderInput | SortOrder
    taxCost?: SortOrderInput | SortOrder
    trueUnitCost?: SortOrderInput | SortOrder
    totalAmount?: SortOrderInput | SortOrder
    balanceAmount?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    batchNumber?: SortOrderInput | SortOrder
    qcStatus?: SortOrderInput | SortOrder
    rejectedQty?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    paidAmount?: SortOrderInput | SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    subCategoryId?: SortOrderInput | SortOrder
    isSynced?: SortOrder
    cloudGRNId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalGRNCountOrderByAggregateInput
    _avg?: LocalGRNAvgOrderByAggregateInput
    _max?: LocalGRNMaxOrderByAggregateInput
    _min?: LocalGRNMinOrderByAggregateInput
    _sum?: LocalGRNSumOrderByAggregateInput
  }

  export type LocalGRNScalarWhereWithAggregatesInput = {
    AND?: LocalGRNScalarWhereWithAggregatesInput | LocalGRNScalarWhereWithAggregatesInput[]
    OR?: LocalGRNScalarWhereWithAggregatesInput[]
    NOT?: LocalGRNScalarWhereWithAggregatesInput | LocalGRNScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LocalGRN"> | number
    invoiceNumber?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    poNumber?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    paymentType?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    creditPeriod?: IntNullableWithAggregatesFilter<"LocalGRN"> | number | null
    dueDate?: DateTimeNullableWithAggregatesFilter<"LocalGRN"> | Date | string | null
    receivedDate?: DateTimeWithAggregatesFilter<"LocalGRN"> | Date | string
    productId?: IntWithAggregatesFilter<"LocalGRN"> | number
    quantity?: IntWithAggregatesFilter<"LocalGRN"> | number
    freeQuantity?: IntNullableWithAggregatesFilter<"LocalGRN"> | number | null
    uom?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    unitCost?: FloatWithAggregatesFilter<"LocalGRN"> | number
    discount?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    discountType?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    landedCost?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    freightCost?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    handlingCost?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    taxCost?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    trueUnitCost?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    totalAmount?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    balanceAmount?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    expiryDate?: DateTimeNullableWithAggregatesFilter<"LocalGRN"> | Date | string | null
    batchNumber?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    qcStatus?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    rejectedQty?: IntNullableWithAggregatesFilter<"LocalGRN"> | number | null
    rejectionReason?: StringNullableWithAggregatesFilter<"LocalGRN"> | string | null
    paymentStatus?: StringWithAggregatesFilter<"LocalGRN"> | string
    paidAmount?: FloatNullableWithAggregatesFilter<"LocalGRN"> | number | null
    supplierId?: IntWithAggregatesFilter<"LocalGRN"> | number
    categoryId?: IntNullableWithAggregatesFilter<"LocalGRN"> | number | null
    subCategoryId?: IntNullableWithAggregatesFilter<"LocalGRN"> | number | null
    isSynced?: BoolWithAggregatesFilter<"LocalGRN"> | boolean
    cloudGRNId?: IntNullableWithAggregatesFilter<"LocalGRN"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"LocalGRN"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalGRN"> | Date | string
  }

  export type SyncMetadataWhereInput = {
    AND?: SyncMetadataWhereInput | SyncMetadataWhereInput[]
    OR?: SyncMetadataWhereInput[]
    NOT?: SyncMetadataWhereInput | SyncMetadataWhereInput[]
    id?: StringFilter<"SyncMetadata"> | string
    lastSyncAt?: DateTimeFilter<"SyncMetadata"> | Date | string
    lastSuccessfulSync?: DateTimeNullableFilter<"SyncMetadata"> | Date | string | null
    syncStatus?: StringFilter<"SyncMetadata"> | string
    pendingCount?: IntFilter<"SyncMetadata"> | number
    failedCount?: IntFilter<"SyncMetadata"> | number
    lastError?: StringNullableFilter<"SyncMetadata"> | string | null
    createdAt?: DateTimeFilter<"SyncMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"SyncMetadata"> | Date | string
  }

  export type SyncMetadataOrderByWithRelationInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    lastSuccessfulSync?: SortOrderInput | SortOrder
    syncStatus?: SortOrder
    pendingCount?: SortOrder
    failedCount?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SyncMetadataWhereInput | SyncMetadataWhereInput[]
    OR?: SyncMetadataWhereInput[]
    NOT?: SyncMetadataWhereInput | SyncMetadataWhereInput[]
    lastSyncAt?: DateTimeFilter<"SyncMetadata"> | Date | string
    lastSuccessfulSync?: DateTimeNullableFilter<"SyncMetadata"> | Date | string | null
    syncStatus?: StringFilter<"SyncMetadata"> | string
    pendingCount?: IntFilter<"SyncMetadata"> | number
    failedCount?: IntFilter<"SyncMetadata"> | number
    lastError?: StringNullableFilter<"SyncMetadata"> | string | null
    createdAt?: DateTimeFilter<"SyncMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"SyncMetadata"> | Date | string
  }, "id">

  export type SyncMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    lastSuccessfulSync?: SortOrderInput | SortOrder
    syncStatus?: SortOrder
    pendingCount?: SortOrder
    failedCount?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncMetadataCountOrderByAggregateInput
    _avg?: SyncMetadataAvgOrderByAggregateInput
    _max?: SyncMetadataMaxOrderByAggregateInput
    _min?: SyncMetadataMinOrderByAggregateInput
    _sum?: SyncMetadataSumOrderByAggregateInput
  }

  export type SyncMetadataScalarWhereWithAggregatesInput = {
    AND?: SyncMetadataScalarWhereWithAggregatesInput | SyncMetadataScalarWhereWithAggregatesInput[]
    OR?: SyncMetadataScalarWhereWithAggregatesInput[]
    NOT?: SyncMetadataScalarWhereWithAggregatesInput | SyncMetadataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncMetadata"> | string
    lastSyncAt?: DateTimeWithAggregatesFilter<"SyncMetadata"> | Date | string
    lastSuccessfulSync?: DateTimeNullableWithAggregatesFilter<"SyncMetadata"> | Date | string | null
    syncStatus?: StringWithAggregatesFilter<"SyncMetadata"> | string
    pendingCount?: IntWithAggregatesFilter<"SyncMetadata"> | number
    failedCount?: IntWithAggregatesFilter<"SyncMetadata"> | number
    lastError?: StringNullableWithAggregatesFilter<"SyncMetadata"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SyncMetadata"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncMetadata"> | Date | string
  }

  export type LocalUserCreateInput = {
    cloudId: number
    username: string
    password: string
    role: string
    status?: string
    pinCode?: string | null
    canUnlockScreen?: boolean
    lastLoginAt?: Date | string | null
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalUserUncheckedCreateInput = {
    id?: number
    cloudId: number
    username: string
    password: string
    role: string
    status?: string
    pinCode?: string | null
    canUnlockScreen?: boolean
    lastLoginAt?: Date | string | null
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalUserUpdateInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    canUnlockScreen?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalUserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    canUnlockScreen?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalUserCreateManyInput = {
    id?: number
    cloudId: number
    username: string
    password: string
    role: string
    status?: string
    pinCode?: string | null
    canUnlockScreen?: boolean
    lastLoginAt?: Date | string | null
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalUserUpdateManyMutationInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    canUnlockScreen?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalUserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    canUnlockScreen?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueCreateInput = {
    id?: string
    operation: string
    tableName: string
    recordId?: string | null
    payload: string
    status?: string
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncQueueUncheckedCreateInput = {
    id?: string
    operation: string
    tableName: string
    recordId?: string | null
    payload: string
    status?: string
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncQueueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    operation?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    operation?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueCreateManyInput = {
    id?: string
    operation: string
    tableName: string
    recordId?: string | null
    payload: string
    status?: string
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncQueueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    operation?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    operation?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderCreateInput = {
    productId: number
    quantity: number
    subtotal?: number | null
    tax?: number | null
    discount?: number | null
    totalPrice: number
    paymentMethod: string
    customerName?: string | null
    customerPhone?: string | null
    cardAuthCode?: string | null
    cardType?: string | null
    qrRefNo?: string | null
    shiftId?: number | null
    orderSource?: string
    deliveryOrderId?: string | null
    deliveryPlatform?: string | null
    commission?: number | null
    isSynced?: boolean
    cloudOrderId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalOrderUncheckedCreateInput = {
    id?: number
    productId: number
    quantity: number
    subtotal?: number | null
    tax?: number | null
    discount?: number | null
    totalPrice: number
    paymentMethod: string
    customerName?: string | null
    customerPhone?: string | null
    cardAuthCode?: string | null
    cardType?: string | null
    qrRefNo?: string | null
    shiftId?: number | null
    orderSource?: string
    deliveryOrderId?: string | null
    deliveryPlatform?: string | null
    commission?: number | null
    isSynced?: boolean
    cloudOrderId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalOrderUpdateInput = {
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    subtotal?: NullableFloatFieldUpdateOperationsInput | number | null
    tax?: NullableFloatFieldUpdateOperationsInput | number | null
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    cardAuthCode?: NullableStringFieldUpdateOperationsInput | string | null
    cardType?: NullableStringFieldUpdateOperationsInput | string | null
    qrRefNo?: NullableStringFieldUpdateOperationsInput | string | null
    shiftId?: NullableIntFieldUpdateOperationsInput | number | null
    orderSource?: StringFieldUpdateOperationsInput | string
    deliveryOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryPlatform?: NullableStringFieldUpdateOperationsInput | string | null
    commission?: NullableFloatFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    subtotal?: NullableFloatFieldUpdateOperationsInput | number | null
    tax?: NullableFloatFieldUpdateOperationsInput | number | null
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    cardAuthCode?: NullableStringFieldUpdateOperationsInput | string | null
    cardType?: NullableStringFieldUpdateOperationsInput | string | null
    qrRefNo?: NullableStringFieldUpdateOperationsInput | string | null
    shiftId?: NullableIntFieldUpdateOperationsInput | number | null
    orderSource?: StringFieldUpdateOperationsInput | string
    deliveryOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryPlatform?: NullableStringFieldUpdateOperationsInput | string | null
    commission?: NullableFloatFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderCreateManyInput = {
    id?: number
    productId: number
    quantity: number
    subtotal?: number | null
    tax?: number | null
    discount?: number | null
    totalPrice: number
    paymentMethod: string
    customerName?: string | null
    customerPhone?: string | null
    cardAuthCode?: string | null
    cardType?: string | null
    qrRefNo?: string | null
    shiftId?: number | null
    orderSource?: string
    deliveryOrderId?: string | null
    deliveryPlatform?: string | null
    commission?: number | null
    isSynced?: boolean
    cloudOrderId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalOrderUpdateManyMutationInput = {
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    subtotal?: NullableFloatFieldUpdateOperationsInput | number | null
    tax?: NullableFloatFieldUpdateOperationsInput | number | null
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    cardAuthCode?: NullableStringFieldUpdateOperationsInput | string | null
    cardType?: NullableStringFieldUpdateOperationsInput | string | null
    qrRefNo?: NullableStringFieldUpdateOperationsInput | string | null
    shiftId?: NullableIntFieldUpdateOperationsInput | number | null
    orderSource?: StringFieldUpdateOperationsInput | string
    deliveryOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryPlatform?: NullableStringFieldUpdateOperationsInput | string | null
    commission?: NullableFloatFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    subtotal?: NullableFloatFieldUpdateOperationsInput | number | null
    tax?: NullableFloatFieldUpdateOperationsInput | number | null
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    totalPrice?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    cardAuthCode?: NullableStringFieldUpdateOperationsInput | string | null
    cardType?: NullableStringFieldUpdateOperationsInput | string | null
    qrRefNo?: NullableStringFieldUpdateOperationsInput | string | null
    shiftId?: NullableIntFieldUpdateOperationsInput | number | null
    orderSource?: StringFieldUpdateOperationsInput | string
    deliveryOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryPlatform?: NullableStringFieldUpdateOperationsInput | string | null
    commission?: NullableFloatFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudOrderId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalProductCreateInput = {
    cloudId: number
    name: string
    category?: string | null
    categoryId?: number | null
    subCategoryId?: number | null
    costPrice: number
    sellingPrice: number
    packagingCost?: number | null
    currentStock?: number
    reorderLevel?: number | null
    supplierId: number
    imageUrl?: string | null
    productType?: string | null
    trackStock?: boolean
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalProductUncheckedCreateInput = {
    id?: number
    cloudId: number
    name: string
    category?: string | null
    categoryId?: number | null
    subCategoryId?: number | null
    costPrice: number
    sellingPrice: number
    packagingCost?: number | null
    currentStock?: number
    reorderLevel?: number | null
    supplierId: number
    imageUrl?: string | null
    productType?: string | null
    trackStock?: boolean
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalProductUpdateInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    costPrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    packagingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: NullableIntFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    productType?: NullableStringFieldUpdateOperationsInput | string | null
    trackStock?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalProductUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    costPrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    packagingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: NullableIntFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    productType?: NullableStringFieldUpdateOperationsInput | string | null
    trackStock?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalProductCreateManyInput = {
    id?: number
    cloudId: number
    name: string
    category?: string | null
    categoryId?: number | null
    subCategoryId?: number | null
    costPrice: number
    sellingPrice: number
    packagingCost?: number | null
    currentStock?: number
    reorderLevel?: number | null
    supplierId: number
    imageUrl?: string | null
    productType?: string | null
    trackStock?: boolean
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalProductUpdateManyMutationInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    costPrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    packagingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: NullableIntFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    productType?: NullableStringFieldUpdateOperationsInput | string | null
    trackStock?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalProductUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    costPrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    packagingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: NullableIntFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    productType?: NullableStringFieldUpdateOperationsInput | string | null
    trackStock?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCategoryCreateInput = {
    cloudId: number
    name: string
    description?: string | null
    isActive?: boolean
    displayOrder?: number
    color?: string | null
    imageUrl?: string | null
    taxRate?: number | null
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalCategoryUncheckedCreateInput = {
    id?: number
    cloudId: number
    name: string
    description?: string | null
    isActive?: boolean
    displayOrder?: number
    color?: string | null
    imageUrl?: string | null
    taxRate?: number | null
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalCategoryUpdateInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCategoryCreateManyInput = {
    id?: number
    cloudId: number
    name: string
    description?: string | null
    isActive?: boolean
    displayOrder?: number
    color?: string | null
    imageUrl?: string | null
    taxRate?: number | null
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalCategoryUpdateManyMutationInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSubCategoryCreateInput = {
    cloudId: number
    name: string
    categoryId: number
    displayOrder?: number
    color?: string | null
    imageUrl?: string | null
    isActive?: boolean
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalSubCategoryUncheckedCreateInput = {
    id?: number
    cloudId: number
    name: string
    categoryId: number
    displayOrder?: number
    color?: string | null
    imageUrl?: string | null
    isActive?: boolean
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalSubCategoryUpdateInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSubCategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSubCategoryCreateManyInput = {
    id?: number
    cloudId: number
    name: string
    categoryId: number
    displayOrder?: number
    color?: string | null
    imageUrl?: string | null
    isActive?: boolean
    lastSyncedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalSubCategoryUpdateManyMutationInput = {
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSubCategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cloudId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    color?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastSyncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalGRNCreateInput = {
    invoiceNumber?: string | null
    poNumber?: string | null
    paymentType?: string | null
    creditPeriod?: number | null
    dueDate?: Date | string | null
    receivedDate?: Date | string
    productId: number
    quantity: number
    freeQuantity?: number | null
    uom?: string | null
    unitCost: number
    discount?: number | null
    discountType?: string | null
    landedCost?: number | null
    freightCost?: number | null
    handlingCost?: number | null
    taxCost?: number | null
    trueUnitCost?: number | null
    totalAmount?: number | null
    balanceAmount?: number | null
    expiryDate?: Date | string | null
    batchNumber?: string | null
    qcStatus?: string | null
    rejectedQty?: number | null
    rejectionReason?: string | null
    paymentStatus?: string
    paidAmount?: number | null
    supplierId: number
    categoryId?: number | null
    subCategoryId?: number | null
    isSynced?: boolean
    cloudGRNId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalGRNUncheckedCreateInput = {
    id?: number
    invoiceNumber?: string | null
    poNumber?: string | null
    paymentType?: string | null
    creditPeriod?: number | null
    dueDate?: Date | string | null
    receivedDate?: Date | string
    productId: number
    quantity: number
    freeQuantity?: number | null
    uom?: string | null
    unitCost: number
    discount?: number | null
    discountType?: string | null
    landedCost?: number | null
    freightCost?: number | null
    handlingCost?: number | null
    taxCost?: number | null
    trueUnitCost?: number | null
    totalAmount?: number | null
    balanceAmount?: number | null
    expiryDate?: Date | string | null
    batchNumber?: string | null
    qcStatus?: string | null
    rejectedQty?: number | null
    rejectionReason?: string | null
    paymentStatus?: string
    paidAmount?: number | null
    supplierId: number
    categoryId?: number | null
    subCategoryId?: number | null
    isSynced?: boolean
    cloudGRNId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalGRNUpdateInput = {
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    creditPeriod?: NullableIntFieldUpdateOperationsInput | number | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    freeQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    uom?: NullableStringFieldUpdateOperationsInput | string | null
    unitCost?: FloatFieldUpdateOperationsInput | number
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    landedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    freightCost?: NullableFloatFieldUpdateOperationsInput | number | null
    handlingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    taxCost?: NullableFloatFieldUpdateOperationsInput | number | null
    trueUnitCost?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    balanceAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qcStatus?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedQty?: NullableIntFieldUpdateOperationsInput | number | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paidAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudGRNId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalGRNUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    creditPeriod?: NullableIntFieldUpdateOperationsInput | number | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    freeQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    uom?: NullableStringFieldUpdateOperationsInput | string | null
    unitCost?: FloatFieldUpdateOperationsInput | number
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    landedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    freightCost?: NullableFloatFieldUpdateOperationsInput | number | null
    handlingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    taxCost?: NullableFloatFieldUpdateOperationsInput | number | null
    trueUnitCost?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    balanceAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qcStatus?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedQty?: NullableIntFieldUpdateOperationsInput | number | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paidAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudGRNId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalGRNCreateManyInput = {
    id?: number
    invoiceNumber?: string | null
    poNumber?: string | null
    paymentType?: string | null
    creditPeriod?: number | null
    dueDate?: Date | string | null
    receivedDate?: Date | string
    productId: number
    quantity: number
    freeQuantity?: number | null
    uom?: string | null
    unitCost: number
    discount?: number | null
    discountType?: string | null
    landedCost?: number | null
    freightCost?: number | null
    handlingCost?: number | null
    taxCost?: number | null
    trueUnitCost?: number | null
    totalAmount?: number | null
    balanceAmount?: number | null
    expiryDate?: Date | string | null
    batchNumber?: string | null
    qcStatus?: string | null
    rejectedQty?: number | null
    rejectionReason?: string | null
    paymentStatus?: string
    paidAmount?: number | null
    supplierId: number
    categoryId?: number | null
    subCategoryId?: number | null
    isSynced?: boolean
    cloudGRNId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalGRNUpdateManyMutationInput = {
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    creditPeriod?: NullableIntFieldUpdateOperationsInput | number | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    freeQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    uom?: NullableStringFieldUpdateOperationsInput | string | null
    unitCost?: FloatFieldUpdateOperationsInput | number
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    landedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    freightCost?: NullableFloatFieldUpdateOperationsInput | number | null
    handlingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    taxCost?: NullableFloatFieldUpdateOperationsInput | number | null
    trueUnitCost?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    balanceAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qcStatus?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedQty?: NullableIntFieldUpdateOperationsInput | number | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paidAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudGRNId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalGRNUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    creditPeriod?: NullableIntFieldUpdateOperationsInput | number | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    freeQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    uom?: NullableStringFieldUpdateOperationsInput | string | null
    unitCost?: FloatFieldUpdateOperationsInput | number
    discount?: NullableFloatFieldUpdateOperationsInput | number | null
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    landedCost?: NullableFloatFieldUpdateOperationsInput | number | null
    freightCost?: NullableFloatFieldUpdateOperationsInput | number | null
    handlingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    taxCost?: NullableFloatFieldUpdateOperationsInput | number | null
    trueUnitCost?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    balanceAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qcStatus?: NullableStringFieldUpdateOperationsInput | string | null
    rejectedQty?: NullableIntFieldUpdateOperationsInput | number | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paidAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    supplierId?: IntFieldUpdateOperationsInput | number
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    subCategoryId?: NullableIntFieldUpdateOperationsInput | number | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    cloudGRNId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncMetadataCreateInput = {
    id?: string
    lastSyncAt?: Date | string
    lastSuccessfulSync?: Date | string | null
    syncStatus?: string
    pendingCount?: number
    failedCount?: number
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncMetadataUncheckedCreateInput = {
    id?: string
    lastSyncAt?: Date | string
    lastSuccessfulSync?: Date | string | null
    syncStatus?: string
    pendingCount?: number
    failedCount?: number
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncMetadataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSuccessfulSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: StringFieldUpdateOperationsInput | string
    pendingCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncMetadataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSuccessfulSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: StringFieldUpdateOperationsInput | string
    pendingCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncMetadataCreateManyInput = {
    id?: string
    lastSyncAt?: Date | string
    lastSuccessfulSync?: Date | string | null
    syncStatus?: string
    pendingCount?: number
    failedCount?: number
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncMetadataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSuccessfulSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: StringFieldUpdateOperationsInput | string
    pendingCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncMetadataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSuccessfulSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: StringFieldUpdateOperationsInput | string
    pendingCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocalUserCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    pinCode?: SortOrder
    canUnlockScreen?: SortOrder
    lastLoginAt?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserAvgOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
  }

  export type LocalUserMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    pinCode?: SortOrder
    canUnlockScreen?: SortOrder
    lastLoginAt?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    pinCode?: SortOrder
    canUnlockScreen?: SortOrder
    lastLoginAt?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserSumOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SyncQueueCountOrderByAggregateInput = {
    id?: SortOrder
    operation?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type SyncQueueMaxOrderByAggregateInput = {
    id?: SortOrder
    operation?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueMinOrderByAggregateInput = {
    id?: SortOrder
    operation?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type LocalOrderCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    totalPrice?: SortOrder
    paymentMethod?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    cardAuthCode?: SortOrder
    cardType?: SortOrder
    qrRefNo?: SortOrder
    shiftId?: SortOrder
    orderSource?: SortOrder
    deliveryOrderId?: SortOrder
    deliveryPlatform?: SortOrder
    commission?: SortOrder
    isSynced?: SortOrder
    cloudOrderId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderAvgOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    totalPrice?: SortOrder
    shiftId?: SortOrder
    commission?: SortOrder
    cloudOrderId?: SortOrder
  }

  export type LocalOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    totalPrice?: SortOrder
    paymentMethod?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    cardAuthCode?: SortOrder
    cardType?: SortOrder
    qrRefNo?: SortOrder
    shiftId?: SortOrder
    orderSource?: SortOrder
    deliveryOrderId?: SortOrder
    deliveryPlatform?: SortOrder
    commission?: SortOrder
    isSynced?: SortOrder
    cloudOrderId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    totalPrice?: SortOrder
    paymentMethod?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    cardAuthCode?: SortOrder
    cardType?: SortOrder
    qrRefNo?: SortOrder
    shiftId?: SortOrder
    orderSource?: SortOrder
    deliveryOrderId?: SortOrder
    deliveryPlatform?: SortOrder
    commission?: SortOrder
    isSynced?: SortOrder
    cloudOrderId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderSumOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    totalPrice?: SortOrder
    shiftId?: SortOrder
    commission?: SortOrder
    cloudOrderId?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type LocalProductCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    supplierId?: SortOrder
    imageUrl?: SortOrder
    productType?: SortOrder
    trackStock?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductAvgOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    supplierId?: SortOrder
  }

  export type LocalProductMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    supplierId?: SortOrder
    imageUrl?: SortOrder
    productType?: SortOrder
    trackStock?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    supplierId?: SortOrder
    imageUrl?: SortOrder
    productType?: SortOrder
    trackStock?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductSumOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    costPrice?: SortOrder
    sellingPrice?: SortOrder
    packagingCost?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    supplierId?: SortOrder
  }

  export type LocalCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrder
    imageUrl?: SortOrder
    taxRate?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCategoryAvgOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    displayOrder?: SortOrder
    taxRate?: SortOrder
  }

  export type LocalCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrder
    imageUrl?: SortOrder
    taxRate?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrder
    imageUrl?: SortOrder
    taxRate?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCategorySumOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    displayOrder?: SortOrder
    taxRate?: SortOrder
  }

  export type LocalSubCategoryCategoryIdNameCompoundUniqueInput = {
    categoryId: number
    name: string
  }

  export type LocalSubCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalSubCategoryAvgOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
  }

  export type LocalSubCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalSubCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
    color?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
    lastSyncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalSubCategorySumOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    categoryId?: SortOrder
    displayOrder?: SortOrder
  }

  export type LocalGRNCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    poNumber?: SortOrder
    paymentType?: SortOrder
    creditPeriod?: SortOrder
    dueDate?: SortOrder
    receivedDate?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrder
    uom?: SortOrder
    unitCost?: SortOrder
    discount?: SortOrder
    discountType?: SortOrder
    landedCost?: SortOrder
    freightCost?: SortOrder
    handlingCost?: SortOrder
    taxCost?: SortOrder
    trueUnitCost?: SortOrder
    totalAmount?: SortOrder
    balanceAmount?: SortOrder
    expiryDate?: SortOrder
    batchNumber?: SortOrder
    qcStatus?: SortOrder
    rejectedQty?: SortOrder
    rejectionReason?: SortOrder
    paymentStatus?: SortOrder
    paidAmount?: SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    isSynced?: SortOrder
    cloudGRNId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalGRNAvgOrderByAggregateInput = {
    id?: SortOrder
    creditPeriod?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrder
    unitCost?: SortOrder
    discount?: SortOrder
    landedCost?: SortOrder
    freightCost?: SortOrder
    handlingCost?: SortOrder
    taxCost?: SortOrder
    trueUnitCost?: SortOrder
    totalAmount?: SortOrder
    balanceAmount?: SortOrder
    rejectedQty?: SortOrder
    paidAmount?: SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    cloudGRNId?: SortOrder
  }

  export type LocalGRNMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    poNumber?: SortOrder
    paymentType?: SortOrder
    creditPeriod?: SortOrder
    dueDate?: SortOrder
    receivedDate?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrder
    uom?: SortOrder
    unitCost?: SortOrder
    discount?: SortOrder
    discountType?: SortOrder
    landedCost?: SortOrder
    freightCost?: SortOrder
    handlingCost?: SortOrder
    taxCost?: SortOrder
    trueUnitCost?: SortOrder
    totalAmount?: SortOrder
    balanceAmount?: SortOrder
    expiryDate?: SortOrder
    batchNumber?: SortOrder
    qcStatus?: SortOrder
    rejectedQty?: SortOrder
    rejectionReason?: SortOrder
    paymentStatus?: SortOrder
    paidAmount?: SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    isSynced?: SortOrder
    cloudGRNId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalGRNMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    poNumber?: SortOrder
    paymentType?: SortOrder
    creditPeriod?: SortOrder
    dueDate?: SortOrder
    receivedDate?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrder
    uom?: SortOrder
    unitCost?: SortOrder
    discount?: SortOrder
    discountType?: SortOrder
    landedCost?: SortOrder
    freightCost?: SortOrder
    handlingCost?: SortOrder
    taxCost?: SortOrder
    trueUnitCost?: SortOrder
    totalAmount?: SortOrder
    balanceAmount?: SortOrder
    expiryDate?: SortOrder
    batchNumber?: SortOrder
    qcStatus?: SortOrder
    rejectedQty?: SortOrder
    rejectionReason?: SortOrder
    paymentStatus?: SortOrder
    paidAmount?: SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    isSynced?: SortOrder
    cloudGRNId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalGRNSumOrderByAggregateInput = {
    id?: SortOrder
    creditPeriod?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    freeQuantity?: SortOrder
    unitCost?: SortOrder
    discount?: SortOrder
    landedCost?: SortOrder
    freightCost?: SortOrder
    handlingCost?: SortOrder
    taxCost?: SortOrder
    trueUnitCost?: SortOrder
    totalAmount?: SortOrder
    balanceAmount?: SortOrder
    rejectedQty?: SortOrder
    paidAmount?: SortOrder
    supplierId?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    cloudGRNId?: SortOrder
  }

  export type SyncMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    lastSuccessfulSync?: SortOrder
    syncStatus?: SortOrder
    pendingCount?: SortOrder
    failedCount?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncMetadataAvgOrderByAggregateInput = {
    pendingCount?: SortOrder
    failedCount?: SortOrder
  }

  export type SyncMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    lastSuccessfulSync?: SortOrder
    syncStatus?: SortOrder
    pendingCount?: SortOrder
    failedCount?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    lastSuccessfulSync?: SortOrder
    syncStatus?: SortOrder
    pendingCount?: SortOrder
    failedCount?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncMetadataSumOrderByAggregateInput = {
    pendingCount?: SortOrder
    failedCount?: SortOrder
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}