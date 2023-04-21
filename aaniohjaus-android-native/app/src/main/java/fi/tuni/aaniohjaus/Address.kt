package fi.tuni.aaniohjaus

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class Address(var road : String? = null,
                   var house_number : Int = 0,
                   var postcode : String? = null,
                   var city : String? = null) {

    fun roadWithHouseNumber() : String {
        return if (house_number != 0) "${this.road} ${this.house_number}," else "${this.road},"
    }

    fun postCodeWithCity() : String {
        return "${this.postcode}, ${this.city}"
    }

    fun toStringWithPostalCodesSeparated() : String {
        return "${this.road} ${this.house_number}, ${this.postcode!!.split("").joinToString(" ")}, $city"
    }

    override fun toString() : String {
        return "${this.road} ${this.house_number}, $postcode, $city"
    }
}