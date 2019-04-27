### 控制方式

* Encryption(SSL)
* Authentication(SSL & SASL)
* Authorisation(ACL)

### 解决的问题

* Currently, any client can access your Kafka cluster (authentication)
* The clients can publish / consumer and topic data (authorisation)
* All the data being sent is fully visible on the network (encryption)

