<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $repo = new ClientRepository();
        $repo->createPersonalAccessClient(
            null,
            'Personal Access Client',
            'http://localhost'
        );
    }

    /** @test */
    public function it_can_register_a_user()
    {
        $response = $this->postJson('/api/register', [
            'nombre'   => 'Ramdom User',
            'email'    => 'ramdom@example.com',
            'password' => '12345678',
            'rol'      => 'admin',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'usuario' => ['id', 'nombre', 'email', 'rol'],
                 ]);
    }

    /** @test */
    public function it_can_login_with_valid_credentials()
    {
        $usuario = Usuario::factory()->create([
            'email'    => 'login@example.com',
            'password' => bcrypt('12345678'),
            'rol'      => 'admin',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'login@example.com',
            'password' => '12345678',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'usuario']);
    }

    /** @test */
    public function it_can_logout_authenticated_user()
    {
        $user = Usuario::factory()->create(['rol' => 'admin']);
        $token = $user->createToken('TestToken')->accessToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
                         ->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Sesión cerrada correctamente',
                 ]);
    }
}

