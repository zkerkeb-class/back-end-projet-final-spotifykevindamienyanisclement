import {
    describe,
    expect,
    jest,
    it,
    beforeEach,
    afterEach,
} from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { Request, Response } from 'express';
import WebSocketService from '../src/services/websocket.service';

// Définir le type correct pour les mocks
export interface MockResponse extends Partial<Response> {
    status: jest.Mock<any, any>;
    json: jest.Mock<any, any>;
    send: jest.Mock<any, any>;
}

export const createMockRes = (): MockResponse => {
    const json = jest.fn();
    const send = jest.fn();
    const status = jest.fn().mockReturnThis();

    const res = {
        status,
        json,
        send,
    } as MockResponse;

    return res;
};

// Mock Prisma avec le type correct
const prisma = mockDeep<PrismaClient>();

// Type pour les fonctions mock de Prisma
export type PrismaMock<T = any> = jest.Mock<Promise<T>>;

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => prisma),
}));

// Mock WebSocket Service
const mockWsService = {
    notifyTrackChange: jest.fn(),
    notifySessionUpdate: jest.fn(),
    broadcastToSession: jest.fn(),
    handleMessage: jest.fn(),
};

// Setup global mocks
global.wsService = mockWsService as any;

export { prisma };
