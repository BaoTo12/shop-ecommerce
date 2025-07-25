### The difference between .env and config folder

- Config folder is used for declaring the settings for our application, can store multiple forms like Json, XML
- .env is used to store sensitive information, and declare global environment variables

---

### MongoDB Update Operators

- $set is used to set values to fields. The key insight with $set is that it handles both existing and non-existing fields gracefully. If the field exists, it overwrites it.

```
await User.updateOne(
  { _id: userId },
  {
    $set: {
      name: 'John',
      'profile.bio': 'Updated bio',  // Notice the dot notation for nested fields
      updatedAt: new Date(),
      status: 'active'
    }
  }
);
```

- $inc is used for for numerical changes and It's atomic. The beauty of $inc is that if the field doesn't exist, MongoDB treats it as zero and then applies the increment.

```
await Post.updateOne(
  { _id: postId },
  {
    $inc: {
      views: 1,           // Increment by 1
      score: 5,           // Add 5 to current score
      downvotes: -1       // Subtract 1 (negative increment)
    }
  }
);
```

#### Array Operations: $push, $addToSet, and $pull

- $push simply appends items to an array.

```
// Basic push - adds one item
await User.updateOne(
  { _id: userId },
  { $push: { tags: 'developer' } }
);

// Push multiple items at once using $each
await User.updateOne(
  { _id: userId },
  { $push: { tags: { $each: ['frontend', 'backend', 'fullstack'] } } }
);

// Push with additional modifiers
await User.updateOne(
  { _id: userId },
  {
    $push: {
      recentActivities: {
        $each: [
          { action: 'login', timestamp: new Date() },
          { action: 'profile_update', timestamp: new Date() }
        ],
        $slice: -10  // Keep only the last 10 activities
      }
    }
  }
);
```

--> $slice modifier is particularly useful - it automatically trims the array to keep only a certain number of elements.

- $addToSet is like a smart version of $push - it only adds items if they're not already present.

```
await User.updateOne(
  { _id: userId },
  { $addToSet: { tags: 'developer' } }  // Only adds if 'developer' isn't already there
);

// Add multiple unique items
await User.updateOne(
  { _id: userId },
  { $addToSet: { skills: { $each: ['JavaScript', 'Node.js', 'JavaScript'] } } }
  // 'JavaScript' will only be added once, even though it appears twice
);
```

- $pull removes all instances of items that match the specified condition

```
// Remove simple values
await User.updateOne(
  { _id: userId },
  { $pull: { tags: 'outdated-tag' } }
);

// Remove using conditions (for arrays of objects)
await User.updateOne(
  { _id: userId },
  {
    $pull: {
      certifications: { year: { $lt: 2020 } }  // Remove certifications older than 2020
    }
  }
);

// Remove multiple values
await User.updateOne(
  { _id: userId },
  { $pull: { tags: { $in: ['old-tag', 'deprecated-tag'] } } }
);
```

---

<!-- ! THIS PART IS NOT RENDERED CORRECTLY SO THAT I COMMENTED IT OUT -->
<!-- **$unset**: Xóa trường khỏi document	{ $unset: { tempField: 1 } }
**$rename**: Đổi tên trường	{ $rename: { old: "new" } }
**$rename**: Đổi tên trường	{ $rename: { old: "new" } }
**$currentDate**: Cập nhật ngày giờ hiện tại	{ $currentDate: { modified: true } }
**$push**: 	Thêm phần tử vào cuối mảng	{ $push: { tags: "new" } }
**$addToSet**: Thêm phần tử nếu chưa tồn tại (không trùng lặp)	{ $addToSet: { tags: "unique" } }
**$pop**: Xóa phần tử đầu/cuối mảng	{ $pop: { scores: 1 } } (1=cuối, -1=đầu)
**$pullAll**: Xóa tất cả phần tử khớp giá trị chính xác	{ $pullAll: { scores: [0, 5] } }
**$position**: Chỉ định vị trí thêm (kết hợp với $push)	{ $push: { list: { $each: ["A"], $position: 0 } } }
**$pullAll**: Xóa tất cả phần tử khớp giá trị chính xác	{ $pullAll: { scores: [0, 5] } }
**$pullAll**: Xóa tất cả phần tử khớp giá trị chính xác	{ $pullAll: { scores: [0, 5] } }
**updateOne**( <filter>, <update>,[options])
**updateMany**( <filter>, <update>,[options])
**findOneAndUpdate**( <filter>, <update>,[options])
**findByIdAndUpdate**( <filter>, <update>,[options])
{
  <operator1>: { <field1>: <value1>, ... },
  <operator2>: { <field2>: <value2>, ... },
  // ...
} -->

### JWT, JWS, JWE

