package fi.tuni.aaniohjaus

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class Address(var road : String? = null,
                   var house_number : String? = null,
                   var postcode : String? = null,
                   var city : String? = null) {

    fun roadWithHouseNumber() : String {
        return if (house_number != null) "${this.road} ${this.house_number}," else "${this.road},"
    }

    fun postCodeWithCity() : String {
        return "${this.postcode}, ${this.city}"
    }

    fun separatePostalCodeNumbers() : String {
        return if (postcode != null) this.postcode!!.split("").joinToString(" ") else ""
    }

    fun toStringWithPostalCodesSeparated() : String {
        return "${roadWithHouseNumber()}, ${separatePostalCodeNumbers()}, $city"
    }

    override fun toString() : String {
        return "${this.road} ${this.house_number}, $postcode, $city"
    }
}