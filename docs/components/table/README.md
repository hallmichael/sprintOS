# IndiTable Component

A reusable, customizable, and performant Table component for React Native applications, built with Tamagui UI library.

## Features

- Figma-matched design with proper styling
  - Rounded corners with border
  - Alternating row colors
  - Proper typography for headers and content
  - Hover effects for rows
- Customizable columns with various configuration options
  - Column alignment (left, center, right)
  - Column spanning with `colSpan`
  - Custom cell rendering with `render` function
  - Accessibility support with `rowScope`
  - Sorting with `sortable`, `sortOrder`, and `defaultSortOrder`
  - Column width control with `width` and `minWidth`
  - Column hiding with `hidden`
  - Custom styling with `viewProps`
  - Custom ordering key with `orderByKey`
- Support for sorting, pagination, and row selection
- Interactive UI with hover effects
  - Row hover highlighting for better user experience
  - Clickable rows with feedback
- Responsive design with horizontal scrolling
- Loading state indicator
- Custom cell rendering
- Nested data access with dot notation or array paths
- Customizable styling
- Configurable per-page options
- Draggable rows

## Usage with Draggable Rows and Input Fields

The table supports draggable rows for reordering with `showRowSortable={true}`. The implementation uses a dedicated drag handle instead of making the entire row draggable, which ensures that input fields within table cells work properly without losing focus during typing.

### Example:

```tsx
import { IndiTable } from '@/components/table';

// Sample data
const data = [
  { id: '1', name: 'Item 1', description: 'Description 1' },
  { id: '2', name: 'Item 2', description: 'Description 2' },
];

// Column definition with an editable field
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (value, record, index) => (
      <IndiTextInput value={value} onChangeText={text => handleTextChange(record.id, 'description', text)} />
    ),
  },
];

// Table implementation
const MyTable = () => {
  const handleSort = newData => {
    console.log('New order:', newData);
    // Update your state with the new order
  };

  return <IndiTable data={data} columns={columns} rowKey="id" showRowSortable={true} onChangeSort={handleSort} />;
};
```

## How Draggable Rows Work

The draggable rows feature uses the following approach:

1. A dedicated drag handle is shown at the beginning of each row
2. Dragging is only activated when the user interacts with the drag handle
3. The rest of the row, including any input fields, functions normally
4. This ensures input fields maintain focus while typing

## Usage

```tsx
import { IndiTable, IndiColumn } from '@/components/table';
import { OrderByClause, SortOrder } from '@/graphql/graphql';

// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
}

// Sample data
const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

// Define columns
const columns: IndiColumn<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
    sortOrder: SortOrder.Asc,
    rowScope: 'row', // Accessibility attribute
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
    defaultSortOrder: SortOrder.Asc, // Default sort order when clicked
  },
  {
    title: 'Age',
    dataIndex: 'age',
    align: 'right',
    colSpan: 1, // Column span example
  },
];

// Initial ordering
const initialOrderBy: OrderByClause[] = [{ column: 'name', order: SortOrder.Asc }];

// Pagination info (optional)
const paginationInfo = {
  count: 2,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: false,
  lastItem: 2,
  lastPage: 1,
  perPage: 10,
  total: 2,
};

// Render the table
function MyComponent() {
  const handleChange = (page: number, pageSize: number, orderBy?: OrderByClause[]) => {
    // Handle pagination and sorting changes
    // Typically, you would fetch new data based on these parameters
  };

  return (
    <IndiTable<User>
      columns={columns}
      data={users}
      rowKey="id"
      paginationInfo={paginationInfo}
      initialOrderBy={initialOrderBy}
      onChange={handleChange}
      scroll={true}
      onRow={record => ({
        // Add custom row props
        onPress: () => console.log('Row clicked:', record.id),
      })}
    />
  );
}
```

## Props

### IndiTable Props

