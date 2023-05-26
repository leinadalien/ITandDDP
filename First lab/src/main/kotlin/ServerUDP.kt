import ClientUDP.Companion.CONNECT_REQUEST
import ClientUDP.Companion.DISCONNECT_REQUEST
import java.net.DatagramPacket
import java.net.DatagramSocket

fun main() {
    val server = ServerUDP()
    println("Server is running")
    while (true) {
        server.receiveMessage()
    }
}


class ServerUDP {
    companion object {
        const val PORT = 12345 // порт, на котором прослушивает сервер
        const val BUFFER_SIZE = 65535 //размер буфера для сообщений
        const val CONNECT_TO_USER = "CONNECT_TO_USER"
        const val WAITING_FOR_USERS = "WAITING_FOR_USERS"
        const val REJECTED = "REJECTED"
        const val CLEAR_CONVERSATION = "CLEAR_CONVERSATION"
    }

    private val users = mutableListOf<User>()
    private val socket = DatagramSocket(PORT)
    private val messages = mutableMapOf<User, MutableList<Message>>()

    private fun connectUser(user: User) {

        if (users.size == 1) {
            users.add(user)
            sendMessage(Message("server", CLEAR_CONVERSATION), user)
            sendMessage(Message("server", CLEAR_CONVERSATION), users.first())
            sendMessage(Message(users.first().name, CONNECT_TO_USER), user)
            sendMessage(Message(user.name, CONNECT_TO_USER), users.first())

            println("${user.name} connected")
            reloadConversation(users[0], users[1])
        } else if (users.isEmpty()) {
            users.add(user)
            sendMessage(Message("server", WAITING_FOR_USERS), user)
            println("${user.name} connected")
        } else if (!users.contains(user)) {
            sendMessage(Message("server", REJECTED), user)
            println("${user.name} rejected")
        }
    }

    private fun disconnectUser(user: User) {
        users.removeAll { it.name == user.name }
        if (users.isNotEmpty()) {
            val lastUser = users.first()
            sendMessage(Message("server", CLEAR_CONVERSATION), user)
            sendMessage(Message("server", CLEAR_CONVERSATION), lastUser)
            sendMessage(Message("server", "You disconnected"), user)
            sendMessage(Message("server", WAITING_FOR_USERS), lastUser)
            println("${user.name} disconnected")
        }
    }

    fun receiveMessage() {
        val packet = DatagramPacket(ByteArray(BUFFER_SIZE), BUFFER_SIZE)
        socket.receive(packet)
        val message = packet.data.toMessage(0, packet.length)
        when (message.text) {
            CONNECT_REQUEST -> connectUser(User(message.senderName, packet.port, packet.address))
            DISCONNECT_REQUEST -> disconnectUser(User(message.senderName, packet.port, packet.address))
            else -> {
                println("${message.senderName}: ${message.text}")
                val receiver = users.firstOrNull { it.name != message.senderName }
                receiver?.let {
                    sendMessage(Message(message.senderName, message.text), receiver)
                    if (!messages.containsKey(receiver)) messages[receiver] = mutableListOf()
                    messages[receiver]?.add(message)
                }
            }
        }
    }

    private fun sendMessage(message: Message, toUser: User) {
        val bytes = message.toByteArray()
        val packet = DatagramPacket(bytes, bytes.size, toUser.address, toUser.port)
        socket.send(packet)
    }

    private fun reloadConversation(firstUser: User, secondUser: User) {
        val conversation = mutableListOf<Message>()
        for ((receiver, receivedMessages) in messages) {
            receivedMessages.forEach {
                if (it.senderName == firstUser.name && receiver == secondUser ||
                    it.senderName == secondUser.name && receiver == firstUser) {
                    conversation.add(it)
                }
            }
        }
        if (conversation.isNotEmpty()) {
            conversation.sortBy { it.id }
            conversation.forEach { message ->
                val yourMessage = Message("You", message.text)
                sendMessage(if (message.senderName == firstUser.name) yourMessage else message, firstUser)
                sendMessage(if (message.senderName == secondUser.name) yourMessage else message,secondUser)
            }
        }
    }
}