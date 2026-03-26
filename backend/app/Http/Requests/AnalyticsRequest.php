<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AnalyticsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'date_format:Y-m-d', 'before_or_equal:end_date'],
            'end_date'   => ['sometimes', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'limit'      => ['sometimes', 'integer', 'min:1', 'max:20'],
            'page'       => ['sometimes', 'integer', 'min:1'],
            'per_page'   => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $start = $this->query('start_date');
            $end   = $this->query('end_date');
            if ($start && $end) {
                $diff = Carbon::parse($start)->diffInDays(Carbon::parse($end));
                if ($diff > 730) {
                    $v->errors()->add('end_date', 'Date range cannot exceed 2 years.');
                }
            }
        });
    }
}
