<?php

namespace App\Http\Controllers;
use OpenApi\Annotations as OA;
use App\Models\Libro;
use App\Models\Usuario;
use App\Models\Prestamo;
use Illuminate\Http\Request;


class PrestamoController extends Controller
{
    /**
 * @OA\Get(
 *     path="/loans",
 *     summary="Listar todos los préstamos",
 *     tags={"Prestamos"},
 *     security={{"passport": {}}},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de préstamos obtenida correctamente",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="id_usuario", type="integer", example=3),
 *                 @OA\Property(property="id_libro", type="integer", example=5),
 *                 @OA\Property(property="fecha_prestamo", type="string", format="date", example="2025-10-10"),
 *                 @OA\Property(property="fecha_devolucion", type="string", format="date", example="2025-10-25"),
 *                 @OA\Property(property="estado", type="string", example="pendiente"),
 *                 @OA\Property(property="usuario", type="object",
 *                     @OA\Property(property="nombre", type="string", example="Jenifer")
 *                 ),
 *                 @OA\Property(property="libro", type="object",
 *                     @OA\Property(property="titulo", type="string", example="Dune")
 *                 )
 *             )
 *         )
 *     )
 * )
 */

    public function index()
    {
        $prestamos = Prestamo::with('usuario','libro')->get();
        return response()->json($prestamos);
    }

  /**
 * @OA\Post(
 *     path="/loans",
 *     summary="Crear un nuevo préstamo",
 *     tags={"Préstamos"},
 *     security={{"passport": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"id_usuario","id_libro","fecha_prestamo","estado"},
 *             @OA\Property(property="id_usuario", type="integer", example=1),
 *             @OA\Property(property="id_libro", type="integer", example=3),
 *             @OA\Property(property="fecha_prestamo", type="string", format="date", example="2025-10-10"),
 *             @OA\Property(property="fecha_devolucion", type="string", format="date", example="2025-10-20"),
 *             @OA\Property(property="estado", type="string", example="pendiente")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Préstamo creado correctamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Prestamo creado correctamente"),
 *             @OA\Property(property="prestamo", type="object",
 *                 @OA\Property(property="id", type="integer", example=2),
 *                 @OA\Property(property="id_usuario", type="integer", example=1),
 *                 @OA\Property(property="id_libro", type="integer", example=3),
 *                 @OA\Property(property="fecha_prestamo", type="string", format="date", example="2025-10-10"),
 *                 @OA\Property(property="fecha_devolucion", type="string", format="date", example="2025-10-20"),
 *                 @OA\Property(property="estado", type="string", example="pendiente")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Datos inválidos"
 *     )
 * )
 */
    public function store(Request $request)
    {
       $request->validate([
           'id_usuario'=>'required|exists:usuarios,id',
           'id_libro'=>'required|exists:libros,id',
           'fecha_prestamo'=>'required|date',
           'fecha_devolucion'=>'nullable|date|after_or_equal:fecha_prestamo',
           'estado'=>'required|string|max:20',
       ]);
       $prestamo = Prestamo::create([
        'id_usuario'=>$request->id_usuario,
        'id_libro'=>$request->id_libro,
        'fecha_prestamo'=>$request->fecha_prestamo,
        'fecha_devolucion'=>$request->fecha_devolucion,
        'estado'=>$request->estado,
       ]);
       return response()->json([
        'message'=>'Prestamo creado correctamente',
        'prestamo'=> $prestamo
       ],201);
    }

    
    public function show(string $id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) {
            return response()->json(['error'=>'Prestamo no encontrado'
            

            ],404);
        }
        return response()->json($prestamo);
    }

  /**
 * @OA\Put(
 *     path="/loans/{id}",
 *     summary="Actualizar un préstamo existente",
 *     tags={"Préstamos"},
 *     security={{"passport": {}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID del préstamo a actualizar",
 *         @OA\Schema(type="integer", example=4)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"id_usuario","id_libro","fecha_prestamo","estado"},
 *             @OA\Property(property="id_usuario", type="integer", example=2),
 *             @OA\Property(property="id_libro", type="integer", example=6),
 *             @OA\Property(property="fecha_prestamo", type="string", format="date", example="2025-10-01"),
 *             @OA\Property(property="fecha_devolucion", type="string", format="date", example="2025-10-15"),
 *             @OA\Property(property="estado", type="string", example="devuelto")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Préstamo actualizado correctamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Prestamo actualizado correctamente"),
 *             @OA\Property(property="prestamo", type="object",
 *                 @OA\Property(property="id", type="integer", example=4),
 *                 @OA\Property(property="id_usuario", type="integer", example=2),
 *                 @OA\Property(property="id_libro", type="integer", example=6),
 *                 @OA\Property(property="fecha_prestamo", type="string", format="date", example="2025-10-01"),
 *                 @OA\Property(property="fecha_devolucion", type="string", format="date", example="2025-10-15"),
 *                 @OA\Property(property="estado", type="string", example="devuelto")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Préstamo no encontrado"
 *     )
 * )
 */

    public function update(Request $request, string $id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) {
            return response()->json(['error'=>'Prestamo no encontrado'
            

            ],404);
        }
         $prestamo = Prestamo::find($id);
        if (!$prestamo) {
            return response()->json(['error'=>'Prestamo no encontrado'
            

            ],404);
        }
        $request->validate([
           'id_usuario'=>'required|exists:usuarios,id',
           'id_libro'=>'required|exists:libros,id',
           'fecha_prestamo'=>'required|date',
           'fecha_devolucion'=>'nullable|date|after_or_equal:fecha_prestamo',
           'estado'=>'required|string|max:20',
       ]);
       $prestamo->update([
        'id_usuario'=>$request->id_usuario,
        'id_libro'=>$request->id_libro,
        'fecha_prestamo'=>$request->fecha_prestamo,
        'fecha_devolucion'=>$request->fecha_devolucion,
        'estado'=>$request->estado,
       ]);
       return response()->json([
        'message'=>'Prestamo actualizado correctamente',
        'prestamo'=> $prestamo
       ]);
    }

    
/**
 * @OA\Delete(
 *     path="/loans/{id}",
 *     summary="Eliminar un préstamo",
 *     tags={"Préstamos"},
 *     security={{"passport": {}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID del préstamo a eliminar",
 *         @OA\Schema(type="integer", example=7)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Préstamo eliminado correctamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Prestamo eliminado correctamente")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Préstamo no encontrado"
 *     )
 * )
 */


    
    public function destroy(string $id)
    {
         $prestamo = Prestamo::find($id);
        if (!$prestamo) {
            return response()->json(['error'=>'Prestamo no encontrado'
            

            ],404);
        }
        $prestamo->delete();
        return response()->json([
            'message'=>'Prestamo eliminado correctamente'
        ]);
    }
}
