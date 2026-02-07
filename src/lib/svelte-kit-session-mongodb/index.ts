import type { SessionStoreData, Store } from 'svelte-kit-sessions';
import type {Collection} from 'mongodb';

interface SessionStoreDataWithId extends SessionStoreData {
	readonly _id: string;
}

export interface SvelteKitSessionMongoDbConfig {
	readonly defaultTtlSeconds?: number;
}

export class SvelteKitSessionMongoDb implements Store {
	private readonly ttlName = 'expireAt';

	constructor(
		private readonly collection: Promise<Collection<SessionStoreDataWithId>> | Collection<SessionStoreDataWithId>,
		private readonly config?: SvelteKitSessionMongoDbConfig
	) {}

	async destroy(_id: string): Promise<void> {
		const collection = await this.collection;

		await collection.deleteOne({ _id });
	}

	async get(_id: string): Promise<SessionStoreData | null> {
		const collection = await this.collection;

		return collection.findOne({ _id });
	}

	async set(_id: string, storeData: SessionStoreData, ttl: number): Promise<void> {
		const collection = await this.collection;

		await collection.updateOne(
			{ _id },
			{
				$set: {
					...storeData,
					[this.ttlName]: this.fixTtl(ttl),
				}
			},
			{ upsert: true }
		);
	}

	async touch(_id: string, ttl: number): Promise<void> {
		const collection = await this.collection;

		await collection.updateOne(
			{ _id },
			{
				$set: { [this.ttlName]: this.fixTtl(ttl) }
			}
		);
	}

	private fixTtl(ttl: number): Date {
		if (ttl === Infinity) {
			ttl = this.config?.defaultTtlSeconds ?? Infinity;
		}

		const ttlDate = new Date();
		ttlDate.setUTCSeconds(ttlDate.getUTCSeconds() + ttl);
		return ttlDate;
	}
}
