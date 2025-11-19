<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Usuario;
use App\Models\Categoria;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoriaControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_category()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $data = [
            'nombre' => 'Fantasía',
            'descripcion' => 'Libros de magia y aventuras'
        ];

        $response = $this->postJson('/api/categories', $data);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'categoria' => ['id', 'nombre', 'descripcion']
                 ]);
    }

    /** @test */
    public function it_can_list_all_categories()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        Categoria::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function it_can_update_a_category()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $categoria = Categoria::factory()->create();

        $data = [
            'nombre' => 'Ciencia ficción',
            'descripcion' => 'Viajes espaciales y futuros distópicos'
        ];

        $response = $this->putJson("/api/categories/{$categoria->id}", $data);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Categoria actualizada correctamente',
                     'categoria' => ['id' => $categoria->id, 'nombre' => 'Ciencia ficción']
                 ]);
    }

    /** @test */
    public function it_can_delete_a_category()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $categoria = Categoria::factory()->create();

        $response = $this->deleteJson("/api/categories/{$categoria->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Categoria eliminada correctamente'
                 ]);
    }
}
