import {Table} from "@mui/joy";

export default function EmptyTable() {
    return <Table>
        <thead>
        <tr>
            <th>Empty Array</th>
        </tr>
        </thead>

        <tbody>
        <tr>
            <td>-</td>
        </tr>
        </tbody>
    </Table>
}