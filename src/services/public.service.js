/**
 * public.service.js
 *
 * Servicio de frontend para los endpoints públicos de ScoreLab.
 * NO usa el interceptor de auth (no requiere JWT).
 * Base URL: http://localhost:8080/api/public
 */
import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8080/api/public",
  headers: { "Content-Type": "application/json" },
});

// ── Torneos ──────────────────────────────────────────────────────────────────

/** Retorna la lista de todos los torneos disponibles. */
export const getTorneos = () =>
  publicApi.get("/torneos").then((r) => r.data?.datos ?? []);

// ── Partidos / Calendario ─────────────────────────────────────────────────────

/** Retorna todos los partidos de un torneo (programados + finalizados). */
export const getPartidosTorneo = (torneoId) =>
  publicApi.get(`/torneos/${torneoId}/partidos`).then((r) => r.data?.datos ?? []);

// ── Estadísticas ──────────────────────────────────────────────────────────────

/** Retorna la tabla de posiciones del torneo. */
export const getPosicionesTorneo = (torneoId) =>
  publicApi.get(`/torneos/${torneoId}/posiciones`).then((r) => r.data?.datos ?? []);

/** Retorna el ranking de goleadores del torneo. */
export const getGoleadoresTorneo = (torneoId) =>
  publicApi.get(`/torneos/${torneoId}/goleadores`).then((r) => r.data?.datos ?? []);

/** Retorna el control disciplinario del torneo. */
export const getDisciplinaTorneo = (torneoId) =>
  publicApi.get(`/torneos/${torneoId}/disciplina`).then((r) => r.data?.datos ?? []);