- JWT là một loại của bộ tiêu chuẩn JOSE (JSON Object Signing and Encryption)
- JOSE bao gồm năm tiêu chuẩn chính.

  - JWS (JSON Web Signature) giúp đảm bảo tính toàn vẹn và xác thực nguồn gốc dữ liệu
  - JWE (JSON Web Encryption) mã hóa dữ liệu để đảm bảo tính bí mật
  - JWK (JSON Web Key) định nghĩa cách biểu diễn khóa mật mã trong JSON
  - JWA (JSON Web Algorithms) liệt kê các thuật toán mật mã được hỗ trợ.
  - JWT (JSON Web Token) là cách thức cụ thể để sử dụng các tiêu chuẩn trên tạo ra token.

- Hiểu rõ hệ thống phân cấp: JOSE → JWS → JWT:
  JOSE như một "gia đình lớn" của các tiêu chuẩn bảo mật. Trong gia đình này, JWS là một "thành viên" cung cấp chức năng digital signature. Còn JWT là một "ứng dụng cụ thể" của JWS.
  - JOSE (JSON Object Signing and Encryption) is a framework that provides a set of specifications for signing and encrypting data using JSON-based structures. It encompasses several standards like JWS, JWE (JSON Web Encryption), JWK (JSON Web Key), and JWKS (JSON Web Key Set)
  - JWS documentation says is a specification within JOSE that focuses on digitally signing JSON data.
  - JWT is an implementation
- JWT (JSON Web Token) components
  - JOSE Header or JWS Header: Thường bao gồm các thành phần như sau
    alg(algorithm) - Algorithm - JWA (JSON Web Algorithms)
    typ(type) - để xác định đây là JSON Web Token
    kid(keyID) - giúp xác định khóa nào được sử dụng khi có nhiều khóa trong hệ thống
    crit(critical) - liệt kê các extension headers mà bên nhận phải hiểu để xử lý token đúng cách
  - Payload: claims
    subject (chủ thể)
    "iss" (issuer - người phát hành)
    "aud" (audience - đối tượng nhận)
    "exp" (expiration time - thời gian hết hạn)
    "nbf" (not before - không hợp lệ trước thời điểm này)
    "iat" (issued at - thời điểm phát hành)
    "jti" (JWT ID - định danh duy nhất)
  - Signature - JWS Signature
    Ví dụ: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    Phần đầu tiên là JWS Header được encode
    phần thứ hai là JWS Payload được encode,
    phần thứ ba là JWS Signature được encode
    --> Toàn bộ chuỗi này tuân theo JWS Compact Serialization format.

---

### Mongoose Middleware

- Def: Middleware in mongoose allows you to execute code at specific points during document operations
- Pre middleware runs before the operation executes
- Post middleware runs after the operation completes successfully
- Document middleware operates on individual documents and includes hooks for save, remove, updateOne, deleteOne, and init
- Query middleware operates on queries themselves and includes hooks for find, findOne, findOneAndUpdate, deleteOne, deleteMany, and others.

---

### Full-Text Search in MongoDB

#### Types of Full-Text Search

- **Simple full-text search**: is very basic in that users enter keywords or phrases to find documents containing those specific terms.
  Best use: These searches are often used as quick searches seeking **general information**.

- **Boolean full-text search**: this kind of search uses Boolean Operator (AND, OR, NOT, ...) to either combine or exclude specific keywords in the search query.
  Best use: Often used in complex queries using logical relationships between terms, Boolean full-text searches help users save time and enhance query relevance.
- **Fuzzy search**: Fuzzy search allows the user to find text that is a “likely” match
  Best use: These searches are helpful when searching through documents that often have non-traditional spellings, typos, or other irregularities.

- **Wildcard search**: Wildcard searches include non-alphanumeric characters (e.g., ?, \*) representing unknown portions of words. This allows the user to search for variations of words (e.g., part, parted, parting) or partial matches (e.g., summertime, summer vacation, summer).
  Best use: These searches are helpful when users want to account for different forms or correct spelling variations of a word.

- **Phrase search**: This search seeks an exact phrase
  Best use: Phrase searches are often used in queries searching for contextually related terms in long documents (e.g., searching for "2024 income tax brackets" within an IRS website).

- **Proximity search**: Proximity searches identify and retrieve documents containing specific terms within a set number of words, phrases, or paragraphs from each other.
  Best use: Proximity searches are useful in narrowing down results when searching long documents on a broad topic.

- **Range search**: Range searches look for terms within a numerical or alphabetical range specified by the user.
  Best use: Range searches are helpful when ranges such as dates, currency values, or alphanumeric medical coding are of interest to a user.

- **Faceted search**: This type of search helps refine results using predefined categories and specific attributes (e.g., facets) of the topic.
  Best use: These searches are used every day in ecommerce (e.g., a medium, cotton, button-down, blue, dress shirt). The descriptors or attributes — such as medium, blue, and dress shirt — are all facets of the clothing desired by the user.

#### Full-text search queries

Def: Full-text queries are used within full-text search to define specific terms, parameters, ... required by users. Furthermore, full-text queries enable the discovery of additional content of which users may be unaware via multiple methods.

