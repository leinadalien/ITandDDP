import ClientUDP.Companion.CONNECT_REQUEST
import ServerUDP.Companion.CONNECT_TO_USER
import ServerUDP.Companion.WAITING_FOR_USERS
import ServerUDP.Companion.BUFFER_SIZE
import ServerUDP.Companion.CLEAR_CONVERSATION
import ServerUDP.Companion.REJECTED
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import java.util.Scanner
import kotlin.concurrent.thread


fun main() {
    val scanner = Scanner(System.`in`)


    println("Input ur name")
    val name = scanner.nextLine()?: "undefined"
    val client = ClientUDP(name)
    client.connect()

    thread {
        while (true) {
            val text = readlnOrNull()
            if (client.connected) {
                client.sendMessage(Message(client.name, text!!))
            }
            if (text == CONNECT_REQUEST) {
                client.connect()
            }
        }
    }
    while (true){
        client.receiveMessage()
    }
}


class ClientUDP(val name: String) {
    companion object{
        const val CONNECT_REQUEST = "CONNECT"
        const val DISCONNECT_REQUEST = "DISCONNECT"
    }
    private val serverAddress: InetAddress = InetAddress.getByName("localhost")
    private val socket = DatagramSocket()
    var connected = false
        private set

    fun receiveMessage() {
        val packet = DatagramPacket(ByteArray(BUFFER_SIZE), BUFFER_SIZE)
        socket.receive(packet)
        val message = packet.data.toMessage(0, packet.length)
        when (message.text) {
            CONNECT_TO_USER -> {
                connected = true
                println("You are connected!")
            }
            WAITING_FOR_USERS -> println("Waiting for connection...")
            REJECTED -> println("Server is busy. Try later. just type CONNECT")
            CLEAR_CONVERSATION -> clearScreen()
            else -> {
                println("${message.senderName}: ${message.text}")
            }
        }
    }

    fun sendMessage(message: Message) {
        val bytes = message.toByteArray()
        val packet = DatagramPacket(bytes, bytes.size, serverAddress, ServerUDP.PORT)
        socket.send(packet)
    }
    fun connect() {
        val connectionMessage = Message(name, CONNECT_REQUEST)
        sendMessage(connectionMessage)
    }
}