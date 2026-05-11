<?php

declare(strict_types=1);

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => 'required|integer|exists:services,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'vehicle_details' => 'nullable|array',
            'vehicle_details.*' => 'nullable|string',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:1000',
            'promo_id' => 'nullable|integer|exists:promos,id',
        ];
    }
}
