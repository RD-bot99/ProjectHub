<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Default role assignment
        $user->roles()->attach(3); // Assuming role_id 3 is 'team_member'

        $token = JWTAuth::fromUser($user);
        $roles = $user->roles()->pluck('name')->toArray();

        return response()->json([
            'user' => $user,
            'token' => $token,
            'roles' => $roles,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = JWTAuth::user();
        $roles = $user->roles()->pluck('name')->toArray();

        return response()->json([
            'token' => $token,
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me()
    {
        $user = auth()->user();
        $roles = $user->roles()->pluck('name')->toArray();
        
        return response()->json([
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function refresh()
    {
        $token = JWTAuth::refresh();
        return response()->json(['token' => $token]);
    }
}
