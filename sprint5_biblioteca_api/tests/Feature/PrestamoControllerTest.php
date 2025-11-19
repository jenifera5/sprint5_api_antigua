<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Usuario;
use App\Models\Libro;
use App\Models\Prestamo;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PrestamoControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_all_loans()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        Prestamo::factory()->count(3)->create();

        $response = $this->getJson('/api/loans');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function it_can_create_a_loan()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));
        $usuario = Usuario::factory()->create();
        $libro = Libro::factory()->create();

        $response = $this->postJson('/api/loans', [
            'id_usuario' => $usuario->id,
            'id_libro' => $libro->id,
            'fecha_prestamo' => now()->toDateString(),
            'fecha_devolucion' => now()->addDays(7)->toDateString(),
            'estado' => 'activo'
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Prestamo creado correctamente'
                 ]);
    }

    /** @test */
    public function it_can_update_a_loan()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));
        $usuario = Usuario::factory()->create();
        $libro = Libro::factory()->create();
        $prestamo = Prestamo::factory()->create([
            'id_usuario' => $usuario->id,
            'id_libro' => $libro->id,
            'estado' => 'activo'
        ]);

        $response = $this->putJson("/api/loans/{$prestamo->id}", [
            'id_usuario' => $usuario->id,
            'id_libro' => $libro->id,
            'fecha_prestamo' => now()->toDateString(),
            'fecha_devolucion' => now()->addDays(10)->toDateString(),
            'estado' => 'devuelto'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Prestamo actualizado correctamente',
                     'prestamo' => ['estado' => 'devuelto']
                 ]);
    }

    /** @test */
    public function it_can_delete_a_loan()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));
        $prestamo = Prestamo::factory()->create();

        $response = $this->deleteJson("/api/loans/{$prestamo->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Prestamo eliminado correctamente'
                 ]);
    }
}
