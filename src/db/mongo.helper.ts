// import * as mongo from 'mongodb'
import { MongoClient, Collection } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'application.env' });

export class MongoHelper {
  public static client: MongoClient;
  constructor() {}

  /**
   * connect
   */
  public static async connect(url: string) {
    const client: MongoClient = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    MongoHelper.client = client;
    return await client.connect();
  }

  public static table(collection: string): any {
    if (!MongoHelper.client) {
      MongoHelper.connect(`${process.env.MONGO_URI_STAGING}`)
        .then((client) => (MongoHelper.client = client))
        .catch((error) => {
          console.log('error from collection table', (error && error.message) || error);
        });
    }

    return MongoHelper.client.db('iamskillful').collection(collection);

  }
}
