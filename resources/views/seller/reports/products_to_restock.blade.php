<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Produk Segera Dipesan</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .title { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
        .subtitle { font-size: 12px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11px; }
        th { background: #f2f2f2; text-align: left; }
    </style>
</head>
<body>
    <div class="title">(SRS-MartPlace-14) Laporan Daftar Produk Segera Dipesan</div>
    <div class="subtitle">
        Tanggal dibuat: {{ $generatedAt->format('d-m-Y H:i') }} oleh {{ $sellerName }}
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:40px;">No</th>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $i => $p)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $p->product_name }}</td>
                    <td>{{ $p->category }}</td>
                    <td>Rp {{ number_format($p->price, 0, ',', '.') }}</td>
                    <td>{{ $p->stock }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align:center;">Tidak ada data</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>

