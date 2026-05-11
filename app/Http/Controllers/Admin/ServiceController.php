<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Services/Index', [
            'services' => Service::paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Services/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:services,slug|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'is_bookable' => 'boolean',
            'is_invoiceable' => 'boolean',
            'is_active' => 'boolean',
        ]);

        Service::create($data);

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil dibuat.');
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('Admin/Services/Edit', ['service' => $service]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:services,slug,' . $service->id . '|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'is_bookable' => 'boolean',
            'is_invoiceable' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $service->update($data);

        return redirect()->route('admin.services.index')->with('success', 'Layanan diperbarui.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('admin.services.index')->with('success', 'Layanan dihapus.');
    }
}
