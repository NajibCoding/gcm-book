<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Application\Invoice\CreateInvoiceUseCase;
use App\Application\Invoice\SendInvoiceEmailUseCase;
use App\Application\Invoice\UpdateInvoiceStatusUseCase;
use App\Domain\Invoice\DTOs\CreateInvoiceDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Infrastructure\Services\PdfService;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InvoiceController extends Controller
{
    public function __construct(
        private readonly CreateInvoiceUseCase $createInvoice,
        private readonly UpdateInvoiceStatusUseCase $updateStatus,
        private readonly SendInvoiceEmailUseCase $sendEmail,
        private readonly PdfService $pdfService,
    ) {}

    public function index(Request $request): Response
    {
        $query = Invoice::with(['booking', 'user', 'payment']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->orderByDesc('created_at')->paginate(20);

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Invoices/Create', [
            'bookings' => \App\Models\Booking::with(['service:id,name,base_price'])
                ->whereDoesntHave('invoice')
                ->select('id', 'booking_code', 'customer_name', 'customer_email', 'service_id')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $dto = new CreateInvoiceDTO(
            bookingId: isset($data['booking_id']) ? (int) $data['booking_id'] : null,
            userId: isset($data['user_id']) ? (int) $data['user_id'] : null,
            customerName: $data['customer_name'],
            customerEmail: $data['customer_email'],
            items: $data['items'],
            discountAmount: (float) ($data['discount_amount'] ?? 0),
            taxAmount: (float) ($data['tax_amount'] ?? 0),
            notes: $data['notes'] ?? null,
        );

        $invoice = $this->createInvoice->execute($dto);

        return redirect()->route('admin.invoices.show', $invoice->id)
            ->with('success', 'Invoice berhasil dibuat.');
    }

    public function show(Invoice $invoice): Response
    {
        return Inertia::render('Admin/Invoices/Show', [
            'invoice' => $invoice->load(['items', 'booking.service', 'payment', 'user']),
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        return Inertia::render('Admin/Invoices/Edit', [
            'invoice' => $invoice->load('items'),
        ]);
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:draft,sent,paid,cancelled',
        ]);

        $this->updateStatus->execute($invoice->id, $request->status);

        return back()->with('success', 'Status invoice diperbarui.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()->route('admin.invoices.index')
            ->with('success', 'Invoice dihapus.');
    }

    public function download(Invoice $invoice): \Illuminate\Http\Response
    {
        return $this->pdfService->generateInvoicePdf($invoice);
    }

    public function send(Invoice $invoice): RedirectResponse
    {
        $this->sendEmail->execute($invoice->id);

        return back()->with('success', 'Invoice berhasil dikirim ke email pelanggan.');
    }
}
