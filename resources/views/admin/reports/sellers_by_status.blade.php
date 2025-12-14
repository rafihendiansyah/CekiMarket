<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Daftar Akun Penjual Berdasarkan Status</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 11px; }
        h1 { font-size: 16px; margin-bottom: 0; }
        p.meta { margin: 2px 0 8px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #000; padding: 4px 6px; }
        th { background: #f0f0f0; }
        .right { text-align: right; }
        .center { text-align: center; }
    </style>
</head>
<body>
    <h1></h1>
    <h1>Laporan Daftar Akun Penjual Berdasarkan Status</h1>
    <p class="meta">
        Tanggal dibuat: {{ $generatedAt->setTimezone('Asia/Jakarta')->format('d-m-Y H:i') }}
        oleh <strong>{{ $adminName }}</strong>
    </p>

    <table>
        <thead>
            <tr>
                <th class="center" style="width: 30px;">No</th>
                <th>Nama User</th>
                <th>Nama PIC</th>
                <th>Nama Toko</th>
                <th class="center" style="width: 80px;">Status</th>
            </tr>
        </thead>
        <tbody>
        @forelse ($sellers as $index => $seller)
            <tr>
                <td class="center">{{ $index + 1 }}</td>
                <td>{{ $seller->user->name ?? '-' }}</td>
                <td>{{ $seller->picName ?? '-' }}</td>
                <td>{{ $seller->storeName ?? '-' }}</td>
                <td class="center">
                    {{ $seller->status }}
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="5" class="center">
                    Tidak ada data penjual.
                </td>
            </tr>
        @endforelse
        </tbody>
    </table>

    <p style="margin-top:8px;font-size:10px;">
        ***) diurutkan berdasarkan status (aktif dulu baru tidak aktif)
    </p>
</body>
</html>
