data class Message (
    val senderName: String,
    val text: String
) {
    val id = idCounter++
    companion object {
        private var idCounter: Int = 0
    }
    override fun toString(): String {
        return "Sender:   $senderName,\n" +
               "Message:  $text"
    }
    private fun stringRepresentation(): String {
        return "$senderName|$text"
    }
    fun toByteArray(): ByteArray {
        return stringRepresentation().toByteArray()
    }

}
fun ByteArray.toMessage(): Message {
    return this.toMessage(0, this.size)
}
fun ByteArray.toMessage(offset: Int, length: Int): Message {
    val fields = String(this, offset, length).split('|').toList()
    return Message(fields[0],fields[1])
}