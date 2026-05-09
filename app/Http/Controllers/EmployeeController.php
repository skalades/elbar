<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with('user')->get();
        return Inertia::render('Employee/Index', [
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'position' => 'required|string|max:255',
            'base_salary' => 'required|numeric|min:0',
            'commission_rate' => 'required|numeric|min:0',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Opsional: Assign role via Spatie
        $user->assignRole('employee');

        Employee::create([
            'user_id' => $user->id,
            'position' => $request->position,
            'base_salary' => $request->base_salary,
            'commission_rate' => $request->commission_rate,
        ]);

        return redirect()->back()->with('success', 'Karyawan berhasil ditambahkan');
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $employee->user_id,
            'position' => 'required|string|max:255',
            'base_salary' => 'required|numeric|min:0',
            'commission_rate' => 'required|numeric|min:0',
        ]);

        $employee->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $employee->update([
            'position' => $request->position,
            'base_salary' => $request->base_salary,
            'commission_rate' => $request->commission_rate,
        ]);

        return redirect()->back()->with('success', 'Karyawan berhasil diperbarui');
    }

    public function destroy(Employee $employee)
    {
        $employee->user->delete(); // Akan menghapus employee juga karena onDelete('cascade')
        return redirect()->back()->with('success', 'Karyawan berhasil dihapus');
    }
}
