import java.net.InetAddress

data class User (
    val name: String,
    val port: Int,
    val address: InetAddress
)