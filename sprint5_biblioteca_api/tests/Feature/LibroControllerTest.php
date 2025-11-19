<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Usuario;
use App\Models\Libro;
use App\Models\Prestamo;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LibroControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_all_books()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        Libro::factory()->count(3)->create();

        $response = $this->getJson('/api/books');

        $response->assertStatus(200)
                 ->assertJsonCount(3,'data');
    }

    /** @test */
    public function it_can_search_books_by_title_or_author()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        Libro::factory()->create(['titulo' => 'El Quijote', 'autor' => 'Cervantes']);
        Libro::factory()->create(['titulo' => 'Cien años de soledad', 'autor' => 'García Márquez']);

        $response = $this->getJson('/api/books/search?query=Quijote');

        $response->assertStatus(200)
                 ->assertJsonFragment(['titulo' => 'El Quijote']);
    }

    /** @test */
    public function it_can_creat_a_book()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $response = $this->postJson('/api/books', [
            'titulo' => 'Dune',
            'autor' => 'Frank Herbert',
            'anio' => 1965,
            'disponibles' => 10,
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Libro creado correctamente',
                     'libro' => ['titulo' => 'Dune']
                 ]);
    }

    /** @test */
    public function it_can_update_a_book()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $book = Libro::factory()->create(['titulo' => 'Viejo título']);

        $response = $this->putJson("/api/books/{$book->id}", [
            'titulo' => 'Nuevo título',
            'autor' => 'Nuevo autor',
            'anio' => 2020,
            'disponibles' => 5,
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Libro actualizado correctamente',
                     'libro' => ['titulo' => 'Nuevo título']
                 ]);
    }

    /** @test */
    public function it_can_delete_a_book()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $book = Libro::factory()->create();

        $response = $this->deleteJson("/api/books/{$book->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Libro eliminado correctamente'
                 ]);
    }

    /** @test */
    public function it_can_get_most_popular_books()
    {
        Passport::actingAs(Usuario::factory()->create(['rol' => 'admin']));

        $book1 = Libro::factory()->create(['titulo' => 'Libro Popular']);
        $book2 = Libro::factory()->create(['titulo' => 'Libro Poco Popular']);

        Prestamo::factory()->count(5)->create(['id_libro' => $book1->id]);
        Prestamo::factory()->count(2)->create(['id_libro' => $book2->id]);

        $response = $this->getJson('/api/books/stats/popular');

        $response->assertStatus(200)
                 ->assertJsonFragment(['titulo' => 'Libro Popular']);
    }
}
