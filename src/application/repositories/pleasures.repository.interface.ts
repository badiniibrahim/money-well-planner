import { PleasuresType } from "@/src/entities/models/pleasures/pleasures";
import { Pleasure } from "@prisma/client";

export interface IPleasureRepository {
  createPleasure(form: PleasuresType, userId: string): Promise<Pleasure>;
  getAllPleasure(
    userId: string
  ): Promise<{ currency: string; pleasure: Pleasure[] }>;
  deletePleasure(pleasureId: number, userId: string): Promise<void>;
}
