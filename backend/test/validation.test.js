import test from "node:test";
import assert from "node:assert/strict";
import { validateComment, validatePost, validateReaction } from "../src/utils/validation.js";

test("valida una publicación pública y elimina espacios exteriores", () => {
  assert.deepEqual(validatePost({ contenido: "  Hola microblog  " }), { contenido: "Hola microblog", privado: false });
});

test("interpreta la privacidad de una publicación multipart", () => {
  assert.equal(validatePost({ contenido: "Borrador", privado: "true" }).privado, true);
});

test("rechaza publicaciones vacías", () => {
  assert.ok(validatePost({ contenido: "   " }).error);
});

test("valida comentarios públicos con nombre", () => {
  assert.deepEqual(validateComment({ nombre: " Ada ", texto: " Buen post " }), { nombre: "Ada", texto: "Buen post" });
});

test("rechaza una reacción sin identificador de visitante", () => {
  assert.ok(validateReaction({ tipo: "like", visitorId: "corto" }).error);
});
