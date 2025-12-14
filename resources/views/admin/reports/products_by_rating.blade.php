<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Produk Berdasarkan Rating</title>

    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td {
            border: 1px solid #444;
            padding: 6px;
            text-align: left;
            font-size: 11px;
        }
        th { background: #e6e6e6; }
        h2 { margin: 0; padding: 0; font-size: 16px; }
        .meta { font-size: 12px; margin-top: 5px; }
    </style>
</head>

<body>

<h2>Laporan Daftar Produk Berdasarkan Rating</h2>
<p class="meta">Tanggal dibuat: {{ $generatedAt->setTimezone('Asia/Jakarta')->format('d-m-Y H:i') }} oleh {{ $adminName }}</p>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Rating</th>
            <th>Nama Toko</th>
            <th>Propinsi</th>
        </tr>
    </thead>

    <tbody>
        @foreach ($products as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $p->product_name }}</td>
                <td>{{ $p->product_category ?? '-' }}</td>
                <td>Rp {{ number_format($p->product_price, 0, ',', '.') }}</td>
                <td>{{ number_format($p->avg_rating, 1) }}/5</td>
                <td>{{ $p->store_name ?? '-' }}</td>
                <td>{{ $p->store_province ?? '-' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<p style="font-size: 11px; margin-top:10px;">
    ***) Propinsi diambil dari lokasi propinsi toko.
</p>

</body>
</html>