| Prop               | Type                                                                                            | Default | Description                                            |
| ------------------ | ----------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------ |
| `bordered`         | `boolean`                                                                                       | `false` | Whether to show all table borders                      |
| `noPadding`        | `boolean`                                                                                       | `false` | Whether to remove padding from the table               |
| `columns`          | `IndiColumn<T>[]`                                                                               | `[]`    | Columns of table                                       |
| `data`             | `T[]`                                                                                           | `[]`    | Data record array to be displayed                      |
| `rowKey`           | `keyof T \| ((record: T) => string)`                                                            | -       | Key of row (required)                                  |
| `footer`           | `React.ReactNode`                                                                               | -       | Footer of table                                        |
| `loading`          | `boolean`                                                                                       | `false` | Whether to show loading status                         |
| `paginationInfo`   | `PaginatorInfo`                                                                                 | -       | Pagination information                                 |
| `initialOrderBy`   | `OrderByClause[]`                                                                               | `[]`    | Initial ordering of the table                          |
| `scroll`           | `boolean`                                                                                       | `false` | Whether to show scrollbar                              |
| `showHeader`       | `boolean`                                                                                       | `true`  | Whether to show header                                 |
| `size`             | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                                  | `'md'`  | Size of table                                          |
| `showRowSelection` | `boolean`                                                                                       | `false` | Whether to show row selection                          |
| `showRowSortable`  | `boolean`                                                                                       | `false` | Whether to enable draggable rows                       |
| `onChangeSort`     | `(newData: T[]) => void`                                                                        | -       | Callback when row order changes from dragging          |
| `sticky`           | `boolean \| { offsetHeader?: number; offsetScroll?: number; getContainer?: () => HTMLElement }` | `false` | Set sticky header and scroll bar (not implemented yet) |
| `onChange`         | `(page: number, pageSize: number, orderBy?: OrderByClause[]) => void`                           | -       | Callback when pagination or sorting changes            |
| `onRow`            | `(record: T, index: number) => IndiViewProps`                                                   | -       | Set props on per row                                   |

### IndiColumn Props

| Prop               | Type                                                        | Description                                                          |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| `align`            | `'left' \| 'center' \| 'right'`                             | The specify which way that column is aligned                         |
| `colSpan`          | `number`                                                    | Span of this column's title                                          |
| `sortable`         | `boolean`                                                   | Whether to show sortable icon and enable sorting for this column     |
| `dataIndex`        | `string \| string[]`                                        | Display field of the data record, support nest path by string array  |
| `defaultSortOrder` | `SortOrder`                                                 | Default order of sorted values                                       |
| `sortOrder`        | `SortOrder`                                                 | Current order of sorted values                                       |
| `orderByKey`       | `string`                                                    | Custom column name to use for ordering (if different from dataIndex) |
| `render`           | `(value: any, record: T, index: number) => React.ReactNode` | Renderer of the table cell                                           |
| `rowScope`         | `'row' \| 'rowgroup'`                                       | Set scope attribute for all cells in this column                     |
| `title`            | `string`                                                    | Title of this column                                                 |
| `width`            | `number \| string`                                          | Width of this column                                                 |
| `minWidth`         | `number \| string`                                          | Minimum width of this column                                         |
| `hidden`           | `boolean`                                                   | Whether to hide this column                                          |
| `viewProps`        | `IndiViewProps`                                             | Apply a custom style to the column                                   |

### TableFooter Props

The TableFooter component accepts the following props:

| Prop       | Type       | Default           | Description                                    |
| ---------- | ---------- | ----------------- | ---------------------------------------------- |
| `perPages` | `number[]` | `[5, 10, 20, 50]` | Available options for items per page selection |

## Examples

See the `example.tsx` file for a complete example of how to use the IndiTable component.

## Implementation Notes

- The table uses the `TableContext` to manage state and provide data to all table components.
- Sorting is implemented through the `OrderByClause` interface, which includes `column` and `order` properties.
- Pagination is handled through the `PaginatorInfo` interface from GraphQL.
- The table supports customizable styling through Tamagui's styling system.
- Draggable rows use a dedicated drag handle to preserve input focus during typing.
