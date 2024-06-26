import { PageInfo } from './page-info.model'

export default function Paginated<TItem>() {
  abstract class EdgeType {
    cursor: string

    node: TItem
  }

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  abstract class PaginatedType {
    edges: Array<EdgeType>

    // @Field((type) => [TItemClass], { nullable: true })
    // nodes: Array<TItem>;

    pageInfo: PageInfo

    totalCount: number
  }
  return PaginatedType
}
