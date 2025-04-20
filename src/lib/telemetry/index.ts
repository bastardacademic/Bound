import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  autoDetectResources: true,
  instrumentations: [getNodeAutoInstrumentations()],
});

export function initTracing() {
  sdk.start();
  console.log('Tracing initialized');
}
