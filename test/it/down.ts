// test/it/example/teardown.ts
export default async () => {
  if (globalThis.__DB_CONTAINER__) {
    await globalThis.__DB_CONTAINER__.stop();
    console.log('🧹 MySQL TestContainer stopped');
  }
};
