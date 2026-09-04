/**
 * Schema registry.
 *
 * Point your Studio's `schema.types` at this array:
 *
 *   // sanity.config.ts (in your Studio project)
 *   import { schemaTypes } from './sanity/schemas';
 *   export default defineConfig({
 *     // …
 *     schema: { types: schemaTypes },
 *   });
 *
 * The order here is the order documents appear in the Studio sidebar, so it is
 * sequenced by how often you will actually edit each type.
 */

import { processStep } from './processStep';
import { project } from './project';
import { service } from './service';
import { testimonial } from './testimonial';
import { tool } from './tool';

export const schemaTypes = [project, testimonial, service, processStep, tool];

export { project, testimonial, service, processStep, tool };