- _Natural language processing (NLP)_: Full-text searching often incorporates NLP techniques to understand the context, semantics, and relationships between words in full-text queries and the text in documents.
- _Synonym expansion_: Full-text search engines often employ synonym expansion capabilities. This means that the full-text search engine is able to identify alternative words or phrases that have the same meaning (e.g., synonyms) as those included in the users' full-text search query.
- _Ontologies and taxonomies_: Using ontologies or taxonomies assists in the grouping of terms into hierarchies based on term relationships. Using these hierarchies, full-text searching is enhanced in that both broader and narrower terms relevant to the user's query can be returned.
- _Fuzzy matching_: Fuzzy matching algorithms enable the database engine to find approximate search term matches for their query. This means that content containing misspelled words, overlooked typos, or other language variations that actually do match the query but would be overlooked by traditional searches are identified and collected for the user.
- _Relevance ranking_: In relevance ranking, sophisticated algorithms are employed to consider such factors as frequency of term usage and term proximity within documents to help identify documents that may contain unexpected but highly relevant information relating to the user's query.

#### Full-text search indexing

Full-text search involves reviewing large numbers of documents and vast amounts of text. Web search services often use full-text search to retrieve relevant results from the internet — be it web page content, online .PDFs, and more. Given the volume of text data involved, a technique to handle the search volume is required — it's called full-text indexing
--> A full-text search index is a specialized data structure that enables the fast, efficient searching of large volumes of textual data.
The process goes like this: original text -> without diacritics --> remove filler words --> Stemming --> Casing --> Dictionary

#### Full-text index types

- _Inverted index_
  Now, imagine you're trying to find all books in a library that mention "database optimization" anywhere in their content. A traditional card catalog wouldn't help because it's organized by title or author, not by every word inside the books.
  An inverted index solves this problem by flipping the traditional approach. Instead of mapping documents to their contents, it maps each unique word to all the documents that contain it. This is why it's called "inverted" - it inverts the normal document-to-content relationship.
- _B-tree index_
  Def: A B-tree (Balanced tree) index works similarly. It's a tree-like data structure where data is stored in a sorted, hierarchical manner. Each node in the tree contains multiple keys (values) and pointers to child nodes. The "balanced" part means that all leaf nodes are at the same depth, ensuring consistent performance.
  // When you create a regular index on a field
  db.users.createIndex({ "age": 1 })

// Given these documents:
/_
Doc1: "MongoDB is a NoSQL database system"
Doc2: "Database optimization improves query performance"  
Doc3: "NoSQL databases are schema-flexible systems"
_/

// An inverted index would look like this:
/_
Word Index:
"mongodb" → [Doc1]
"is" → [Doc1]
"a" → [Doc1]
"nosql" → [Doc1, Doc3]
"database" → [Doc1, Doc2]
"system" → [Doc1]
"optimization" → [Doc2]
"improves" → [Doc2]
"query" → [Doc2]
"performance" → [Doc2]
"databases" → [Doc3]
"are" → [Doc3]
"schema" → [Doc3]
"flexible" → [Doc3]
"systems" → [Doc3]
_/

// When you search for "database", the index immediately tells you:
// Documents 1 and 2 contain this word - no need to scan all documents!

// MongoDB builds a B-tree structure like this conceptually:
/_
<!-- [30, 60]
             /    |    \
        [15, 25]  [45, 50]  [75, 85]
       /  |   |   |   |   |   |   |   \
    [10] [20] [28] [40] [48] [55] [70] [80] [90] -->
_/
--> B-tree indexes excel at range queries, equality searches, and sorting operations.

#### Necessary features

Adding a full-text index to your database will help optimize your text search and potentially minimize storage requirements. Still, you might need additional features, such as auto-complete suggestions, synonym search, or custom scoring for relevant results.

---

### node-redis client (Redis Client)

- createClient(): tạo một kết nối đến Redis server
- connect() (async): thiết lập kết nối tới server.
- on('error', handler), on('connect'), on('ready'), on('reconnecting'): lắng nghe trạng thái & lỗi.
- isReady, isOpen: kiểm tra trạng thái kết nối.
- destroy() / close(): đóng kết nối.

**Các phương thức Pub/Sub cơ bản**

- _publish(channel, message)_: Gửi tin nhắn đến channel cụ thể. và trả về số lượng subscriber đã nhận
- _subscribe(channel, listener?)_: Đăng ký lắng nghe tin nhắn từ channel. Phương thức listener là callback khi subscribe thành công.
- _unsubscribe(channel?)_: Hủy đăng ký channel. Không truyền tham số = hủy tất cả.
- _psubscribe(pattern, listener?)_: Đăng ký dựa trên pattern (glob-style)
- _punsubscribe(pattern?)_: Hủy đăng ký bằng pattern. Không truyền = hủy tất cả.
- **Events**
  - on("message", ...): Khi có tin nhắn đến.
  - on("pmessage", ...): Khi tin đến từ pattern subscription.
  - on("subscribe"/"unsubscribe"/"psubscribe"/"punsubscribe"): Khi subscribe/unsubscribe thành công.
  - on("error", ...): Xử lý lỗi kết nối hoặc runtime.
