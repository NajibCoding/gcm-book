<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Domain\Service\Repositories\ServiceRepositoryInterface;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceRepositoryInterface $serviceRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Services/Index', [
            'services' => $this->serviceRepository->listActive(),
        ]);
    }
}
